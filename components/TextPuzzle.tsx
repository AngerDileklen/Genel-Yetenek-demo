import React from 'react';
import { TextPuzzleData, Language } from '../types';

interface Props {
  data: TextPuzzleData;
  lang: Language;
}

const TextPuzzle: React.FC<Props> = ({ data, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 w-full min-h-[200px]">
      <div className="mb-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
        {lang === 'en' ? 'Verbal Logic' : 'Sözel Mantık'}
      </div>
      
      <p className="text-lg text-slate-800 font-medium leading-relaxed text-center">
        {data.text}
      </p>

      {data.subText && (
        <div className="mt-6 pt-4 border-t border-slate-100 w-full text-center">
           <p className="text-slate-600 italic">
             {data.subText}
           </p>
        </div>
      )}
    </div>
  );
};

export default TextPuzzle;