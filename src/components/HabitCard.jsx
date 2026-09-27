/**
 * HabitCard — displays a single habit with completion toggle
 */

import { useState } from 'react';

export default function HabitCard({ habit, stats, onToggle, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const completed = stats.completedToday;

  return (
    <div className={`habit-card ${completed ? 'completed' : ''}`}>
      <button
        className={`habit-checkbox ${completed ? 'checked' : ''}`}
        onClick={() => onToggle(habit.id)}
        aria-label={completed ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
        title={completed ? 'Completed today' : 'Mark as complete'}
      />
      
      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        {habit.description && (
          <div className="habit-description">{habit.description}</div>
        )}
      </div>
      
      {stats.currentStreak > 0 && (
        <div className="habit-streak" title="Current streak">
          🔥 {stats.currentStreak}d
        </div>
      )}
      
      <div className="habit-actions">
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={() => onEdit(habit)}
          aria-label={`Edit ${habit.name}`}
        >
          ✎
        </button>
        <button 
          className="btn btn-ghost btn-sm btn-danger" 
          onClick={() => onDelete(habit)}
          aria-label={`Delete ${habit.name}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
