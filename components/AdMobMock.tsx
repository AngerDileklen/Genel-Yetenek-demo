import React, { useState, useEffect } from 'react';

// Mock Banner Ad Component
export const AdBanner = () => {
  return (
    <div className="w-full h-[50px] bg-gray-100 border-t border-gray-300 flex items-center justify-center">
      <div className="text-xs text-gray-400 font-mono text-center">
        AD BANNER <br/> 
        (Space reserved for AdMob)
      </div>
    </div>
  );
};

// Mock Rewarded Video Modal
export const AdRewardModal = ({ onReward, onClose }: { onReward: () => void, onClose: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    const complete = setTimeout(() => {
      onReward();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(complete);
    };
  }, [onReward]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
      <div className="text-4xl mb-4">📺</div>
      <h2 className="text-2xl font-bold mb-2">Reklam İzleniyor...</h2>
      <p className="text-gray-400 mb-8">Video oynatılıyor</p>
      
      <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-brand-500 animate-spin flex items-center justify-center font-mono text-xl">
        {timeLeft > 0 ? timeLeft : '✓'}
      </div>
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white"
      >
        Kapat
      </button>
    </div>
  );
};