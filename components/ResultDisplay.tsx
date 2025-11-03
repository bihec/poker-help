import React from 'react';
import { RecommendationResult } from '../types';

interface ResultDisplayProps {
  result: {
    recommendation: RecommendationResult;
    winProbability: number;
    bestHandName: string;
  };
  t: any; // Translation object
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, t }) => {
  const { recommendation, winProbability, bestHandName } = result;
  
  const getRecommendationColor = () => {
    switch (recommendation.key) {
      case 'Raise':
      case 'Bet':
      case 'AllIn':
        return 'text-green-400 border-green-400';
      case 'Call':
        return 'text-yellow-400 border-yellow-400';
      case 'Check':
        return 'text-blue-400 border-blue-400';
      case 'Fold':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };
  
  const getProgressColor = () => {
    if (winProbability > 70) return 'bg-green-500';
    if (winProbability >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const showAmountBox = (recommendation.key === 'Bet' || recommendation.key === 'Raise');
  const showAllInBox = recommendation.key === 'AllIn';
  const shouldShowSeparateBox = showAmountBox || showAllInBox;
  
  let amountToDisplay: string | number = '';
  if (showAllInBox) {
    amountToDisplay = t.recommendationAllIn;
  } else if (showAmountBox) {
    const { amountMin, amountMax } = recommendation;
    if (amountMin && amountMax) {
      if (amountMin === amountMax) {
        amountToDisplay = amountMin;
      } else {
        amountToDisplay = `${amountMin} - ${amountMax}`;
      }
    }
  }

  return (
    <div className="mt-8 bg-gray-700/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-6">{t.analysisResult}</h2>
      
      <div className="text-center mb-2">
        <p className="text-lg text-gray-300">{t.ourSuggestion}</p>
        <p className={`text-4xl md:text-5xl font-extrabold my-2 p-4 rounded-lg border-2 ${getRecommendationColor()}`}>
          {t[`recommendation${recommendation.key}`]}
        </p>
      </div>
      
      {shouldShowSeparateBox && amountToDisplay && (
        <div className="text-center mb-6">
           <p className="text-sm text-gray-300">{t.suggestedAmount}</p>
           <div className="mt-1 p-3 rounded-lg border-2 text-orange-400 border-orange-400 bg-orange-900/30">
               <p className="text-3xl font-bold">
                   {amountToDisplay}
               </p>
           </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-gray-200">
            <span className="font-bold">{t.winProbability}</span>
            <span className={`font-bold text-xl ${getProgressColor().replace('bg-', 'text-')}`}>{winProbability.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`}
              style={{ width: `${winProbability}%` }}
            ></div>
          </div>
        </div>
        
        <div>
           <div className="flex justify-between items-center text-gray-200">
            <span className="font-bold">{t.bestHand}</span>
            <span className="font-bold text-xl text-blue-300">{bestHandName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ResultDisplay;