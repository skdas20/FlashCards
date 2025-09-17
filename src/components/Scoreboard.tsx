'use client';

import { Player } from '@/lib/types';

interface ScoreboardProps {
  players: Player[];
}

export default function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Scoreboard</h3>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.userId}
            className={`flex justify-between items-center p-2 rounded ${
              index === 0 ? 'bg-yellow-100' : 'bg-gray-50'
            }`}
          >
            <span className="font-medium">
              {index === 0 && '👑 '}
              {player.username}
            </span>
            <span className="font-bold">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
