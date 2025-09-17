'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GameRoom as GameRoomType, Player } from '@/lib/types';
import Flashcard from './Flashcard';
import Scoreboard from './Scoreboard';

export default function GameRoom({ roomId }: { roomId: string }) {
  const [gameState, setGameState] = useState<GameRoomType | null>(null);
  const [user, setUser] = useState<any>(null);
  // persistent id for unauthenticated players
  const [guestId, setGuestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;

      setUser(user);
      // ensure guestId exists for unauthenticated users
      let existing = window.localStorage.getItem('fc_guest_id');
      if (!existing) {
        existing = `guest-${Math.random().toString(36).slice(2, 10)}`;
        window.localStorage.setItem('fc_guest_id', existing);
      }
      setGuestId(existing);

      if (user) {
        joinGame(user.id, user.email || 'Player');
      } else {
        // use guest id and default username for unauthenticated players
        joinGame(existing as string, 'Guest');
      }
    });

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`room-${roomId}`)
      .on('broadcast', { event: 'game-update' }, ({ payload }) => {
        if (mounted) {
          setGameState(payload.gameState);
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
      if (questionTimer) {
        clearTimeout(questionTimer);
      }
    };
  }, [roomId]);

  // Set timer for each new question
  useEffect(() => {
    if (gameState?.status === 'playing' && gameState.currentCard) {
      // Clear any existing timer
      if (questionTimer) {
        clearTimeout(questionTimer);
      }

      // Set 10 second timer for each question
      const timer = setTimeout(async () => {
        await moveToNextCard();
      }, 10000);

      setQuestionTimer(timer);
    }

    return () => {
      if (questionTimer) {
        clearTimeout(questionTimer);
      }
    };
  }, [gameState?.currentCardIndex, gameState?.status]);

  const moveToNextCard = async () => {
    try {
      const nextResponse = await fetch('/api/game/next-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      const nextData = await nextResponse.json();

      // Broadcast the next card update
      await supabase.channel(`room-${roomId}`).send({
        type: 'broadcast',
        event: 'game-update',
        payload: { gameState: nextData.gameState },
      });
    } catch (error) {
      console.error('Error moving to next card:', error);
    }
  };


  const joinGame = async (userId: string, username: string) => {
    if (hasJoined) return;

    try {
      setHasJoined(true);
      const response = await fetch(`/api/game/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId, username }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Join game failed:', err);
        setGameState(null);
        setLoading(false);
        setHasJoined(false);
        return;
      }
      const data = await response.json();
      setGameState(data.gameState);
      // Broadcast the updated game state so other connected clients receive the new player
      try {
        await supabase.channel(`room-${roomId}`).send({
          type: 'broadcast',
          event: 'game-update',
          payload: { gameState: data.gameState },
        });
      } catch (broadcastErr) {
        // eslint-disable-next-line no-console
        console.error('Failed to broadcast join update:', broadcastErr);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error joining game:', error);
      setLoading(false);
      setHasJoined(false);
    }
  };

  const startGame = async () => {
    const response = await fetch('/api/game/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    });
    const data = await response.json();
    
    // Broadcast update
    await supabase.channel(`room-${roomId}`).send({
      type: 'broadcast',
      event: 'game-update',
      payload: { gameState: data.gameState },
    });
  };

  const handleAnswer = async (answer: string) => {
    // allow guests or authenticated users to answer
    if (!gameState) return;

    const clientId = user?.id || guestId || window.localStorage.getItem('fc_guest_id') || 'guest';

    const response = await fetch('/api/game/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        userId: clientId,
        answer,
      }),
    });

    const data = await response.json();

    // Update local state for any valid response
    if (data.gameState) {
      setGameState(data.gameState);
    }

    // Move to next card if needed (correct answer or all players attempted)
    if (data.shouldMoveNext) {
      // Clear the timer since we're moving to next card
      if (questionTimer) {
        clearTimeout(questionTimer);
        setQuestionTimer(null);
      }

      const delay = data.correct ? 2000 : 1000; // Shorter delay for wrong answers

      setTimeout(async () => {
        await moveToNextCard();
      }, delay);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!gameState) {
    return <div className="text-center">Game not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl font-bold mb-2">Room: {roomId}</h2>
        <p>Status: {gameState.status}</p>
        <p>Players: {gameState.players.length}</p>
      </div>

      {gameState.status === 'waiting' && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="mb-4">Waiting for players...</p>
          {gameState.players.length >= 2 && (
            <button
              onClick={startGame}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Start Game
            </button>
          )}
        </div>
      )}

      {gameState.status === 'playing' && gameState.currentCard && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Flashcard
              card={gameState.currentCard}
              onAnswer={handleAnswer}
              cardIndex={gameState.currentCardIndex}
            />
          </div>
          <div>
            <Scoreboard players={gameState.players} />
          </div>
        </div>
      )}

      {gameState.status === 'finished' && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
          <Scoreboard players={gameState.players} />
        </div>
      )}
    </div>
  );
}
