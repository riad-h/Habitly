/**
 * History page — calendar view with stats (HabitFlow design)
 */

import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import HabitCalendar from '../components/HabitCalendar';
import { calculateCurrentStreak, calculateLongestStreak, calculateCompletionRate } from '../utils/streakUtils';

export default function History() {
  const { habits, getHabitCompletions, loading } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState(null);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spin spin-lg" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div>
        <h1 className="h1" style={{ marginBottom: '8px' }}>History</h1>
        <p className="muted">Create your first habit to start tracking your progress.</p>
      </div>
    );
  }

  const activeHabit = selectedHabit || habits[0];
  const completions = getHabitCompletions(activeHabit.id);
  const currentStreak = calculateCurrentStreak(completions);
  const longestStreak = calculateLongestStreak(completions);
  const completionRate = calculateCompletionRate(completions, 30, activeHabit.created_at);

  return (
    <div>
      <h1 className="h1" style={{ marginBottom: '20px' }}>History</h1>
      
      {/* Habit selector */}
      <div style={{ marginBottom: '20px' }}>
        <label className="label" htmlFor="habit-select">Select habit</label>
        <select
          id="habit-select"
          className="input"
          value={activeHabit.id}
          onChange={(e) => {
            const habit = habits.find(h => h.id === e.target.value);
            setSelectedHabit(habit);
          }}
        >
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>🔥 {currentStreak}</div>
          <div className="stat-label">Current streak</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--teal)' }}>🏆 {longestStreak}</div>
          <div className="stat-label">Longest streak</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--leaf)' }}>{completionRate}%</div>
          <div className="stat-label">Last 30 days</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card" style={{ padding: '20px' }}>
        <HabitCalendar completions={completions} />
      </div>

      {/* Summary */}
      <div className="card" style={{ padding: '16px', marginTop: '16px' }}>
        <p className="soft" style={{ fontSize: '13px' }}>
          <strong style={{ color: 'var(--ink)' }}>{activeHabit.name}</strong>
          {activeHabit.description && ` — ${activeHabit.description}`}
          {' · '}
          {completions.length} total completion{completions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
