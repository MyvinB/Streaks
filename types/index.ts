export type DayEntry = {
  date: string;
  habits: Record<string, number>;
  score: number;
};

export type Habit = {
  name: string;
  label: string;
  emoji: string;
};

export type Stats = {
  habitStreaks: Record<string, number>;
  habitLongestStreaks: Record<string, number>;
};
