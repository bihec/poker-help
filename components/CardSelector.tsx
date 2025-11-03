import React from 'react';
import { Card } from '../types';
import { SUITS, RANKS } from '../constants';

interface CardSelectorProps {
  selectedCards: Card[];
  onCardSelect: (card: Card) => void;
  title: string;
}

const CardSelector: React.FC<CardSelectorProps> = ({ selectedCards, onCardSelect, title }) => {
  const isSelected = (card: Card) => {
    return selectedCards.some(c => c.rank === card.rank && c.suit === card.suit);
  };

  return (
    <div className="bg-green-800/60 p-4 rounded-xl shadow-inner border border-green-700">
      <h3 className="text-xl font-bold mb-4 text-center text-white">{title}</h3>
      <div className="grid grid-cols-13 gap-1 md:gap-2">
        {RANKS.map(rank => (
          <div key={rank} className="space-y-1 md:space-y-2">
            {SUITS.map(suit => {
              const card = { suit, rank };
              const selected = isSelected(card);
              const isRed = suit === '♥' || suit === '♦';
              
              return (
                <button
                  key={`${suit}-${rank}`}
                  onClick={() => onCardSelect(card)}
                  disabled={selected}
                  className={`w-full h-8 md:h-10 rounded text-sm md:text-base font-bold flex items-center justify-center transition-all duration-200
                    ${isRed ? 'text-red-500' : 'text-black'}
                    ${selected ? 'bg-yellow-400 ring-2 ring-yellow-200 text-gray-800' : 'bg-gray-200 hover:bg-white hover:scale-105'}
                  `}
                >
                  {rank}{suit}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Add a simple grid-cols-13 utility to tailwind config if not present, but for CDN we do it via style
const style = document.createElement('style');
style.innerHTML = `
  .grid-cols-13 {
    grid-template-columns: repeat(13, minmax(0, 1fr));
  }
`;
document.head.appendChild(style);


export default CardSelector;