import {db} from "../firebase/firebase";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";


export default function Tracker() {
  const [mood, setMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  const moodsCollection = collection(db, "moods");

  // Load mood history from Firebase
  useEffect(() => {
    const fetchMoods = async () => {
      const q = query(moodsCollection, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const moodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(moodData);
    };
    fetchMoods();
  }, []);

  // Save today’s entry
  const handleSave = async () => {
    if (!mood) return;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    try {
      await addDoc(moodsCollection, {
        date: today,
        mood,
        journal,
        timestamp: new Date(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setJournal("");

      // Reload moods
      const snapshot = await getDocs(query(moodsCollection, orderBy("timestamp", "desc")));
      const moodData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHistory(moodData);

    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  return (
    <section className="w-full py-16 px-6 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold font-[Poppins] text-sky-700 mb-6">
          🌸 Mood Tracker & Journal
        </h2>

         {/* Mood Options */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {[
            { mood: "happy", emoji: "😊", color: "bg-green-200", hover: "hover:bg-green-100" },
            { mood: "neutral", emoji: "😐", color: "bg-yellow-200", hover: "hover:bg-yellow-100" },
            { mood: "sad", emoji: "😞", color: "bg-red-200", hover: "hover:bg-red-100" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setMood(item.mood)}
              className={`p-6 rounded-2xl shadow-md text-4xl transition-all duration-300 transform
                ${mood === item.mood ? `${item.color} scale-110 animate-bounce` : `bg-white ${item.hover}`}
              `}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        {/* Journal Input */}
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full max-w-2xl mx-auto p-4 rounded-xl border border-gray-200 shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-sky-300 font-[Inter] text-lg"
          rows="4"
        />

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-xl 
            shadow-md font-semibold hover:opacity-90 transition-all duration-300"
          >
            Save Entry
          </button>
          {saved && (
            <p className="text-green-600 mt-3 font-medium animate-fadeIn">
              ✅ Saved!
            </p>
          )}
        </div>

        {/* Calendar History */}
        {history.length > 0 && (
          <div className="mt-14">
            <h3 className="text-2xl font-bold text-sky-700 mb-6 text-center">
              📅 Mood Calendar
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="relative group bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 font-[Inter]">{entry.date}</p>
                  <p className="text-3xl mt-2">
                    {entry.mood === "happy" ? "😊" : entry.mood === "neutral" ? "😐" : "😞"}
                  </p>

                  {entry.journal && (
                    <div className="absolute bottom-[-100%] opacity-0 group-hover:opacity-100 group-hover:bottom-[-110%] transition-all duration-300 bg-sky-100 text-gray-700 text-sm p-3 rounded-xl shadow-md w-48 font-[Inter]">
                      {entry.journal}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
