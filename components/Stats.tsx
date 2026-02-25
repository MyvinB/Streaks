import { Stats as StatsType } from '@/types';

type Props = {
  stats: StatsType;
};

export default function Stats({ stats }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Streaks</h1>

      <h2 className="text-xl font-semibold mb-3 text-gray-300">Current Streaks</h2>
      <div className="space-y-3 mb-8">
        {Object.entries(stats.habitStreaks).map(([habit, streak]) => (
          <div key={habit} className="bg-gray-800 rounded-xl p-5 flex justify-between items-center">
            <span className="capitalize text-lg font-medium">{habit}</span>
            <span className="text-3xl font-bold text-orange-400">{streak} 🔥</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-3 text-gray-300">Longest Streaks</h2>
      <div className="space-y-3">
        {Object.entries(stats.habitLongestStreaks).map(([habit, streak]) => (
          <div key={habit} className="bg-gray-800 rounded-xl p-5 flex justify-between items-center">
            <span className="capitalize text-lg font-medium">{habit}</span>
            <span className="text-3xl font-bold text-purple-400">{streak}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
