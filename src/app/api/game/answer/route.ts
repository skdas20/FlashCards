import { NextRequest, NextResponse } from 'next/server';
import { gameRooms } from '@/lib/gameState';

const answeredCards = new Map<string, Set<string>>();
const attemptedCards = new Map<string, Set<string>>(); // Track all attempts

export async function POST(request: NextRequest) {
  const { roomId, userId, answer } = await request.json();

  const gameRoom = gameRooms.get(roomId);

  if (!gameRoom || !gameRoom.currentCard) {
    return NextResponse.json({ error: 'Invalid game state' }, { status: 400 });
  }

  const cardKey = `${roomId}-${gameRoom.currentCardIndex}`;
  const answeredSet = answeredCards.get(cardKey) || new Set();
  const attemptedSet = attemptedCards.get(cardKey) || new Set();

  // Check if this card was already answered correctly
  if (answeredSet.size > 0) {
    return NextResponse.json({ correct: false, alreadyAnswered: true });
  }

  // Check if this user already attempted this card
  if (attemptedSet.has(userId)) {
    return NextResponse.json({ correct: false, alreadyAttempted: true });
  }

  // Mark user as having attempted this card
  attemptedSet.add(userId);
  attemptedCards.set(cardKey, attemptedSet);

  const isCorrect = answer === gameRoom.currentCard.answer;

  if (isCorrect) {
    answeredSet.add(userId);
    answeredCards.set(cardKey, answeredSet);

    // Update player score
    const player = gameRoom.players.find(p => p.userId === userId);
    if (player) {
      player.score += 1;
    }

    return NextResponse.json({ correct: true, gameState: gameRoom, shouldMoveNext: true });
  }

  // For wrong answers, always allow moving to next card after timeout
  // This prevents the game from getting stuck
  return NextResponse.json({
    correct: false,
    gameState: gameRoom,
    shouldMoveNext: true // Always allow progression on wrong answers
  });
}
