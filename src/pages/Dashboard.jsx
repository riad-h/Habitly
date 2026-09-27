/**
 * Dashboard — main page showing today's habits
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import { getGreeting, formatDisplayDate, getToday } from '../utils/dateUtils';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import AIHabitGenerator from '../components/AIHabitGenerator';
import Modal from '../components/Modal';

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
      showToast('Failed to create habit. Please try again.', 'error');
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
    if (result.error) {
      showToast('Something went wrong.', 'error');
    }
  };

  const handleAIAddHabits = async (habitsToAdd) => {
    setFormLoading(true);
    let added = 0;
    for (const habit of habitsToAdd) {
      const result = await createHabit({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        color: '#171717',
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
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">
          {getGreeting()}, {displayName}
        </h1>
        <p className="dashboard-date">
          Today — {formatDisplayDate(getToday())}
        </p>
      </div>

      {/* Stats */}
      {habits.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.completedToday}/{stats.totalToday}</div>
            <div className="stat-label">Completed today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">🔥 {stats.longestStreak}</div>
            <div className="stat-label">Best streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">This month</div>
          </div>
        </div>
      )}

      {/* Today's Progress Bar */}
      {habits.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${stats.totalToday > 0 ? (stats.completedToday / stats.totalToday) * 100 : 0}%` }} 
            />
          </div>
        </div>
      )}

      {/* Habits Section */}
      {habits.length > 0 ? (
        <>
          <div className="section-header">
            <h2 className="section-title">Today's habits</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAIModal(true)}>
                ✨ AI
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(true)}>
                + New
              </button>
            </div>
          </div>
          
          <div className="habit-list">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                stats={getHabitStats(habit.id)}
                onToggle={handleToggle}
                onEdit={setEditingHabit}
                onDelete={setDeletingHabit}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◉</div>
          <h2 className="empty-state-title">No habits yet</h2>
          <p className="empty-state-text">
            What's one thing you'd like to improve? Start with one small habit.
          </p>
          <div className="empty-state-actions">
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              Create habit
            </button>
            <button className="btn btn-secondary" onClick={() => setShowAIModal(true)}>
              ✨ Create with AI
            </button>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        title="Delete habit"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeletingHabit(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" style={{ background: 'var(--error)' }} onClick={handleDeleteHabit}>
              Delete
            </button>
          </>
        }
      >
        {deletingHabit && (
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete <strong>"{deletingHabit.name}"</strong>? 
            This will also remove all completion history. This action cannot be undone.
          </p>
        )}
      </Modal>

      {/* AI Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="Create with AI"
      >
        <AIHabitGenerator
          onAddHabits={handleAIAddHabits}
          onClose={() => setShowAIModal(false)}
        />
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
