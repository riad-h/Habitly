/**
 * Dashboard — main page showing today's habits
 * HabitFlow-inspired design with habit rows and stat cards
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { getGreeting, getToday } from '../utils/dateUtils';
import HabitForm from '../components/HabitForm';
import AIHabitGenerator from '../components/AIHabitGenerator';
import Modal from '../components/Modal';

// SVG Icons
const Icons = {
  check: (
    <svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>
  ),
  flame: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"/><path d="M5 12h14"/>
    </svg>
  ),
  sparkle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  ),
  leaf: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
};

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    habits, loading, 
    createHabit, updateHabit, deleteHabit, 
    toggleCompletion, getHabitStats, getOverallStats 
  } = useHabits();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'Friend';
  const stats = getOverallStats();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateHabit = async (data) => {
    setFormLoading(true);
    const result = await createHabit(data);
    setFormLoading(false);
    if (result.error) {
      showToast('Failed to create habit.', 'error');
    } else {
      setShowCreateModal(false);
      showToast('Habit created!');
    }
  };

  const handleUpdateHabit = async (data) => {
    setFormLoading(true);
    const result = await updateHabit(editingHabit.id, data);
    setFormLoading(false);
    if (result.error) {
      showToast('Failed to update habit.', 'error');
    } else {
      setEditingHabit(null);
      showToast('Habit updated!');
    }
  };

  const handleDeleteHabit = async () => {
    const result = await deleteHabit(deletingHabit.id);
    if (result.error) {
      showToast('Failed to delete habit.', 'error');
    } else {
      setDeletingHabit(null);
      showToast('Habit deleted.');
    }
  };

  const handleToggle = async (habitId) => {
    const result = await toggleCompletion(habitId);
    if (result.error) showToast('Something went wrong.', 'error');
  };

  const handleAIAddHabits = async (habitsToAdd) => {
    setFormLoading(true);
    let added = 0;
    for (const habit of habitsToAdd) {
      const result = await createHabit({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        color: '#23854f',
        target_days: [0, 1, 2, 3, 4, 5, 6],
      });
      if (!result.error) added++;
    }
    setFormLoading(false);
    setShowAIModal(false);
    showToast(`${added} habit${added !== 1 ? 's' : ''} added!`);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spin spin-lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="h1" style={{ marginBottom: '4px' }}>
          {getGreeting()}, {displayName}
        </h1>
        <p className="muted" style={{ fontSize: '14px' }}>
          {habits.length === 0 
            ? 'Start your journey with one small habit.' 
            : `${stats.completedToday} of ${stats.totalToday} habits done today`
          }
        </p>
      </div>

      {/* Stats */}
      {habits.length > 0 && (
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: 'var(--leaf)' }}>
              {stats.completedToday}/{stats.totalToday}
            </div>
            <div className="stat-label">Completed today</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: 'var(--gold)' }}>
              🔥 {stats.longestStreak}
            </div>
            <div className="stat-label">Best streak</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ color: 'var(--teal)' }}>
              {stats.completionRate}%
            </div>
            <div className="stat-label">This month</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {habits.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div className="bar">
            <div 
              className="bar-i" 
              style={{ 
                width: `${stats.totalToday > 0 ? (stats.completedToday / stats.totalToday) * 100 : 0}%`,
                background: 'var(--leaf)'
              }} 
            />
          </div>
        </div>
      )}

      {/* Habits Section */}
      {habits.length > 0 ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head">
            <h2 className="h2">Today's habits</h2>
            <div className="row-s">
              <button className="btn btn-ghost btn-s" onClick={() => setShowAIModal(true)}>
                {Icons.sparkle}
                <span>AI</span>
              </button>
              <button className="btn btn-primary btn-s" onClick={() => setShowCreateModal(true)}>
                {Icons.plus}
                <span>New</span>
              </button>
            </div>
          </div>
          
          <div>
            {habits.map(habit => {
              const habitStats = getHabitStats(habit.id);
              return (
                <div key={habit.id} className={`habit-row ${habitStats.completedToday ? 'completed' : ''}`}>
                  <button
                    className={`checkbtn ${habitStats.completedToday ? 'on' : ''}`}
                    onClick={() => handleToggle(habit.id)}
                    aria-label={habitStats.completedToday ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
                    style={{ '--cb': habit.color || 'var(--leaf)' }}
                  >
                    {Icons.check}
                  </button>
                  
                  <div className="habit-info">
                    <div className="habit-name">{habit.name}</div>
                    {habit.description && (
                      <div className="habit-desc">{habit.description}</div>
                    )}
                  </div>
                  
                  {habitStats.currentStreak > 0 && (
                    <div className="streak-badge">
                      <span className="flame-live">{Icons.flame}</span>
                      {habitStats.currentStreak}d
                    </div>
                  )}
                  
                  <div className="habit-actions">
                    <button 
                      className="btn btn-ghost btn-s"
                      onClick={() => setEditingHabit(habit)}
                      aria-label={`Edit ${habit.name}`}
                    >
                      {Icons.edit}
                    </button>
                    <button 
                      className="btn btn-ghost btn-s"
                      onClick={() => setDeletingHabit(habit)}
                      aria-label={`Delete ${habit.name}`}
                      style={{ color: 'var(--coral)' }}
                    >
                      {Icons.trash}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty">
            <div className="floaty">{Icons.leaf}</div>
            <h2 className="h2">No habits yet</h2>
            <p className="muted" style={{ fontSize: '14px', maxWidth: '320px' }}>
              What's one thing you'd like to improve? Start with one small habit.
            </p>
            <div className="row-s" style={{ marginTop: '8px' }}>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                {Icons.plus}
                Create habit
              </button>
              <button className="btn btn-ghost" onClick={() => setShowAIModal(true)}>
                {Icons.sparkle}
                Create with AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New habit"
      >
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowCreateModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Edit habit"
      >
        {editingHabit && (
          <HabitForm
            habit={editingHabit}
            onSubmit={handleUpdateHabit}
            onCancel={() => setEditingHabit(null)}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        title="Delete habit"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeletingHabit(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteHabit}>Delete</button>
          </>
        }
      >
        {deletingHabit && (
          <p className="soft" style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>"{deletingHabit.name}"</strong>? 
            This will also remove all completion history.
          </p>
        )}
      </Modal>

      {/* AI Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="Create with AI"
      >
        <AIHabitGenerator onAddHabits={handleAIAddHabits} onClose={() => setShowAIModal(false)} />
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="toast-stack">
          <div className={`toast-item card`}>
            <div className="toast-msg">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
