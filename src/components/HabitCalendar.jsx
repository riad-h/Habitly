/**
 * HabitCalendar — simple monthly calendar view for habit history
 */

import { useState } from 'react';
import { getCalendarMonth, getMonthName, DAY_LABELS, getToday } from '../utils/dateUtils';
import { getCompletionMap } from '../utils/streakUtils';

export default function HabitCalendar({ completions }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const weeks = getCalendarMonth(currentYear, currentMonth);
  
  // Build completion map for the visible month
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
  
  const isCurrentMonthView = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="calendar-container">
      <div className="section-header">
        <h3 className="calendar-month-title">
          {getMonthName(currentMonth)} {currentYear}
        </h3>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth} aria-label="Previous month">
            ←
          </button>
          {!isCurrentMonthView && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}>
              Today
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={nextMonth} aria-label="Next month">
            →
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="calendar-day-header">{label}</div>
        ))}
        
        {weeks.flat().map((day, i) => {
          if (!day.date) {
            return <div key={i} className="calendar-day" />;
          }
          
          const isCompleted = !!completionMap[day.date];
          const isToday = day.isToday;
          
          let className = 'calendar-day';
          if (day.isCurrentMonth) className += ' current-month';
          if (isToday) className += ' today';
          if (isCompleted) className += ' completed';
          
          return (
            <div key={i} className={className} title={day.date}>
              {day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
