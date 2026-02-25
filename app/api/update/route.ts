import { NextRequest, NextResponse } from 'next/server';
import { updateHabit, createDay, getTodayEntry } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const { date, habit, value } = await req.json();

    if (!date || !habit || value === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const entry = await getTodayEntry(date);
    if (!entry) {
      await createDay(date);
    }

    await updateHabit(date, habit, value);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: 'Failed to update habit' }, { status: 500 });
  }
}
