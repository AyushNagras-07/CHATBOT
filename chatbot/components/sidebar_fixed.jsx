import React, { useState } from "react";
import Popup from "./popup";
import { motion } from "framer-motion";

const Sidebar = ({ onSelect, isDarkMode, toggleDarkMode }) => {
  const predefinedQuestions = [
    "Return Policy",
    "Refund Policy",
    "Shipping Policy",
    "Privacy Policy",
  ];

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleSelect = (question) => {
    setSelectedQuestion(question);
  };

  const closePopup = () => {
    setSelectedQuestion(null);
  };

  // Sample chat history data
  const chatHistory = [
    {
      id: 1,
      title: "Return Request #1243",
      date: "May 15, 2023",
      preview: "I need to return my damaged shoes...",
    },
    {
      id: 2,
      title: "Order Status #9876",
      date: "June 3, 2023",
      preview: "Where is my order? It's been a week...",
    },
    {
      id: 3,
      title: "Refund Request",
      date: "July 10, 2023",
      preview: "When will I receive my refund?",
    }
  ];

  const handleHistoryClick = (chat) => {
    // Send the load previous conversation command to the parent component
    if (typeof onSelect === 'function') {
      onSelect(`Loading previous conversation: ${chat.title}`);
      console.log(`Loading previous conversation: ${chat.title}`);
    } else {
      console.error("onSelect prop is not a function or not provided", onSelect);
    }
  };

  return (
    <div
      style={{
        width: "275px",
        height: "100vh",
        background: isDarkMode ? "#1a1a1a" : "#5EB1BF",
        color: isDarkMode ? "#fff" : "#333",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        transition: "background 0.3s ease-in-out",
      }}
    >
      {/* 🔄 Dark Mode Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>FAQs</h2>
        <button
          onClick={toggleDarkMode}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* 📜 Chat History Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>Return Chat History</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chatHistory.map((chat) => (
            <motion.li
              key={chat.id}
              whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? "#444" : "#e9e9e9" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleHistoryClick(chat)}
              style={{
                padding: "12px",
                background: isDarkMode ? "#333" : "#fff",
                borderRadius: "8px",
                marginBottom: "10px",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center", 
                marginBottom: "6px" 
              }}>
                <span style={{ 
                  color: isDarkMode ? "#fff" : "#333",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>🕒</span>
                  {chat.title}
                </span>
                <span style={{ 
                  color: isDarkMode ? "#999" : "#777",
                  fontSize: "0.75rem",
                  fontWeight: "400"
                }}>
                  {chat.date}
                </span>
              </div>
              <p style={{ 
                color: isDarkMode ? "#bbb" : "#666",
                fontSize: "0.85rem",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {chat.preview}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* ⚡ Quick Actions Section */}
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "10px" }}>Quick Actions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSelect(question)}
              style={{
                padding: "10px",
                width: "215px",
                borderRadius: "8px",
                border: "none",
                background: isDarkMode ? "#444" : "#e9ecef",
                color: isDarkMode ? "#fff" : "#333",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {selectedQuestion && <Popup question={selectedQuestion} onClose={closePopup} />}
    </div>
  );
};

export default Sidebar; 