/**
 * Streak calculation utilities for Habitly
 * 
 * Streak rules:
 * - Current streak counts consecutive completed days ending today or yesterday
 * - If today is not completed but yesterday was, the streak is still active
 *   (it will break at end of today if not completed)
 * - Longest streak is the maximum consecutive days ever achieved
 */

import { getToday, getDaysAgo, parseDate, formatDate } from './dateUtils';

/**
 * Check if a habit was completed on a specific date
 */
export function isCompletedOn(completions, dateStr) {
  return completions.some(function(c) { return c.completed_date === dateStr; });
}

/**
 * Check if a habit is completed today
 */
export function isCompletedToday(completions) {
  return isCompletedOn(completions, getToday());
}

/**
 * Calculate current streak (consecutive days up to today or yesterday)
 * Returns the number of consecutive days
 */
export function calculateCurrentStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const today = getToday();
  const completedToday = isCompletedToday(completions);
  
  let streak = 0;
  const startOffset = completedToday ? 0 : 1;
  
  for (let i = startOffset; i < 365 + startOffset; i++) {
    const dateStr = getDaysAgo(i);
    if (isCompletedOn(completions, dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate longest streak ever achieved
 */
export function calculateLongestStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const sortedDates = completions
    .map(function(c) { return c.completed_date; })
    .sort();
  
  if (sortedDates.length === 0) return 0;
  
  let longest = 1;
  let current = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = parseDate(sortedDates[i - 1]);
    const currDate = parseDate(sortedDates[i]);
    const diffMs = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  
  return longest;
}

/**
 * Calculate completion percentage over a period
 */
export function calculateCompletionRate(completions, days, createdAt) {
  if (days === undefined) days = 30;
  if (!completions || completions.length === 0) return 0;
  
  const today = new Date();
  const createdDate = createdAt ? parseDate(createdAt) : new Date(0);
  
  const daysSinceCreation = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const effectiveDays = Math.min(days, daysSinceCreation);
  
  if (effectiveDays <= 0) return 0;
  
  const startDate = getDaysAgo(effectiveDays - 1);
  const completionsInPeriod = completions.filter(function(c) { 
    return c.completed_date >= startDate; 
  }).length;
  
  return Math.round((completionsInPeriod / effectiveDays) * 100);
}

/**
 * Get completion data for a specific date range
 */
export function getCompletionMap(completions, startDate, endDate) {
  var map = {};
  var relevantCompletions = completions.filter(function(c) { 
    return c.completed_date >= startDate && c.completed_date <= endDate;
  });
  
  relevantCompletions.forEach(function(c) {
    map[c.completed_date] = true;
  });
  
  return map;
}
