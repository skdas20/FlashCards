import { NextRequest, NextResponse } from 'next/server';
import { gameRooms } from '@/lib/gameState';
import { flashcards } from '@/data/flashcards';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  const { roomId } = await request.json();
  
  const gameRoom = gameRooms.get(roomId);
  
  if (!gameRoom) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  
  gameRoom.currentCardIndex += 1;
  
  if (gameRoom.currentCardIndex >= flashcards.length) {
    // Game finished, save to database
    gameRoom.status = 'finished';
    gameRoom.currentCard = null;
    
    try {
      const db = await getDatabase();
      const winner = gameRoom.players.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      );
      
      await db.collection('matches').insertOne({
        roomId,
        players: gameRoom.players,
        flashcards: flashcards.slice(0, gameRoom.currentCardIndex),
        winner: winner.username,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving match:', error);
    }
  } else {
    gameRoom.currentCard = flashcards[gameRoom.currentCardIndex];
  }
  
  return NextResponse.json({ gameState: gameRoom });
}
