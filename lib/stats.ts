import { DayEntry, Stats } from '@/types';

export function calculateHabitStreaks(entries: DayEntry[]): Record<string, number> {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) return {};

  const habitNames = Object.keys(sorted[0].habits);
  const streaks: Record<string, number> = {};

  habitNames.forEach((habit) => {
    let streak = 0;
    for (const entry of sorted) {
      if (entry.habits[habit] === 1) {
        streak++;
      } else {
        break;
      }
    }
    streaks[habit] = streak;
  });

  return streaks;
}

export function calculateHabitLongestStreaks(entries: DayEntry[]): Record<string, number> {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) return {};

  const habitNames = Object.keys(sorted[0].habits);
  const longestStreaks: Record<string, number> = {};

  habitNames.forEach((habit) => {
    let longest = 0;
    let current = 0;
    
    for (const entry of sorted) {
      if (entry.habits[habit] === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    longestStreaks[habit] = longest;
  });

  return longestStreaks;
}

export function calculateConsistency(entries: DayEntry[], days: number): number {
  const recent = entries.slice(-days);
  const total = recent.reduce((sum, e) => sum + e.score, 0);
  const habitCount = recent.length > 0 ? Object.keys(recent[0].habits).length : 4;
  const possible = days * habitCount;
  return possible > 0 ? Math.round((total / possible) * 100) : 0;
}

export function calculateHabitRates(entries: DayEntry[]): Record<string, number> {
  const total = entries.length;
  if (total === 0) return {};

  const habitNames = entries.length > 0 ? Object.keys(entries[0].habits) : [];
  const rates: Record<string, number> = {};

  habitNames.forEach((habit) => {
    const completed = entries.filter((e) => e.habits[habit] === 1).length;
    rates[habit] = Math.round((completed / total) * 100);
  });

  return rates;
}

export function calculateStats(entries: DayEntry[]): Stats {
  return {
    habitStreaks: calculateHabitStreaks(entries),
    habitLongestStreaks: calculateHabitLongestStreaks(entries),
  };
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
