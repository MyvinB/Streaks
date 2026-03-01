'use client';
import { useState } from 'react';
import { DayEntry, Habit } from '@/types';

type Props = {
  data: DayEntry[];
  habits: Habit[];
};

export default function ConsistencyWheel({ data, habits }: Props) {
  const now = new Date();
  const [viewDate, setViewDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  
  if (!habits || habits.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6">
        <p className="text-center text-gray-400">No habits configured</p>
      </div>
    );
  }
  
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  
  const monthData = data.filter(entry => {
    const d = new Date(entry.date);
    return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month;
  });

  const size = 340;
  const center = size / 2;
  const outerRadius = size / 2 - 30;
  const ringWidth = (outerRadius - 40) / habits.length;
  
  const segmentAngle = (2 * Math.PI) / daysInMonth;

  const getColor = (value: number) => value === 1 ? '#10b981' : '#374151';

  const prevMonth = () => {
    const newMonth = viewDate.month - 1;
    if (newMonth < 0) {
      setViewDate({ year: viewDate.year - 1, month: 11 });
    } else {
      setViewDate({ ...viewDate, month: newMonth });
    }
  };

  const nextMonth = () => {
    const newMonth = viewDate.month + 1;
    if (newMonth > 11) {
      setViewDate({ year: viewDate.year + 1, month: 0 });
    } else {
      setViewDate({ ...viewDate, month: newMonth });
    }
  };

  const monthName = new Date(viewDate.year, viewDate.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-2xl px-3 py-1 hover:bg-gray-700 rounded">←</button>
        <h2 className="text-xl font-bold">{monthName}</h2>
        <button onClick={nextMonth} className="text-2xl px-3 py-1 hover:bg-gray-700 rounded">→</button>
      </div>
      
      <svg width={size} height={size} className="mx-auto">
        {/* Draw habit rings */}
        {habits.map((habit, habitIndex) => {
          const innerR = 40 + habitIndex * ringWidth;
          const outerR = 40 + (habitIndex + 1) * ringWidth;
          
          return Array.from({ length: daysInMonth }, (_, dayIndex) => {
            const day = dayIndex + 1;
            const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEntry = monthData.find(e => e.date === dateStr);
            
            const startAngle = dayIndex * segmentAngle - Math.PI / 2;
            const endAngle = (dayIndex + 1) * segmentAngle - Math.PI / 2;
            
            const value = dayEntry?.habits[habit.name] || 0;
            const color = getColor(value);
            
            const x1 = center + innerR * Math.cos(startAngle);
            const y1 = center + innerR * Math.sin(startAngle);
            const x2 = center + outerR * Math.cos(startAngle);
            const y2 = center + outerR * Math.sin(startAngle);
            const x3 = center + outerR * Math.cos(endAngle);
            const y3 = center + outerR * Math.sin(endAngle);
            const x4 = center + innerR * Math.cos(endAngle);
            const y4 = center + innerR * Math.sin(endAngle);
            
            const largeArc = segmentAngle > Math.PI ? 1 : 0;
            
            const path = `
              M ${x1} ${y1}
              L ${x2} ${y2}
              A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3}
              L ${x4} ${y4}
              A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1}
              Z
            `;
            
            return (
              <path
                key={`${habit.name}-${day}`}
                d={path}
                fill={color}
                stroke="#1f2937"
                strokeWidth="0.5"
              />
            );
          });
        })}
        
        {/* Day numbers on outer ring */}
        {Array.from({ length: daysInMonth }, (_, dayIndex) => {
          const day = dayIndex + 1;
          const angle = dayIndex * segmentAngle + segmentAngle / 2 - Math.PI / 2;
          const labelRadius = outerRadius + 18;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={day}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9ca3af"
              fontSize="10"
              fontWeight="bold"
            >
              {day}
            </text>
          );
        })}
        
        {/* Habit emoji labels on each ring */}
        {habits.map((habit, habitIndex) => {
          const ringRadius = 40 + (habitIndex + 0.5) * ringWidth;
          const labelAngle = -Math.PI / 2; // Top position
          const x = center + ringRadius * Math.cos(labelAngle);
          const y = center + ringRadius * Math.sin(labelAngle);
          
          return (
            <g key={habit.name}>
              <circle cx={x} cy={y} r={8} fill="#1f2937" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
              >
                {habit.emoji}
              </text>
            </g>
          );
        })}
        
        {/* Center circle */}
        <circle cx={center} cy={center} r={35} fill="#1f2937" />
      </svg>
    </div>
  );
}
