import { DayEntry } from '@/types';

type Props = {
  entries: DayEntry[];
};

export default function Calendar({ entries }: Props) {
  const getColor = (score: number) => {
    if (score === 0) return 'bg-gray-800 border-gray-700';
    if (score === 1) return 'bg-green-900 border-green-800';
    if (score === 2) return 'bg-green-700 border-green-600';
    if (score === 3) return 'bg-green-500 border-green-400';
    return 'bg-green-400 border-green-300';
  };

  const last90Days = [...Array(90)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (89 - i));
    return date;
  });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  last90Days.forEach((date) => {
    if (currentWeek.length === 0 && date.getDay() !== 0) {
      for (let i = 0; i < date.getDay(); i++) {
        currentWeek.push(null as any);
      }
    }
    currentWeek.push(date);
    if (date.getDay() === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Activity</h1>
      <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-2">
            <div className="h-5" />
            {dayLabels.map((day) => (
              <div key={day} className="text-[10px] text-gray-500 h-3 flex items-center w-6">
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {weekIdx === 0 || (week[0] && week[0].getDate() <= 7) ? (
                <div className="text-xs text-gray-400 h-5 flex items-center">
                  {week.find(d => d)?.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              ) : (
                <div className="h-5" />
              )}
              {week.map((date, dayIdx) => {
                if (!date) {
                  return <div key={dayIdx} className="w-3 h-3" />;
                }
                const dateStr = date.toISOString().split('T')[0];
                const entry = entries.find((e) => e.date === dateStr);
                const score = entry?.score || 0;
                return (
                  <div
                    key={dateStr}
                    className={`w-3 h-3 rounded-sm border ${getColor(score)} hover:ring-1 hover:ring-white cursor-pointer transition`}
                    title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${score}/4 habits`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="text-xs text-gray-500">
            {entries.length} days tracked
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-900 border border-green-800 rounded-sm" />
            <div className="w-3 h-3 bg-green-700 border border-green-600 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 border border-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 border border-green-300 rounded-sm" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
