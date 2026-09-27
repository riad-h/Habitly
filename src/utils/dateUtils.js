/**
 * Date utility functions for Habitly
 * 
 * All dates are stored as 'YYYY-MM-DD' strings to avoid timezone issues.
 * This ensures that "today" is always the user's local calendar day.
 */

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getToday() {
  const now = new Date();
  return formatDate(now);
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string to a Date object (local time)
 */
export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get a friendly greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format date for display: "Monday, September 27"
 */
export function formatDisplayDate(date) {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Get the date N days ago as YYYY-MM-DD
 */
export function getDaysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return formatDate(date);
}

/**
 * Get the date N days from now as YYYY-MM-DD
 */
export function getDaysFromNow(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return formatDate(date);
}

/**
 * Get all dates between two dates (inclusive)
 */
export function getDateRange(startStr, endStr) {
  const dates = [];
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Get calendar data for a specific month
 * Returns array of weeks, each week is array of day objects
 */
export function getCalendarMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  const weeks = [];
  let currentWeek = [];
  
  // Fill empty days before the first
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({ date: null, day: null, isCurrentMonth: false });
  }
  
  // Fill actual days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    currentWeek.push({
      date: formatDate(date),
      day,
      isCurrentMonth: true,
      isToday: formatDate(date) === getToday()
    });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Fill remaining days in last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, day: null, isCurrentMonth: false });
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
}

/**
 * Get month name
 */
export function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
}

/**
 * Day labels for calendar header (Sun-Sat)
 */
export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
