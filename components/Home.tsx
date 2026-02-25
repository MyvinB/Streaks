'use client';
import { useState, useEffect } from 'react';
import { DayEntry, Habit, Stats } from '@/types';

type Props = {
  today: DayEntry;
  habits: Habit[];
  stats: Stats;
  onToggle: (habitName: string) => void;
};

export default function Home({ today, habits, stats, onToggle }: Props) {
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);

  useEffect(() => {
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => setQuote(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <img src="/streaks.png" alt="Streaks" className="w-24 h-24" />
      </div>

      {quote && (
        <div className="bg-gray-800 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-300 italic">"{quote.q}"</p>
          <p className="text-gray-500 text-sm mt-2">— {quote.a}</p>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-2xl p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold">{today.score} / {habits.length}</div>
          <div className="text-gray-400">Today's Progress</div>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => {
            const isCompleted = today.habits[habit.name] === 1;
            return (
              <button
                key={habit.name}
                onClick={() => !isCompleted && onToggle(habit.name)}
                disabled={isCompleted}
                className={`w-full p-4 rounded-xl flex items-center justify-between transition ${
                  isCompleted
                    ? 'bg-green-600 cursor-default'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{habit.emoji}</span>
                  <span className="text-lg font-medium">{habit.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-orange-400">{stats.habitStreaks[habit.name] || 0}🔥</span>
                  {!isCompleted && <span className="text-2xl">⭕</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
