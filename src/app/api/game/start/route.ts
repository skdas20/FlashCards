import { NextRequest, NextResponse } from 'next/server';
import { gameRooms } from '@/lib/gameState';
import { flashcards } from '@/data/flashcards';

export async function POST(request: NextRequest) {
  const { roomId } = await request.json();
  
  const gameRoom = gameRooms.get(roomId);
  
  if (!gameRoom) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  
  gameRoom.status = 'playing';
  gameRoom.currentCardIndex = 0;
  gameRoom.currentCard = flashcards[0];
  
  return NextResponse.json({ gameState: gameRoom });
}
