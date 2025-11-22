import React from "react";
import "./chat.css";

function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
      {text}
    </div>
  );
}

export default MessageBubble;