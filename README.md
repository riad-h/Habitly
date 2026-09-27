# ◉ Habitly — Minimalist Habit Tracker

> "Did I do the habits I care about today?"

Habitly is a calm, minimal habit tracking application that helps you build consistency one day at a time. No clutter, no distractions — just your habits and your progress.

---

## 📖 What is Habitly?

Habitly is a web application for tracking daily habits. It helps you:

- ✅ **Create habits** you want to build (reading, exercise, meditation, etc.)
- ✅ **Track daily** — mark habits as done each day with one tap
- ✅ **See streaks** — watch your consistency grow with fire 🔥 streaks
- ✅ **View history** — a simple calendar showing your completion pattern
- ✅ **Get AI suggestions** — describe a goal and get habit ideas powered by Grok AI
- ✅ **Stay private** — all data is stored securely in your own Supabase database

### Who is this for?

Anyone who wants to build better habits without complicated tools. Students, professionals, teachers, parents — if you want to be more consistent, Habitly is for you.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (JavaScript/JSX) + Vite |
| **Styling** | Pure CSS (no frameworks) |
| **Backend** | Pure Node.js (built-in `http` module) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI** | Grok API (via Node.js backend) |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
habitly/
│
├── src/                          # Frontend (React)
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── HabitCard.tsx         # Individual habit display
│   │   ├── HabitForm.tsx         # Create/edit habit form
│   │   ├── HabitCalendar.tsx     # Monthly calendar view
│   │   ├── AIHabitGenerator.tsx  # AI suggestion interface
│   │   └── Modal.tsx             # Reusable modal dialog
│   │
│   ├── pages/                    # Page components
│   │   ├── Login.tsx             # Sign in page
│   │   ├── Signup.tsx            # Create account page
│   │   ├── Dashboard.tsx         # Main habit tracking page
│   │   ├── History.tsx           # Calendar & stats page
│   │   └── Profile.tsx           # User profile page
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.tsx           # Authentication state
│   │   └── useHabits.ts          # Habit data management
│   │
│   ├── lib/                      # Libraries & clients
│   │   ├── supabase.ts           # Supabase client config
│   │   ├── storage.ts            # localStorage demo mode
│   │   └── api.ts                # Backend API client
│   │
│   ├── utils/                    # Utility functions
│   │   ├── dateUtils.ts          # Date formatting & handling
│   │   ├── streakUtils.ts        # Streak calculations
│   │   └── validation.ts         # Input validation
│   │
│   ├── index.css                 # All styles (pure CSS)
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
│
├── server/                       # Backend (Node.js)
│   ├── server.js                 # HTTP server (pure Node.js)
│   ├── routes/
│   │   └── ai.js                 # AI endpoint (Grok API)
│   └── middleware/
│       └── auth.js               # Authentication middleware
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema + RLS
│
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI
│
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── vite.config.js                # Vite build config
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** version 18 or higher ([download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Supabase account** (free tier is fine) — [supabase.com](https://supabase.com)
- A **Grok API key** (for AI features) — [console.x.ai](https://console.x.ai)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/habitly.git
cd habitly
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and add your values:

```env
# Frontend — Get these from Supabase project settings
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Backend — Get from Grok/X.AI console
GROK_API_KEY=your-grok-api-key-here

# Server port (default: 5000)
PORT=5000
```

**Where to find these values:**

| Variable | Where to find it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon/public key |
| `GROK_API_KEY` | [console.x.ai](https://console.x.ai) → API Keys |

### Step 4: Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/)
2. Create a new project (or use an existing one)
3. Go to **SQL Editor** in the sidebar
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL Editor and click **Run**
6. Go to **Authentication → Providers** and make sure **Email** is enabled

That's it! The migration creates all tables, security policies, and triggers automatically.

### Step 5: Run the Application

You need to run **two things**: the frontend and the backend.

**Terminal 1 — Frontend (React):**
```bash
npm run dev
```
This starts the frontend at `http://localhost:3000`

**Terminal 2 — Backend (Node.js server):**
```bash
node server/server.js
```
This starts the API server at `http://localhost:5000`

### Step 6: Open in Browser

Go to `http://localhost:3000` and create your account!

---

## 🎮 Demo Mode

If you don't want to set up Supabase right away, Habitly works in **demo mode** automatically when no Supabase credentials are provided. In demo mode:

- All data is stored in your browser's localStorage
- No account needed — just start using it
- Data persists between page refreshes
- Data is cleared if you clear browser data

This is great for trying the app, testing, or demonstrations.

---

## 📦 Building for Production

### Build the Frontend

```bash
npm run build
```

This creates an optimized build in the `dist/` folder. You can serve this folder with any static hosting service.

### Start the Backend in Production

```bash
NODE_ENV=production node server/server.js
```

---

## 🌐 Deployment

### Recommended Architecture

```
Users → Static Host (Frontend) → Supabase (Database + Auth)
                                → Node.js Host (AI API)
```

### Frontend Deployment (Static)

The frontend is a static site. Deploy the `dist/` folder to any of these:

| Platform | How |
|----------|-----|
| **Vercel** | Connect GitHub repo → auto-deploys on push |
| **Netlify** | Drag & drop `dist/` folder or connect GitHub |
| **GitHub Pages** | Push `dist/` to `gh-pages` branch |
| **Cloudflare Pages** | Connect GitHub repo → auto-deploys |

**Important:** Set these environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (set to your backend URL, e.g., `https://your-api.railway.app/api`)

### Backend Deployment (Node.js)

The backend is a simple Node.js server. Deploy to any of these:

| Platform | How |
|----------|-----|
| **Railway** | Connect GitHub → set env vars → auto-deploys |
| **Render** | Connect GitHub → New Web Service → set env vars |
| **Fly.io** | `fly launch` → set secrets → `fly deploy` |

**Required environment variables on the server:**
- `GROK_API_KEY` — Your Grok API key
- `PORT` — The port (usually set by the platform)

### GitHub Secrets (for CI/CD)

If you want the GitHub Actions workflow to work properly, add these secrets:

Go to your repo → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value |
|--------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

Note: The CI workflow uses dummy values for building, so secrets aren't strictly required for the build to pass.

---

## 🔧 Troubleshooting

### "Unable to sign up" or "Unable to log in"
- Check that your Supabase project is active
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Make sure you ran the SQL migration in Supabase
- Check that Email auth provider is enabled in Supabase

### AI suggestions not working
- Verify `GROK_API_KEY` is set in the server's environment
- Make sure the backend server is running (`node server/server.js`)
- Check that `VITE_API_URL` points to your backend (if deployed separately)
- In demo mode, AI suggestions work without a backend (uses built-in suggestions)

### Page is blank after build
- Make sure `npm run build` completed without errors
- Check browser console for errors (F12 → Console)
- Verify environment variables are set correctly

### "Cannot connect to API" errors
- Make sure the backend server is running
- Check that the frontend's `VITE_API_URL` matches your backend URL
- For local development, the default is `/api` which proxies to the same origin

### Database errors
- Verify the SQL migration was run successfully
- Check that RLS policies are enabled on all tables
- Make sure you're using the `anon` key, not the `service_role` key in the frontend

---

## 🧪 Testing

The project includes tests for core utility functions. Run:

```bash
npm test
```

Key tested areas:
- Date formatting and handling
- Streak calculations (current streak, longest streak)
- Input validation (email, password, habit names)
- AI response validation

---

## 🔒 Security

Habitly follows security best practices:

- ✅ **Grok API key** is never exposed to the browser — it stays on the server
- ✅ **Row Level Security (RLS)** ensures users can only access their own data
- ✅ **Supabase Auth** handles authentication (no custom password storage)
- ✅ **Input validation** on both frontend and backend
- ✅ **AI response validation** — the server validates all AI output before sending to the client
- ✅ **Rate limiting** on AI endpoints (10 requests per user per day)
- ✅ **No secrets in Git** — `.env` is in `.gitignore`

---

## 📝 For Teachers & Non-Developers

### What does this project do?

Habitly is a web app that helps people track daily habits. Think of it like a digital checklist that remembers what you've done each day and shows you how consistent you've been.

### How does it work?

1. **User creates an account** — their data is stored securely in a cloud database (Supabase)
2. **User creates habits** — like "Read for 20 minutes" or "Exercise"
3. **Each day, user marks habits as done** — by clicking a circle
4. **The app tracks streaks** — how many days in a row they've done a habit
5. **AI can suggest habits** — if the user says "I want to be healthier", the AI suggests specific habits

### Can I modify this?

Yes! Here's what you might want to change:

| Change | Where to look |
|--------|--------------|
| Change colors | `src/index.css` — look for `:root` variables at the top |
| Change the app name | `index.html` (title) and `src/components/Navbar.tsx` |
| Add a new page | Create a file in `src/pages/` and add it to `src/App.tsx` |
| Change habit fields | `src/components/HabitForm.tsx` and the database migration |
| Change AI behavior | `server/routes/ai.js` — edit the system prompt |
| Change styling | `src/index.css` — all styles are in this one file |

### Key concepts explained

- **React** — The library that builds the user interface
- **CSS** — Controls how everything looks (colors, spacing, fonts)
- **Supabase** — A cloud database that stores user accounts and habit data
- **Node.js server** — A small program that runs on a server to handle AI requests
- **Grok API** — An AI service that generates habit suggestions
- **localStorage** — Browser storage used for demo mode (no database needed)

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Credits

Built with:
- [React](https://react.dev) — UI library
- [Vite](https://vitejs.dev) — Build tool
- [Supabase](https://supabase.com) — Database & Auth
- [Grok](https://x.ai) — AI habit suggestions

---

*Habitly — Small habits, big changes.*
