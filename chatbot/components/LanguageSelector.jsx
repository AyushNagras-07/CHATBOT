import React from 'react';
import { motion } from 'framer-motion';

const LanguageSelector = ({ selectedLanguage, onSelectLanguage, isDarkMode }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '70px',
        right: '20px',
        zIndex: 1000,
        width: '200px'
      }}
    >
      <h3 style={{
        margin: '0 0 10px 0',
        fontSize: '16px',
        color: isDarkMode ? '#fff' : '#333',
        fontWeight: '500'
      }}>
        Select Language
      </h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {languages.map(lang => (
          <motion.button
            key={lang.code}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectLanguage(lang.code)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedLanguage === lang.code 
                ? (isDarkMode ? '#444' : '#e6f7ff') 
                : (isDarkMode ? '#333' : '#f5f5f5'),
              color: isDarkMode ? '#fff' : '#333',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: selectedLanguage === lang.code ? '500' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {lang.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageSelector; 