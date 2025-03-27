import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'completed', label: 'Completed' },
  { id: 'failed', label: 'Failed' }
];

const getCurrentStageIndex = (status) => {
  return stages.findIndex(stage => stage.id === status.toLowerCase());
};

const RefundTimeline = ({ status, isDarkMode }) => {
  const currentStageIndex = getCurrentStageIndex(status);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const circleVariants = {
    inactive: {
      scale: 1,
      backgroundColor: isDarkMode ? "#404040" : "#e0e0e0",
      transition: { duration: 0.3 }
    },
    active: {
      scale: 1.2,
      backgroundColor: "#4CAF50",
      transition: { duration: 0.3 }
    },
    completed: {
      scale: 1.2,
      backgroundColor: "#4CAF50",
      transition: { duration: 0.3 }
    }
  };

  const lineVariants = {
    inactive: {
      scaleX: 0,
      backgroundColor: isDarkMode ? "#404040" : "#e0e0e0",
      transition: { duration: 0.3 }
    },
    active: {
      scaleX: 1,
      backgroundColor: "#4CAF50",
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            variants={circleVariants}
            animate={
              index < currentStageIndex
                ? "completed"
                : index === currentStageIndex
                ? "active"
                : "inactive"
            }
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              position: 'relative',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {index < currentStageIndex ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{ color: 'white', fontSize: '20px' }}
              >
                ✓
              </motion.span>
            ) : (
              <span style={{ color: isDarkMode ? '#fff' : '#333' }}>
                {index + 1}
              </span>
            )}
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#fff' : '#333',
              textAlign: 'center',
              fontWeight: index <= currentStageIndex ? '600' : '400'
            }}
          >
            {stage.label}
          </motion.span>
        </motion.div>
      ))}
      
      {/* Connecting lines */}
      {stages.map((stage, index) => (
        index < stages.length - 1 && (
          <motion.div
            key={`line-${index}`}
            variants={lineVariants}
            animate={index < currentStageIndex ? "active" : "inactive"}
            style={{
              position: 'absolute',
              top: '20px',
              left: `${(index + 1) * 25}%`,
              width: '50%',
              height: '2px',
              transformOrigin: 'left',
              zIndex: 0
            }}
          />
        )
      ))}
    </motion.div>
  );
};

export default RefundTimeline;
