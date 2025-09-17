import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const db = await getDatabase();
    const matches = await db
      .collection('matches')
      .find({
        'players.userId': user.id,
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
