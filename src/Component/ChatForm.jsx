import {useRef} from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        // update chat history with the user's message
        setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

        setTimeout(() => {
            setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}]);
            // call function to generate the bot's response
            generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);
        }, 600);
    };
    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input type="text" placeholder="Type a message..." className="message-input" required ref={inputRef} />
            <button className="material-symbols-rounded">keyboard_arrow_up</button>
        </form>
    );
};

export default ChatForm;