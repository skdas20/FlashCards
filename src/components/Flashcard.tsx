'use client';

import { Flashcard as FlashcardType } from '@/lib/types';
import { useState, useEffect } from 'react';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (answer: string) => void;
  cardIndex?: number; // Add cardIndex to identify unique cards
}

export default function Flashcard({ card, onAnswer, cardIndex }: FlashcardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string>('');

  // Reset state when a genuinely new card arrives
  useEffect(() => {
    const cardId = `${cardIndex}-${card.question}`;
    if (cardId !== currentCardId) {
      setSelectedOption(null);
      setAnswered(false);
      setCurrentCardId(cardId);
    }
  }, [card.question, cardIndex, currentCardId]);

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);
    onAnswer(option);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{card.question}</h3>
      <div className="grid grid-cols-2 gap-3">
        {card.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={`p-3 rounded border-2 transition-colors ${
              selectedOption === option
                ? option === card.answer
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-red-500 text-white border-red-500'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
