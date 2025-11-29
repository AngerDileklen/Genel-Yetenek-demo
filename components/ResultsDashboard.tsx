import React, { useState } from 'react';
import { UserSession, PuzzleCategory, PuzzleType, Language } from '../types';
import { AdRewardModal } from './AdMobMock';

interface Props {
  session: UserSession;
  onRestart: () => void;
  lang: Language;
}

const ResultsDashboard: React.FC<Props> = ({ session, onRestart, lang }) => {
  const [reviewMode, setReviewMode] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAd, setShowAd] = useState(false);

  // Calculate stats
  const total = session.totalQuestions;
  const correct = session.correctCount;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  // Stats by Category
  const getCategoryStats = (cat: PuzzleCategory) => {
    const items = session.history.filter(h => h.puzzle.category === cat);
    const catTotal = items.length;
    const catCorrect = items.filter(h => h.isCorrect).length;
    return {
      total: catTotal,
      correct: catCorrect,
      acc: catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0
    };
  };

  const numStats = getCategoryStats('NUMERICAL');
  const visStats = getCategoryStats('VISUAL');
  const logStats = getCategoryStats('LOGIC');

  // Identify Weaknesses
  const recommendations: string[] = [];
  if (numStats.total > 0 && numStats.acc < 60) recommendations.push("Sayısal Mantık: Temel aritmetik pratikleri yapın.");
  if (visStats.total > 0 && visStats.acc < 60) recommendations.push("Görsel Zeka: Şekil döndürme sorularına çalışın.");
  if (logStats.total > 0 && logStats.acc < 60) recommendations.push("Sözel Mantık: Denklem kurma becerisini geliştirin.");
  if (recommendations.length === 0 && total > 0) recommendations.push("Tebrikler! Zorluk seviyesini artırmayı deneyin.");

  const wrongAnswers = session.history.filter(h => !h.isCorrect);

  const handleUnlock = () => {
    setShowAd(true);
  };

  const onAdComplete = () => {
    setIsUnlocked(true);
    setShowAd(false);
    setReviewMode(true);
  };

  if (showAd) {
    return <AdRewardModal onReward={onAdComplete} onClose={() => setShowAd(false)} />;
  }

  if (reviewMode) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full mx-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Detaylı Çözümler</h2>
          <button onClick={() => setReviewMode(false)} className="text-brand-600 hover:underline">
            ← Özet Raporuna Dön
          </button>
        </div>
        
        <div className="space-y-6 pb-20">
           {wrongAnswers.length === 0 ? (
             <div className="text-center py-10 text-slate-500">Hiç yanlışınız yok! Mükemmel.</div>
           ) : (
             wrongAnswers.map((item, idx) => (
               <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-200 text-slate-700">
                      {item.puzzle.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-red-500 font-bold">Yanlış Cevap</span>
                 </div>
                 <p className="font-medium text-slate-800 mb-2">
                   {(item.puzzle.data as any).text || item.puzzle.question}
                 </p>
                 <div className="text-sm bg-white p-3 rounded border border-slate-100 mb-2 text-slate-600 whitespace-pre-line">
                   <span className="font-semibold text-brand-600 block mb-1">Çözüm Yolu:</span> 
                   {item.puzzle.explanation}
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl w-full mx-auto animate-fadeIn mb-10">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">Test Tamamlandı</h1>
      <p className="text-center text-slate-500 mb-8">Performans Analizi</p>

      {/* Main Score Card */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex flex-col items-center">
          <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase">Başarı</span>
          <span className="text-2xl sm:text-4xl font-bold text-brand-700 mt-1">%{accuracy}</span>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center">
          <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase">Doğru</span>
          <span className="text-2xl sm:text-4xl font-bold text-green-700 mt-1">{correct}</span>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center">
          <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase">Yanlış</span>
          <span className="text-2xl sm:text-4xl font-bold text-red-700 mt-1">{total - correct}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Konu Analizi</h3>
        <div className="space-y-4">
          <CategoryBar label="Sayısal" stats={numStats} color="bg-blue-500" />
          <CategoryBar label="Görsel" stats={visStats} color="bg-purple-500" />
          <CategoryBar label="Sözel/Mantık" stats={logStats} color="bg-orange-500" />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          💡 Gelişim Önerileri
        </h3>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
              <span className="text-brand-500 mt-1">●</span> {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={onRestart}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
        >
          Yeni Test Başlat
        </button>
        
        {wrongAnswers.length > 0 && !isUnlocked && (
          <button 
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 animate-pulse"
          >
            <span>📺</span> Çözümleri İzle (Reklamlı)
          </button>
        )}
        
        {isUnlocked && (
           <button 
            onClick={() => setReviewMode(true)}
            className="w-full bg-white border-2 border-brand-200 text-brand-700 py-4 rounded-xl font-bold"
          >
            Çözümleri İncele
          </button>
        )}
      </div>
    </div>
  );
};

const CategoryBar = ({ label, stats, color }: { label: string, stats: {acc: number, total: number}, color: string }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-slate-500">{stats.acc}%</span>
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full transition-all duration-1000 ${color}`} 
        style={{ width: `${stats.acc}%` }}
      ></div>
    </div>
  </div>
);

export default ResultsDashboard;