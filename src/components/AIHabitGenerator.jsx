/**
 * AIHabitGenerator — "Create with AI" feature
 * Uses demo suggestions when backend isn't available
 */

import { useState } from 'react';
import { validateAIGoal } from '../utils/validation';

// Demo suggestions when AI backend isn't available
const DEMO_SUGGESTIONS = {
  health: [
    { name: 'Morning Walk', description: 'Walk for 20 minutes after waking up.', frequency: 'daily' },
    { name: 'Drink Water', description: 'Drink a glass of water first thing in the morning.', frequency: 'daily' },
    { name: 'Stretch', description: 'Do 5 minutes of stretching before bed.', frequency: 'daily' },
  ],
  productivity: [
    { name: 'Plan Tomorrow', description: 'Write down 3 priorities for tomorrow.', frequency: 'daily' },
    { name: 'Deep Work Block', description: 'Spend 1 hour on focused work without distractions.', frequency: 'daily' },
    { name: 'Review Goals', description: 'Review your weekly goals every Sunday.', frequency: 'custom' },
  ],
  learning: [
    { name: 'Read 20 Pages', description: 'Read at least 20 pages of a book.', frequency: 'daily' },
    { name: 'Practice Coding', description: 'Solve one coding problem or work on a project.', frequency: 'daily' },
    { name: 'Learn New Word', description: 'Learn and use one new vocabulary word.', frequency: 'daily' },
  ],
  mindfulness: [
    { name: 'Meditate', description: 'Meditate for 10 minutes.', frequency: 'daily' },
    { name: 'Gratitude Journal', description: 'Write 3 things you are grateful for.', frequency: 'daily' },
    { name: 'Digital Detox', description: 'No phone for the first hour after waking.', frequency: 'daily' },
  ],
  default: [
    { name: 'Exercise', description: 'Do 20 minutes of physical activity.', frequency: 'daily' },
    { name: 'Read', description: 'Read for at least 15 minutes.', frequency: 'daily' },
    { name: 'Journal', description: 'Write a few sentences about your day.', frequency: 'daily' },
  ],
};

function getSuggestionsForGoal(goal) {
  const lower = goal.toLowerCase();
  if (lower.includes('health') || lower.includes('fit') || lower.includes('exercise') || lower.includes('body')) {
    return DEMO_SUGGESTIONS.health;
  }
  if (lower.includes('productiv') || lower.includes('work') || lower.includes('focus') || lower.includes('organize')) {
    return DEMO_SUGGESTIONS.productivity;
  }
  if (lower.includes('learn') || lower.includes('study') || lower.includes('read') || lower.includes('skill') || lower.includes('code')) {
    return DEMO_SUGGESTIONS.learning;
  }
  if (lower.includes('mind') || lower.includes('calm') || lower.includes('stress') || lower.includes('meditat') || lower.includes('peace')) {
    return DEMO_SUGGESTIONS.mindfulness;
  }
  return DEMO_SUGGESTIONS.default;
}

export default function AIHabitGenerator({ onAddHabits, onClose }) {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    const validation = validateAIGoal(goal);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = getSuggestionsForGoal(goal);
    setSuggestions(results);
    setSelected(results.map((_, i) => i)); // Select all by default
    setLoading(false);
  };

  const toggleSelect = (index) => {
    setSelected(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleAddSelected = () => {
    const habitsToAdd = selected.map(i => suggestions[i]);
    onAddHabits(habitsToAdd);
  };

  const handleRegenerate = () => {
    setSuggestions(null);
    setSelected([]);
    setGoal('');
  };

  return (
    <div className="ai-generator">
      {!suggestions && !loading && (
        <>
          <p className="text-muted mb-2" style={{ marginBottom: '1rem' }}>
            Describe what you'd like to improve, and we'll suggest habits for you.
          </p>
          <div className="ai-generator-input">
            <textarea
              className="form-input form-textarea"
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setError(null); }}
              placeholder="e.g., I want to become healthier and exercise more..."
              rows={3}
              autoFocus
            />
            {error && <span className="form-error" style={{ marginTop: '0.5rem', display: 'block' }}>{error}</span>}
          </div>
          <button 
            className="btn btn-primary btn-full" 
            onClick={handleGenerate}
            disabled={!goal.trim()}
          >
            ✨ Generate suggestions
          </button>
        </>
      )}
      
      {loading && (
        <div className="ai-loading">
          <div className="spinner spinner-lg" />
          <span className="ai-loading-text">Generating habit suggestions...</span>
        </div>
      )}
      
      {suggestions && !loading && (
        <>
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            Select the habits you'd like to add:
          </p>
          <div className="ai-suggestions">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`ai-suggestion-card ${selected.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleSelect(index)}
                role="checkbox"
                aria-checked={selected.includes(index)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSelect(index); }}
              >
                <div className="ai-suggestion-check" />
                <div className="ai-suggestion-info">
                  <h4>{suggestion.name}</h4>
                  <p>{suggestion.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-primary btn-full" 
              onClick={handleAddSelected}
              disabled={selected.length === 0}
            >
              Add {selected.length} habit{selected.length !== 1 ? 's' : ''}
            </button>
            <button className="btn btn-secondary" onClick={handleRegenerate}>
              Retry
            </button>
          </div>
        </>
      )}
    </div>
  );
}
