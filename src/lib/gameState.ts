import { GameRoom } from './types';

// In-memory storage for demo (use Redis in production)
// Persist the map on globalThis so it survives module reloads in dev
const _globalAny: any = globalThis as any;
if (!_globalAny.__gameRooms) {
  _globalAny.__gameRooms = new Map<string, GameRoom>();
}

export const gameRooms: Map<string, GameRoom> = _globalAny.__gameRooms;