/**
 * Input validation utilities for Habitly
 */

/**
 * Validate habit name
 */
export function validateHabitName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Habit name is required' };
  }
  if (name.trim().length > 100) {
    return { valid: false, error: 'Habit name must be 100 characters or less' };
  }
  return { valid: true, error: null };
}

/**
 * Validate habit description
 */
export function validateHabitDescription(description) {
  if (description && description.length > 500) {
    return { valid: false, error: 'Description must be 500 characters or less' };
  }
  return { valid: true, error: null };
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
}

/**
 * Validate password
 */
export function validatePassword(password) {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true, error: null };
}

/**
 * Validate AI goal input
 */
export function validateAIGoal(goal) {
  if (!goal || goal.trim().length === 0) {
    return { valid: false, error: 'Please describe your goal' };
  }
  if (goal.trim().length > 500) {
    return { valid: false, error: 'Goal description must be 500 characters or less' };
  }
  return { valid: true, error: null };
}

/**
 * Validate AI response structure
 */
export function validateAIResponse(data) {
  if (!data || !Array.isArray(data.habits)) {
    return { valid: false, error: 'Invalid response from AI' };
  }
  
  for (const habit of data.habits) {
    if (!habit.name || typeof habit.name !== 'string') {
      return { valid: false, error: 'Invalid habit data from AI' };
    }
    if (habit.name.length > 100) {
      return { valid: false, error: 'AI generated invalid habit name' };
    }
  }
  
  if (data.habits.length > 10) {
    return { valid: false, error: 'Too many suggestions from AI' };
  }
  
  return { valid: true, error: null };
}
