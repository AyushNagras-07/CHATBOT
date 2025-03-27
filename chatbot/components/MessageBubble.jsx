import React from "react";
import { motion } from "framer-motion";

const MessageBubble = ({ text, isUser, isDarkMode, animate }) => {
  // Enhanced animation variants
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      x: isUser ? 20 : -20,
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.9,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.01,
      boxShadow: isDarkMode 
        ? "0 4px 12px rgba(0,0,0,0.25)" 
        : "0 4px 12px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  // Responsive style for different screen sizes
  const getResponsiveMargins = () => {
    return {
      marginLeft: isUser ? 0 : "10px",
      marginRight: isUser ? "10px" : 0,
      position: "relative",
      backdropFilter: "blur(10px)",
      "@media screen and (min-width: 768px)": {
        marginLeft: isUser ? 0 : "170px",
        marginRight: isUser ? "150px" : 0,
      },
      "@media screen and (max-width: 767px)": {
        marginLeft: isUser ? 0 : "50px",
        marginRight: isUser ? "50px" : 0,
      }
    };
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      variants={bubbleVariants}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
        width: "100%",
      }}
    >
      <motion.div
        style={{
          backgroundColor: isUser 
            ? (isDarkMode ? "#4a4a4a" : "#333") 
            : (isDarkMode ? "rgba(74, 74, 74, 0.7)" : "rgba(255, 255, 255, 0.85)"),
          color: isUser 
            ? "#fff" 
            : (isDarkMode ? "#fff" : "#333"),
          padding: "12px 18px",
          borderRadius: "18px",
          maxWidth: "100%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          fontSize: "15px",
          lineHeight: "1.5",
          boxShadow: isDarkMode 
            ? "0 2px 10px rgba(0,0,0,0.2)" 
            : "0 2px 10px rgba(0,0,0,0.08)",
          border: isUser 
            ? "none" 
            : (isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"),
          marginLeft: isUser ? 0 : window.innerWidth > 768 ? "170px" : "50px",
          marginRight: isUser ? window.innerWidth > 768 ? "150px" : "50px" : 0,
        }}
        className={isUser ? "user-message" : "bot-message"}
      >
        {typeof text === 'string' ? text : JSON.stringify(text, null, 2)}
      </motion.div>
    </motion.div>
  );
};

export default MessageBubble;
