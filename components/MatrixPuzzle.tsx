import React from 'react';
import { MatrixData, Language } from '../types';

interface Props {
  data: MatrixData;
  lang: Language;
}

const ArrowIcon = ({ rotation, isQuestion }: { rotation: number, isQuestion: boolean }) => {
  if (isQuestion) {
    return <span className="text-4xl font-bold text-brand-600">?</span>;
  }
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-slate-700 transition-transform duration-500"
      style={{ transform: `rotate(${rotation * 90}deg)` }}
    >
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  );
};

const MatrixPuzzle: React.FC<Props> = ({ data, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
       <div className="mb-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
        {lang === 'en' ? 'Matrix Logic' : 'Matris Mantığı'}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-2 rounded-lg">
        {data.grid.map((row, rIdx) => (
          row.map((cellVal, cIdx) => (
            <div 
              key={`${rIdx}-${cIdx}`}
              className={`
                w-20 h-20 flex items-center justify-center rounded-md border-2
                ${cellVal === -1 ? 'bg-brand-50 border-brand-300' : 'bg-white border-slate-200'}
              `}
            >
              <ArrowIcon rotation={cellVal} isQuestion={cellVal === -1} />
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default MatrixPuzzle;