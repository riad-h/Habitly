/**
 * History page — shows habit completion history with calendar
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
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // If no habits
  if (habits.length === 0) {
    return (
      <div>
        <h1 className="dashboard-greeting" style={{ marginBottom: '0.5rem' }}>History</h1>
        <p className="text-muted">Create your first habit to start tracking your progress.</p>
      </div>
    );
  }

  // Default to first habit if none selected
  const activeHabit = selectedHabit || habits[0];
  const completions = getHabitCompletions(activeHabit.id);
  const currentStreak = calculateCurrentStreak(completions);
  const longestStreak = calculateLongestStreak(completions);
  const completionRate = calculateCompletionRate(completions, 30, activeHabit.created_at);

  return (
    <div>
      <h1 className="dashboard-greeting" style={{ marginBottom: '1.5rem' }}>History</h1>
      
      {/* Habit selector */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="habit-select">Select habit</label>
        <select
          id="habit-select"
          className="form-input form-select"
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

      {/* Stats for selected habit */}
      <div className="dashboard-stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-value">🔥 {currentStreak}</div>
          <div className="stat-label">Current streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🏆 {longestStreak}</div>
          <div className="stat-label">Longest streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Last 30 days</div>
        </div>
      </div>

      {/* Calendar */}
      <HabitCalendar completions={completions} />

      {/* Summary */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>{activeHabit.name}</strong>
          {activeHabit.description && ` — ${activeHabit.description}`}
          {' · '}
          {completions.length} total completion{completions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
