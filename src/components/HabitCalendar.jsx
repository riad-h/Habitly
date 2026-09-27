/**
 * HabitCalendar — monthly calendar view (HabitFlow design)
 */

import { useState } from 'react';
import { getCalendarMonth, getMonthName, DAY_LABELS } from '../utils/dateUtils';
import { getCompletionMap } from '../utils/streakUtils';

export default function HabitCalendar({ completions }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const weeks = getCalendarMonth(currentYear, currentMonth);
  
  const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  const completionMap = getCompletionMap(completions, startDate, endDate);
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="row spread" style={{ marginBottom: '16px' }}>
        <h3 className="h2">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <div className="row-s">
          <button className="btn btn-ghost btn-s" onClick={prevMonth} aria-label="Previous month">
            ←
          </button>
          <button 
            className="btn btn-ghost btn-s" 
            onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
          >
            Today
          </button>
          <button className="btn btn-ghost btn-s" onClick={nextMonth} aria-label="Next month">
            →
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="cal-grid">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="cal-head">{label}</div>
        ))}
        
        {weeks.flat().map((day, i) => {
          if (!day.date) {
            return <div key={i} className="cal-cell" style={{ visibility: 'hidden' }} />;
          }
          
          const isCompleted = !!completionMap[day.date];
          
          let style = {
            color: day.isCurrentMonth ? 'var(--ink)' : 'var(--mut)',
            background: 'transparent',
          };
          
          if (isCompleted) {
            style = {
              ...style,
              background: 'var(--leaf-soft)',
              color: 'var(--leaf-deep)',
            };
          }
          
          if (day.isToday) {
            style = {
              ...style,
              fontWeight: 800,
              ...(isCompleted ? {
                background: 'var(--leaf)',
                color: '#fff',
              } : {
                boxShadow: 'inset 0 0 0 1.5px var(--leaf)',
              }),
            };
          }
          
          return (
            <div key={i} className="cal-cell" style={style} title={day.date}>
              {day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
