/**
 * localStorage-based storage for demo/offline mode
 * 
 * This provides the same interface as the Supabase operations
 * but stores everything in the browser's localStorage.
 * Used when Supabase is not configured.
 */

import { getToday } from '../utils/dateUtils';

const STORAGE_KEYS = {
  USERS: 'habitly_users',
  CURRENT_USER: 'habitly_current_user',
  HABITS: 'habitly_habits',
  COMPLETIONS: 'habitly_completions',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getStore(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============ AUTH ============

export async function signUp(email, password) {
  const users = getStore(STORAGE_KEYS.USERS);
  
  if (users.find(u => u.email === email)) {
    return { error: { message: 'An account with this email already exists' } };
  }
  
  const user = {
    id: generateId(),
    email,
    password, // In demo mode only - never do this in production
    display_name: email.split('@')[0],
    created_at: new Date().toISOString(),
  };
  
  users.push(user);
  setStore(STORAGE_KEYS.USERS, users);
  
  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  
  return { data: { user: safeUser }, error: null };
}

export async function signIn(email, password) {
  const users = getStore(STORAGE_KEYS.USERS);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { error: { message: 'Invalid email or password' } };
  }
  
  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  
  return { data: { user: safeUser }, error: null };
}

export async function signOut() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return { error: null };
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function onAuthStateChange(callback) {
  // In demo mode, just call with current user
  const user = getCurrentUser();
  callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
  
  // Return unsubscribe function (noop in demo mode)
  return { data: { subscription: { unsubscribe: () => {} } } };
}

// ============ HABITS ============

export async function getHabits(userId) {
  const habits = getStore(STORAGE_KEYS.HABITS);
  return { data: habits.filter(h => h.user_id === userId && !h.archived), error: null };
}

export async function getAllHabitsIncludingArchived(userId) {
  const habits = getStore(STORAGE_KEYS.HABITS);
  return { data: habits.filter(h => h.user_id === userId), error: null };
}

export async function createHabit(habit) {
  const habits = getStore(STORAGE_KEYS.HABITS);
  const newHabit = {
    id: generateId(),
    ...habit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    archived: false,
  };
  habits.push(newHabit);
  setStore(STORAGE_KEYS.HABITS, habits);
  return { data: newHabit, error: null };
}

export async function updateHabit(habitId, userId, updates) {
  const habits = getStore(STORAGE_KEYS.HABITS);
  const index = habits.findIndex(h => h.id === habitId && h.user_id === userId);
  
  if (index === -1) {
    return { error: { message: 'Habit not found' } };
  }
  
  habits[index] = { ...habits[index], ...updates, updated_at: new Date().toISOString() };
  setStore(STORAGE_KEYS.HABITS, habits);
  return { data: habits[index], error: null };
}

export async function deleteHabit(habitId, userId) {
  const habits = getStore(STORAGE_KEYS.HABITS);
  const filtered = habits.filter(h => !(h.id === habitId && h.user_id === userId));
  setStore(STORAGE_KEYS.HABITS, filtered);
  
  // Also delete completions
  const completions = getStore(STORAGE_KEYS.COMPLETIONS);
  const filteredCompletions = completions.filter(c => !(c.habit_id === habitId && c.user_id === userId));
  setStore(STORAGE_KEYS.COMPLETIONS, filteredCompletions);
  
  return { error: null };
}

export async function archiveHabit(habitId, userId) {
  return updateHabit(habitId, userId, { archived: true });
}

// ============ COMPLETIONS ============

export async function getCompletions(userId, habitId) {
  const completions = getStore(STORAGE_KEYS.COMPLETIONS);
  let filtered = completions.filter(c => c.user_id === userId);
  if (habitId) {
    filtered = filtered.filter(c => c.habit_id === habitId);
  }
  return { data: filtered, error: null };
}

export async function toggleCompletion(habitId, userId, date) {
  const completions = getStore(STORAGE_KEYS.COMPLETIONS);
  const existing = completions.find(
    c => c.habit_id === habitId && c.user_id === userId && c.completed_date === date
  );
  
  if (existing) {
    // Remove completion
    const filtered = completions.filter(c => c.id !== existing.id);
    setStore(STORAGE_KEYS.COMPLETIONS, filtered);
    return { data: null, error: null, toggled: false };
  } else {
    // Add completion
    const newCompletion = {
      id: generateId(),
      habit_id: habitId,
      user_id: userId,
      completed_date: date || getToday(),
      created_at: new Date().toISOString(),
    };
    completions.push(newCompletion);
    setStore(STORAGE_KEYS.COMPLETIONS, completions);
    return { data: newCompletion, error: null, toggled: true };
  }
}

export async function completeHabit(habitId, userId, date) {
  const completions = getStore(STORAGE_KEYS.COMPLETIONS);
  
  // Check for duplicate
  const exists = completions.find(
    c => c.habit_id === habitId && c.user_id === userId && c.completed_date === date
  );
  
  if (exists) {
    return { data: exists, error: null };
  }
  
  const newCompletion = {
    id: generateId(),
    habit_id: habitId,
    user_id: userId,
    completed_date: date || getToday(),
    created_at: new Date().toISOString(),
  };
  completions.push(newCompletion);
  setStore(STORAGE_KEYS.COMPLETIONS, completions);
  return { data: newCompletion, error: null };
}

export async function uncompleteHabit(habitId, userId, date) {
  const completions = getStore(STORAGE_KEYS.COMPLETIONS);
  const filtered = completions.filter(
    c => !(c.habit_id === habitId && c.user_id === userId && c.completed_date === date)
  );
  setStore(STORAGE_KEYS.COMPLETIONS, filtered);
  return { error: null };
}

// ============ PROFILE ============

export async function getProfile(userId) {
  const users = getStore(STORAGE_KEYS.USERS);
  const user = users.find(u => u.id === userId);
  if (!user) return { data: null, error: { message: 'User not found' } };
  const { password, ...profile } = user;
  return { data: profile, error: null };
}

export async function updateProfile(userId, updates) {
  const users = getStore(STORAGE_KEYS.USERS);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return { error: { message: 'User not found' } };
  
  users[index] = { ...users[index], ...updates, updated_at: new Date().toISOString() };
  setStore(STORAGE_KEYS.USERS, users);
  
  // Update current user in storage too
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password: _, ...safeUser } = users[index];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
  }
  
  const { password: __, ...profile } = users[index];
  return { data: profile, error: null };
}
