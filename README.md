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

3. **📅 Calendar & Events with Reminders**
   - Month-view calendar with colour-coded events and a per-day agenda.
   - Plan anything: **Tests/Exams**, Classes, Study Sessions, or other events.
   - Each event records a date, start time and end time, plus subject, location and notes.
   - Optional reminders (10m, 30m, 1h, 2h, 1 day, 2 days, 1 week before).
   - **Live countdowns on the dashboard** ("Starts in 2h 15m") that update automatically.
   - Optional desktop notifications when an event is about to begin.
   - Click any day in the calendar to see and manage that day's agenda.

4. **📆 Daily Study Timetable**
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

5. **🎓 Marks & Grades Tracker**
   - Record every test, exam, quiz, assignment, project and oral score.
   - Automatic percentage and letter grade (A+ through F) per entry.
   - Overall average — weighted by assessment weight when you provide one, otherwise a simple average.
   - Per-subject average breakdown with colour-coded progress bars and a "strongest subject" highlight.
   - Optional weight (%) per assessment, plus notes for feedback and revision targets.
   - Search, filter by subject, and sort by date or score.

6. **⏱️ Progress Tracker & Pomodoro Focus Hub**
   - Built-in Pomodoro Timer (25m Focus, 5m Short Break, 15m Long Break).
   - Animated SVG circular progress indicator.
   - Automatic focus time accumulator and session count logger.
   - Synchronized mini-timer widget in the sidebar.
   - Academic mastery breakdown by subject.
   - 7-day study habit streak tracker.

7. **🔐 Private Journal (Password-Protected)**
   - A personal, everyday journal living right beside your study tools — one page per day.
   - Opening the Journal tab always asks for a **journal password** you create once, so it feels
   like stepping into a room only you have the key to. It re-locks itself the moment you leave
   the tab (or switch windows), with an optional *"keep unlocked"* checkbox for long writing sessions.
   - Your words are **encrypted in the browser with AES-GCM** under a random data key, and that
   key is locked twice: once under your password (PBKDF2, 150k iterations) and once under your
   **security answer** — so the readable text never leaves the device, and neither the cloud nor
   anyone with your account can read your pages.
   - **Security question from day one:** creating the journal also asks you to pick a question
   and answer. If you ever forget the password, *Forgot your password?* on the lock screen asks
   that question — answer it correctly and you choose a new one, with every entry untouched.
   - Daily editor with mood tracking (😞 → 🤩), a title, free writing, rotating reflection prompts,
   word count, and yesterday/next-day navigation.
   - Writing streak counter, full-text search across past entries, and an entry list that doubles
   as a timeline of your days.
   - **Backed up so it's never lost:** every save syncs the encrypted journal to your account
   (works on any device you sign into), plus a one-click **Backup file** you can drop into Google
   Drive, and a **Restore** action that brings it back anywhere — password required.

8. **☁️ Cloud Persistence (Supabase)**
   - Sign in with Google — every account gets its own private workspace.
   - New accounts start with a completely empty workspace — no sample content.
   - All tasks, timetable sessions, notes, events, marks and study metrics sync to your Supabase project and follow you across devices.
   - Every save also writes a **per-account device mirror** to your browser's local storage — if the cloud ever comes back empty on sign-in, the last saved workspace is restored from this device instead of showing a blank app. (Failed syncs are now surfaced with a toast instead of failing silently.)
   - Secured with Row Level Security: no user can ever read or edit another user's data.
   - "Clear All Data" button in the sidebar footer to wipe your workspace anytime.

9. **🌗 Light & Dark Theme**
   - One-click theme toggle in the top bar (and on the login screen).
   - Dark mode re-points the whole design-token palette — every surface, border, shadow and accent adapts, including the calendar, modals and toasts.
   - Remembers your choice across sessions; follows your operating system preference until you pick one yourself.

10. **📱 Fully Responsive & Clean Design**
   - Light blue and crisp white palette (`#f0f9ff`, `#e0f2fe`, `#38bdf8`, `#0284c7`) with a matching dark counterpart.
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

### 3. The Journal — private by design (no extra setup)

The **Journal** tab works the moment you're signed in:

1. Open **Journal** in the sidebar and **create your journal password** (6+ characters) together
   with a **security question** and answer — the question is your way back in if you forget.
2. Write — every save is encrypted in your browser and synced to your account automatically.
3. Use **Backup file** to download an encrypted copy for Google Drive, and **Restore** to bring
   it back on any device (the backup only opens with your journal password).
4. Forgot the password? Click **Forgot your password?** on the lock screen, answer your security
   question, and pick a new password — the entries come back exactly as they were.
5. Journals created before this feature ask you to **Set recovery question** from the toolbar the
   first time you unlock them (and upgrade themselves to the new format automatically).

> ⚠️ **Nobody can read or recover your journal for you** — that's what makes the entries
> genuinely private (your account itself is never enough to read them). The only key besides your
> password is your security answer, so treat it like a second password: pick an answer nobody
> else would guess, and keep a **Backup file** somewhere safe. Changing the password from inside
> the journal does not touch the entries themselves.

### Optional: run the automated test

```bash
npm i --no-save playwright-core   # one-time; uses the Edge already on your machine
node tools-test-journal.js
```

This drives a real headless browser through the whole journal flow: create password + security
question → write → encrypt → lock/unlock → backup download → restore → change password →
auto-lock → forgot-password reset → upgrading an old-format (v1) journal.
