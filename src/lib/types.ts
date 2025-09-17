export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  options: string[];
}

export interface Player {
  userId: string;
  username: string;
  score: number;
}

export interface GameRoom {
  id: string;
  players: Player[];
  currentCardIndex: number;
  currentCard: Flashcard | null;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export interface Match {
  _id?: string;
  roomId: string;
  players: Player[];
  flashcards: Flashcard[];
  winner: string;
  createdAt: Date;
}
