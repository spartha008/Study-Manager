# 🎓 StudyBuddy — Student Study Planner & Dashboard

A modern, responsive, and beginner-friendly web application built for students to organize, manage, and excel in their studies.

---

## 🌟 Key Features

1. **🏠 Today (Dashboard)**
   - A greeting with a one-line summary of your day ("1 assignment due today, 1 overdue… your next test is in 3 days").
   - **Next up** card with a live countdown to whatever is happening now or next — an event, a timetable session or your most urgent deadline.
   - Today's plan: one timeline that merges timetable sessions, events and assignments due today, each tickable in place.
   - Due-soon list, overdue alert, focus-today vs. your daily goal, day streak, and a Mon–Sun focus chart.

2. **✅ Assignments**
   - Grouped by when they're due: Overdue, Due today, Tomorrow, Next 7 days, Later, Completed.
   - Quick-add row (type a title, press Enter), priority pills, date shortcuts (Today / Tomorrow / Next week).
   - To do / Done / All filter with counts, priority + subject filters, and sorting by due date, priority or recently added.
   - ▶ "Focus on this" starts a Pomodoro linked to the assignment and tracks minutes focused on it.
   - **Checklists**: break an assignment into steps; cards show a progress bar and expand to tick steps off in place.
   - Completing, deleting or clearing shows an **Undo** toast instead of a blocking confirmation.

3. **📅 Calendar & Events with Reminders**
   - Month view showing events **and assignment deadlines**, colour-coded by type; per-day agenda beside it.
   - Tests/exams, classes, study sessions or other events with date, times, subject, location and notes.
   - Reminders (10m → 1 week before) now fire when the reminder window opens, once per event, with optional desktop notifications.
   - Double-click a day to add an event on it; delete from the agenda or the edit dialog.

4. **🗓️ Weekly Timetable**
   - Opens on **today**, marks the session happening now, and shows total planned time per day.
   - Day view and a 7-column **Week view**; duplicate a slot to another day in one click.
   - "Done" is tracked per week, so recurring sessions reset every Monday (older ticked slots are migrated automatically).

5. **📝 Notes**
   - Masonry grid with colour swatches, **pinning**, and light formatting: `- bullets`, `**bold**`, `` `code` ``, `# headings`.
   - Search and subject filter; click any card to edit.

6. **🃏 Flashcards (spaced repetition)**
   - Decks of question/answer cards, with search across every card.
   - Study sessions with 3D flip cards: rate each one **Again / Good / Easy** (keys `1` `2` `3`, `Space` to flip).
   - Leitner-style scheduling: cards you know come back in 1 → 2 → 4 → 8 → 16 days; cards you miss repeat in the same session.
   - Due counts on the sidebar badge, the Today summary and a "Review cards" button.

7. **🎓 Marks & Grades**
   - Percentages, letter grades (A+ → F), weighted overall average, strongest subject.
   - Per-subject averages and a **trend chart** of your last 10 results.
   - **"What do I need?"** calculator: pick a subject, a target and the next test's weight to see the score you need.

8. **⏱️ Focus & Progress**
   - Pomodoro timer that stays accurate in background tabs, shows the countdown in the browser tab title, and earns a long break every 4th session.
   - Custom focus/break lengths, daily focus goal and optional auto-start (Settings).
   - **Full-screen focus mode** (`Shift + F`): a distraction-free timer over a slowly drifting aurora, with generated ambient sound (rain, deep brown noise or white noise) and a volume slider.
   - Weekly focus chart, study streak, assignment completion by subject. A mini timer stays in the sidebar.

9. **⌨️ Fast navigation**
   - **Command palette** (`Ctrl/⌘ + K` or `/`): search assignments, events, notes, marks and timetable slots, or run commands.
   - "+ New" menu everywhere, and single-key shortcuts: `A` assignment, `E` event, `N` note, `M` mark, `S` slot, `D` deck, `R` review cards, `F` focus, `Shift+F` focus mode, `T` theme, `1–9` sections, `?` help.
   - The sidebar collapses to an icon rail (« button) and remembers your choice.

10. **⚙️ Settings & your data**
   - Timer lengths, daily goal, sounds and confetti on/off.
   - **Export** the whole workspace to JSON and **import** it back (journal pages stay encrypted inside the file).
   - "Clear all data" lives in a Danger zone inside Settings, behind a confirmation.

11. **🔐 Private Journal (Password-Protected)**
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

12. **☁️ Cloud Persistence (Supabase)**
   - Sign in with Google — every account gets its own private workspace.
   - New accounts start with a completely empty workspace — no sample content.
   - All tasks, timetable sessions, notes, flashcards, events, marks and study metrics sync to your Supabase project and follow you across devices.
   - Every save also writes a **per-account device mirror** to your browser's local storage — if the cloud ever comes back empty on sign-in, the last saved workspace is restored from this device instead of showing a blank app. (Failed syncs are now surfaced with a toast instead of failing silently.)
   - Secured with Row Level Security: no user can ever read or edit another user's data.

13. **🎨 Design, motion, themes & phones**
   - "Aurora" palette — lavender-white surfaces with indigo → violet → pink gradient accents, Inter + Fraunces type, and consistent subject colours across every view.
   - Motion throughout: staggered page entrances, numbers that count up, charts that grow and draw in, a sliding nav indicator, click ripples, a cursor spotlight on cards, rows that collapse away on delete and flash back on undo, toasts with a countdown bar, and confetti bursting from whatever you just completed.
   - Switching theme plays a circular reveal from the toggle (in browsers with the View Transitions API).
   - Respects **reduced motion**: with that system setting on, animations are skipped and the drifting backgrounds are hidden.
   - Light and dark themes (follows your OS until you choose), remembered across sessions.
   - On phones: a bottom navigation bar with a central **+** button, dialogs that open as bottom sheets, a compact calendar with event dots, and no horizontal scrolling from 360px up.

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
