/**
 * HabitForm — create or edit a habit
 */

import { useState, useEffect } from 'react';
import { validateHabitName, validateHabitDescription } from '../utils/validation';

const COLORS = [
  { name: 'Default', value: '#171717' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HabitForm({ habit = null, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [frequency, setFrequency] = useState('daily');
  const [targetDays, setTargetDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setColor(habit.color || COLORS[0].value);
      setFrequency(habit.frequency || 'daily');
      setTargetDays(habit.target_days || [0, 1, 2, 3, 4, 5, 6]);
    }
  }, [habit]);

  const toggleDay = (day) => {
    setTargetDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nameValidation = validateHabitName(name);
    const descValidation = validateHabitDescription(description);
    
    if (!nameValidation.valid || !descValidation.valid) {
      setErrors({
        name: nameValidation.error,
        description: descValidation.error,
      });
      return;
    }
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color,
      frequency,
      target_days: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : targetDays,
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="habit-name">Habit name</label>
        <input
          id="habit-name"
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: null})); }}
          placeholder="e.g., Read for 20 minutes"
          maxLength={100}
          autoFocus
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="habit-description">Description (optional)</label>
        <textarea
          id="habit-description"
          className="form-input form-textarea"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({...prev, description: null})); }}
          placeholder="Why is this habit important to you?"
          maxLength={500}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Frequency</label>
        <select
          className="form-input form-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Every day</option>
          <option value="custom">Custom days</option>
        </select>
      </div>
      
      {frequency === 'custom' && (
        <div className="form-group">
          <label className="form-label">Target days</label>
          <div className="day-selector">
            {DAYS.map((label, index) => (
              <button
                key={index}
                type="button"
                className={`day-btn ${targetDays.includes(index) ? 'active' : ''}`}
                onClick={() => toggleDay(index)}
                aria-label={label}
                aria-pressed={targetDays.includes(index)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Color</label>
        <div className="color-options">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`color-option ${color === c.value ? 'selected' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              aria-label={c.name}
              aria-pressed={color === c.value}
            />
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Saving...' : (habit ? 'Update habit' : 'Create habit')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
