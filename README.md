# 🎓 StudyBuddy — Student Study Planner & Dashboard

A modern, responsive, and beginner-friendly web application built for students to organize, manage, and excel in their studies.

---

## 🌟 Key Features

1. **📊 Interactive Dashboard**
   - Quick overview metrics: Pending Assignments, Completed Tasks, Today's Study Sessions, and Total Focused Time.
   - Daily inspirational quotes to keep motivation high.
   - Immediate access to upcoming priorities and today's schedule preview.
   - Weekly assignment goal completion progress bar.

2. **✅ Assignments To-Do List**
   - Create, edit, and delete coursework and homework assignments.
   - Due date badges with automatic overdue tracking.
   - Priority levels: High (Urgent), Medium, and Low.
   - Real-time search by title, subject, or description.
   - Filters for status (Pending/Completed), priority, and subject.
   - Celebratory confetti animation and audio chimes on task completion.
   - Bulk action to clear completed tasks.

3. **📅 Daily Study Timetable**
   - Weekday navigation (Monday through Sunday).
   - Time slots with automatic duration calculations (e.g., `1h 30m`).
   - Categorization by session type: *Lecture*, *Self Study*, *Exam Revision*, *Lab*, or *Group Study*.
   - Location/room or online meeting link recording.
   - One-click attendance/completion tracking.

4. **📝 Notes & Ideas Repository**
   - Quick capture for lecture takeaways, formula sheets, and exam tips.
   - Color-coded cards: Ocean Blue, Emerald Mint, Soft Violet, Warm Amber, Coral Rose.
   - Searchable and filterable by subject.
   - Formatted text support.

5. **⏱️ Progress Tracker & Pomodoro Focus Hub**
   - Built-in Pomodoro Timer (25m Focus, 5m Short Break, 15m Long Break).
   - Animated SVG circular progress indicator.
   - Automatic focus time accumulator and session count logger.
   - Synchronized mini-timer widget in the sidebar.
   - Academic mastery breakdown by subject.
   - 7-day study habit streak tracker.

6. **☁️ Cloud Persistence (Supabase)**
   - Sign in with Google — every account gets its own private workspace.
   - All tasks, timetable sessions, notes, and study metrics sync to your Supabase project and follow you across devices.
   - Secured with Row Level Security: no user can ever read or edit another user's data.
   - Comes pre-populated with friendly sample study data on first sign-in.
   - "Reset Demo Data" button in the sidebar footer to reset back to initial sample state anytime.

7. **📱 Fully Responsive & Clean Design**
   - Light blue and crisp white palette (`#f0f9ff`, `#e0f2fe`, `#38bdf8`, `#0284c7`).
   - Rounded cards with smooth shadows and micro-animations.
   - Mobile slide-out drawer navigation and desktop sidebar.

---

## 🚀 How to Run Locally

### 1. One-time setup (Supabase + Google login)

StudyBuddy uses [Supabase](https://supabase.com) for Google sign-in and cloud storage. The free tier is plenty.

1. **Create a Supabase project** at [database.new](https://database.new) (free tier).
2. **Create the database table** — open *SQL Editor → New query*, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.
3. **Enable the Google provider** — *Authentication → Providers → Google*.
   Follow the link Supabase shows you to create an OAuth Client ID in the
   [Google Cloud Console](https://console.cloud.google.com) (APIs & Services → Credentials →
   Create credentials → OAuth client ID → *Web application*).
   - Authorized JavaScript origins: your site URL, e.g. `http://localhost:8000`
   - Authorized redirect URI: the one Supabase displays, e.g. `https://<project-ref>.supabase.co/auth/v1/callback`
4. **Allow your site URL** — *Authentication → URL Configuration*: add `http://localhost:8000`
   (and later your production URL) to the redirect allow list, and set the Site URL.
5. **Add your credentials** — open [`config.js`](config.js) and paste your
   *Project URL* and *anon public* key (found under *Project Settings → API*).

### 2. Run the app

Serve the folder over HTTP (Google sign-in does not work from `file://`):

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`, click **Continue with Google**, and you'll get
your own personal StudyBuddy workspace.
