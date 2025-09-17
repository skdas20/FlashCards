import { NextRequest, NextResponse } from 'next/server';
import { GameRoom } from '@/lib/types';
import { gameRooms } from '@/lib/gameState';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const gameRoom: GameRoom = {
    id: roomId,
    players: [],
    currentCardIndex: 0,
    currentCard: null,
    status: 'waiting',
    createdAt: new Date(),
  };
  
  gameRooms.set(roomId, gameRoom);

  // Return the created game state so the client can render immediately after creation
  return NextResponse.json({ roomId, gameState: gameRoom });
}

