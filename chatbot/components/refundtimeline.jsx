import React from 'react';
import { motion } from 'framer-motion';

const RefundTimeline = ({ status, isDarkMode }) => {
  const stages = [
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === status);
  };

  return (
    <div className="refund-timeline" style={{
      padding: '20px',
      background: isDarkMode ? '#1a1a1a' : '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '10px 0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: '20px'
      }}>
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: getCurrentStageIndex() >= index ? 1 : 0.8,
                opacity: getCurrentStageIndex() >= index ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: getCurrentStageIndex() >= index 
                  ? (stage.id === status ? '#4CAF50' : '#2196F3')
                  : (isDarkMode ? '#333' : '#e0e0e0'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {index + 1}
              </div>
              <span style={{
                color: isDarkMode ? '#fff' : '#333',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {stage.label}
              </span>
            </motion.div>
            {index < stages.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: getCurrentStageIndex() > index ? 1 : 0,
                  opacity: getCurrentStageIndex() > index ? 1 : 0.3
                }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: `${(index + 1) * 25}%`,
                  width: '50%',
                  height: '2px',
                  background: isDarkMode ? '#333' : '#e0e0e0',
                  zIndex: 0
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RefundTimeline;
