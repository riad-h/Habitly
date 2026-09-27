/**
 * useHabits hook — manages habit CRUD and completions
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as storage from '../lib/storage';
import { getToday } from '../utils/dateUtils';
import { 
  calculateCurrentStreak, 
  calculateLongestStreak, 
  calculateCompletionRate,
  isCompletedToday 
} from '../utils/streakUtils';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({}); // { habitId: [completions] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // Load habits and completions
  const loadData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: habitsData, error: habitsError } = await storage.getHabits(userId);
      if (habitsError) throw habitsError;
      
      setHabits(habitsData || []);
      
      // Load completions for each habit
      const { data: allCompletions } = await storage.getCompletions(userId);
      const completionsMap = {};
      
      (allCompletions || []).forEach(c => {
        if (!completionsMap[c.habit_id]) {
          completionsMap[c.habit_id] = [];
        }
        completionsMap[c.habit_id].push(c);
      });
      
      setCompletions(completionsMap);
    } catch (err) {
      setError('Failed to load habits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create a new habit
  const createHabit = async (habitData) => {
    const { data, error: err } = await storage.createHabit({
      ...habitData,
      user_id: userId,
    });
    
    if (err) {
      setError('Failed to create habit');
      return { error: err };
    }
    
    setHabits(prev => [...prev, data]);
    return { data };
  };

  // Update a habit
  const updateHabit = async (habitId, updates) => {
    const { data, error: err } = await storage.updateHabit(habitId, userId, updates);
    
    if (err) {
      setError('Failed to update habit');
      return { error: err };
    }
    
    setHabits(prev => prev.map(h => h.id === habitId ? data : h));
    return { data };
  };

  // Delete a habit
  const deleteHabit = async (habitId) => {
    const { error: err } = await storage.deleteHabit(habitId, userId);
    
    if (err) {
      setError('Failed to delete habit');
      return { error: err };
    }
    
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => {
      const next = { ...prev };
      delete next[habitId];
      return next;
    });
    return { error: null };
  };

  // Toggle completion for today
  const toggleCompletion = async (habitId) => {
    const today = getToday();
    const { data, toggled, error: err } = await storage.toggleCompletion(habitId, userId, today);
    
    if (err) {
      setError('Failed to update completion');
      return { error: err };
    }
    
    // Update local state
    setCompletions(prev => {
      const habitCompletions = prev[habitId] || [];
      
      if (toggled) {
        return { ...prev, [habitId]: [...habitCompletions, data] };
      } else {
        return { 
          ...prev, 
          [habitId]: habitCompletions.filter(c => c.completed_date !== today) 
        };
      }
    });
    
    return { toggled };
  };

  // Get habit stats
  const getHabitStats = (habitId) => {
    const habitCompletions = completions[habitId] || [];
    const habit = habits.find(h => h.id === habitId);
    
    return {
      currentStreak: calculateCurrentStreak(habitCompletions),
      longestStreak: calculateLongestStreak(habitCompletions),
      completionRate: calculateCompletionRate(habitCompletions, 30, habit?.created_at),
      completedToday: isCompletedToday(habitCompletions),
      completions: habitCompletions,
    };
  };

  // Get overall stats
  const getOverallStats = () => {
    if (habits.length === 0) {
      return { currentStreak: 0, longestStreak: 0, completionRate: 0, completedToday: 0, totalToday: 0 };
    }
    
    let completedCount = 0;
    let longestStreak = 0;
    
    habits.forEach(h => {
      const stats = getHabitStats(h.id);
      if (stats.completedToday) completedCount++;
      longestStreak = Math.max(longestStreak, stats.longestStreak);
    });
    
    return {
      completedToday: completedCount,
      totalToday: habits.length,
      longestStreak,
      completionRate: Math.round((completedCount / habits.length) * 100),
    };
  };

  // Get completions for a habit (for calendar/history)
  const getHabitCompletions = (habitId) => {
    return completions[habitId] || [];
  };

  return {
    habits,
    completions,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getHabitStats,
    getOverallStats,
    getHabitCompletions,
    refresh: loadData,
  };
}
