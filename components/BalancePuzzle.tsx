import React from 'react';
import { BalanceData, Language } from '../types';

interface Props {
  data: BalanceData;
  lang: Language;
}

const ShapeIcon = ({ type, count }: { type: string, count: number }) => {
  const getColor = (t: string) => {
    switch(t) {
      case 'square': return 'text-red-500 fill-red-500';
      case 'circle': return 'text-blue-500 fill-blue-500';
      case 'triangle': return 'text-green-500 fill-green-500';
      case 'diamond': return 'text-purple-500 fill-purple-500';
      default: return 'text-slate-500';
    }
  };

  const renderShape = () => {
    const className = `w-6 h-6 sm:w-8 sm:h-8 drop-shadow-sm ${getColor(type)}`;
    switch(type) {
      case 'square': return <rect x="4" y="4" width="24" height="24" rx="2" className={className} />;
      case 'circle': return <circle cx="16" cy="16" r="12" className={className} />;
      case 'triangle': return <polygon points="16,4 4,28 28,28" className={className} />;
      default: return <circle cx="16" cy="16" r="12" className={className} />;
    }
  };

  // Stack multiple shapes of the same type
  return (
    <div className="flex -space-x-1 items-end hover:scale-110 transition-transform">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 32 32" className="w-8 h-8 sm:w-10 sm:h-10">
          {renderShape()}
        </svg>
      ))}
    </div>
  );
};

const Pan = ({ items, isRight, isQuestion }: { items?: any[], isRight?: boolean, isQuestion?: boolean }) => {
  // Logic: The pan hangs from the beam.
  // Structure:
  // | (String)
  // --- (Plate)
  // Items sit absolute bottom-full of the Plate to ensure they are ON TOP.
  
  return (
    <div className="absolute top-0 flex flex-col items-center" style={{ [isRight ? 'right' : 'left']: 0 }}>
      {/* String */}
      <div className="h-10 sm:h-12 w-0.5 bg-slate-400"></div>
      
      {/* Plate Container */}
      <div className="relative">
        {/* The Plate Visual */}
        <div className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-sm"></div>
        <div className="w-16 h-4 border-b-2 border-l-2 border-r-2 border-slate-300/50 rounded-b-full mx-auto opacity-50"></div>

        {/* Items Container - Sitting ON TOP (bottom: 100% of plate) */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[1px] flex items-end justify-center gap-1 min-w-max px-2 pb-0.5">
           {items ? (
             items.map((item, i) => <ShapeIcon key={i} type={item.shape} count={item.count} />)
           ) : (
             isQuestion && <span className="text-3xl font-bold text-brand-600 animate-bounce">?</span>
           )}
        </div>
      </div>
    </div>
  );
};

const Scale = ({ left, right, isQuestion }: { left: any[], right?: any[], isQuestion?: boolean }) => {
  // If isQuestion is true, usually the right side is missing (answer), so left is heavier.
  // We tilt it. Left goes down (rotate negative).
  const rotationClass = isQuestion ? '-rotate-3' : 'rotate-0';

  return (
    <div className="relative w-full max-w-[340px] h-36 sm:h-40 mx-auto mb-2">
      
      {/* 1. The Fulcrum (Base) - Centered absolutely */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-0">
         {/* Triangle Tip */}
         <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-slate-700"></div>
         {/* Base Plate */}
         <div className="w-24 h-1.5 bg-slate-300 rounded-full mt-[-1px]"></div>
      </div>

      {/* 2. The Beam Assembly - Rotates around center */}
      <div className={`absolute top-8 left-0 right-0 h-2 transition-transform duration-700 ease-out origin-center ${rotationClass} z-10`}>
         {/* The Beam Line */}
         <div className="w-full h-1.5 bg-slate-800 rounded-full shadow-sm"></div>
         
         {/* Center Pivot Circle */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-100 border-4 border-slate-800 rounded-full z-20"></div>

         {/* Left Pan */}
         <Pan items={left} />

         {/* Right Pan */}
         <Pan items={right} isRight isQuestion={isQuestion} />
      </div>

    </div>
  );
};

const BalancePuzzle: React.FC<Props> = ({ data, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-white rounded-xl shadow-sm border border-slate-200 w-full">
      <div className="mb-4 text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold border-b border-slate-100 w-full text-center pb-2">
        {lang === 'en' ? 'Balance Scale' : 'Terazi Dengesi'}
      </div>
      
      <div className="w-full space-y-2">
        {data.scales.map((scale, idx) => (
          <div key={idx} className="relative pt-2">
             <div className="absolute top-0 left-0 text-[10px] font-bold text-slate-400 bg-slate-100 px-1 rounded">#{idx + 1}</div>
             <Scale left={scale.left} right={scale.right} />
          </div>
        ))}
        
        <div className="bg-brand-50/50 rounded-xl pt-4 pb-0 border border-brand-100 relative mt-4">
            <div className="absolute top-0 left-0 bg-brand-100 text-[10px] font-bold text-brand-600 px-2 py-0.5 rounded-tl-xl rounded-br-lg">{lang === 'en' ? 'QUESTION' : 'SORU'}</div>
            <Scale left={data.question.left} right={undefined} isQuestion={true} />
        </div>
      </div>
    </div>
  );
};

export default BalancePuzzle;