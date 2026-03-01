'use client';
import { useState, useEffect } from 'react';
import { DayEntry, Habit } from '@/types';
import { calculateStats, getTodayDate } from '@/lib/stats';
import Home from '@/components/Home';
import Stats from '@/components/Stats';
import Calendar from '@/components/Calendar';
import ConsistencyWheel from '@/components/ConsistencyWheel';

export default function Page() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [today, setToday] = useState<DayEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'home' | 'stats' | 'calendar'>('home');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, entriesRes] = await Promise.all([
        fetch('/api/habits'),
        fetch('/api/entries'),
      ]);
      
      const habitsData = await habitsRes.json();
      const entriesData = await entriesRes.json();
      
      setHabits(habitsData);
      setEntries(entriesData);
      
      const todayDate = getTodayDate();
      const todayEntry = entriesData.find((e: DayEntry) => e.date === todayDate);
      
      const emptyHabits: Record<string, number> = {};
      habitsData.forEach((h: Habit) => emptyHabits[h.name] = 0);
      
      setToday(todayEntry || { date: todayDate, habits: emptyHabits, score: 0 });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitName: string) => {
    if (!today) return;

    const newValue = today.habits[habitName] === 1 ? 0 : 1;
    const optimisticToday = {
      ...today,
      habits: { ...today.habits, [habitName]: newValue },
      score: today.score + (newValue === 1 ? 1 : -1),
    };
    setToday(optimisticToday);

    try {
      await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today.date, habit: habitName, value: newValue }),
      });
      await fetchData();
    } catch (error) {
      console.error('Failed to update habit:', error);
      setToday(today);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const stats = calculateStats(entries);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto pb-20">
        {tab === 'home' && <Home today={today!} habits={habits} stats={stats} onToggle={toggleHabit} />}
        {tab === 'stats' && (
          <>
            <ConsistencyWheel data={entries} habits={habits} />
            <Stats stats={stats} />
          </>
        )}
        {tab === 'calendar' && <Calendar entries={entries} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <button onClick={() => setTab('home')} className={tab === 'home' ? 'text-blue-400' : 'text-gray-400'}>
            🏠 Home
          </button>
          <button onClick={() => setTab('stats')} className={tab === 'stats' ? 'text-blue-400' : 'text-gray-400'}>
            📊 Stats
          </button>
          <button onClick={() => setTab('calendar')} className={tab === 'calendar' ? 'text-blue-400' : 'text-gray-400'}>
            📅 Calendar
          </button>
        </div>
      </nav>
    </div>
  );
}
