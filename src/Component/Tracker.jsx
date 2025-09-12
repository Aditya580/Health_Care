import { db } from "../firebase/firebase";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Tracker() {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [journal, setJournal] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const moodsCollection = collection(db, "moods");

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

  const handleMoodClick = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else if (selectedMoods.length < 2) {
      setSelectedMoods([...selectedMoods, mood]);
      setError("");
    } else {
      setError("⚠️ You can only select 2 moods per day.");
    }
  };

  const handleJournalChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 20) {
      setJournal(e.target.value);
      setError("");
    } else {
      setError("⚠️ Journal entry cannot exceed 20 words.");
    }
  };

  const handleSave = async () => {
    if (selectedMoods.length === 0) {
      setError("⚠️ Please select at least 1 mood.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    try {
      await addDoc(moodsCollection, {
        date: today,
        moods: selectedMoods,
        journal,
        timestamp: new Date(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setSelectedMoods([]);
      setJournal("");

      const snapshot = await getDocs(query(moodsCollection, orderBy("timestamp", "desc")));
      const moodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(moodData);
    } catch (err) {
      console.error("Error saving mood:", err);
    }
  };

  const moodCounts = history.reduce((acc, entry) => {
    entry?.moods?.forEach((m) => {
      acc[m] = (acc[m] || 0) + 1;
    });
    return acc;
  }, {});

  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  const chartData = [
    { mood: "happy", emoji: "😊", value: moodCounts["happy"] || 0 },
    { mood: "neutral", emoji: "😐", value: moodCounts["neutral"] || 0 },
    { mood: "sad", emoji: "😞", value: moodCounts["sad"] || 0 },
    { mood: "excited", emoji: "🤩", value: moodCounts["excited"] || 0 },
    { mood: "angry", emoji: "😡", value: moodCounts["angry"] || 0 },
  ];

  const COLORS = ["#34d399", "#fbbf24", "#f87171", "#ec4899", "#f97316"];

  return (
    <section className="w-full py-16 px-6 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-100 min-h-screen">
      <div className="max-w-5xl mx-auto text-center bg-white shadow-2xl rounded-3xl p-10">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-sky-700 mb-3 drop-shadow-sm">
          🌸 Mood Tracker & Journal
        </h2>
        <p className="text-gray-600 mb-8">
          Select your mood, jot down your thoughts, and see your emotional trends.
        </p>

        {/* Mood Selection */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {[
            { mood: "happy", emoji: "😊", color: "bg-green-300" },
            { mood: "neutral", emoji: "😐", color: "bg-yellow-300" },
            { mood: "sad", emoji: "😞", color: "bg-red-300" },
            { mood: "excited", emoji: "🤩", color: "bg-pink-300" },
            { mood: "angry", emoji: "😡", color: "bg-orange-300" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => handleMoodClick(item.mood)}
              className={`p-6 rounded-2xl shadow-md text-5xl transition-all duration-300 
                ${selectedMoods.includes(item.mood)
                  ? `${item.color} scale-110 ring-4 ring-offset-2 ring-sky-400`
                  : "bg-gray-50 hover:bg-gray-100"}
              `}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        {/* Journal Input */}
        <textarea
          value={journal}
          onChange={handleJournalChange}
          placeholder="✍️ Write your thoughts (max 20 words)..."
          className="w-full max-w-2xl mx-auto p-4 rounded-xl border border-gray-200 shadow-md 
          focus:ring-4 focus:ring-sky-300 focus:outline-none text-lg resize-none"
          rows="4"
        />
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={selectedMoods.length === 0 || error}
            className="px-8 py-3 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-full 
            shadow-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Save Entry
          </button>
          {saved && (
            <p className="text-green-600 mt-3 font-medium animate-pulse">✅ Saved!</p>
          )}
        </div>

        {/* Mood Donut Chart */}
        {totalMoods > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-sky-700 mb-4">
              📊 Mood Distribution
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="emoji"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={3}
                    label={({ emoji, value }) =>
                      value > 0 ? `${emoji} ${(value / totalMoods * 100).toFixed(1)}%` : ""
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name, props) => [`${val} times`, props.payload.emoji]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History Toggle */}
        <div className="mt-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-8 py-3 bg-indigo-500 text-white rounded-full shadow-lg font-semibold hover:bg-indigo-600 transition"
          >
            {showHistory ? "🙈 Hide History" : "📅 See Your History"}
          </button>
        </div>

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <div className="mt-10 text-left">
            <h3 className="text-2xl font-bold text-sky-700 mb-6 text-center">
              📔 Your Mood Journal
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
                >
                  <p className="text-gray-500 text-sm">{entry?.date || "Unknown date"}</p>
                  <p className="text-2xl mt-2">
                    {entry?.moods?.map((m, i) => (
                      <span key={i} className="mr-2">
                        {m === "happy"
                          ? "😊"
                          : m === "neutral"
                          ? "😐"
                          : m === "sad"
                          ? "😞"
                          : m === "excited"
                          ? "🤩"
                          : "😡"}
                      </span>
                    ))}
                  </p>
                  {entry?.journal && (
                    <p className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {entry.journal}
                    </p>
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
