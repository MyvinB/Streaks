import { NextResponse } from 'next/server';
import { getHabits } from '@/lib/googleSheets';

export async function GET() {
  try {
    const habits = await getHabits();
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}
