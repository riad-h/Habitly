# 📘 Habitly — Complete Setup Guide

> **For teachers, students, and non-developers**  
> This guide walks you through everything step-by-step, from installing software to running the app.

---

## 📋 Table of Contents

1. [What is Habitly?](#1-what-is-habitly)
2. [What You Need to Install](#2-what-you-need-to-install)
3. [Setting Up Supabase (Database)](#3-setting-up-supabase-database)
4. [Setting Up the Project](#4-setting-up-the-project)
5. [Running the App](#5-running-the-app)
6. [Understanding the Code](#6-understanding-the-code)
7. [Making Changes](#7-making-changes)
8. [Deploying Online](#8-deploying-online)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. What is Habitly?

Habitly is a **habit tracking web application**. It helps users:

- ✅ Create daily habits (like "Read for 20 minutes" or "Exercise")
- ✅ Mark habits as done each day
- ✅ See streaks (how many days in a row)
- ✅ View history on a calendar
- ✅ Get AI-generated habit suggestions

### How It Works (Simple Explanation)

```
User opens website
    ↓
User creates account (stored in Supabase database)
    ↓
User creates habits (stored in database)
    ↓
User clicks habit to mark it done (stored in database)
    ↓
App shows streaks and calendar (calculated from database)
```

### Technology Used

| Part | Technology | What It Does |
|------|-----------|--------------|
| **Frontend** | React.js + JavaScript | The user interface (what you see) |
| **Styling** | Pure CSS | Makes it look good |
| **Backend** | Node.js | Handles AI requests |
| **Database** | Supabase | Stores user data and habits |
| **AI** | Grok API | Generates habit suggestions |

---

## 2. What You Need to Install

### Step 1: Install Node.js

Node.js is the software that runs JavaScript code.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer
4. Verify installation:
   - Open **Terminal** (Mac) or **Command Prompt** (Windows)
   - Type: `node --version`
   - You should see something like: `v20.11.0`

### Step 2: Install a Code Editor

We recommend **Visual Studio Code** (free):

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download and install
3. Open the Habitly folder in VS Code

### Step 3: Create a Supabase Account

Supabase is where all the data is stored (users, habits, completions).

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new project:
   - **Name:** `habitly` (or anything you like)
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to you
5. Wait for the project to be ready (takes ~2 minutes)

### Step 4: Get Your Supabase Keys

Once your project is ready:

1. In Supabase dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"API"**
3. You'll see:
   - **Project URL** — looks like `https://abc123.supabase.co`
   - **anon public key** — a long string starting with `eyJ...`
4. Copy both of these — you'll need them soon!

---

## 3. Setting Up Supabase (Database)

### Step 1: Run the Database Setup

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase/migrations/001_initial_schema.sql` in your code editor
4. Copy ALL the content
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
7. You should see "Success. No rows returned"

### Step 2: Enable Email Authentication

1. In Supabase dashboard, click **"Authentication"** (left sidebar)
2. Click **"Providers"**
3. Make sure **"Email"** is enabled (it should be by default)
4. Optional: Disable "Confirm email" for easier testing:
   - Click **"Email"** provider
   - Turn off **"Confirm email"**
   - Click **"Save"**

### Step 3: Verify Tables Were Created

1. Click **"Table Editor"** (left sidebar)
2. You should see these tables:
   - `profiles`
   - `habits`
   - `habit_completions`

If you see all three tables, your database is ready! ✅

---

## 4. Setting Up the Project

### Step 1: Download the Project

If you have the project as a ZIP file:
1. Extract it to a folder you can easily find (like Desktop)
2. Open the folder in VS Code

If you're cloning from GitHub:
```bash
git clone https://github.com/YOUR_USERNAME/habitly.git
cd habitly
```

### Step 2: Install Dependencies

Open Terminal in the project folder and run:

```bash
npm install
```

This downloads all the required packages. It takes 1-2 minutes.

You'll see a `node_modules` folder appear — this is normal!

### Step 3: Create Your Environment File

1. In the project folder, find the file `.env.example`
2. **Copy** this file and rename the copy to `.env`
   - Mac/Linux: `cp .env.example .env`
   - Windows: `copy .env.example .env`
   - Or just use VS Code: right-click → "Copy" → paste → rename to `.env`

3. Open `.env` and fill in your values:

```env
# Paste your Supabase Project URL here
VITE_SUPABASE_URL=https://abc123.supabase.co

# Paste your Supabase anon key here
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Grok API key for AI features
GROK_API_KEY=

# Server port
PORT=5000
```

**Important:**
- Replace the example values with your REAL Supabase URL and key
- If you don't have a Grok API key, leave it empty (AI features won't work, but everything else will)
- NEVER share or commit your `.env` file!

---

## 5. Running the App

### Step 1: Start the Frontend

In Terminal, make sure you're in the project folder, then run:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 2: Open in Browser

Open your web browser and go to:

**http://localhost:3000**

You should see the Habitly login page! 🎉

### Step 3: Create Your First Account

1. Click **"Create one"** (or "Sign up")
2. Enter your email and a password (at least 6 characters)
3. Click **"Create account"**
4. You'll be taken to the dashboard

### Step 4: Create Your First Habit

1. Click **"Create habit"**
2. Enter a name like "Read for 20 minutes"
3. Add a description (optional)
4. Choose frequency (daily or custom days)
5. Pick a color
6. Click **"Create habit"**
7. Your habit appears on the dashboard!

### Step 5: Mark a Habit as Done

Click the circle next to your habit. It fills in with a checkmark ✓

### Step 6: View Your History

Click **"History"** in the top navigation to see your calendar view.

---

## 6. Understanding the Code

### Project Structure (What Each Folder Does)

```
habitly/
│
├── src/                      ← Frontend code (what users see)
│   ├── App.jsx              ← Main app component
│   ├── main.jsx             ← Entry point
│   ├── index.css            ← All styling
│   │
│   ├── components/          ← Reusable UI pieces
│   │   ├── Navbar.jsx       ← Top navigation bar
│   │   ├── HabitCard.jsx    ← One habit on the dashboard
│   │   ├── HabitForm.jsx    ← Form to create/edit habits
│   │   ├── HabitCalendar.jsx← Calendar view
│   │   ├── AIHabitGenerator.jsx ← AI suggestion feature
│   │   └── Modal.jsx        ← Popup dialog
│   │
│   ├── pages/               ← Full page screens
│   │   ├── Login.jsx        ← Login page
│   │   ├── Signup.jsx       ← Signup page
│   │   ├── Dashboard.jsx    ← Main page (today's habits)
│   │   ├── History.jsx      ← Calendar & stats page
│   │   └── Profile.jsx      ← User profile page
│   │
│   ├── hooks/               ← Custom React logic
│   │   ├── useAuth.jsx      ← Login/signup/logout logic
│   │   └── useHabits.js     ← Habit CRUD operations
│   │
│   ├── lib/                 ← External service connections
│   │   ├── supabase.js      ← Supabase configuration
│   │   ├── storage.js       ← Demo mode (localStorage)
│   │   └── api.js           ← Backend API calls
│   │
│   └── utils/               ← Helper functions
│       ├── dateUtils.js     ← Date formatting
│       ├── streakUtils.js   ← Streak calculations
│       └── validation.js    ← Input validation
│
├── server/                   ← Backend code (AI features)
│   ├── server.js            ← Main server file
│   ├── routes/
│   │   └── ai.js            ← AI habit generation
│   └── middleware/
│       └── auth.js          ← Authentication checks
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql ← Database setup
│
├── .env                      ← Your secrets (NOT in Git)
├── .env.example              ← Template file
├── package.json              ← Project configuration
└── README.md                 ← Project documentation
```

### Key Concepts Explained

#### React Components
Every `.jsx` file is a **React component** — a reusable piece of UI.

Example: `HabitCard.jsx` shows one habit with its name, streak, and a checkbox.

#### Hooks
Hooks (files starting with `use`) contain **logic** that components use.

Example: `useAuth.jsx` handles login, signup, and checking if a user is logged in.

#### CSS Variables
In `index.css`, you'll see `:root { ... }` at the top. These are **CSS variables** that control colors and spacing across the entire app.

```css
:root {
  --background: #ffffff;    /* Page background color */
  --text: #171717;          /* Text color */
  --accent: #171717;        /* Button color */
  --success: #16a34a;       /* Green for completed habits */
}
```

#### Supabase Tables
- **profiles** — User information (name, email)
- **habits** — The habits users create
- **habit_completions** — Records of when habits were completed

---

## 7. Making Changes

### Change the App Name

1. Open `index.html`
2. Find `<title>Habitly — Minimalist Habit Tracker</title>`
3. Change "Habitly" to your app name

Also update `src/components/Navbar.jsx`:
```jsx
<span className="navbar-brand">Habitly</span>
// Change to:
<span className="navbar-brand">YourAppName</span>
```

### Change Colors

Open `src/index.css` and modify the `:root` variables:

```css
:root {
  --background: #f0f4f8;    /* Light blue background */
  --accent: #3b82f6;         /* Blue buttons */
  --success: #10b981;        /* Green for completed */
}
```

### Add a New Habit Field

1. **Database:** Add column in Supabase SQL Editor
2. **Form:** Update `src/components/HabitForm.jsx`
3. **Display:** Update `src/components/HabitCard.jsx`
4. **Storage:** Update `src/lib/storage.js`

### Change the Greeting

Open `src/pages/Dashboard.jsx` and find:

```jsx
<h1 className="dashboard-greeting">
  {getGreeting()}, {displayName}
</h1>
```

Change to whatever you like!

---

## 8. Deploying Online

### Option A: Deploy Frontend to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click **"New Project"**
5. Import your GitHub repository
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **"Deploy"**
8. Your site is live! 🎉

### Option B: Deploy to Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Drag and drop the `dist/` folder
3. Or connect your GitHub repo
4. Add environment variables in Site Settings
5. Deploy!

### Option C: Deploy Backend (for AI features)

If you want AI features to work online:

1. Use [Railway](https://railway.app) or [Render](https://render.com)
2. Connect your GitHub repo
3. Set the root directory to `server/`
4. Add environment variable: `GROK_API_KEY`
5. Deploy
6. Update `VITE_API_URL` in your frontend to point to the backend URL

---

## 9. Troubleshooting

### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "Invalid API key" or "Failed to fetch"

- Check that `.env` file exists (not `.env.example`)
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart the dev server after changing `.env`

### "User already registered"

- You already have an account with that email
- Use a different email or log in instead

### Blank page after login

- Open browser console (F12)
- Check for errors
- Verify Supabase tables exist (Table Editor)
- Check that RLS policies are enabled

### AI features not working

- Make sure `GROK_API_KEY` is set in `.env`
- Start the backend: `node server/server.js`
- Check that `VITE_API_URL` points to the backend

### Port 3000 already in use

```bash
# Kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📚 Additional Resources

- **React Documentation:** [https://react.dev](https://react.dev)
- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Node.js Documentation:** [https://nodejs.org/docs](https://nodejs.org/docs)
- **CSS Tutorial:** [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 🆘 Need Help?

If you're stuck:

1. Check the error message carefully
2. Search the error on Google or Stack Overflow
3. Check the [README.md](./README.md) for more technical details
4. Ask a developer friend or teacher

---

**Remember:** Every developer was a beginner once. Take it one step at a time! 🚀
