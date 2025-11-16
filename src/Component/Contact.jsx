// src/components/Contact.jsx
import { useEffect, useState, useRef } from "react";
import { collection, query, onSnapshot, doc, setDoc, addDoc, getDocs, serverTimestamp, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/firebase"; // your firebase export
import { FaVideo, FaPhone, FaPaperPlane, FaMicrophone, FaRegClock } from "react-icons/fa";
import { format } from "date-fns";

/*
  Contact.jsx
  - Left: doctor list with realtime availability
  - Middle: chat & voice notes
  - Right: profile + booking + video (Jitsi) + symptom checker
*/

export default function Contact({ currentUser }) {
  // currentUser: { id, name, photo } — pass from auth context
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Chat state
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesRef = useRef(null);

  // typing indicator
  const [isDoctorTyping, setIsDoctorTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  // voice recording
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const audioRef = useRef(null);

  // appointments
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  // UI toggles
  const [showJitsi, setShowJitsi] = useState(false);
  const [showSymptom, setShowSymptom] = useState(false);

  // notifications
  const notify = async (title, body) => {
    // in-app: add to 'notifications' collection if you want persistence
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      try {
        const p = await Notification.requestPermission();
        if (p === "granted") new Notification(title, { body });
      } catch (e) {}
    }
  };

  // -------------------------
  // Load doctors realtime
  // -------------------------
  useEffect(() => {
    const q = query(collection(db, "doctors"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDoctors(arr);
    });
    return () => unsub();
  }, []);

  // ----------------------------------------
  // When doctor selected -> create/open chat
  // ----------------------------------------
  useEffect(() => {
    if (!selectedDoctor || !currentUser) return;
    // chatId pattern: userId_doctorId (keeps one chat per pair)
    const id = `${currentUser.id}_${selectedDoctor.id}`;
    setChatId(id);

    // subscribe to messages
    const messagesCol = collection(db, "chats", id, "messages");
    // ensure chat doc exists
    (async () => {
      try {
        await setDoc(doc(db, "chats", id), {
          userId: currentUser.id,
          doctorId: selectedDoctor.id,
          lastTimestamp: serverTimestamp(),
        }, { merge: true });
      } catch (e) { console.error(e); }
    })();

    const q = query(messagesCol, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      // reset unread etc if you want...
      // scroll
      setTimeout(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
    });

    // typing presence: we can read a small doc at chats/{chatId}/presence
    const presDoc = doc(db, "chats", id, "meta", "typing");
    const unsubTyping = onSnapshot(presDoc, (snap) => {
      if (!snap.exists()) return setIsDoctorTyping(false);
      const data = snap.data();
      // doctor typing? compare by id field names used in meta (doctorTyping)
      setIsDoctorTyping(!!data.doctorTyping);
    });

    return () => {
      unsub(); unsubTyping();
    };
  }, [selectedDoctor, currentUser]);

  // -------------------------
  // Send text message
  // -------------------------
  const sendMessage = async (type = "text", extra = {}) => {
    if (!chatId) return;
    if (type === "text" && !messageText.trim()) return;

    const messagesCol = collection(db, "chats", chatId, "messages");
    const payload = {
      senderId: currentUser.id,
      text: type === "text" ? messageText.trim() : "",
      type,
      timestamp: serverTimestamp(),
      ...extra,
    };

    try {
      await addDoc(messagesCol, payload);
      // update chat meta lastMessage
      await setDoc(doc(db, "chats", chatId), {
        lastMessage: payload.text || (type === "voice" ? "Voice note" : ""),
        lastTimestamp: serverTimestamp(),
      }, { merge: true });

      setMessageText("");
      // notify doctor (in-app)
      await notify(`New message to ${selectedDoctor.name}`, payload.text || "Voice message");
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------
  // Typing indicator (user)
  // -------------------------
  const userTyping = async (val) => {
    if (!chatId) return;
    setIsUserTyping(val);
    try {
      await setDoc(doc(db, "chats", chatId, "meta", "typing"), { userTyping: val }, { merge: true });
    } catch (e) {}
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => userTyping(false), 3000);
  };

  // ------------------------------
  // Voice recorder (MediaRecorder)
  // ------------------------------
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("Recording not supported in this browser.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    setRecorder(mr);
    setAudioChunks([]);
    mr.ondataavailable = (e) => {
      setAudioChunks((c) => [...c, e.data]);
    };
    mr.onstop = async () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      // For demo we upload blob to Firestore is not possible; upload to Storage and save URL
      // Here we will create an object URL and send as "audioUrl" (works local only)
      const audioUrl = URL.createObjectURL(blob);
      await sendMessage("voice", { audioUrl });
    };
    mr.start();
    setRecording(true);
  };
  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      recorder.stream.getTracks().forEach(t => t.stop());
      setRecording(false);
    }
  };

  // -------------------------
  // Appointment booking
  // -------------------------
  useEffect(() => {
    // load slots template from doctor doc if exists
    if (!selectedDoctor) return;
    const docSlots = selectedDoctor.slots || {};
    // default we can set next 7 days with morning slots as fallback
    const dateStr = selectedDate;
    const slots = docSlots[dateStr] || ["09:00", "10:30", "14:00", "16:00"];
    setAvailableSlots(slots);
    setSelectedSlot("");
  }, [selectedDoctor, selectedDate]);

  const bookAppointment = async () => {
    if (!selectedSlot || !selectedDate) return alert("Choose date & time");
    try {
      await addDoc(collection(db, "appointments"), {
        userId: currentUser.id,
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedSlot,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      await notify("Appointment requested", `Requested ${selectedDate} ${selectedSlot} with ${selectedDoctor.name}`);
      alert("Appointment requested!");
    } catch (e) { console.error(e); alert("Booking failed"); }
  };

  // ------------------------------
  // Symptom Checker (simple rules)
  // ------------------------------
  const [symptomText, setSymptomText] = useState("");
  const [symptomResult, setSymptomResult] = useState(null);

  const runSymptomChecker = async (text) => {
    // quick rule-based: keywords -> suggested specialty
    const lower = text.toLowerCase();
    const map = [
      { key: ["sad", "depressed", "hopeless"], spec: "Psychiatrist / Therapist" },
      { key: ["anxiety", "nervous", "panic"], spec: "Anxiety Specialist / Therapist" },
      { key: ["sleep", "insomnia"], spec: "Sleep Specialist / Therapist" },
      { key: ["stress", "overwhelmed"], spec: "Counseling Psychologist" },
      { key: ["panic", "palpitations"], spec: "Cardio check + Therapist" },
    ];
    const matches = map.filter(m => m.key.some(k => lower.includes(k)));
    if (matches.length) {
      setSymptomResult({ suggestion: matches[0].spec, confidence: `${Math.min(95, 60 + matches.length * 10)}%` });
      return;
    }
    // fallback: generic mental health
    setSymptomResult({ suggestion: "Mental Health Specialist", confidence: "50%" });

    // Optional: call OpenAI for detailed analysis
    /*
    // Uncomment and implement if you have a backend to call OpenAI securely
    const resp = await fetch("/api/openai-symptom", { method: "POST", body: JSON.stringify({text})});
    const json = await resp.json();
    setSymptomResult(json);
    */
  };

  // -------------------------
  // Helpers & UI
  // -------------------------
  const formatDate = (iso) => {
    try { return format(new Date(iso), "dd MMM yyyy"); } catch { return iso; }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-100 p-6" style={{ fontFamily: "Poppins, Inter, sans-serif" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ---------------- LEFT: Doctor list ---------------- */}
        <div className="col-span-1 bg-white rounded-2xl shadow-lg p-4">
          <h3 className="text-lg font-semibold text-sky-700 mb-3">Available Doctors</h3>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {doctors.map(doc => (
              <div key={doc.id} onClick={() => setSelectedDoctor(doc)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${selectedDoctor?.id === doc.id ? "ring-2 ring-sky-300 bg-sky-50" : "hover:bg-gray-50"}`}>
                <img src={doc.photo || "https://via.placeholder.com/80"} alt="" className="w-14 h-14 rounded-xl object-cover shadow" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.specialty}</div>
                    </div>
                    <div className="text-xs text-gray-500">{doc.rating ?? "—"} ⭐</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${doc.available ? "bg-green-400" : "bg-gray-300"}`}></span>
                    <span className="text-xs text-gray-600">{doc.available ? "Available" : "Offline"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ------------- MIDDLE: Chat & Voice ------------- */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4 flex flex-col">

          {/* Top: selected doctor header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={selectedDoctor?.photo || "https://via.placeholder.com/100"} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <div className="text-lg font-semibold">{selectedDoctor?.name || "Select a doctor"}</div>
                <div className="text-sm text-gray-500">{selectedDoctor?.specialty}</div>
                <div className="text-xs text-gray-600 mt-1 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${selectedDoctor?.available ? "bg-green-400" : "bg-gray-300"}`}></span>
                  {selectedDoctor?.available ? "Available for call" : "Not available"}
                  {isDoctorTyping && <span className="ml-3 text-indigo-600">⏳ Doctor is typing...</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => {
                if (!selectedDoctor) return alert("Select doctor");
                setShowJitsi(true);
              }} className={`flex items-center gap-2 px-4 py-2 rounded-md ${selectedDoctor?.available ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}>
                <FaVideo /> Video
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100">
                <FaPhone /> Call
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto mt-4 p-4 space-y-3 bg-gradient-to-b from-white to-sky-50 rounded-lg">
            {messages.length === 0 && <div className="text-center text-gray-400">No messages yet — say hi 👋</div>}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[70%] p-3 rounded-2xl ${m.senderId === currentUser.id ? "ml-auto bg-indigo-600 text-white" : "bg-white border"}`}>
                {m.type === "text" && <div>{m.text}</div>}
                {m.type === "voice" && <audio src={m.audioUrl} controls className="w-full" />}
                <div className="text-xs text-gray-300 mt-2 text-right">{m.timestamp?.toDate ? format(m.timestamp.toDate(), "hh:mm a") : ""}</div>
              </div>
            ))}
          </div>

          {/* Input & actions */}
          <div className="mt-4 flex items-center gap-3">
            <textarea
              value={messageText}
              onChange={(e) => { setMessageText(e.target.value); userTyping(true); }}
              placeholder="Write a message..."
              className="flex-1 p-3 rounded-xl border resize-none h-14"
            />
            {/* send text */}
            <button onClick={() => sendMessage("text")} className="p-3 bg-indigo-600 text-white rounded-xl">
              <FaPaperPlane />
            </button>

            {/* record voice */}
            {!recording ? (
              <button onClick={startRecording} className="p-3 bg-pink-500 text-white rounded-xl">
                <FaMicrophone />
              </button>
            ) : (
              <button onClick={stopRecording} className="p-3 bg-red-500 text-white rounded-xl">
                Stop
              </button>
            )}
          </div>
        </div>

        {/* ---------------- RIGHT: Profile, Booking, Symptom, Jitsi ---------------- */}
        <div className="col-span-1 space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-col items-center">
              <img src={selectedDoctor?.photo || "https://via.placeholder.com/200"} className="w-28 h-28 rounded-2xl object-cover shadow" alt="" />
              <div className="mt-3 text-center">
                <div className="text-lg font-semibold">{selectedDoctor?.name || "Doctor Name"}</div>
                <div className="text-xs text-gray-500">{selectedDoctor?.specialty}</div>
                <div className="text-sm text-gray-600 mt-2">{selectedDoctor?.experience}</div>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={() => setShowSymptom(true)} className="w-full py-2 rounded-lg bg-emerald-500 text-white">Check Symptoms</button>
            </div>
          </div>

          {/* Booking */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-2">
              <FaRegClock />
              <h4 className="font-semibold">Book Appointment</h4>
            </div>

            <div className="mt-3 space-y-2">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-2 rounded-md border" />
              <div className="flex gap-2 flex-wrap mt-2">
                {availableSlots.map((s) => (
                  <button key={s} onClick={() => setSelectedSlot(s)} className={`px-3 py-2 rounded-md ${selectedSlot === s ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={bookAppointment} className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg">Request</button>
            </div>
          </div>

          {/* Jitsi embed */}
          {showJitsi && selectedDoctor && (
            <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  <img src={selectedDoctor.photo || ""} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div>
                    <div className="font-semibold">{selectedDoctor.name}</div>
                    <div className="text-xs text-gray-500">Video Call</div>
                  </div>
                </div>
                <button onClick={() => setShowJitsi(false)} className="px-3 py-1 text-sm bg-gray-100 rounded">Close</button>
              </div>
              <div style={{ height: 360 }}>
                {/* Jitsi iframe — using a room unique to chatId */}
                <iframe
                  title="jitsi"
                  src={`https://meet.jit.si/${chatId || (currentUser?.id + "_" + (selectedDoctor?.id || "room"))}`}
                  style={{ width: "100%", height: "100%", border: 0 }}
                  allow="camera; microphone; fullscreen; display-capture"
                />
              </div>
            </div>
          )}

          {/* Symptom checker modal */}
          {showSymptom && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">AI Symptom Checker</h3>
                  <button onClick={() => setShowSymptom(false)} className="text-sm text-gray-500">Close</button>
                </div>

                <textarea value={symptomText} onChange={(e) => setSymptomText(e.target.value)} placeholder="Describe your symptoms..." className="w-full mt-4 p-3 rounded-md border" rows={4} />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => runSymptomChecker(symptomText)} className="px-4 py-2 bg-indigo-600 text-white rounded">Analyze</button>
                  <button onClick={() => { setSymptomText(""); setSymptomResult(null); }} className="px-4 py-2 bg-gray-100 rounded">Clear</button>
                </div>

                {symptomResult && (
                  <div className="mt-4 bg-sky-50 p-3 rounded">
                    <div className="font-semibold">Suggested Specialist: {symptomResult.suggestion}</div>
                    <div className="text-sm text-gray-600">Confidence: {symptomResult.confidence}</div>
                    <div className="mt-2 flex gap-2">
                      {/* auto-filter doctors */}
                      <button onClick={() => {
                        // auto-select first doctor with matching specialty
                        const found = doctors.find(d => (d.specialty || "").toLowerCase().includes((symptomResult.suggestion || "").split(" ")[0].toLowerCase()));
                        if (found) setSelectedDoctor(found);
                      }} className="px-3 py-2 bg-emerald-500 text-white rounded">Find Doctor</button>
                      <button onClick={() => setShowSymptom(false)} className="px-3 py-2 bg-gray-100 rounded">Close</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
