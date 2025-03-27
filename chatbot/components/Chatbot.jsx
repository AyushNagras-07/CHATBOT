import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import UserProfile from "./UserProfile";
import Sidebar from "./sidebar";
import { motion, AnimatePresence } from "framer-motion";
import orderData from "../data/ordersData";
import { useNavigate } from "react-router-dom";
import RefundTimeline from './refundtimeline';
import { useMediaQuery } from 'react-responsive';

const predefinedMessages = [
  "What is my refund status?",
  "Can I return my order?",
];

// Add breakpoints
const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)'
};

const Chatbot = () => {
  // Add media queries
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  const [messages, setMessages] = useState([{ text: "Welcome! Ask me about your order.", isUser: false }]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPredefined, setShowPredefined] = useState(true);
  const [pastOrders, setPastOrders] = useState([]);
  const [showOrderSelection, setShowOrderSelection] = useState(false);
  const chatContainerRef = useRef(null);
  const [orders, setOrders] = useState(orderData);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false); // Tracks if speech recognition is active
  const [muteVoice, setMuteVoice] = useState(false);     // Tracks if voice output is muted
  const [recognitionSupported, setRecognitionSupported] = useState(false); // Browser support for speech recognition
  const [synthesisSupported, setSynthesisSupported] = useState(false);     // Browser support for text-to-speech
  const recognition = useRef(null); // Reference to store the SpeechRecognition object

  // Get user data from localStorage
  const userData = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com"
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // Update chatbotStyle to be responsive
  const chatbotStyle = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    overflow: "hidden",
    backgroundColor: isDarkMode ? "rgba(18,18,18)" : "#CDEDF6",
    transition: "all 0.3s ease-in-out",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  };

  // Update header style
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "10px" : "15px 20px",
    background: isDarkMode ? "#1a1a1a" : "#5EB1BF",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    width: "100%",
    zIndex: 10,
  };

  // Update chat container style
  const chatContainerStyle = {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: isMobile ? "10px" : "20px",
    gap: "10px",
    fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
    width: "100%",
    height: isMobile ? "calc(100vh - 120px)" : "80",
    marginBottom: isMobile ? "80px" : "6%",
    position: "relative",
    backgroundColor: isDarkMode ? "#121212" : "#CDEDF6",
  };

  // Update input box style
  const inputBoxStyle = {
    position: isMobile ? "fixed" : "absolute",
    bottom: 20,
    left: isMobile ? "0" : "30%",
    display: "flex",
    gap: "10px",
    zIndex: 10,
    width: isMobile ? "100%" : "60%",
    padding: isMobile ? "10px" : "0",
    backgroundColor: isDarkMode ? "#1a1a1a" : "#CDEDF6",
  };

  // Update message container style
  const getMessageContainerStyle = (msg) => ({
    alignSelf: msg.isUser ? "flex-end" : "flex-start",
    maxWidth: isMobile ? "90%" : "80%",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  });

  // Update predefined messages container style
  const predefinedContainerStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: isMobile ? "95%" : "60%",
  };

  // Update order buttons container style
  const orderButtonsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    width: isMobile ? "100%" : "auto",
  };

  // Update order button style
  const orderButtonStyle = {
    padding: isMobile ? "10px 15px" : "12px 20px",
    borderRadius: "8px",
    backgroundColor: isDarkMode ? "#333" : "#fff",
    color: isDarkMode ? "#fff" : "#333",
    border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "left",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "500",
    width: isMobile ? "100%" : "auto",
  };

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleBotResponse = (response) => {
    try {
      const data = JSON.parse(response);
      
      if (data.orders) {
        setMessages(prev => [
          ...prev,
          { 
            text: "Here are your past orders. Please select one:", 
            isUser: false, 
            isOrderMessage: true,
            orders: data.orders
          }
        ]);
      } else if (data.refundStatus) {
        setMessages(prev => [
          ...prev,
          {
            text: "Here's your refund status:",
            isUser: false,
            isRefundStatus: true,
            refundStatus: data.refundStatus
          }
        ]);
      } else {
        setMessages(prev => [...prev, {
          text: typeof data === 'string' ? data : data.message || response,
          isUser: false
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }
  };

  const fetchBotMessage = (userMessage) => {
    setIsTyping(true);
    const userId = localStorage.getItem('userId');

    fetch('https://smart-nhv2.onrender.com/api/nlp/getorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: userMessage,
        userId: userId
      }),
    })
      .then(response => response.text())
      .then(botMessage => {
        handleBotResponse(botMessage);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('Error fetching bot message:', error);
        setMessages(prev => [...prev, {
          text: "Sorry, I couldn't process your request. Please try again.",
          isUser: false
        }]);
        setIsTyping(false);
      });
  };

  const handleOrderSelection = async (orderId) => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Send the order selection to the bot API
      fetchBotMessage(`Return order ${orderId}`);
    } catch (error) {
      console.error('Error handling order selection:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your order selection. Please try again.",
        isUser: false
      }]);
    }
  };

  const handleOrderReturn = async (orderId) => {
    const userId = localStorage.getItem('userId');

    try {
      // First, show the user's selection in the chat
      setMessages(prev => [...prev, {
        text: `${orderId}`,
        isUser: true
      }]);

      // Send the return request to the backend
      const response = await fetch('https://smart-nhv2.onrender.com/api/nlp/getorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `order id is ${orderId}`,
          orderId: orderId,
          userId: userId
        }),
      });

      const data = await response.text();

      // Show the bot's response
      setMessages(prev => [...prev, {
        text: data,
        isUser: false
      }]);

    } catch (error) {
      console.error('Error initiating return:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your return request. Please try again.",
        isUser: false
      }]);
    }
  };

  const handleSend = (message) => {
    if (!message) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setInput("");
    setIsTyping(true);
    setShowPredefined(false);

    fetchBotMessage(message);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Check for SpeechRecognition support (vendor-prefixed in some browsers)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setRecognitionSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = 'en-US';          // Set language to English
      recognition.current.interimResults = false;  // Only return final results
      recognition.current.maxAlternatives = 1;     // Return one transcription

      // Handle speech recognition results
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set transcribed text in input field
        setIsListening(false); // Stop listening after transcription
      };

      // Stop recognition when user stops speaking
      recognition.current.onspeechend = () => {
        recognition.current.stop();
        setIsListening(false);
      };

      // Handle errors
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    // Check for SpeechSynthesis support
    if ('speechSynthesis' in window) {
      setSynthesisSupported(true);
    }
  }, []);


  useEffect(() => {
    if (messages.length > 0 && synthesisSupported && !muteVoice) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) { // Only speak chatbot messages
        speak(lastMessage.text);
      }
    }
  }, [messages]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={chatbotStyle}
    >
      {/* Sidebar - Only show on desktop and tablet */}
      {(isDesktop || isTablet) && (
        <Sidebar
          onSelect={handleSend}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h2 style={{
              margin: 0,
              fontSize: "1.5rem",
              color: isDarkMode ? "#fff" : "#333",
              fontWeight: "600"
            }}>
              Chatbot Shanks
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "right", gap: "15px" }}>
            <button
              onClick={() => setMuteVoice(!muteVoice)}
              style={{
                color: isDarkMode ? "#fff" : "#333",
                marginLeft: 800,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px 10px"
              }}
            >
              {muteVoice ? "Unmute" : "Mute"}
            </button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfile(!showProfile)}
            >
            </motion.div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                background: isDarkMode ? "#ff4d4d" : "#ff4444",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Logout
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`}
                alt="User"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: `4px solid ${isDarkMode ? "#ff4d4d" : "#007bff"}`,
                  transition: "all 0.3s ease",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          style={chatContainerStyle}
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={getMessageContainerStyle(msg)}
              >
                <MessageBubble text={msg.text} isUser={msg.isUser} isDarkMode={isDarkMode} />
                {msg.isOrderMessage && msg.orders && (
                  <div style={orderButtonsContainerStyle}>
                    {msg.orders.map((order) => (
                      <motion.button
                        key={order.orderId}
                        onClick={() => handleOrderReturn(order.orderId)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={orderButtonStyle}
                      >
                        <div>
                          Order #{order.orderId}
                          <div style={{ 
                            fontSize: "14px", 
                            color: isDarkMode ? "#aaa" : "#666",
                            marginTop: "4px" 
                          }}>
                            Item {order.itmes}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
                {msg.isRefundStatus && (
                  <div style={{ marginTop: "10px" }}>
                    <RefundTimeline status={msg.refundStatus} isDarkMode={isDarkMode} />
                  </div>
                )}
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
                fontSize: "16px",
                color: isDarkMode ? "#fff" : "#333",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginLeft: 170,
              }}
            >
              <span className="typing-indicator">...</span>
              Chatbot is typing
            </motion.div>
          )}

          {/* Floating Predefined Questions and Category Buttons */}
          {showPredefined && (
            <div style={predefinedContainerStyle}>
              {predefinedMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: isDarkMode ? "#333" : "#ddd" }}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "10px",
                    background: isDarkMode ? "rgba(172, 172, 172, 0.53)" : "rgba(0, 0, 0, 0.05)",
                    color: isDarkMode ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
                    transition: "all 0.3s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setInput(msg)}
                >
                  {msg}
                </motion.div>
              ))}
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={getMessageContainerStyle(msg)}
                >
                  <MessageBubble text={msg.text} isUser={msg.isUser} isDarkMode={isDarkMode} />
                  {msg.isOrderMessage && msg.orders && (
                    <div style={orderButtonsContainerStyle}>
                      {msg.orders.map((order) => (
                        <motion.button
                          key={order.orderId}
                          onClick={() => handleOrderReturn(order.orderId)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={orderButtonStyle}
                        >
                          Order {order.orderId}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Category Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "20px",
              }}>
                {["Past Orders", "Order Status", "Returns", "Payment"].map((category, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      border: "none",
                      borderRadius: "25px",
                      padding: "10px 20px",
                      background: isDarkMode ? "linear-gradient(135deg,rgba(190, 190, 190, 0.7),rgba(160, 159, 161, 0.9))" : "linear-gradient(135deg,rgb(219, 211, 211),rgba(163, 159, 168, 0.93))",
                      color: isDarkMode ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Popup */}
        <AnimatePresence>
          {showProfile && (
            <UserProfile
              user={userData}
              closeProfile={() => setShowProfile(false)}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>

        {/* Input Box */}
        <div style={inputBoxStyle}>
          {recognitionSupported && (
            <button
              onClick={() => {
                if (!isListening) {
                  recognition.current.start();
                  setIsListening(true);
                }
              }}
              disabled={isListening}
              style={{
                padding: "10px",
                backgroundColor: isListening ? "#ccc" : "#e0e0e0",
                borderRadius: "50%",
              }}
            >
              🎤
            </button>
          )}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "12px 15px",
              border: "none",
              borderRadius: "25px",
              outline: "none",
              backgroundColor: isDarkMode ? "rgba(172, 172, 172, 0.23)" : "rgba(0, 0, 0, 0.05)",
              color: isDarkMode ? "#fff" : "#333",
              fontSize: "16px",
              fontFamily: "inherit",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(input)}
            style={{
              backgroundColor: isDarkMode ? "#404040" : "#e0e0e0",
              color: isDarkMode ? "#fff" : "#333",
              border: "none",
              padding: "12px 20px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot; 