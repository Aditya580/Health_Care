// Updated Contact.jsx (Booking removed, Video call refined, AI Checker clean UI)

import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FaVideo, FaPaperPlane, FaMicrophone } from "react-icons/fa";
import { format } from "date-fns";

export default function Contact({ currentUser }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesRef = useRef(null);

  const [isDoctorTyping, setIsDoctorTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const [showCall, setShowCall] = useState(false);

  const [showSymptom, setShowSymptom] = useState(false);
  const [symptomText, setSymptomText] = useState("");
  const [symptomResult, setSymptomResult] = useState(null);

  const notify = async (title, body) => {
    if ("Notification" in window && Notification.permission === "granted")
      new Notification(title, { body });
  };

  // FETCH DOCTORS
  useEffect(() => {
    const q = query(collection(db, "doctors"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDoctors(arr);
    });
    return () => unsub();
  }, []);

  // FETCH CHAT + TYPING STATUS
  useEffect(() => {
    if (!selectedDoctor || !currentUser) return;

    const id = `${currentUser.id}_${selectedDoctor.id}`;
    setChatId(id);

    (async () => {
      await setDoc(
        doc(db, "chats", id),
        {
          userId: currentUser.id,
          doctorId: selectedDoctor.id,
          lastTimestamp: serverTimestamp(),
        },
        { merge: true }
      );
    })();

    const q = query(
      collection(db, "chats", id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);

      setTimeout(() => {
        if (messagesRef.current)
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
    });

    const typingRef = doc(db, "chats", id, "meta", "typing");
    const unsubTyping = onSnapshot(typingRef, (snap) => {
      setIsDoctorTyping(snap.data()?.doctorTyping || false);
    });

    return () => {
      unsub();
      unsubTyping();
    };
  }, [selectedDoctor, currentUser]);

  // SEND MESSAGE
  const sendMessage = async (type = "text", extra = {}) => {
    if (!chatId) return;
    if (type === "text" && !messageText.trim()) return;

    const payload = {
      senderId: currentUser.id,
      text: type === "text" ? messageText.trim() : "",
      type,
      timestamp: serverTimestamp(),
      ...extra,
    };

    await addDoc(collection(db, "chats", chatId, "messages"), payload);

    await setDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: payload.text || (type === "voice" ? "Voice note" : ""),
        lastTimestamp: serverTimestamp(),
      },
      { merge: true }
    );

    setMessageText("");
    notify(`New message to ${selectedDoctor.name}`, payload.text);
  };

  // USER TYPING INDICATOR
  const userTyping = async (val) => {
    if (!chatId) return;

    await setDoc(
      doc(db, "chats", chatId, "meta", "typing"),
      { userTyping: val },
      { merge: true }
    );

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => userTyping(false), 2500);
  };

  // VOICE RECORDING
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);

    setRecorder(mr);
    setAudioChunks([]);

    mr.ondataavailable = (e) => setAudioChunks((c) => [...c, e.data]);

    mr.onstop = async () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);
      await sendMessage("voice", { audioUrl });
    };

    mr.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  // AI SYMPTOM CHECKER
  const runSymptomChecker = (text) => {
    const low = text.toLowerCase();

    const rules = [
      { key: ["sad", "hopeless"], spec: "Therapist (Depression)" },
      { key: ["anxiety", "panic"], spec: "Anxiety Specialist" },
      { key: ["insomnia", "sleep"], spec: "Sleep Specialist" },
      { key: ["stress", "overwhelmed"], spec: "Counseling Psychologist" },
    ];

    const match = rules.find((r) => r.key.some((k) => low.includes(k)));

    setSymptomResult({
      suggestion: match ? match.spec : "General Mental Health Expert",
      confidence: match ? "85%" : "55%",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-100 p-6 font-[Poppins]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE – DOCTORS */}
        <div className="bg-white rounded-2xl shadow-lg p-4 h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-sky-700 mb-3">Available Doctors</h3>

          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`p-3 mb-3 rounded-xl cursor-pointer flex items-center gap-3 transition ${
                selectedDoctor?.id === doc.id
                  ? "ring-2 ring-indigo-400 bg-sky-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <img src={doc.photo} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.specialty}</div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${doc.available ? "bg-green-400" : "bg-gray-400"}`}></span>
                  {doc.available ? "Available" : "Offline"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE: CHAT */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-4">
              <img src={selectedDoctor?.photo} className="w-14 h-14 rounded-xl" />
              <div>
                <div className="font-semibold text-lg">{selectedDoctor?.name || "Select a Doctor"}</div>
                <div className="text-sm text-gray-500">{selectedDoctor?.specialty}</div>
                {isDoctorTyping && (
                  <div className="text-xs text-indigo-600">Doctor is typing...</div>
                )}
              </div>
            </div>

            <button
              disabled={!selectedDoctor?.available}
              onClick={() => setShowCall(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedDoctor?.available
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <FaVideo /> Video Call
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto mt-4 p-4 bg-gradient-to-b from-white to-sky-50 rounded-lg space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-center text-gray-400">Say Hi 👋</div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[70%] p-3 rounded-2xl ${
                  m.senderId === currentUser.id
                    ? "ml-auto bg-indigo-600 text-white"
                    : "bg-white border"
                }`}
              >
                {m.type === "text" && m.text}
                {m.type === "voice" && (
                  <audio src={m.audioUrl} controls className="w-full" />
                )}
                <div className="text-[10px] text-right mt-1 text-gray-300">
                  {m.timestamp?.toDate ? format(m.timestamp.toDate(), "hh:mm a") : ""}
                </div>
              </div>
            ))}
          </div>

          {/* MESSAGE INPUT */}
          <div className="mt-3 flex items-center gap-3">
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                userTyping(true);
              }}
              className="flex-1 border rounded-xl p-3 h-14 resize-none"
              placeholder="Type a message..."
            />

            <button
              onClick={() => sendMessage("text")}
              className="p-3 rounded-xl bg-indigo-600 text-white"
            >
              <FaPaperPlane />
            </button>

            {!recording ? (
              <button
                onClick={startRecording}
                className="p-3 bg-pink-500 text-white rounded-xl"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="p-3 bg-red-500 text-white rounded-xl"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE – AI CHECKER + VIDEO */}
        <div className="space-y-4">
          {/* AI Symptom Checker */}
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <h3 className="font-semibold mb-2 text-gray-700">AI Symptom Checker</h3>
            <button
              onClick={() => setShowSymptom(true)}
              className="w-full py-2 rounded-lg bg-emerald-600 text-white"
            >
              Open Checker
            </button>
          </div>

          {/* VIDEO SDK CALL */}
          {showCall && selectedDoctor && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-3 border-b flex justify-between items-center">
                <div className="font-semibold">
                  Video Call - {selectedDoctor.name}
                </div>
                <button
                  onClick={() => setShowCall(false)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>

              <iframe
                title="videosdk-room"
                src={`https://app.videosdk.live/preview?roomId=${chatId}`}
                style={{ width: "100%", height: 360, border: 0 }}
                allow="camera; microphone; fullscreen; display-capture"
              />
            </div>
          )}
        </div>
      </div>

      {/* AI CHECKER MODAL */}
      {showSymptom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">AI Health Analyzer</h3>
              <button
                onClick={() => setShowSymptom(false)}
                className="text-sm text-gray-600"
              >
                Close
              </button>
            </div>

            <textarea
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="Describe your symptoms..."
              className="w-full border rounded-lg p-3 h-28"
            />

            <button
              onClick={() => runSymptomChecker(symptomText)}
              className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Analyze
            </button>

            {symptomResult && (
              <div className="mt-4 bg-sky-50 border p-4 rounded-xl">
                <div className="font-semibold text-gray-800">
                  Recommended Specialist
                </div>
                <div className="mt-2 text-indigo-600 text-sm">
                  {symptomResult.suggestion}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  Confidence: {symptomResult.confidence}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
