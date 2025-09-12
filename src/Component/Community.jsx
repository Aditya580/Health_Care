import React, { useState, useEffect } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { db } from "../firebase/firebase"; // adjust path if needed
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function Community() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Fetch messages in real-time
  useEffect(() => {
    const q = query(collection(db, "communityMessages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // ✅ Post message to Firestore
  const handlePost = async () => {
    if (!username.trim() || !message.trim()) return;

    await addDoc(collection(db, "communityMessages"), {
      user: username,
      text: message,
      timestamp: serverTimestamp(),
    });

    setMessage("");
  };

  return (
    <div
      id="community"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 p-6"
    >
      {/* Heading */}
      <h2 className="text-4xl font-bold text-white mb-6 tracking-wide">
        🌐 Community Chat
      </h2>

      {/* Username Input */}
      <div className="flex items-center gap-3 mb-6">
        <FaUserCircle className="text-white text-3xl" />
        <input
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-xl focus:outline-none border border-sky-400 focus:ring-2 focus:ring-sky-300 bg-white/90"
        />
      </div>

      {/* Messages Feed */}
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col gap-4 overflow-y-auto h-[400px] border border-sky-400">
        {messages.length === 0 ? (
          <p className="text-center text-white/70">
            No messages yet. Be the first to post! 🚀
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-3 bg-white/20 rounded-xl p-3 shadow-md"
            >
              <FaUserCircle className="text-white text-3xl" />
              <div className="flex flex-col">
                <span className="font-semibold text-sky-200">{msg.user}</span>
                <span className="text-white">{msg.text}</span>
                <span className="text-xs text-gray-300 mt-1">
                  {msg.timestamp?.toDate
                    ? msg.timestamp.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Message Box */}
      <div className="w-full max-w-3xl flex items-center gap-3 mt-6">
        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl focus:outline-none border border-sky-400 focus:ring-2 focus:ring-sky-300 bg-white/90"
        />
        <button
          onClick={handlePost}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 shadow-md"
        >
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
}
