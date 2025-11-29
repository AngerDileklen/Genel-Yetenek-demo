import React from 'react';
import { SymbolEquationData, Language } from '../types';

interface Props {
  data: SymbolEquationData;
  lang: Language;
}

const ShapeIcon = ({ type }: { type: string }) => {
  const sizeClass = "w-10 h-10 inline-block align-middle";
  
  switch(type) {
    case 'circle': 
      return (
        <svg viewBox="0 0 24 24" className={`${sizeClass} text-blue-500 fill-blue-500`}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
    case 'square': 
      return (
        <svg viewBox="0 0 24 24" className={`${sizeClass} text-red-500 fill-red-500`}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
    case 'triangle': 
      return (
        <svg viewBox="0 0 24 24" className={`${sizeClass} text-green-500 fill-green-500`}>
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      );
    case 'star':
      return (
         <svg viewBox="0 0 24 24" className={`${sizeClass} text-yellow-500 fill-yellow-500`}>
           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
         </svg>
      );
    default: return <span>{type}</span>;
  }
};

const EquationLine = ({ items, result }: { items: (string|number)[], result: string | number }) => {
  return (
    <div className="flex items-center justify-center space-x-3 text-2xl font-mono font-bold text-slate-700 bg-white p-4 rounded-lg shadow-sm border border-slate-200 w-full max-w-md">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {typeof item === 'string' && ['circle', 'square', 'triangle', 'star'].includes(item) ? (
            <ShapeIcon type={item} />
          ) : (
            <span>{item}</span>
          )}
        </React.Fragment>
      ))}
      <span className="text-slate-400">=</span>
      <span className="text-brand-600">{result}</span>
    </div>
  );
};

const SymbolEquationPuzzle: React.FC<Props> = ({ data, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 w-full space-y-4">
      <div className="mb-2 text-sm text-slate-500 uppercase tracking-widest font-semibold">
        {lang === 'en' ? 'Symbol Equations' : 'Sembollü İşlemler'}
      </div>
      
      {data.equations.map((eq, idx) => (
        <EquationLine key={idx} items={eq.items} result={eq.result} />
      ))}
      
      <div className="w-full max-w-md border-t-2 border-slate-300 my-4"></div>
      
      <div className="bg-brand-50 border-2 border-brand-200 p-4 rounded-lg w-full max-w-md">
         <EquationLine items={data.question.items} result={data.question.result} />
      </div>
    </div>
  );
};

export default SymbolEquationPuzzle;