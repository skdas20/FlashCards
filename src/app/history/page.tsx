'use client';

import { useEffect, useState } from 'react';
import { Match } from '@/lib/types';

export default function HistoryPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches');
      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Match History</h1>
      
      {matches.length === 0 ? (
        <p className="text-gray-500">No matches played yet.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Room: {match.roomId}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Winner</p>
                  <p className="font-bold text-green-600">{match.winner}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-2">Players:</p>
                <div className="flex flex-wrap gap-2">
                  {match.players.map((player) => (
                    <span
                      key={player.userId}
                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                    >
                      {player.username}: {player.score} pts
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
