import React from 'react';
import { CubeData, Language } from '../types';

interface Props {
  data: CubeData;
  lang: Language;
}

// 2D Net Renderer
const NetView = ({ symbols }: { symbols: string[] }) => {
  // Map standard array [0..5] to grid positions
  // Grid 4x3
  //   2
  // 1 0 3
  //   4
  //   5
  
  const cellClass = "w-12 h-12 border-2 border-slate-800 flex items-center justify-center font-bold text-xl bg-white shadow-sm";
  const emptyClass = "w-12 h-12";

  return (
    <div className="grid grid-cols-3 gap-1 mb-8">
       {/* Row 1 */}
       <div className={emptyClass}></div>
       <div className={cellClass}>{symbols[2]}</div>
       <div className={emptyClass}></div>
       
       {/* Row 2 */}
       <div className={cellClass}>{symbols[1]}</div>
       <div className={cellClass}>{symbols[0]}</div>
       <div className={cellClass}>{symbols[3]}</div>

       {/* Row 3 */}
       <div className={emptyClass}></div>
       <div className={cellClass}>{symbols[4]}</div>
       <div className={emptyClass}></div>

        {/* Row 4 */}
       <div className={emptyClass}></div>
       <div className={cellClass}>{symbols[5]}</div>
       <div className={emptyClass}></div>
    </div>
  );
};

export const IsometricCube = ({ faces, size = 60 }: { faces: string[], size?: number }) => {
  // Faces[0] = Top, Faces[1] = Left(Front), Faces[2] = Right
  // Note: Standard isometric projection often visualizes Top, Left, Right
  
  const h = size; // half width approx
  const w = size * 0.866; // height factor
  
  // Coordinates relative to center
  // Top Face (Rhombus)
  // Left Face (Rhombus)
  // Right Face (Rhombus)
  
  return (
    <div className="relative group cursor-pointer transition-transform hover:scale-110" style={{ width: size * 2, height: size * 2.2 }}>
       <svg viewBox="0 0 100 115" width="100%" height="100%" className="drop-shadow-md">
         {/* Top Face */}
         <path d="M50 0 L93.3 25 L50 50 L6.7 25 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2"/>
         <text x="50" y="28" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e293b">{faces[0]}</text>
         
         {/* Left Face (Front-Left) */}
         <path d="M6.7 25 L50 50 L50 100 L6.7 75 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2"/>
         <text x="28" y="65" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e293b" transform="rotate(-30, 28, 65)">{faces[1]}</text>

         {/* Right Face (Front-Right) */}
         <path d="M50 50 L93.3 25 L93.3 75 L50 100 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2"/>
         <text x="72" y="65" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e293b" transform="rotate(30, 72, 65)">{faces[2]}</text>
       </svg>
    </div>
  );
};

const CubePuzzle: React.FC<Props> = ({ data, lang }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl border border-slate-200">
      <div className="mb-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
        {lang === 'en' ? 'Cube Folding' : 'Küp Açılımı'}
      </div>
      <NetView symbols={data.net} />
      <div className="text-sm text-slate-500 mb-2">{lang === 'en' ? 'Which cube can be formed?' : 'Hangi küp oluşturulabilir?'}</div>
    </div>
  );
};

export default CubePuzzle;