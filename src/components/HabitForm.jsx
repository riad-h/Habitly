/**
 * HabitForm — create or edit a habit (HabitFlow design)
 */

import { useState, useEffect } from 'react';
import { validateHabitName, validateHabitDescription } from '../utils/validation';

const COLORS = [
  { name: 'Leaf', value: '#23854f' },
  { name: 'Gold', value: '#dd9a1d' },
  { name: 'Coral', value: '#d95a38' },
  { name: 'Teal', value: '#2b8a99' },
  { name: 'Plum', value: '#a45c9e' },
  { name: 'Pine', value: '#5c7a6b' },
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
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameValidation = validateHabitName(name);
    const descValidation = validateHabitDescription(description);
    
    if (!nameValidation.valid || !descValidation.valid) {
      setErrors({ name: nameValidation.error, description: descValidation.error });
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
    <form onSubmit={handleSubmit} className="stack-s">
      <div>
        <label className="label" htmlFor="habit-name">Habit name</label>
        <input
          id="habit-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: null})); }}
          placeholder="e.g., Read for 20 minutes"
          maxLength={100}
          autoFocus
        />
        {errors.name && <span className="muted" style={{ fontSize: '12px', color: 'var(--coral)', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
      </div>
      
      <div>
        <label className="label" htmlFor="habit-description">
          Description 
          <span className="label-note"> (optional)</span>
        </label>
        <textarea
          id="habit-description"
          className="input"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({...prev, description: null})); }}
          placeholder="Why is this habit important to you?"
          maxLength={500}
        />
        {errors.description && <span className="muted" style={{ fontSize: '12px', color: 'var(--coral)', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
      </div>
      
      <div>
        <label className="label">Frequency</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            className={`chip ${frequency === 'daily' ? 'on' : ''}`}
            onClick={() => setFrequency('daily')}
            style={frequency === 'daily' ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: 'var(--bg)' } : {}}
          >
            Every day
          </button>
          <button 
            type="button" 
            className={`chip ${frequency === 'custom' ? 'on' : ''}`}
            onClick={() => setFrequency('custom')}
            style={frequency === 'custom' ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: 'var(--bg)' } : {}}
          >
            Custom days
          </button>
        </div>
      </div>
      
      {frequency === 'custom' && (
        <div>
          <label className="label">Target days</label>
          <div className="day-selector">
            {DAYS.map((label, index) => (
              <button
                key={index}
                type="button"
                className={`day-btn ${targetDays.includes(index) ? 'on' : ''}`}
                onClick={() => toggleDay(index)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <label className="label">Color</label>
        <div className="swatch-grid">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`swatch ${color === c.value ? 'selected' : ''}`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
      
      <div className="row-s" style={{ marginTop: '12px' }}>
        <button type="submit" className="btn btn-primary grow" disabled={loading}>
          {loading ? <><span className="spin" /> Saving...</> : (habit ? 'Update habit' : 'Create habit')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
