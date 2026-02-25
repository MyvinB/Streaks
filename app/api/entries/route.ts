import { NextResponse } from 'next/server';
import { getAllEntries } from '@/lib/googleSheets';

export async function GET() {
  try {
    const entries = await getAllEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
