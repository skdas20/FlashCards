import { NextRequest, NextResponse } from 'next/server';
import { gameRooms } from '@/lib/gameState';
import { GameRoom } from '@/lib/types';

export async function POST(request: NextRequest) {
  const { roomId, userId, username } = await request.json();

  let gameRoom = gameRooms.get(roomId);

  // Demo-only: if the in-memory store isn't shared between handlers (serverless),
  // create the room here so the client redirected from /api/game/create can join immediately.
  if (!gameRoom) {
    const newRoom: GameRoom = {
      id: roomId,
      players: [],
      currentCardIndex: 0,
      currentCard: null,
      status: 'waiting',
      createdAt: new Date(),
    };
    gameRooms.set(roomId, newRoom);
    gameRoom = newRoom;
  }

  // Check if player already in room
  const existingPlayer = gameRoom.players.find((p) => p.userId === userId);

  if (!existingPlayer) {
    gameRoom.players.push({
      userId,
      username,
      score: 0,
    });
  }

  return NextResponse.json({ gameState: gameRoom });
}
