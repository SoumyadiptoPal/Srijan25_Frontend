
// GlobalConfetti.jsx
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const GlobalConfetti = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: document.documentElement.scrollHeight
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: document.documentElement.scrollHeight
      });
    };

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', updateDimensions);
    };
  }, []);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        pointerEvents: 'none', 
        zIndex: 9999 
      }}
    >
      <Confetti recycle={false} numberOfPieces={577}/>
    </div>
  );
};

export default GlobalConfetti;
