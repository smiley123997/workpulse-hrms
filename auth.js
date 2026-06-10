/* ============================================================
   WorkPulse HRMS — Auth & User Store
   All pages load this first via <script src="js/auth.js">
   ============================================================ */

// ── USER DATABASE (demo — in production replace with API) ────
var USERS = [
  {
    id: 'WP-0001',
    name: 'HR Manager',
    email: 'admin@workpulse.io',
    password: 'admin123',
    role: 'admin',
    dept: 'HR',
    designation: 'HR Administrator',
    initials: 'HR',
    joinDate: 'Jan 1, 2018'
  },
  {
    id: 'WP-1001',
    name: 'Arjun Kumar',
    email: 'arjun@workpulse.io',
    password: 'arjun123',
    role: 'employee',
    dept: 'Engineering',
    designation: 'Software Engineer',
    initials: 'AK',
    joinDate: 'Apr 1, 2022'
  },
  {
    id: 'WP-1002',
    name: 'Priya Sharma',
    email: 'priya@workpulse.io',
    password: 'priya123',
    role: 'employee',
    dept: 'HR',
    designation: 'HR Executive',
    initials: 'PS',
    joinDate: 'Jan 15, 2021'
  },
  {
    id: 'WP-1003',
    name: 'Ravi Shankar',
    email: 'ravi@workpulse.io',
    password: 'ravi123',
    role: 'employee',
    dept: 'Engineering',
    designation: 'Engineering Head',
    initials: 'RS',
    joinDate: 'Mar 10, 2019'
  },
  {
    id: 'WP-1004',
    name: 'Sneha Patel',
    email: 'sneha@workpulse.io',
    password: 'sneha123',
    role: 'employee',
    dept: 'Finance',
    designation: 'Finance Analyst',
    initials: 'SP',
    joinDate: 'Jul 20, 2022'
  },
  {
    id: 'WP-1005',
    name: 'Karan Singh',
    email: 'karan@workpulse.io',
    password: 'karan123',
    role: 'employee',
    dept: 'Sales',
    designation: 'Sales Executive',
    initials: 'KS',
    joinDate: 'Sep 5, 2023'
  }
];

// ── SESSION HELPERS ──────────────────────────────────────────

/**
 * Get the currently logged-in user object, or null.
 */
function getSession() {
  try {
    var raw = sessionStorage.getItem('wp_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear session and redirect to login.
 */
function logout() {
  sessionStorage.removeItem('wp_user');
  window.location.href = 'login.html';
}

// ── ROUTE GUARDS ─────────────────────────────────────────────

/**
 * Call on index.html — redirects to login if not logged in,
 * redirects to admin if user is admin.
 */
function requireEmployee() {
  var user = getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  if (user.role === 'admin') {
    window.location.href = 'admin.html';
    return null;
  }
  return user;
}

/**
 * Call on admin.html — redirects to login if not logged in,
 * redirects to index if user is not admin.
 */
function requireAdmin() {
  var user = getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  if (user.role !== 'admin') {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

// ── HOLIDAY STORE (localStorage so edits persist in session) ─
var DEFAULT_HOLIDAYS = [
  { id: 1, name: 'Eid al-Adha',       date: '2025-06-07', day: 'Saturday',  type: 'National' },
  { id: 2, name: 'Independence Day',   date: '2025-08-15', day: 'Friday',    type: 'National' },
  { id: 3, name: 'Onam',               date: '2025-09-05', day: 'Friday',    type: 'Regional' },
  { id: 4, name: 'Gandhi Jayanti',     date: '2025-10-02', day: 'Thursday',  type: 'National' },
  { id: 5, name: 'Diwali',             date: '2025-10-20', day: 'Monday',    type: 'National' },
  { id: 6, name: 'Christmas',          date: '2025-12-25', day: 'Thursday',  type: 'National' },
];

function getHolidays() {
  try {
    var raw = localStorage.getItem('wp_holidays');
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_HOLIDAYS));
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_HOLIDAYS));
  }
}

function saveHolidays(list) {
  localStorage.setItem('wp_holidays', JSON.stringify(list));
}

function formatHolidayDate(dateStr) {
  // "2025-08-15" → "Aug 15, 2025"
  try {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getDayName(dateStr) {
  try {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long' });
  } catch (e) {
    return '';
  }
}
