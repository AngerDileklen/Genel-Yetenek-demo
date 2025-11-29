
import React, { useState, useEffect } from 'react';
import { Puzzle, PuzzleType, UserSession, GameState, TestConfig, Difficulty, Language } from './types';
import { QuestionGenerator } from './services/puzzleGenerator';
import TrianglePuzzle from './components/TrianglePuzzle';
import MatrixPuzzle from './components/MatrixPuzzle';
import BalancePuzzle from './components/BalancePuzzle';
import CubePuzzle, { IsometricCube } from './components/CubePuzzle'; 
import SymbolEquationPuzzle from './components/SymbolEquationPuzzle';
import TextPuzzle from './components/TextPuzzle';
import ResultsDashboard from './components/ResultsDashboard';
import Loading from './components/Loading';
import { AdBanner } from './components/AdMobMock';
import SplashScreen from './components/SplashScreen';
import Logo from './components/Logo';
import { UI_TEXT } from './constants/translations';

// Icons
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8"/><path d="M22 12.5a10 10 0 0 1-18.8 4.3L2.5 16"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const TimerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [config, setConfig] = useState<TestConfig>({ questionCount: 10, durationMinutes: 20, difficulty: 'Medium' });
  const [session, setSession] = useState<UserSession>({ score: 0, totalQuestions: 0, correctCount: 0, history: [] });
  const [lang, setLang] = useState<Language>('tr');
  
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const t = UI_TEXT[lang];

  // Timer Effect
  useEffect(() => {
    if (gameState === GameState.PLAYING && timeLeft > 0 && config.durationMinutes !== 'UNTIMED') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState(GameState.RESULTS);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, config.durationMinutes]);

  const startExam = () => {
    setSession({ score: 0, totalQuestions: 0, correctCount: 0, history: [] });
    setQuestionIndex(0);
    if (config.durationMinutes !== 'UNTIMED') {
      setTimeLeft(config.durationMinutes * 60);
    }
    setGameState(GameState.PLAYING);
    loadNewPuzzle();
  };

  const loadNewPuzzle = () => {
    setLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);
    
    setTimeout(() => {
      const puzzle = QuestionGenerator.generateQuestion({ difficulty: config.difficulty, lang: lang });
      setCurrentPuzzle(puzzle);
      setLoading(false);
    }, 400);
  };

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered || !currentPuzzle) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentPuzzle.correctOptionId;
    
    setSession(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      score: isCorrect ? prev.score + 10 : prev.score,
      history: [...prev.history, { 
        puzzle: currentPuzzle, 
        selectedOptionId: optionId, 
        isCorrect, 
        timeSpent: 0 
      }]
    }));
  };

  const handleNext = () => {
    if (questionIndex + 1 >= config.questionCount) {
      setGameState(GameState.RESULTS);
    } else {
      setQuestionIndex(prev => prev + 1);
      loadNewPuzzle();
    }
  };

  const renderPuzzleContent = () => {
    if (!currentPuzzle) return null;
    switch (currentPuzzle.type) {
      case PuzzleType.TRIANGLE_MATH: return <TrianglePuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.MATRIX_LOGIC: return <MatrixPuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.BALANCE_SCALE: return <BalancePuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.CUBE_FOLDING: return <CubePuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.SYMBOL_EQUATION: return <SymbolEquationPuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.WORD_PROBLEM: return <TextPuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.ANALYTIC_GEO: return <TextPuzzle data={currentPuzzle.data as any} lang={lang} />;
      case PuzzleType.ODD_ONE_OUT:
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-xl border border-slate-200">
             <div className="mb-4 text-sm text-slate-500 uppercase tracking-widest font-semibold">
              {t.p_odd}
            </div>
            <div className="text-4xl">🧐</div>
            <p className="text-slate-600 mt-2">{t.findOdd}</p>
          </div>
        );
      default: return <div>Unknown Puzzle Type</div>;
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans pt-safe pb-safe pl-safe pr-safe">
      
      {/* ---------------- VIEW: LOBBY ---------------- */}
      {gameState === GameState.LOBBY && (
        <div className="flex flex-col h-full">
           <div className="absolute top-4 right-4 z-20">
             <button 
               onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
               className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#102C87] shadow-sm hover:bg-gray-50"
             >
               <span>{lang === 'tr' ? '🇹🇷 Türkçe' : '🇺🇸 English'}</span>
             </button>
           </div>
          <main className="flex-1 overflow-y-auto px-4 py-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-t-4 border-brand-blue p-6 sm:p-8 relative">
              
              <div className="text-center mb-8">
                {/* Lobby Logo */}
                <div className="flex justify-center mb-4">
                  <Logo className="h-28 w-28" />
                </div>
                <h1 className="text-2xl font-bold text-brand-blue">{t.setup}</h1>
                <p className="text-slate-500 mt-1">{t.setupDesc}</p>
              </div>

              <div className="space-y-6">
                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.qCount}: <span className="text-brand-orange font-bold">{config.questionCount}</span>
                  </label>
                  <input 
                    type="range" min="5" max="50" step="5"
                    value={config.questionCount}
                    onChange={(e) => setConfig({...config, questionCount: Number(e.target.value)})}
                    className="w-full h-10 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange touch-manipulation"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.duration}: <span className="text-brand-orange font-bold">{config.durationMinutes === 'UNTIMED' ? t.untimed : config.durationMinutes}</span>
                  </label>
                  <input 
                    type="range" min="0" max="120" step="5"
                    value={config.durationMinutes === 'UNTIMED' ? 0 : config.durationMinutes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setConfig({...config, durationMinutes: val === 0 ? 'UNTIMED' : val});
                    }}
                    className="w-full h-10 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-orange touch-manipulation"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.difficulty}</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg min-h-[44px]">
                    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setConfig({...config, difficulty: level})}
                        className={`flex-1 py-3 text-sm font-medium rounded-md transition-all touch-manipulation ${
                          config.difficulty === level 
                          ? 'bg-white text-brand-blue shadow-sm ring-1 ring-slate-200' 
                          : 'text-slate-500 hover:text-brand-blue'
                        }`}
                      >
                        {level === 'Easy' ? t.easy : level === 'Medium' ? t.medium : t.hard}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={startExam}
                  className="bg-[#FF6900] text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105 w-full min-h-[56px] touch-manipulation"
                >
                  {t.start}
                </button>
              </div>
            </div>
          </main>
          
          <AdBanner />
        </div>
      )}


      {/* ---------------- VIEW: RESULTS ---------------- */}
      {gameState === GameState.RESULTS && (
         <main className="flex-1 overflow-y-auto px-4 py-8">
            <ResultsDashboard session={session} onRestart={() => setGameState(GameState.LOBBY)} lang={lang} />
         </main>
      )}


      {/* ---------------- VIEW: PLAYING ---------------- */}
      {gameState === GameState.PLAYING && (
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <header className="flex-none bg-white border-b-2 border-brand-blue shadow-sm z-10">
            <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
              
              {/* BRANDING HEADER */}
              <div className="flex items-center gap-3">
                <Logo className="h-10 w-10" />
                <span className="text-xl font-bold text-[#102C87] hidden sm:block">Genel Yetenek</span>
              </div>

              <div className="flex items-center gap-3">
                 {config.durationMinutes !== 'UNTIMED' && (
                   <div className={`flex items-center space-x-1 font-mono font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-full ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-brand-blue'}`}>
                     <TimerIcon />
                     <span>{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</span>
                   </div>
                 )}
                 <div className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-brand-blue rounded border border-blue-100 uppercase tracking-wider hidden xs:block">
                    {config.difficulty === 'Easy' ? t.easy : config.difficulty === 'Medium' ? t.medium : t.hard}
                 </div>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 h-1">
              <div 
                className="bg-brand-orange h-full transition-all duration-500 ease-out" 
                style={{ width: `${((questionIndex) / config.questionCount) * 100}%` }}
              ></div>
            </div>
          </header>

          {/* Scrollable Content (Middle) */}
          <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
             <div className="max-w-md mx-auto w-full pb-24">
                {(!currentPuzzle || loading) ? (
                   <div className="h-64 flex items-center justify-center"><Loading /></div>
                ) : (
                  <div className="puzzle-enter">
                    {/* Puzzle Question */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border-t-2 border-brand-blue mb-6">
                        <h2 className="text-lg font-bold text-center text-brand-blue leading-snug">
                        {currentPuzzle.question}
                        </h2>
                    </div>

                    {/* Puzzle Content */}
                    <div className="flex justify-center mb-8">
                      {renderPuzzleContent()}
                    </div>

                    {/* Options */}
                    <div className={`grid gap-3 mb-6 ${currentPuzzle.type === PuzzleType.CUBE_FOLDING ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-5'}`}>
                      {currentPuzzle.options.map((opt) => {
                        let btnClass = "min-h-[60px] py-2 px-2 rounded-lg font-medium border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1 touch-manipulation";
                        
                        if (isAnswered) {
                          if (opt.id === currentPuzzle.correctOptionId) {
                            btnClass += " bg-green-50 border-green-500 text-green-700 shadow-md"; 
                          } else if (opt.id === selectedOption) {
                            btnClass += " bg-red-50 border-red-500 text-red-700"; 
                          } else {
                            btnClass += " bg-white border-slate-100 text-slate-300 opacity-50"; 
                          }
                        } else {
                          btnClass += " bg-white border-slate-200 active:bg-blue-50 active:border-brand-blue text-slate-700 shadow-sm hover:border-brand-blue/50";
                        }

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(opt.id)}
                            disabled={isAnswered}
                            className={btnClass}
                          >
                            {currentPuzzle.type === PuzzleType.MATRIX_LOGIC ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${Number(opt.value) * 90}deg)` }}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                            ) : currentPuzzle.type === PuzzleType.BALANCE_SCALE ? (
                              <div className="flex flex-col items-center scale-90">
                                {opt.visualData && (
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                                      {opt.visualData.shape === 'square' && <rect x="4" y="4" width="16" height="16" className="fill-red-500" />}
                                      {opt.visualData.shape === 'circle' && <circle cx="12" cy="12" r="8" className="fill-blue-500" />}
                                      {opt.visualData.shape === 'triangle' && <polygon points="12,2 2,22 22,22" className="fill-green-500" />}
                                    </svg>
                                )}
                                <span className="text-lg font-mono">{opt.value}</span>
                              </div>
                            ) : currentPuzzle.type === PuzzleType.CUBE_FOLDING ? (
                              <div className="py-1"><IsometricCube faces={opt.visualData.faces} size={35} /></div>
                            ) : currentPuzzle.type === PuzzleType.ODD_ONE_OUT ? (
                              <div className="flex flex-wrap justify-center gap-1 w-12 scale-75">
                                {opt.visualData.type === 'dots' && Array.from({ length: opt.visualData.count }).map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-brand-blue"></div>)}
                                {opt.visualData.type === 'grid' && <div className="grid grid-cols-2 gap-1">{opt.visualData.colors.map((c: string, i: number) => <div key={i} className={`w-6 h-6 rounded-sm ${c === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}></div>)}</div>}
                              </div>
                            ) : (
                              <span className="text-xl font-mono">{opt.value}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback in Flow */}
                    {isAnswered && (
                      <div className="animate-fadeIn p-4 rounded-lg flex items-start gap-3 border bg-white shadow-sm mb-4 border-slate-200">
                        <div className={`mt-1 flex-shrink-0 ${selectedOption === currentPuzzle.correctOptionId ? 'text-green-600' : 'text-red-500'}`}>
                          {selectedOption === currentPuzzle.correctOptionId ? <CheckIcon /> : <XIcon />}
                        </div>
                        <div>
                          <p className={`font-bold mb-1 ${selectedOption === currentPuzzle.correctOptionId ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedOption === currentPuzzle.correctOptionId ? t.correct : t.wrong}
                          </p>
                          <p className="text-sm opacity-95 leading-relaxed whitespace-pre-line text-slate-700">
                            {currentPuzzle.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
             </div>
          </main>

          {/* Fixed Footer */}
          {isAnswered && (
            <footer className="flex-none p-4 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
               <div className="max-w-md mx-auto w-full">
                  <button 
                      onClick={handleNext}
                      className="w-full bg-[#FF6900] text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation"
                    >
                      {questionIndex + 1 >= config.questionCount ? t.finish : t.next} <RefreshIcon />
                    </button>
               </div>
            </footer>
          )}
        </div>
      )}

    </div>
  );
};

export default App;
