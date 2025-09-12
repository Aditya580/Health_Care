import {useEffect, useRef, useState} from "react";
import ChatBotIcon from "./ChatBotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "./ChatBot.css";

function ChatBot() {
    const chatBodyRef = useRef();
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);

    const generateBotResponse = async (history) => {
        const updateHistory = (text) => {
            setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "Thinking..."), {role: "model", text}]);
        };
        // 🔁 Add the system message
        const systemMessage = {
            role: "user",
            parts: [
                {
                    text: `
You are HealthMate, a friendly and knowledgeable health assistant for the website Mindease.com.
- You help users with questions about health, wellness, and navigating the site.
- Always introduce yourself as "your health companion", never as a language model or AI developed by Google.
- If users ask questions about the website, respond with answers based on the following knowledge:
  - We offer 24/7 health chat support.
  - Services include wellness tips, personalized tracking, and live Q&A with experts.
  - Common questions are answered at /faq.
  - For support, direct users to /contact or support@mindease.com.
If unsure, kindly ask the user to check the appropriate section of the site.
            `.trim(),
                },
            ],
        };

        // 🛠️ Convert history to Gemini format
        const formattedHistory = history.map(({role, text}) => ({
            role,
            parts: [{text}],
        }));

        // 🧠 Inject system prompt at the beginning
        const contents = [systemMessage, ...formattedHistory];

        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({contents}),
        };

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
                    import.meta.env.VITE_GEMINI_API_KEY
                }`,
                requestOptions
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

            const apiResponseText =
                data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "";

            updateHistory(apiResponseText);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const chatBody = chatBodyRef.current;
        if (!chatBody) return;

        const isNearBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 100;

        if (isNearBottom) {
            chatBody.scrollTo({
                top: chatBody.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [chatHistory]);

    return (
        <div className={`chatbot ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
                <span className="material-symbols-rounded">{showChatbot ? "close" : "mode_comment"}</span>
            </button>

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatBotIcon />
                        <h2 className="logo-text">Chatbot</h2>
                    </div>
                    <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
                        keyboard_arrow_down
                    </button>
                </div>

                {/* Chatbot Body */}
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatBotIcon />
                        <p className="message-text">
                            Hey there 👋
                            <br /> How can I help you today?
                        </p>
                    </div>
                    {/* Render the chat history dynamically */}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                {/* chatbot footer */}
                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
