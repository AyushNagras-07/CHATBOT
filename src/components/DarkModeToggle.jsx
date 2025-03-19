import React from "react";
import { FaMoon } from "react-icons/fa"; // Import Moon Icon

const DarkModeToggle = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div
      onClick={() => setIsDarkMode(!isDarkMode)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "15px",
        background: isDarkMode ? "#333" : "#f0f0f0",
        transition: "background 0.3s ease-in-out",
      }}
    >
      {/* Moon Icon Button */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: isDarkMode ? "#ff4d4d" : "#e5e5e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.3s ease-in-out",
        }}
      >
        <FaMoon color={isDarkMode ? "white" : "#444"} size={20} />
      </div>
    </div>
  );
};

export default DarkModeToggle;
