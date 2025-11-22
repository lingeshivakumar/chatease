import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { sendMessage } from "../services/api";
import "./chat.css";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    const botReply = await sendMessage(input);
    const newBotMsg = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, newBotMsg]);

    setLoading(false);
  };

  const firstMessageSent = messages.length > 0;

  return (
    <div className="grok-page">
      
      {/* HEADER */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="logo">ChatEase</div>

          <div className="auth-buttons">
            <button className="btn-outline">Sign in</button>
            <button className="btn-filled">Sign up</button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className={`main-area ${firstMessageSent ? "with-messages" : ""}`}>

        {!firstMessageSent && (
          <div className="center-box">
            <h1 className="center-title">ChatEase</h1>
          </div>
        )}

        {firstMessageSent && (
          <div className="chat-window">
            {messages.map((m, i) => (
              <MessageBubble key={i} sender={m.sender} text={m.text} />
            ))}
            {loading && <p className="thinking">thinking…</p>}
          </div>
        )}

        <div className={`input-area ${firstMessageSent ? "bottom" : "center"}`}>
  <input
    className="chat-input"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask anything…"
  />
  <button className="send-btn" onClick={handleSend}>➤</button>
  
</div>

{!firstMessageSent && (
  <p className="contact-line">Mail — lingeshivakumar@gmail.com</p>
)}

      </div>
    </div>
  );
}

export default ChatWindow;