
import React from 'react';
import { Card } from '../types';

interface CardDisplayProps {
  card: Card | null;
  placeholder?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, placeholder, onClick, isSelected }) => {
  const isRed = card && (card.suit === '♥' || card.suit === '♦');
  const colorClass = isRed ? 'text-red-500' : 'text-gray-800';
  
  const baseClasses = "w-20 h-28 md:w-24 md:h-36 rounded-lg flex flex-col justify-between p-2 shadow-md transition-all duration-200";
  const selectedClasses = isSelected ? "ring-4 ring-yellow-400 scale-105" : "ring-2 ring-gray-400";
  const clickableClasses = onClick ? "cursor-pointer transform hover:scale-105 hover:shadow-xl" : "";

  if (!card) {
    return (
      <div className={`${baseClasses} bg-gray-500/20 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-300 text-center`}>
        {placeholder}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses} ${clickableClasses} bg-white ${colorClass} font-bold select-none`}
    >
      <div className="text-2xl md:text-3xl">{card.rank}</div>
      <div className="text-3xl md:text-4xl self-center">{card.suit}</div>
      <div className="text-2xl md:text-3xl self-end transform rotate-180">{card.rank}</div>
    </div>
  );
};

export default CardDisplay;
