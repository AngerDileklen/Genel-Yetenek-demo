
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const timer = setTimeout(() => {
      setFading(true);
      // Unmount after transition
      setTimeout(onFinish, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo Component */}
        <div className="mb-8 pulse-logo">
            <Logo className="h-32 w-32 drop-shadow-xl" />
        </div>
        
        {/* Text Logo */}
        <h1 className="text-3xl font-bold text-[#102C87] mb-8 tracking-tight">
          Genel Yetenek
        </h1>
        
        {/* Loading Bar */}
        <div className="h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6900] animate-[loading_2s_ease-in-out]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
