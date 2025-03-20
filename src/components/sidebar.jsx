import React from "react";

const Sidebar = ({ onSelect, isDarkMode, toggleDarkMode }) => {
  const predefinedQuestions = [
    "Track My Order",
    "Return Policy",
    "Refund Status",
    "Generate Return Label",
  ];

  return (
    <div
      style={{
        width: "215px",
        height: "100vh",
        background: isDarkMode ? "#1a1a1a" : "#f8f9fa",
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
        <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Order Assistant</h2>
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
          <li style={{ padding: "8px", background: isDarkMode ? "#333" : "#fff", borderRadius: "5px", marginBottom: "5px", cursor: "pointer" }}>
            🕒 Conversation 1
          </li>
          <li style={{ padding: "8px", background: isDarkMode ? "#333" : "#fff", borderRadius: "5px", marginBottom: "5px", cursor: "pointer" }}>
            🕒 Conversation 2
          </li>
        </ul>
      </div>

      {/* ⚡ Quick Actions Section */}
      <div>
        <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "10px" }}>Quick Actions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSelect(question)}
              style={{
                padding: "10px",
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
    </div>
  );
};

export default Sidebar;
