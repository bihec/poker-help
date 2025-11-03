import React, { useState, useCallback, useEffect } from 'react';
import { Card as CardType, HandRank, RecommendationResult } from './types';
import { translations, Language } from './constants';
import { calculateWinProbability, getRecommendation, evaluateHand } from './services/pokerService';
import CardSelector from './components/CardSelector';
import CardDisplay from './components/CardDisplay';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.title = t.title;
  }, [language, t.title]);

  const [playerCards, setPlayerCards] = useState<(CardType | null)[]>([null, null]);
  const [tableCards, setTableCards] = useState<(CardType | null)[]>([null, null, null, null, null]);
  const [potSize, setPotSize] = useState<string>('');
  const [amountToCall, setAmountToCall] = useState<string>('');
  const [stackSize, setStackSize] = useState<string>('');
  
  const [result, setResult] = useState<{ recommendation: RecommendationResult; winProbability: number; bestHandName: string; } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const allSelectedCards = [...playerCards, ...tableCards].filter(Boolean) as CardType[];

  const handleCardSelect = useCallback((card: CardType) => {
    if (allSelectedCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
      setPlayerCards(prev => prev.map(c => c && c.rank === card.rank && c.suit === card.suit ? null : c));
      setTableCards(prev => prev.map(c => c && c.rank === card.rank && c.suit === card.suit ? null : c));
      return;
    }

    const newPlayerCards = [...playerCards];
    const playerCardIndex = newPlayerCards.indexOf(null);
    if (playerCardIndex !== -1) {
      newPlayerCards[playerCardIndex] = card;
      setPlayerCards(newPlayerCards);
      return;
    }

    const newTableCards = [...tableCards];
    const tableCardIndex = newTableCards.indexOf(null);
    if (tableCardIndex !== -1) {
      newTableCards[tableCardIndex] = card;
      setTableCards(newTableCards);
    }
  }, [playerCards, tableCards, allSelectedCards]);

  const handleReset = () => {
    setPlayerCards([null, null]);
    setTableCards([null, null, null, null, null]);
    setPotSize('');
    setAmountToCall('');
    setStackSize('');
    setResult(null);
    setError('');
    setIsLoading(false);
  };
  
  const handleAnalyze = async () => {
    const finalPlayerCards = playerCards.filter(Boolean) as CardType[];
    if (finalPlayerCards.length !== 2) {
      setError(t.selectTwoCardsError);
      return;
    }
    
    setError('');
    setIsLoading(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const finalTableCards = tableCards.filter(Boolean) as CardType[];
      const winProbability = await calculateWinProbability(finalPlayerCards, finalTableCards);
      
      const currentPotSize = parseFloat(potSize) || 0;
      const currentAmountToCall = parseFloat(amountToCall) || 0;
      const currentStackSize = parseFloat(stackSize) || 0;

      const recommendationResult = getRecommendation(winProbability, currentPotSize, currentAmountToCall, currentStackSize);
      
      const currentFullHand = [...finalPlayerCards, ...finalTableCards];
      const bestHand = currentFullHand.length >= 5 ? evaluateHand(currentFullHand) : null;
      
      const bestHandName = bestHand 
        ? t.handNames[bestHand.rank]
        : t.handNames[HandRank.HIGH_CARD];
      
      setResult({
        winProbability,
        recommendation: recommendationResult,
        bestHandName,
      });
    } catch (e) {
      setError(t.analysisError);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'en' ? 'fa' : 'en');
    handleReset(); 
  };

  const isAnalyzeDisabled = playerCards.filter(Boolean).length !== 2 || isLoading;

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 p-4 md:p-8 flex flex-col items-center" style={{ background: 'radial-gradient(circle, #2d3748, #1a202c)' }}>
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 relative">
          <button onClick={handleLanguageToggle} className={`absolute top-0 ${language === 'fa' ? 'left-0' : 'right-0'} z-10 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors`}>
            {t.languageSwitch}
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 drop-shadow-lg pt-12 md:pt-0">{t.title}</h1>
          <p className="text-gray-300 mt-2 text-lg">{t.subtitle}</p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">{t.yourCards}</h2>
            <div className="flex justify-center gap-4">
              {playerCards.map((card, index) => (
                <CardDisplay key={index} card={card} placeholder={`${t.playerCard} ${index + 1}`} onClick={() => card && handleCardSelect(card)} />
              ))}
            </div>
          </div>

          <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">{t.tableCards}</h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {tableCards.map((card, index) => (
                <CardDisplay key={index} card={card} placeholder={`${t.playerCard} ${index + 1}`} onClick={() => card && handleCardSelect(card)} />
              ))}
            </div>
          </div>
          
          <CardSelector selectedCards={allSelectedCards} onCardSelect={handleCardSelect} title={t.selectCards} />

          <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-2">{t.bettingInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pot-size" className="block text-sm font-medium text-gray-300 mb-1">{t.potSize}</label>
                <input
                  type="number"
                  id="pot-size"
                  value={potSize}
                  onChange={(e) => setPotSize(e.target.value)}
                  placeholder={t.potSizePlaceholder}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="amount-to-call" className="block text-sm font-medium text-gray-300 mb-1">{t.amountToCall}</label>
                <input
                  type="number"
                  id="amount-to-call"
                  value={amountToCall}
                  onChange={(e) => setAmountToCall(e.target.value)}
                  placeholder={t.amountToCallPlaceholder}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="stack-size" className="block text-sm font-medium text-gray-300 mb-1">{t.stackSize}</label>
                <input
                  type="number"
                  id="stack-size"
                  value={stackSize}
                  onChange={(e) => setStackSize(e.target.value)}
                  placeholder={t.stackSizePlaceholder}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className="px-8 py-4 text-xl font-bold text-gray-900 bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? t.analyzing : t.analyze}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 font-bold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-500 transition-all duration-300"
            >
              {t.reset}
            </button>
          </div>
          
          {error && <p className="text-center text-red-400 mt-4 text-lg">{error}</p>}

          {isLoading && (
            <div className="flex justify-center items-center flex-col text-center p-6 bg-gray-700/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-600 mt-8">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
                <p className="mt-4 text-xl text-gray-200">{t.simulatingMessage}</p>
                <p className="text-sm text-gray-400">{t.simulationWait}</p>
            </div>
          )}

          {result && !isLoading && <ResultDisplay result={result} t={t} />}
        </main>
        
        <footer className="text-center mt-12 text-gray-400">
          <p>{t.creator}</p>
          <p>{t.contact}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
