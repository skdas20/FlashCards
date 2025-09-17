'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const createRoom = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const response = await fetch('/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await response.json();
    router.push(`/game/${data.roomId}`);
  };

  const joinRoom = () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (roomId) {
      router.push(`/game/${roomId}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Flashcard Frenzy</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h2 className="text-2xl font-semibold mb-4">Create New Game</h2>
          <button
            onClick={createRoom}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Room
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Join Existing Game</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
