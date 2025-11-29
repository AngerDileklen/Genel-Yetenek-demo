import React from 'react';
import { TriangleData, Language } from '../types';

interface Props {
  data: TriangleData;
  lang: Language;
}

const TrianglePuzzle: React.FC<Props> = ({ data, lang }) => {
  // SVG Configuration
  const width = 300;
  const height = 300;
  
  // Triangle Vertices (Equilateralish)
  const pTop = { x: 150, y: 40 };
  const pLeft = { x: 40, y: 250 };
  const pRight = { x: 260, y: 250 };
  const pCenter = { x: 150, y: 160 };

  const CircleNode = ({ x, y, value, label }: { x: number, y: number, value: string | number, label?: string }) => (
    <g className="transition-all duration-500 hover:scale-110">
      <circle 
        cx={x} 
        cy={y} 
        r="32" 
        fill="white" 
        stroke="#3b82f6" 
        strokeWidth="3"
        className="shadow-lg" 
      />
      <text 
        x={x} 
        y={y} 
        dy="0.35em" 
        textAnchor="middle" 
        className="font-mono text-2xl font-bold fill-slate-800 pointer-events-none"
      >
        {value}
      </text>
      {label && (
        <text x={x} y={y - 45} textAnchor="middle" className="text-xs fill-slate-400 font-sans uppercase tracking-wider">
          {label}
        </text>
      )}
    </g>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
        {lang === 'en' ? 'Visual Logic' : 'Görsel Mantık'}
      </div>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-xl">
        {/* Connection Lines */}
        <path 
          d={`M${pTop.x} ${pTop.y} L${pLeft.x} ${pLeft.y} L${pRight.x} ${pRight.y} Z`} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth="4" 
          strokeLinejoin="round"
        />
        
        {/* Center Lines (Subtle hint of connection) */}
        <path 
          d={`M${pTop.x} ${pTop.y + 32} L${pCenter.x} ${pCenter.y - 32}`} 
          stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
        />
         <path 
          d={`M${pLeft.x + 25} ${pLeft.y - 15} L${pCenter.x - 20} ${pCenter.y + 10}`} 
          stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
        />
        <path 
          d={`M${pRight.x - 25} ${pRight.y - 15} L${pCenter.x + 20} ${pCenter.y + 10}`} 
          stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
        />

        {/* Nodes */}
        <CircleNode x={pTop.x} y={pTop.y} value={data.top} />
        <CircleNode x={pLeft.x} y={pLeft.y} value={data.left} />
        <CircleNode x={pRight.x} y={pRight.y} value={data.right} />
        
        {/* Center Result Node */}
        <g>
          <circle 
            cx={pCenter.x} 
            cy={pCenter.y} 
            r="40" 
            fill="#eff6ff" 
            stroke="#2563eb" 
            strokeWidth="4"
          />
          <text 
            x={pCenter.x} 
            y={pCenter.y} 
            dy="0.35em" 
            textAnchor="middle" 
            className="font-mono text-3xl font-bold fill-brand-700"
          >
            {data.center}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default TrianglePuzzle;