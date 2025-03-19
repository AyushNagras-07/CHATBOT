import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import UserProfile from "./UserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { fetchChatResponse, fetchOrderStatus } from "../api/fetch";

const predefinedMessages = [
  "Where is my order?",
  "What is my refund status?",
  "Can I return my order?",
  "How do I generate a return label?"
];

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Welcome! Ask me about your order.", isUser: false }]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setInput("");
    setIsTyping(true);

    try {
      // Send the message to backend API
      const response = await fetchChatResponse(message);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: response.message, isUser: false }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error getting response:", error);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", isUser: false }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleOrderQuery = async (orderId) => {
    try {
      // Fetch specific order information
      const orderData = await fetchOrderStatus(orderId);
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: `Order #${orderId}: ${orderData.status}. ${orderData.details}`, isUser: false }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching order:", error);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "Sorry, I couldn't find information about that order.", isUser: false }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100%",
        maxWidth: "450px",
        margin: "auto",
        padding: "0px",
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        borderRadius: "20px",
        overflow: "hidden",
        background: isDarkMode ? "#1a1a1a" : "#ffffff",
        position: "relative",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          background: isDarkMode ? "#2d2d2d" : "#f8f9fa",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: isDarkMode ? "#404040" : "#e9ecef",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </motion.div>
          <h2 style={{ 
            margin: 0, 
            fontSize: "1.2rem", 
            color: isDarkMode ? "#fff" : "#333",
            fontWeight: "600"
          }}>
            Chatbot Shanks
          </h2>
        </div>

        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }} 
          onClick={() => setShowProfile(!showProfile)}
        >
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=John`}
            alt="User"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `2px solid ${isDarkMode ? "#ff4d4d" : "#007bff"}`,
              transition: "all 0.3s ease",
            }}
          />
        </motion.div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          gap: "15px",
          fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
        }}
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MessageBubble text={msg.text} isUser={msg.isUser} isDarkMode={isDarkMode} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: "flex-start",
              background: isDarkMode ? "#404040" : "#e9ecef",
              padding: "10px 15px",
              borderRadius: "15px",
              fontSize: "14px",
              color: isDarkMode ? "#fff" : "#333",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span className="typing-indicator">...</span>
            Chatbot is typing
          </motion.div>
        )}
      </div>

      {/* Profile Popup */}
      <AnimatePresence>
        {showProfile && (
          <UserProfile 
            user={{ name: "John Doe", email: "john@example.com" }} 
            closeProfile={() => setShowProfile(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div style={{ 
      padding: "2px 10px", 
      background: isDarkMode ? "#2d2d2d" : "#f8f9fa",
      borderTop: "1px solid rgba(0,0,0,0.1)",
    }}>
      <p style={{ 
        marginBottom: "5px", 
        color: isDarkMode ? "#ddd" : "#333",
        fontSize: "1rem",
        textAlign: "center",
        fontWeight: "500"
      }}>
      </p>

      {/* Horizontal Scrollable Buttons */}
      <div style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingBottom: "5px",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}>
        {predefinedMessages.map((msg, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInput(msg)}
            style={{
              border: "none",
              borderRadius: "15px",
              padding: "6px 12px",
              background: isDarkMode ? "#404040" : "#e9ecef",
              color: isDarkMode ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
              transition: "all 0.2s ease",
              flexShrink: 0
            }}
          >
            {msg}
          </motion.button>
        ))}
      </div>
    </div>
    
      {/* Input Box */}
      <div style={{ 
        display: "flex", 
        padding: "15px 20px",
        background: isDarkMode ? "#2d2d2d" : "#f8f9fa",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        gap: "10px"
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          style={{
            flex: "1",
            padding: "12px 15px",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "25px",
            outline: "none",
            backgroundColor: isDarkMode ? "#404040" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            fontSize: "16px",
            fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
            transition: "all 0.3s ease",
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 20px",
            cursor: "pointer",
            borderRadius: "25px",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Chatbot;