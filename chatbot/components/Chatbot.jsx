import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import UserProfile from "./UserProfile";
import Sidebar from "./sidebar_fixed";
import { motion, AnimatePresence } from "framer-motion";
import orderData from "../data/ordersData";
import { useNavigate } from "react-router-dom";
import RefundTimeline from './RefundTimeline';
import LanguageSelector from './LanguageSelector';

const translations = {
  en: {
    welcome: "Welcome! Ask me about your order.",
    whatRefundStatus: "What is my refund status?",
    canReturnOrder: "Can I return my order?",
    pastOrders: "Past Orders",
    orderStatus: "Order Status",
    returns: "Returns",
    refundstatus: "Refund Status",
    typeMessage: "Type your message...",
    send: "Send",
    logout: "Logout",
    mute: "Mute",
    unmute: "Unmute",
    chatbotTyping: "Chatbot is typing",
    language: "Language",
    errorMessage: "Sorry, I couldn't process your request. Please try again.",
    pastOrdersMessage: "Here are your past orders. Please select one:",
    refundStatusMessage: "Here's your refund status:",
    microphoneError: "Microphone access denied. Please allow microphone access.",
    returnError: "Sorry, I couldn't process your return request. Please try again."
  },
  es: {
    welcome: "¡Bienvenido! Pregúntame sobre tu pedido.",
    whatRefundStatus: "¿Cuál es el estado de mi reembolso?",
    canReturnOrder: "¿Puedo devolver mi pedido?",
    pastOrders: "Pedidos Anteriores",
    orderStatus: "Estado del Pedido",
    returns: "Devoluciones",
    refundstatus: "Estado del Reembolso",
    typeMessage: "Escribe tu mensaje...",
    send: "Enviar",
    logout: "Cerrar sesión",
    mute: "Silenciar",
    unmute: "Activar sonido",
    chatbotTyping: "El chatbot está escribiendo",
    language: "Idioma",
    errorMessage: "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.",
    pastOrdersMessage: "Aquí están sus pedidos anteriores. Por favor, seleccione uno:",
    refundStatusMessage: "Aquí está su estado de reembolso:",
    microphoneError: "Acceso al micrófono denegado. Por favor, permite el acceso al micrófono.",
    returnError: "Lo siento, no pude procesar tu solicitud de devolución. Por favor, inténtalo de nuevo."
  },
  fr: {
    welcome: "Bienvenue ! Posez-moi des questions sur votre commande.",
    whatRefundStatus: "Quel est l'état de mon remboursement ?",
    canReturnOrder: "Puis-je retourner ma commande ?",
    pastOrders: "Commandes Passées",
    orderStatus: "État de la Commande",
    returns: "Retours",
    refundstatus: "État du Remboursement",
    typeMessage: "Tapez votre message...",
    send: "Envoyer",
    logout: "Déconnexion",
    mute: "Muet",
    unmute: "Activer le son",
    chatbotTyping: "Le chatbot est en train d'écrire",
    language: "Langue",
    errorMessage: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
    pastOrdersMessage: "Voici vos commandes passées. Veuillez en sélectionner une:",
    refundStatusMessage: "Voici l'état de votre remboursement:",
    microphoneError: "Accès au microphone refusé. Veuillez autoriser l'accès au microphone.",
    returnError: "Désolé, je n'ai pas pu traiter votre demande de retour. Veuillez réessayer."
  },
  de: {
    welcome: "Willkommen! Fragen Sie mich nach Ihrer Bestellung.",
    whatRefundStatus: "Wie ist der Status meiner Rückerstattung?",
    canReturnOrder: "Kann ich meine Bestellung zurücksenden?",
    pastOrders: "Vergangene Bestellungen",
    orderStatus: "Bestellstatus",
    returns: "Rücksendungen",
    refundstatus: "Rückerstattungsstatus",
    typeMessage: "Nachricht eingeben...",
    send: "Senden",
    logout: "Abmelden",
    mute: "Stummschalten",
    unmute: "Ton aktivieren",
    chatbotTyping: "Chatbot schreibt",
    language: "Sprache",
    errorMessage: "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten. Bitte versuchen Sie es erneut.",
    pastOrdersMessage: "Hier sind Ihre vergangenen Bestellungen. Bitte wählen Sie eine aus:",
    refundStatusMessage: "Hier ist Ihr Rückerstattungsstatus:",
    microphoneError: "Mikrofonzugriff verweigert. Bitte erlauben Sie den Zugriff auf das Mikrofon.",
    returnError: "Entschuldigung, ich konnte Ihre Rücksendeanfrage nicht bearbeiten. Bitte versuchen Sie es erneut."
  },
  zh: {
    welcome: "欢迎！询问有关您订单的问题。",
    whatRefundStatus: "我的退款状态是什么？",
    canReturnOrder: "我可以退货吗？",
    pastOrders: "历史订单",
    orderStatus: "订单状态",
    returns: "退货",
    refundstatus: "退款状态",
    typeMessage: "输入您的消息...",
    send: "发送",
    logout: "登出",
    mute: "静音",
    unmute: "取消静音",
    chatbotTyping: "聊天机器人正在输入",
    language: "语言",
    errorMessage: "抱歉，我无法处理您的请求。请再试一次。",
    pastOrdersMessage: "这里是您的历史订单。请选择一个:",
    refundStatusMessage: "这里是您的退款状态:",
    microphoneError: "麦克风访问被拒绝。请允许麦克风访问。",
    returnError: "抱歉，我无法处理您的退货请求。请再试一次。"
  }
};

const predefinedMessages = [
  "What is my refund status?",
  "Can I return my order?",
];

// Add sample conversation history data
const sampleConversations = {
  "Return Request #1243": [
    { text: "I need to return my damaged shoes", isUser: true },
    { text: "I'm sorry to hear about your damaged shoes. I'd be happy to help you process a return. Could you provide the order number?", isUser: false },
    { text: "Order #54321", isUser: true },
    { text: "Thank you. I can see your order for Nike Air Max shoes. Could you explain what damage occurred?", isUser: false },
    { text: "The sole is coming apart after just one week of use", isUser: true },
    { text: "I apologize for the quality issue. Based on the information provided, you're eligible for a full refund or replacement. Which would you prefer?", isUser: false }
  ],
  "Order Status #9876": [
    { text: "Where is my order? It's been a week", isUser: true },
    { text: "I'd be happy to check on that for you. Could you please provide your order number?", isUser: false },
    { text: "Order #9876", isUser: true },
    { text: "Thank you. I can see your order was shipped 3 days ago via expedited shipping. According to the tracking information, it should be delivered tomorrow by 8pm.", isUser: false },
    { text: "That's great, thank you!", isUser: true },
    { text: "You're welcome! Is there anything else I can help you with today?", isUser: false }
  ],
  "Refund Request": [
    { text: "When will I receive my refund?", isUser: true },
    { text: "I'd be happy to check on the status of your refund. Could you provide the order number?", isUser: false },
    { text: "Order #12345", isUser: true },
    { text: "Thank you. I see that your refund was processed 2 days ago. It typically takes 3-5 business days to appear on your account, depending on your bank.", isUser: false },
    { text: "Ok, I'll wait a few more days then", isUser: true },
    { text: "That sounds good. If you don't see the refund by the end of the week, please contact us again and we'll follow up with your bank.", isUser: false }
  ]
};

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Welcome! Ask me about your order.", isUser: false }]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPredefined, setShowPredefined] = useState(true);
  const [pastOrders, setPastOrders] = useState([]);
  const [showOrderSelection, setShowOrderSelection] = useState(false);
  const chatContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [orders, setOrders] = useState(orderData);
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false); // Tracks if speech recognition is active
  const [muteVoice, setMuteVoice] = useState(false);     // Tracks if voice output is muted
  const [recognitionSupported, setRecognitionSupported] = useState(false); // Browser support for speech recognition
  const [synthesisSupported, setSynthesisSupported] = useState(false);     // Browser support for text-to-speech
  const recognition = useRef(null); // Reference to store the SpeechRecognition object

  const [language, setLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showCategoryContent, setShowCategoryContent] = useState(null);

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

  // Responsive design adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileSidebar(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
      
      // Enhanced translation handling for all bot responses
      if (data.orders) {
        setMessages(prev => [
          ...prev,
          { 
            text: translations[language].pastOrdersMessage || "Here are your past orders. Please select one:", 
            isUser: false, 
            isOrderMessage: true,
            orders: data.orders,
            animate: true
          }
        ]);
      } else if (data.refundStatus) {
        // Always reset to show animation from the beginning
        // Use setTimeout to ensure UI updates properly before animation
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: translations[language].refundStatusMessage || "Here's your refund status:",
              isUser: false,
              isRefundStatus: true,
              refundStatus: data.refundStatus,
              animate: true
            }
          ]);
        }, 100);
      } else {
        // Prioritize translated responses from backend if available
        const messageText = data.translatedText?.[language] || 
                          data.translations?.[language] ||
                          data.message || 
                          response;
        
        setMessages(prev => [...prev, {
          text: messageText,
          isUser: false,
          animate: true
        }]);
      }
    } catch (error) {
      // If not JSON, treat as regular text
      setMessages(prev => [...prev, {
        text: response,
        isUser: false,
        animate: true
      }]);
    }
    
    // Automatically scroll to the latest message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const fetchBotMessage = (userMessage, lang = language) => {
    setIsTyping(true);
    const userId = localStorage.getItem('userId');
    
    // Log the language being used for this request
    console.log(`Fetching bot message in language: ${lang}`);
    
    fetch('https://smart-nhv2.onrender.com/api/nlp/getorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: userMessage, 
        userId: userId,
        language: lang
      }),
    })
      .then(response => response.text())
      .then(botMessage => {
        handleBotResponse(botMessage);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('Error fetching bot message:', error);
        // Translate the error message based on selected language
        const errorMessage = translations[lang].errorMessage || "Sorry, I couldn't process your request. Please try again.";
        setMessages(prev => [...prev, { 
          text: errorMessage, 
          isUser: false,
          animate: true // Add animation
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

      // Send the order selection to the bot API with language parameter
      fetchBotMessage(`Return order ${orderId}`, language);
    } catch (error) {
      console.error('Error handling order selection:', error);
      setMessages(prev => [...prev, {
        text: translations[language].errorMessage || "Sorry, I couldn't process your order selection. Please try again.",
        isUser: false,
        animate: true // Add animation
      }]);
    }
  };

  const handleOrderReturn = async (orderId, lang = language) => {
    const userId = localStorage.getItem('userId');
    
    try {
      // First, show the user's selection in the chat
      setMessages(prev => [...prev, {
        text: `${orderId}`,
        isUser: true,
        animate: true // Add animation
      }]);

      // Show typing indicator
      setIsTyping(true);

      // Send the return request to the backend with language parameter
      const response = await fetch('https://smart-nhv2.onrender.com/api/nlp/getorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `order id is ${orderId}`,
          orderId: orderId,
          userId: userId,
          language: lang // Always include language
        }),
      });

      const data = await response.text();
      let messageText;
      
      // Try to parse the response as JSON to extract translated messages
      try {
        const jsonData = JSON.parse(data);
        messageText = jsonData.translatedText?.[lang] || 
                      jsonData.translations?.[lang] ||
                      jsonData.message || 
                      data;
      } catch (e) {
        // If not JSON, use the raw text
        messageText = data;
      }

      // Hide typing indicator
      setIsTyping(false);

      // Show the bot's response
      setMessages(prev => [...prev, {
        text: messageText,
        isUser: false,
        animate: true
      }]);

    } catch (error) {
      console.error('Error initiating return:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: translations[lang].returnError || "Sorry, I couldn't process your return request. Please try again.",
        isUser: false,
        animate: true
      }]);
    }
  };

  const handleSend = (message) => {
    // Check if this is a request to load a previous conversation
    if (message.startsWith("Loading previous conversation:")) {
      const conversationTitle = message.replace("Loading previous conversation: ", "");
      const conversation = sampleConversations[conversationTitle];
      
      if (conversation) {
        // Clear current messages and load the sample conversation
        setMessages([
          { text: `Previous conversation: ${conversationTitle}`, isUser: false },
          ...conversation
        ]);
        setShowPredefined(false);
        return;
      }
    }

    // Regular message handling
    if (!message) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setInput("");
    setIsTyping(true);
    setShowPredefined(false);

    fetchBotMessage(message, language);
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
      
      // Update the recognition language based on the selected language
      const languageMap = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'zh': 'zh-CN'
      };
      
      recognition.current.lang = languageMap[language] || 'en-US';
      recognition.current.interimResults = false;  // Only return final results
      recognition.current.maxAlternatives = 1;     // Return one transcription

      // Handle speech recognition results
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set transcribed text in input field
        setIsListening(false); // Stop listening after transcription
        
        // Automatically send the message after a short delay
        setTimeout(() => {
          handleSend(transcript);
        }, 300);
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
        
        // Show translated error message for speech recognition issues
        if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, {
            text: translations[language].microphoneError || "Microphone access denied. Please allow microphone access.",
            isUser: false
          }]);
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    // Check for SpeechSynthesis support
    if ('speechSynthesis' in window) {
      setSynthesisSupported(true);
    }
  }, [language]); // Add language as a dependency to update when language changes


  useEffect(() => {
    if (messages.length > 0 && synthesisSupported && !muteVoice) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) { // Only speak chatbot messages
        speak(lastMessage.text);
      }
    }
  }, [messages, language, muteVoice]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Set the language for speech based on the selected language
    utterance.lang = language === 'en' ? 'en-US' : 
                     language === 'es' ? 'es-ES' : 
                     language === 'fr' ? 'fr-FR' : 
                     language === 'de' ? 'de-DE' : 
                     language === 'zh' ? 'zh-CN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleRefundStatusClick = () => {
    setIsTyping(true);
    
    // Simulate a typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Generate a random refund status (1-4)
      // In a real application, this would come from the backend
      const randomStatus = Math.floor(Math.random() * 3) + 1; // Status 1-3 (Pending, Processing, Completed)
      
      setMessages(prev => [
        ...prev,
        {
          text: "Let me check your refund status...",
          isUser: false,
          animate: true,
        }
      ]);
      
      // Wait a bit, then show the refund timeline
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            text: translations[language].refundStatusMessage,
            isUser: false,
            isRefundStatus: true,
            refundStatus: randomStatus,
            animate: true,
            timestamp: Date.now() // Ensure component rerendering
          }
        ]);
      }, 1000);
    }, 1500);
  };

  const handleCategoryClick = (category) => {
    setShowPredefined(false);
    
    switch(category) {
      case "Past Orders":
        fetchBotMessage("show my past orders");
        break;
      case "Order Status":
        fetchBotMessage("check my order status");
        break;
      case "Returns":
        fetchBotMessage("how do I return an item");
        break;
      case "Refund Status":
        handleRefundStatusClick();
        break;
      default:
        break;
    }
  };

  const localizedPredefinedMessages = [
    translations[language].whatRefundStatus,
    translations[language].canReturnOrder,
  ];

  useEffect(() => {
    setMessages([{ text: translations[language].welcome, isUser: false }]);
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
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
      }}
    >
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && (
        <Sidebar
          onSelect={handleSend}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Mobile header - Only shown on mobile */}
      {isMobile && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          background: isDarkMode ? "#1a1a1a" : "#5EB1BF",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          width: "100%",
          zIndex: 10,
        }}>
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            style={{
              background: "transparent",
              border: "none",
              color: isDarkMode ? "#fff" : "#333",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            ☰
          </button>
          <h2 style={{ 
            margin: 0, 
            fontSize: "1.5rem", 
            color: isDarkMode ? "#fff" : "#333",
            fontWeight: "600"
          }}>
            Chatbot Shanks
          </h2>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button
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
              {translations[language].logout}
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay - Only shown when toggled */}
      <AnimatePresence>
        {isMobile && showMobileSidebar && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "80%",
              height: "100vh",
              zIndex: 100,
              boxShadow: "0 0 15px rgba(0,0,0,0.2)"
            }}
          >
            <Sidebar
              onSelect={(text) => {
                handleSend(text);
                setShowMobileSidebar(false);
              }}
              isDarkMode={isDarkMode}
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
            <button
              onClick={() => setShowMobileSidebar(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: isDarkMode ? "#333" : "#fff",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                cursor: "pointer",
                fontSize: "16px",
                color: isDarkMode ? "#fff" : "#333",
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        height: isMobile ? "calc(100vh - 60px)" : "100vh",
      }}>
        {/* Desktop Header - Only shown on desktop */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              background: isDarkMode ? "#1a1a1a" : "#5EB1BF",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              width: "100%",
              zIndex: 10,
            }}
          >
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

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <button
                onClick={() => setMuteVoice(!muteVoice)}
                style={{
                  color: isDarkMode ? "#fff" : "#333",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 10px"
                }}
              >
                {muteVoice ? translations[language].unmute : translations[language].mute}
              </button>
              
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
                {translations[language].logout}
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
        )}

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            gap: "10px",
            fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
            width: "100%",
            marginBottom: isMobile ? "70px" : "80px",
            position: "relative",
            backgroundColor: isDarkMode ? "#121212" : "#CDEDF6",
          }}
        >
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf: msg.isUser ? "flex-end" : "flex-start",
                  maxWidth: isMobile ? "90%" : "80%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                <MessageBubble text={msg.text} isUser={msg.isUser} isDarkMode={isDarkMode} animate={msg.animate} />
                {msg.isOrderMessage && msg.orders && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                    {msg.orders.map((order) => (
                      <motion.button
                        key={order.orderId}
                        onClick={() => handleOrderReturn(order.orderId, language)}
                        whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        style={{
                          padding: "12px 20px",
                          borderRadius: "8px",
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                          color: isDarkMode ? "#fff" : "#333",
                          border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textAlign: "left",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          fontSize: "16px",
                          fontWeight: "500"
                        }}
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
                  <div style={{ marginTop: "10px", width: "100%" }}>
                    <RefundTimeline 
                      status={msg.refundStatus} 
                      isDarkMode={isDarkMode} 
                      demoMode={msg.demoMode} 
                      key={`refund-${index}-${Date.now()}`} // Force re-render on update
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                marginLeft: isMobile ? "10px" : "170px",
              }}
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="typing-indicator"
              >
                ...
              </motion.span>
              {translations[language].chatbotTyping}
            </motion.div>
          )}

          {/* Floating Predefined Questions and Category Buttons */}
          {showPredefined && (
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: isMobile ? "90%" : "60%",
            }}>
              {localizedPredefinedMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: isDarkMode ? "#333" : "#ddd" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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

              {/* Category Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "20px",
                flexWrap: "wrap" // Added for better responsiveness
              }}>
                {["Returns", "Refund Status", "Order Status"].map((category, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      border: "none",
                      borderRadius: "25px",
                      padding: "10px 20px",
                      background: isDarkMode ? "linear-gradient(135deg,rgba(190, 190, 190, 0.7),rgba(160, 159, 161, 0.9))" : "linear-gradient(135deg,rgb(219, 211, 211),rgba(163, 159, 168, 0.93))",
                      color: isDarkMode ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: "clamp(14px, 2vw, 16px)",
                      fontFamily: "Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      whiteSpace: "nowrap",
                      margin: "5px" // Added for better spacing in wrapped layout
                    }}
                  >
                    {translations[language][category.toLowerCase().replace(" ", "")] || category}
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
        <div style={{
          position: "absolute",
          bottom: 20,
          left: isMobile ? "5%" : "30%",
          display: "flex",
          gap: "10px",
          zIndex: 10,
          width: isMobile ? "90%" : "65%",
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          {recognitionSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isListening) {
                  recognition.current.start();
                  setIsListening(true);
                }
              }}
              disabled={isListening}
              style={{
                padding: "12px",
                backgroundColor: isListening ? "#ccc" : isDarkMode ? "#404040" : "#e0e0e0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: isListening ? "default" : "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <span role="img" aria-label="microphone" style={{ fontSize: "18px" }}>
                {isListening ? "🔴" : "🎤"}
              </span>
            </motion.button>
          )}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder={translations[language].typeMessage}
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
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            style={{
              backgroundColor: isDarkMode ? "#404040" : "#e0e0e0",
              color: isDarkMode ? "#fff" : "#333",
              border: "none",
              padding: "12px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
            title={translations[language].language}
          >
            <span role="img" aria-label="language" style={{ fontSize: "18px" }}>🌐</span>
          </motion.button>
          
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
            {translations[language].send}
          </motion.button>
        </div>

        {/* Language Selector */}
        <AnimatePresence>
          {showLanguageSelector && (
            <LanguageSelector
              selectedLanguage={language}
              onSelectLanguage={(lang) => {
                setLanguage(lang);
                setShowLanguageSelector(false);
              }}
              isDarkMode={isDarkMode}
              style={{
                position: "absolute",
                bottom: isMobile ? "80px" : "80px",
                right: isMobile ? "20px" : "10%",
                zIndex: 1000
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Chatbot; 