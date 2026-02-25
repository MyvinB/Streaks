import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://zenquotes.io/api/random');
    const data = await res.json();
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" });
  }
}
