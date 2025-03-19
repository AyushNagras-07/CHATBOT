import React from "react";

const PredefinedMessages = ({ handleSend, isDarkMode }) => {
  const predefinedQuestions = [
    "Where is my order?",
    "What is my refund status?",
    "Can I return my order?",
    "How do I generate a return label?",
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
      {predefinedQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => handleSend(question)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #007bff",
            backgroundColor: isDarkMode ? "#007bff" : "white",
            color: isDarkMode ? "white" : "#007bff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default PredefinedMessages;
