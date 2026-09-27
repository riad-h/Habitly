/**
 * Stats page — Heatmap, bar charts, and detailed analytics
 */

import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { getDaysAgo, getToday, formatDate } from '../utils/dateUtils';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionRate } from '../utils/streakUtils';

const Icons = {
  flame: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  trophy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
};

export default function Stats() {
  const { habits, getHabitCompletions, getOverallStats } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState('all');

  if (habits.length === 0) {
    return (
      <div>
        <h1 className="h1" style={{ marginBottom: '8px' }}>Statistics</h1>
        <p className="muted">Create habits to see your statistics and progress.</p>
      </div>
    );
  }

  // Get completions based on selection
  let completions = [];
  if (selectedHabit === 'all') {
    habits.forEach(h => {
      completions = completions.concat(getHabitCompletions(h.id));
    });
  } else {
    completions = getHabitCompletions(selectedHabit);
  }

  const currentStreak = calculateCurrentStreak(completions);
  const longestStreak = calculateLongestStreak(completions);
  const completionRate = calculateCompletionRate(completions, 30);
  const totalCompletions = completions.length;

  // Generate heatmap data (last 16 weeks = 112 days)
  const heatmapData = [];
  for (let week = 15; week >= 0; week--) {
    const weekData = [];
    for (let day = 6; day >= 0; day--) {
      const daysAgo = week * 7 + day;
      const date = getDaysAgo(daysAgo);
      const completed = completions.filter(c => c.completed_date === date).length;
      weekData.push({ date, completed, daysAgo });
    }
    heatmapData.push(weekData);
  }

  // Generate weekly bar chart data (last 8 weeks)
  const weeklyData = [];
  for (let week = 7; week >= 0; week--) {
    const weekStart = getDaysAgo(week * 7 + 6);
    const weekEnd = getDaysAgo(week * 7);
    const weekCompletions = completions.filter(c => 
      c.completed_date >= weekStart && c.completed_date <= weekEnd
    ).length;
    const weekLabel = new Date(weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeklyData.push({ label: weekLabel, count: weekCompletions });
  }

  const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1);

  // Get heatmap color intensity
  const getHeatColor = (count) => {
    if (count === 0) return 'var(--surface2)';
    if (count === 1) return 'var(--leaf-soft)';
    if (count === 2) return 'var(--leaf)';
    return 'var(--leaf-deep)';
  };

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: '20px' }}>Statistics</h1>

      {/* Habit selector */}
      <div style={{ marginBottom: '20px' }}>
        <label className="label" htmlFor="stats-habit">View stats for</label>
        <select
          id="stats-habit"
          className="input"
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
        >
          <option value="all">All habits</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {/* Overview stats */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="row-s" style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--gold)' }}>{Icons.flame}</span>
            <span className="tag">Current streak</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{currentStreak}</div>
          <div className="stat-label">days</div>
        </div>
        <div className="card stat-card">
          <div className="row-s" style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--teal)' }}>{Icons.trophy}</span>
            <span className="tag">Longest streak</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--teal)' }}>{longestStreak}</div>
          <div className="stat-label">days</div>
        </div>
        <div className="card stat-card">
          <div className="row-s" style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--leaf)' }}>{Icons.target}</span>
            <span className="tag">Completion rate</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--leaf)' }}>{completionRate}%</div>
          <div className="stat-label">last 30 days</div>
        </div>
        <div className="card stat-card">
          <div className="row-s" style={{ marginBottom: '8px' }}>
            <span style={{ color: 'var(--plum)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
            </span>
            <span className="tag">Total completions</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--plum)' }}>{totalCompletions}</div>
          <div className="stat-label">all time</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h2 className="h2" style={{ marginBottom: '16px' }}>Activity heatmap</h2>
        <p className="muted" style={{ fontSize: '13px', marginBottom: '16px' }}>
          Last 16 weeks of habit completions
        </p>
        
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '4px', minWidth: '500px' }}>
            {heatmapData.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="heat-cell"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '3px',
                      background: getHeatColor(day.completed),
                      transition: 'transform 0.15s ease',
                      cursor: 'pointer',
                    }}
                    title={`${day.date}: ${day.completed} completion${day.completed !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="row-s" style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
          <span className="muted" style={{ fontSize: '11px' }}>Less</span>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              background: getHeatColor(i),
            }} />
          ))}
          <span className="muted" style={{ fontSize: '11px' }}>More</span>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="card" style={{ padding: '20px' }}>
        <h2 className="h2" style={{ marginBottom: '16px' }}>Weekly completions</h2>
        <p className="muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
          Completions per week (last 8 weeks)
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 8px' }}>
          {weeklyData.map((week, i) => {
            const height = (week.count / maxWeekly) * 100;
            const isCurrentWeek = i === weeklyData.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  flex: 1, 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-end',
                  position: 'relative',
                }}>
                  {week.count > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--ink2)',
                    }}>
                      {week.count}
                    </div>
                  )}
                  <div style={{
                    width: '100%',
                    height: `${height}%`,
                    background: isCurrentWeek ? 'var(--leaf)' : 'var(--leaf-soft)',
                    borderRadius: '6px 6px 3px 3px',
                    minHeight: week.count > 0 ? '8px' : '0',
                    transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  }} />
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: isCurrentWeek ? 'var(--leaf-deep)' : 'var(--mut)',
                  textAlign: 'center',
                }}>
                  {week.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
