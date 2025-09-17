import { NextRequest, NextResponse } from 'next/server';
import { GameRoom } from '@/lib/types';
import { flashcards } from '@/data/flashcards';

// In-memory storage for demo (use Redis in production)
// Persist the map on globalThis so it survives module reloads in dev (Next dev may reload modules
// and create separate Map instances for different route handlers).
const _globalAny: any = globalThis as any;
if (!_globalAny.__gameRooms) {
  _globalAny.__gameRooms = new Map<string, GameRoom>();
}
const gameRooms: Map<string, GameRoom> = _globalAny.__gameRooms;

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

export { gameRooms };
