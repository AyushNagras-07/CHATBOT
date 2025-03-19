import React from "react";
import { motion } from "framer-motion";

const MessageBubble = ({ text, isUser, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start", // ✅ Right for user, Left for bot
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 15px",
          borderRadius: "15px",
          background: isUser ? (isDarkMode ? "#007bff" : "#007bff") : (isDarkMode ? "#404040" : "#e9ecef"),
          color: isUser ? "#fff" : isDarkMode ? "#fff" : "#333",
          textAlign: "left",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
