/**
 * StudyBuddy - Modern Student Study Planner
 * Core Application Logic & Local Storage Management
 */

// =============================================================================
// 1. Initial State & Sample Seed Data
// =============================================================================
const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "Calculus IV - Green's Theorem Problem Set",
    subject: "Mathematics",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Tomorrow
    estimatedTime: 90,
    description: "Complete problems 14 through 28 on page 412. Show all vector field calculations.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Quantum Physics Lab Report Revision",
    subject: "Physics",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // In 3 days
    estimatedTime: 60,
    description: "Incorporate Professor Yang's comments on the double-slit interference error bars.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "Data Structures - Implement Dijkstra's Algorithm",
    subject: "Computer Science",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedTime: 120,
    description: "Write priority-queue optimized Dijkstra shortest path in Python with unit tests.",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    title: "Economics Chapter 5 Reading & Summary",
    subject: "Economics",
    priority: "low",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    estimatedTime: 45,
    description: "Read supply/demand elasticity and summarize cross-price effects.",
    completed: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_TIMETABLE = [
  {
    id: "slot-1",
    day: "Monday",
    title: "Calculus & Linear Algebra Lecture",
    subject: "Mathematics",
    type: "Lecture",
    startTime: "09:00",
    endTime: "10:30",
    location: "Hall B302",
    completed: true
  },
  {
    id: "slot-2",
    day: "Monday",
    title: "Algorithms & Data Structures",
    subject: "Computer Science",
    type: "Lecture",
    startTime: "11:00",
    endTime: "12:30",
    location: "CS Lab 3",
    completed: false
  },
  {
    id: "slot-3",
    day: "Monday",
    title: "Quiet Study & Problem Solving Session",
    subject: "Mathematics",
    type: "Self Study",
    startTime: "14:00",
    endTime: "15:45",
    location: "Campus Main Library - 2nd Floor",
    completed: false
  },
  {
    id: "slot-4",
    day: "Tuesday",
    title: "Modern Physics & Optics",
    subject: "Physics",
    type: "Lecture",
    startTime: "10:00",
    endTime: "11:30",
    location: "Science Complex Rm 104",
    completed: false
  },
  {
    id: "slot-5",
    day: "Wednesday",
    title: "Software Engineering Group Sprint",
    subject: "Computer Science",
    type: "Group Study",
    startTime: "13:00",
    endTime: "15:00",
    location: "Innovation Hub Room A",
    completed: false
  },
  {
    id: "slot-6",
    day: "Thursday",
    title: "Microeconomics Seminar",
    subject: "Economics",
    type: "Lecture",
    startTime: "09:30",
    endTime: "11:00",
    location: "Social Sciences Auditorium",
    completed: false
  },
  {
    id: "slot-7",
    day: "Friday",
    title: "Weekly Review & Exam Preparation",
    subject: "Mathematics",
    type: "Revision",
    startTime: "15:00",
    endTime: "17:00",
    location: "Study Buddy Lounge",
    completed: false
  }
];

const DEFAULT_NOTES = [
  {
    id: "note-1",
    title: "Key Big-O Complexity Cheatsheet",
    subject: "Computer Science",
    color: "sky",
    content: "• Binary Search: O(log n)\n• QuickSort: O(n log n) average, O(n²) worst\n• MergeSort: O(n log n) guaranteed\n• Hash Map Lookup: O(1) average\n• Dijkstra with Min-Heap: O((V + E) log V)",
    updatedAt: "Oct 18, 2026"
  },
  {
    id: "note-2",
    title: "Thermodynamics 4 Laws Summary",
    subject: "Physics",
    color: "emerald",
    content: "0th: Thermal equilibrium is transitive.\n1st: Energy conservation (ΔU = Q - W).\n2nd: Entropy of an isolated system never decreases.\n3rd: Absolute zero cannot be reached in finite steps.",
    updatedAt: "Oct 17, 2026"
  },
  {
    id: "note-3",
    title: "Calculus Gradient & Divergence",
    subject: "Mathematics",
    color: "purple",
    content: "Gradient (∇f): Vector of partial derivatives pointing in direction of greatest increase.\nDivergence (∇ · F): Scalar measure of source or sink behavior.\nCurl (∇ × F): Vector representing rotational circulation.",
    updatedAt: "Oct 16, 2026"
  }
];

/**
 * The sample items above are no longer seeded into anyone's workspace — they
 * exist only so we can recognise (and clean up) the demo content that older
 * versions of the app saved for users who signed in back then.
 */
const DEMO_SEED_IDS = new Set(
  [...DEFAULT_TASKS, ...DEFAULT_TIMETABLE, ...DEFAULT_NOTES].map(item => item.id)
);

const MOTIVATIONAL_QUOTES = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Focus on progress, not perfection.", author: "Bill Phillips" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
];

// =============================================================================
// 2. Cloud Storage (Supabase) & Auth Client
// =============================================================================
const SUPABASE_CONFIG = window.STUDYBUDDY_CONFIG || {};
const IS_CONFIGURED = Boolean(
  window.supabase &&
  SUPABASE_CONFIG.SUPABASE_URL &&
  SUPABASE_CONFIG.SUPABASE_ANON_KEY &&
  !SUPABASE_CONFIG.SUPABASE_URL.startsWith("YOUR_") &&
  !SUPABASE_CONFIG.SUPABASE_ANON_KEY.startsWith("YOUR_")
);

const supabaseClient = IS_CONFIGURED
  ? window.supabase.createClient(SUPABASE_CONFIG.SUPABASE_URL, SUPABASE_CONFIG.SUPABASE_ANON_KEY)
  : null;

// Shown on the loading/login screens so it's always obvious which build is
// actually running in the browser (rules out stale-cache confusion).
const APP_BUILD = "build 2026-10-20c";

/**
 * RemoteStore - reads/writes the signed-in user's single workspace row in
 * Supabase. Row Level Security (see supabase/schema.sql) guarantees that each
 * user can only ever touch their own data.
 *
 * Every request races a timeout so a blocked/slow connection surfaces a clear
 * error instead of an infinite "Preparing your workspace…" spinner.
 */
class RemoteStore {
  static async request(fn, label, timeoutMs = 12000) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s (network blocked or offline?)`));
      }, timeoutMs);
    });
    try {
      return await Promise.race([fn(), timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  static load(userId) {
    return this.request(() => supabaseClient
      .from("studybuddy_state")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle(), "Loading your workspace");
  }

  static save(userId, state) {
    return this.request(() => supabaseClient
      .from("studybuddy_state")
      .upsert(
        { user_id: userId, data: state, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      ), "Saving your workspace", 15000);
  }
}

// =============================================================================
// 3. Audio & Celebration FX
// =============================================================================
class SoundFX {
  static playSuccess() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      // AudioContext unavailable or blocked
    }
  }

  static playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) { }
  }
}

class ConfettiFX {
  static launch() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#38bdf8", "#0284c7", "#10b981", "#f59e0b", "#a855f7", "#f43f5e"];

    for (let i = 0; i < 65; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() * 200 - 100),
        y: canvas.height / 2 + (Math.random() * 100 - 50),
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        gravity: 0.3,
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: (Math.random() * 0.08) + 0.04,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.tiltAngle += p.tiltAngleInc;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }
    render();
  }
}

// =============================================================================
// 4. Main Application Class
// =============================================================================
class StudyBuddyApp {
  constructor() {
    // Workspace data — hydrated from the signed-in user's cloud profile in
    // startSession(). First-time sign-ins get the sample data seeded below.
    this.user = null;
    this.tasks = [];
    this.timetable = [];
    this.notes = [];
    this.events = [];
    this.focusMinutes = 0;
    this.pomodoroSessions = 0;
    this.activeDates = [];
    this._persistTimer = null;
    this._reminderTick = null;
    this._lastReminderKey = "";
    this._initialized = false;

    this.currentTab = "dashboard";
    this.selectedDay = "Monday";

    // Calendar state
    const now = new Date();
    this.calendarYear = now.getFullYear();
    this.calendarMonth = now.getMonth(); // 0-indexed
    this.selectedDate = this.toDateKey(now);

    // Pomodoro Timer State
    this.timerMode = "pomodoro"; // pomodoro (25), shortBreak (5), longBreak (15)
    this.timerDurations = {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    };
    this.timeLeft = this.timerDurations.pomodoro;
    this.timerInterval = null;
    this.isTimerRunning = false;

    // Filters & Search
    this.taskSearch = "";
    this.taskStatusFilter = "all";
    this.taskPriorityFilter = "all";
    this.taskSubjectFilter = "all";

    this.noteSearch = "";
    this.noteSubjectFilter = "all";

    this.theme = "light";

    this.init();
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;

    this.setupDateDisplay();
    this.setupNavigation();
    this.setupModals();
    this.setupTaskEvents();
    this.setupTimetableEvents();
    this.setupNoteEvents();
    this.setupCalendarEvents();
    this.setupPomodoroEvents();
    this.setupQuotes();
    this.setupTheme();
    this.startReminderTicker();

    // Initial Render
    this.renderAll();
  }

  // ===========================================================================
  // 4. Session & Cloud Sync
  // ===========================================================================
  /**
   * Called after Google sign-in: loads this user's workspace from Supabase
   * (seeding the sample data on very first sign-in), then boots the UI.
   */
  async startSession(session) {
    this.user = session.user;
    this.renderUserProfile();

    AuthGate.showLoading("Loading your workspace…");

    let saved = null;
    try {
      saved = await RemoteStore.load(this.user.id);
    } catch (e) {
      // Don't silently degrade: entering the app with sample data could
      // overwrite the real cloud workspace on the next save. Surface a clear,
      // actionable error instead.
      console.error("[StudyBuddy] Failed to load cloud workspace:", e);
      const err = new Error(describeWorkspaceError(e));
      err.isAuthHtml = true;
      throw err;
    }

    if (saved && typeof saved === "object") {
      this.tasks = Array.isArray(saved.tasks) ? saved.tasks : [];
      this.timetable = Array.isArray(saved.timetable) ? saved.timetable : [];
      this.notes = Array.isArray(saved.notes) ? saved.notes : [];
      this.events = Array.isArray(saved.events) ? saved.events : [];
      this.focusMinutes = Number(saved.focusMinutes) || 0;
      this.pomodoroSessions = Number(saved.pomodoroSessions) || 0;
      this.activeDates = Array.isArray(saved.activeDates) ? saved.activeDates : [];

      // One-time cleanup: accounts that signed up while the app still shipped
      // with sample data had that demo content saved into their workspace.
      // Strip it so everyone starts (and stays) with their own real content.
      if (this.removeDemoContent()) this.persist();
    } else {
      // First sign-in on this account: start with a clean, empty workspace.
      this.tasks = [];
      this.timetable = [];
      this.notes = [];
      this.events = [];
      this.focusMinutes = 0;
      this.pomodoroSessions = 0;
      this.activeDates = [];
      this.persist();
    }
    AuthGate.showLoading("Starting StudyBuddy…");
    this.backfillActivityFromData();
    this.init();
  }

  /**
   * Removes any leftover sample/demo items from the current workspace.
   * Returns true if anything was removed.
   */
  removeDemoContent() {
    const isDemo = item => item && DEMO_SEED_IDS.has(item.id);
    const tasks = this.tasks.filter(t => !isDemo(t));
    const timetable = this.timetable.filter(s => !isDemo(s));
    const notes = this.notes.filter(n => !isDemo(n));

    const removed = tasks.length !== this.tasks.length ||
      timetable.length !== this.timetable.length ||
      notes.length !== this.notes.length;

    if (removed) {
      this.tasks = tasks;
      this.timetable = timetable;
      this.notes = notes;
    }
    return removed;
  }

  // Fill the sidebar/topbar with the signed-in Google profile.
  renderUserProfile() {
    if (!this.user) return;
    const meta = this.user.user_metadata || {};
    const fullName = meta.full_name || meta.name || this.user.email || "Student";
    const firstName = fullName.split(" ")[0];
    const avatarUrl = meta.avatar_url || meta.picture;

    const nameEl = document.getElementById("display-user-name");
    if (nameEl) nameEl.textContent = fullName;

    const titleEl = document.getElementById("page-title");
    if (titleEl) titleEl.textContent = `Welcome back, ${firstName}! 👋`;

    const avatarWrap = document.getElementById("sidebar-avatar");
    if (avatarWrap && avatarUrl) {
      avatarWrap.innerHTML = `<img src="${this.escapeHTML(avatarUrl)}" alt="${this.escapeHTML(fullName)}" referrerpolicy="no-referrer">`;
    }
  }

  // Debounced cloud sync — every mutation funnels through here.
  schedulePersist() {
    if (!this.user) return;
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(() => this.persist(), 400);
  }

  async persist() {
    if (!this.user) return;
    clearTimeout(this._persistTimer);
    const state = {
      tasks: this.tasks,
      timetable: this.timetable,
      notes: this.notes,
      events: this.events,
      focusMinutes: this.focusMinutes,
      pomodoroSessions: this.pomodoroSessions,
      activeDates: this.activeDates
    };
    try {
      await RemoteStore.save(this.user.id, state);
    } catch (e) {
      console.error("Cloud save failed:", e);
      this.showToast("Couldn't sync your latest changes to the cloud", "alert");
    }
  }

  // Set Top Date String
  setupDateDisplay() {
    const dateEl = document.getElementById("current-date-display");
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
  }

  // Setup Motivational Quotes
  setupQuotes() {
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    const textEl = document.getElementById("quote-text");
    const authorEl = document.getElementById("quote-author");
    if (textEl && authorEl) {
      textEl.textContent = `"${quote.text}"`;
      authorEl.textContent = `— ${quote.author}`;
    }
  }

  // Navigation Logic
  setupNavigation() {
    // Tab item buttons in sidebar
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Delegated links with data-tab
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-tab]");
      if (link && !link.classList.contains("nav-item")) {
        const tab = link.dataset.tab;
        this.switchTab(tab);
      }
    });

    // Mobile Menu Controls
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const closeSidebarBtn = document.getElementById("close-sidebar-btn");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("active");
      });

      const closeMenu = () => {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("active");
      };

      closeSidebarBtn?.addEventListener("click", closeMenu);
      sidebarOverlay?.addEventListener("click", closeMenu);
    }

    // Clear All Data
    const clearBtn = document.getElementById("clear-all-data-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear your entire workspace? This permanently deletes all your assignments, study slots, and notes.")) {
          this.tasks = [];
          this.timetable = [];
          this.notes = [];
          this.events = [];
          this.focusMinutes = 0;
          this.pomodoroSessions = 0;
          this.activeDates = [];
          this.persist();
          this.renderAll();
          this.showToast("All data cleared", "info");
        }
      });
    }

    // Sign Out
    const signOutBtn = document.getElementById("sign-out-btn");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", async () => {
        if (!supabaseClient) return;
        if (confirm("Sign out of StudyBuddy? Your data stays safe in your account.")) {
          await supabaseClient.auth.signOut();
          window.location.reload();
        }
      });
    }

    // Top quick button to add assignment
    const quickAddTaskBtn = document.getElementById("quick-add-task-btn");
    if (quickAddTaskBtn) {
      quickAddTaskBtn.addEventListener("click", () => {
        this.openTaskModal();
      });
    }

    // Quick chips on dashboard
    document.getElementById("chip-add-task")?.addEventListener("click", () => this.openTaskModal());
    document.getElementById("chip-add-schedule")?.addEventListener("click", () => this.openTimetableModal());
    document.getElementById("chip-start-focus")?.addEventListener("click", () => {
      this.switchTab("progress");
      if (!this.isTimerRunning) this.toggleTimer();
    });
    document.getElementById("dash-new-note-btn")?.addEventListener("click", () => this.openNoteModal());
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update nav links
    document.querySelectorAll(".nav-menu .nav-item").forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update panes
    document.querySelectorAll(".tab-pane").forEach(pane => {
      pane.classList.remove("active");
    });
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    // Close mobile drawer if open
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebar-overlay")?.classList.remove("active");

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh views that might have updated
    this.renderAll();
  }

  // Toast Notification System
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "fa-circle-check";
    if (type === "info") icon = "fa-circle-info";
    if (type === "alert") icon = "fa-triangle-exclamation";

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ===========================================================================
  // 5. Modal Setup & Handling
  // ===========================================================================
  setupModals() {
    // Task Modal
    const taskModal = document.getElementById("task-modal");
    document.getElementById("add-assignment-modal-btn")?.addEventListener("click", () => this.openTaskModal());
    document.getElementById("empty-state-add-task-btn")?.addEventListener("click", () => this.openTaskModal());
    document.getElementById("close-task-modal-btn")?.addEventListener("click", () => this.closeModal(taskModal));
    document.getElementById("cancel-task-btn")?.addEventListener("click", () => this.closeModal(taskModal));

    // Timetable Modal
    const timetableModal = document.getElementById("timetable-modal");
    document.getElementById("add-timetable-slot-btn")?.addEventListener("click", () => this.openTimetableModal());
    document.getElementById("empty-state-add-slot-btn")?.addEventListener("click", () => this.openTimetableModal());
    document.getElementById("close-timetable-modal-btn")?.addEventListener("click", () => this.closeModal(timetableModal));
    document.getElementById("cancel-timetable-btn")?.addEventListener("click", () => this.closeModal(timetableModal));

    // Note Modal
    const noteModal = document.getElementById("note-modal");
    document.getElementById("add-note-btn")?.addEventListener("click", () => this.openNoteModal());
    document.getElementById("empty-state-add-note-btn")?.addEventListener("click", () => this.openNoteModal());
    document.getElementById("close-note-modal-btn")?.addEventListener("click", () => this.closeModal(noteModal));
    document.getElementById("cancel-note-btn")?.addEventListener("click", () => this.closeModal(noteModal));

    // Event Modal
    const eventModal = document.getElementById("event-modal");
    document.getElementById("add-event-btn")?.addEventListener("click", () => this.openEventModal());
    document.getElementById("empty-state-add-event-btn")?.addEventListener("click", () => this.openEventModal());
    document.getElementById("close-event-modal-btn")?.addEventListener("click", () => this.closeModal(eventModal));
    document.getElementById("cancel-event-btn")?.addEventListener("click", () => this.closeModal(eventModal));

    // Close on backdrop click
    [taskModal, timetableModal, noteModal, eventModal].forEach(modal => {
      modal?.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.active").forEach(m => this.closeModal(m));
      }
    });
  }

  openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  // ===========================================================================
  // 6. To-Do List (Assignments) Management
  // ===========================================================================
  setupTaskEvents() {
    // Form Submission
    const taskForm = document.getElementById("task-form");
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveTaskFromForm();
      });
    }

    // Search & Filter
    document.getElementById("task-search-input")?.addEventListener("input", (e) => {
      this.taskSearch = e.target.value.toLowerCase().trim();
      this.renderTasks();
    });

    document.getElementById("task-filter-status")?.addEventListener("change", (e) => {
      this.taskStatusFilter = e.target.value;
      this.renderTasks();
    });

    document.getElementById("task-filter-priority")?.addEventListener("change", (e) => {
      this.taskPriorityFilter = e.target.value;
      this.renderTasks();
    });

    document.getElementById("task-filter-subject")?.addEventListener("change", (e) => {
      this.taskSubjectFilter = e.target.value;
      this.renderTasks();
    });

    // Clear completed
    document.getElementById("clear-completed-tasks-btn")?.addEventListener("click", () => {
      const completedCount = this.tasks.filter(t => t.completed).length;
      if (completedCount === 0) {
        this.showToast("No completed assignments to clear", "info");
        return;
      }
      if (confirm(`Remove ${completedCount} completed assignment(s)?`)) {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.renderAll();
        this.showToast(`Removed ${completedCount} completed assignment(s)`, "info");
      }
    });
  }

  openTaskModal(task = null) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");
    const titleEl = document.getElementById("task-modal-title");

    form.reset();

    if (task) {
      titleEl.textContent = "Edit Assignment";
      document.getElementById("task-id").value = task.id;
      document.getElementById("task-title-input").value = task.title;
      document.getElementById("task-subject-input").value = task.subject;
      document.getElementById("task-priority-input").value = task.priority;
      document.getElementById("task-due-date-input").value = task.dueDate;
      document.getElementById("task-estimated-time-input").value = task.estimatedTime || 45;
      document.getElementById("task-description-input").value = task.description || "";
    } else {
      titleEl.textContent = "Add New Assignment";
      document.getElementById("task-id").value = "";
      // Default due date to tomorrow
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      document.getElementById("task-due-date-input").value = tomorrow;
    }

    this.openModal(modal);
  }

  saveTaskFromForm() {
    const id = document.getElementById("task-id").value;
    const title = document.getElementById("task-title-input").value.trim();
    const subject = document.getElementById("task-subject-input").value.trim();
    const priority = document.getElementById("task-priority-input").value;
    const dueDate = document.getElementById("task-due-date-input").value;
    const estimatedTime = parseInt(document.getElementById("task-estimated-time-input").value, 10) || 45;
    const description = document.getElementById("task-description-input").value.trim();

    if (!title || !subject || !dueDate) {
      this.showToast("Please fill in all required fields", "alert");
      return;
    }

    if (id) {
      // Edit
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          title,
          subject,
          priority,
          dueDate,
          estimatedTime,
          description
        };
        this.showToast("Assignment updated successfully!");
      }
    } else {
      // Add new
      const newTask = {
        id: "task-" + Date.now(),
        title,
        subject,
        priority,
        dueDate,
        estimatedTime,
        description,
        completed: false,
        createdAt: new Date().toISOString()
      };
      this.tasks.unshift(newTask);
      this.showToast("Assignment added to your list!");
    }

    this.saveTasks();
    this.recordActivity();
    this.closeModal(document.getElementById("task-modal"));
    this.renderAll();
  }

  toggleTaskCompletion(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    this.saveTasks();

    if (task.completed) {
      SoundFX.playSuccess();
      ConfettiFX.launch();
      this.showToast("Great job completing your assignment! 🎉");
      this.recordActivity();
    }

    this.renderAll();
  }

  deleteTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.renderAll();
      this.showToast("Assignment removed", "info");
    }
  }

  saveTasks() {
    this.schedulePersist();
  }

  // ===========================================================================
  // 7. Study Timetable Management
  // ===========================================================================
  setupTimetableEvents() {
    // Day chips navigation
    const dayChips = document.querySelectorAll(".day-chip");
    dayChips.forEach(chip => {
      chip.addEventListener("click", () => {
        dayChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.selectedDay = chip.dataset.day;
        this.renderTimetable();
      });
    });

    // Form Submission
    document.getElementById("timetable-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveTimetableFromForm();
    });
  }

  openTimetableModal(slot = null) {
    const modal = document.getElementById("timetable-modal");
    const form = document.getElementById("timetable-form");
    const titleEl = document.getElementById("timetable-modal-title");

    form.reset();

    if (slot) {
      titleEl.textContent = "Edit Study Slot";
      document.getElementById("slot-id").value = slot.id;
      document.getElementById("slot-day-select").value = slot.day;
      document.getElementById("slot-title-input").value = slot.title;
      document.getElementById("slot-subject-input").value = slot.subject;
      document.getElementById("slot-type-select").value = slot.type;
      document.getElementById("slot-start-time").value = slot.startTime;
      document.getElementById("slot-end-time").value = slot.endTime;
      document.getElementById("slot-location-input").value = slot.location || "";
    } else {
      titleEl.textContent = "Add Study Slot";
      document.getElementById("slot-id").value = "";
      document.getElementById("slot-day-select").value = this.selectedDay;
      document.getElementById("slot-start-time").value = "10:00";
      document.getElementById("slot-end-time").value = "11:30";
    }

    this.openModal(modal);
  }

  saveTimetableFromForm() {
    const id = document.getElementById("slot-id").value;
    const day = document.getElementById("slot-day-select").value;
    const title = document.getElementById("slot-title-input").value.trim();
    const subject = document.getElementById("slot-subject-input").value.trim();
    const type = document.getElementById("slot-type-select").value;
    const startTime = document.getElementById("slot-start-time").value;
    const endTime = document.getElementById("slot-end-time").value;
    const location = document.getElementById("slot-location-input").value.trim();

    if (!title || !subject || !startTime || !endTime) {
      this.showToast("Please fill in all required fields", "alert");
      return;
    }

    if (id) {
      const index = this.timetable.findIndex(s => s.id === id);
      if (index !== -1) {
        this.timetable[index] = {
          ...this.timetable[index],
          day,
          title,
          subject,
          type,
          startTime,
          endTime,
          location
        };
        this.showToast("Schedule updated!");
      }
    } else {
      const newSlot = {
        id: "slot-" + Date.now(),
        day,
        title,
        subject,
        type,
        startTime,
        endTime,
        location,
        completed: false
      };
      this.timetable.push(newSlot);
      this.showToast("Study slot added to timetable!");
    }

    // Automatically switch day view to the saved day
    this.selectedDay = day;
    document.querySelectorAll(".day-chip").forEach(c => {
      c.classList.toggle("active", c.dataset.day === day);
    });

    this.saveTimetable();
    this.closeModal(document.getElementById("timetable-modal"));
    this.renderAll();
  }

  deleteTimetableSlot(id) {
    const slot = this.timetable.find(s => s.id === id);
    if (!slot) return;

    if (confirm(`Delete session "${slot.title}"?`)) {
      this.timetable = this.timetable.filter(s => s.id !== id);
      this.saveTimetable();
      this.renderAll();
      this.showToast("Study slot deleted", "info");
    }
  }

  toggleTimetableSlotComplete(id) {
    const slot = this.timetable.find(s => s.id === id);
    if (!slot) return;
    slot.completed = !slot.completed;
    this.saveTimetable();
    if (slot.completed) {
      SoundFX.playSuccess();
      this.showToast("Session marked as attended / completed!");
      this.recordActivity();
    }
    this.renderAll();
  }

  saveTimetable() {
    this.schedulePersist();
  }

  // ===========================================================================
  // 8. Notes Section Management
  // ===========================================================================
  setupNoteEvents() {
    document.getElementById("note-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveNoteFromForm();
    });

    document.getElementById("note-search-input")?.addEventListener("input", (e) => {
      this.noteSearch = e.target.value.toLowerCase().trim();
      this.renderNotes();
    });

    document.getElementById("note-filter-subject")?.addEventListener("change", (e) => {
      this.noteSubjectFilter = e.target.value;
      this.renderNotes();
    });
  }

  openNoteModal(note = null) {
    const modal = document.getElementById("note-modal");
    const form = document.getElementById("note-form");
    const titleEl = document.getElementById("note-modal-title");

    form.reset();

    if (note) {
      titleEl.textContent = "Edit Study Note";
      document.getElementById("note-id").value = note.id;
      document.getElementById("note-title-input").value = note.title;
      document.getElementById("note-subject-input").value = note.subject;
      document.getElementById("note-color-select").value = note.color;
      document.getElementById("note-content-input").value = note.content;
    } else {
      titleEl.textContent = "New Study Note";
      document.getElementById("note-id").value = "";
    }

    this.openModal(modal);
  }

  saveNoteFromForm() {
    const id = document.getElementById("note-id").value;
    const title = document.getElementById("note-title-input").value.trim();
    const subject = document.getElementById("note-subject-input").value.trim();
    const color = document.getElementById("note-color-select").value;
    const content = document.getElementById("note-content-input").value.trim();

    if (!title || !content || !subject) {
      this.showToast("Please fill in note title, subject, and content", "alert");
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (id) {
      const idx = this.notes.findIndex(n => n.id === id);
      if (idx !== -1) {
        this.notes[idx] = {
          ...this.notes[idx],
          title,
          subject,
          color,
          content,
          updatedAt: todayStr
        };
        this.showToast("Note updated!");
      }
    } else {
      const newNote = {
        id: "note-" + Date.now(),
        title,
        subject,
        color,
        content,
        updatedAt: todayStr
      };
      this.notes.unshift(newNote);
      this.showToast("New note created!");
    }

    this.saveNotes();
    this.recordActivity();
    this.closeModal(document.getElementById("note-modal"));
    this.renderAll();
  }

  deleteNote(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;

    if (confirm(`Delete note "${note.title}"?`)) {
      this.notes = this.notes.filter(n => n.id !== id);
      this.saveNotes();
      this.renderAll();
      this.showToast("Note deleted", "info");
    }
  }

  saveNotes() {
    this.schedulePersist();
  }

  // ===========================================================================
  // 9. Pomodoro Focus Timer
  // ===========================================================================
  setupPomodoroEvents() {
    const toggleBtn = document.getElementById("timer-toggle-btn");
    const resetBtn = document.getElementById("timer-reset-btn");
    const skipBtn = document.getElementById("timer-skip-btn");
    const modeButtons = document.querySelectorAll(".mode-btn");

    // Sidebar controls
    const sidebarStartBtn = document.getElementById("sidebar-timer-start-btn");
    const sidebarResetBtn = document.getElementById("sidebar-timer-reset-btn");

    toggleBtn?.addEventListener("click", () => this.toggleTimer());
    sidebarStartBtn?.addEventListener("click", () => this.toggleTimer());

    resetBtn?.addEventListener("click", () => this.resetTimer());
    sidebarResetBtn?.addEventListener("click", () => this.resetTimer());

    skipBtn?.addEventListener("click", () => this.skipTimer());

    modeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        this.setTimerMode(mode);
      });
    });

    this.updateTimerDisplay();
  }

  setTimerMode(mode) {
    this.timerMode = mode;
    this.pauseTimer();
    this.timeLeft = this.timerDurations[mode];

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const statusLabel = document.getElementById("timer-status-text");
    const sidebarTag = document.getElementById("sidebar-timer-mode");

    if (mode === "pomodoro") {
      if (statusLabel) statusLabel.textContent = "Ready to focus";
      if (sidebarTag) sidebarTag.textContent = "Focus";
    } else if (mode === "shortBreak") {
      if (statusLabel) statusLabel.textContent = "Take a short break";
      if (sidebarTag) sidebarTag.textContent = "Break";
    } else {
      if (statusLabel) statusLabel.textContent = "Recharge with a long break";
      if (sidebarTag) sidebarTag.textContent = "Rest";
    }

    this.updateTimerDisplay();
  }

  toggleTimer() {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;

    const toggleBtn = document.getElementById("timer-toggle-btn");
    const sidebarBtn = document.getElementById("sidebar-timer-start-btn");
    if (toggleBtn) toggleBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
    if (sidebarBtn) sidebarBtn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerDisplay();
      } else {
        this.onTimerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);

    const toggleBtn = document.getElementById("timer-toggle-btn");
    const sidebarBtn = document.getElementById("sidebar-timer-start-btn");
    if (toggleBtn) toggleBtn.innerHTML = `<i class="fa-solid fa-play"></i> Start Session`;
    if (sidebarBtn) sidebarBtn.innerHTML = `<i class="fa-solid fa-play"></i> Start`;
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.timerDurations[this.timerMode];
    this.updateTimerDisplay();
  }

  skipTimer() {
    this.pauseTimer();
    if (this.timerMode === "pomodoro") {
      this.setTimerMode("shortBreak");
    } else {
      this.setTimerMode("pomodoro");
    }
  }

  onTimerComplete() {
    this.pauseTimer();
    SoundFX.playChime();
    ConfettiFX.launch();

    if (this.timerMode === "pomodoro") {
      this.pomodoroSessions++;
      this.focusMinutes += 25;
      this.recordActivity();
      this.schedulePersist();
      this.showToast("Focus session finished! Time for a well-earned break! ☕");
      this.setTimerMode("shortBreak");
    } else {
      this.showToast("Break over! Ready to resume studying? 📚");
      this.setTimerMode("pomodoro");
    }

    this.renderDashboardStats();
    this.renderProgressStats();
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const mainDisplay = document.getElementById("timer-display");
    const sidebarDisplay = document.getElementById("sidebar-timer-time");
    if (mainDisplay) mainDisplay.textContent = formatted;
    if (sidebarDisplay) sidebarDisplay.textContent = formatted;

    // SVG Circular Progress
    const totalDuration = this.timerDurations[this.timerMode];
    const circle = document.getElementById("timer-progress-circle");
    if (circle) {
      const circumference = 2 * Math.PI * 90; // r=90 => 565.48
      const progressFraction = (totalDuration - this.timeLeft) / totalDuration;
      const offset = circumference * (1 - progressFraction);
      circle.style.strokeDashoffset = offset;
    }
  }

  // ===========================================================================
  // 9b. Calendar & Events Management
  // ===========================================================================

  // Local-time date key (YYYY-MM-DD) — avoids the UTC off-by-one of toISOString().
  toDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Start/end Date objects for an event.
  eventStart(event) {
    return new Date(`${event.date}T${event.startTime || "00:00"}:00`);
  }

  eventEnd(event) {
    return new Date(`${event.date}T${event.endTime || event.startTime || "23:59"}:00`);
  }

  formatClock(dateObj) {
    return dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  formatLongDate(dateObj) {
    return dateObj.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  }

  // "Ends in 2d 4h", "Starts in 45m", "Happening now" etc.
  formatCountdown(event) {
    const now = Date.now();
    const start = this.eventStart(event).getTime();
    const end = this.eventEnd(event).getTime();

    if (now >= start && now <= end) {
      const minsLeft = Math.ceil((end - now) / 60000);
      return { text: minsLeft <= 1 ? "Happening now" : `Happening now · ends in ${this.formatDurationShort(minsLeft)}`, state: "now", minutes: 0 };
    }

    const minutes = Math.ceil((start - now) / 60000);
    if (minutes <= 0) {
      return { text: "Already finished", state: "past", minutes: -1 };
    }

    let state = "upcoming";
    if (minutes <= 60) state = "urgent";

    let text;
    if (minutes < 60) {
      text = `Starts in ${minutes} min${minutes === 1 ? "" : "s"}`;
    } else if (minutes < 24 * 60) {
      text = `Starts in ${this.formatDurationShort(minutes)}`;
    } else {
      const days = Math.floor(minutes / (24 * 60));
      text = `In ${days} day${days === 1 ? "" : "s"} · ${this.formatDurationShort(minutes % (24 * 60))}`;
    }

    return { text, state, minutes };
  }

  formatDurationShort(totalMinutes) {
    if (totalMinutes <= 0) return "0m";
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  }

  // Events happening now, then upcoming ones, soonest first.
  getUpcomingEvents(limit = 6) {
    const now = Date.now();
    return this.events
      .filter(ev => this.eventEnd(ev).getTime() >= now)
      .sort((a, b) => this.eventStart(a) - this.eventStart(b))
      .slice(0, limit);
  }

  eventTypeInfo(type) {
    switch (type) {
      case "test": return { icon: "fa-solid fa-file-pen", label: "Test / Exam" };
      case "class": return { icon: "fa-solid fa-chalkboard-user", label: "Class" };
      case "study": return { icon: "fa-solid fa-book-open-reader", label: "Study" };
      default: return { icon: "fa-solid fa-star", label: "Event" };
    }
  }

  setupCalendarEvents() {
    document.getElementById("event-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveEventFromForm();
    });

    document.getElementById("cal-prev-btn")?.addEventListener("click", () => {
      this.calendarMonth--;
      if (this.calendarMonth < 0) { this.calendarMonth = 11; this.calendarYear--; }
      this.renderCalendar();
    });

    document.getElementById("cal-next-btn")?.addEventListener("click", () => {
      this.calendarMonth++;
      if (this.calendarMonth > 11) { this.calendarMonth = 0; this.calendarYear++; }
      this.renderCalendar();
    });

    document.getElementById("cal-today-btn")?.addEventListener("click", () => {
      const now = new Date();
      this.calendarYear = now.getFullYear();
      this.calendarMonth = now.getMonth();
      this.selectedDate = this.toDateKey(now);
      this.renderCalendar();
      this.renderAgenda();
    });

    // Requests notification permission on user gesture (required by browsers).
    document.getElementById("enable-notifications-btn")?.addEventListener("click", () => this.enableNotifications());
  }

  openEventModal(event = null) {
    const modal = document.getElementById("event-modal");
    const form = document.getElementById("event-form");
    const titleEl = document.getElementById("event-modal-title");

    form.reset();

    if (event) {
      titleEl.textContent = "Edit Event";
      document.getElementById("event-id").value = event.id;
      document.getElementById("event-title-input").value = event.title;
      document.getElementById("event-type-select").value = event.type || "event";
      document.getElementById("event-subject-input").value = event.subject || "";
      document.getElementById("event-date-input").value = event.date;
      document.getElementById("event-start-time").value = event.startTime || "09:00";
      document.getElementById("event-end-time").value = event.endTime || "10:00";
      document.getElementById("event-reminder-select").value = String(event.reminderMinutes ?? 0);
      document.getElementById("event-location-input").value = event.location || "";
      document.getElementById("event-notes-input").value = event.notes || "";
    } else {
      titleEl.textContent = "New Event";
      document.getElementById("event-id").value = "";
      document.getElementById("event-date-input").value = this.selectedDate || this.toDateKey(new Date());
      document.getElementById("event-start-time").value = "09:00";
      document.getElementById("event-end-time").value = "10:00";
    }

    this.openModal(modal);
  }

  saveEventFromForm() {
    const id = document.getElementById("event-id").value;
    const title = document.getElementById("event-title-input").value.trim();
    const type = document.getElementById("event-type-select").value;
    const subject = document.getElementById("event-subject-input").value.trim();
    const date = document.getElementById("event-date-input").value;
    const startTime = document.getElementById("event-start-time").value;
    const endTime = document.getElementById("event-end-time").value;
    const reminderMinutes = parseInt(document.getElementById("event-reminder-select").value, 10) || 0;
    const location = document.getElementById("event-location-input").value.trim();
    const notes = document.getElementById("event-notes-input").value.trim();

    if (!title || !date || !startTime || !endTime) {
      this.showToast("Please fill in the title, date and times", "alert");
      return;
    }

    if (startTime >= endTime) {
      this.showToast("End time must be after the start time", "alert");
      return;
    }

    if (id) {
      const index = this.events.findIndex(e => e.id === id);
      if (index !== -1) {
        this.events[index] = {
          ...this.events[index],
          title, type, subject, date, startTime, endTime,
          reminderMinutes, location, notes
        };
        this.showToast("Event updated!");
      }
    } else {
      this.events.push({
        id: "event-" + Date.now(),
        title, type, subject, date, startTime, endTime,
        reminderMinutes, location, notes,
        createdAt: new Date().toISOString()
      });
      this.showToast("Event added to your calendar!");
    }

    // Jump the calendar to the saved event so it's immediately visible.
    const [y, m] = date.split("-").map(Number);
    this.calendarYear = y;
    this.calendarMonth = m - 1;
    this.selectedDate = date;

    this.saveEvents();
    this.recordActivity();
    this.closeModal(document.getElementById("event-modal"));
    this.renderAll();
  }

  deleteEvent(id) {
    const event = this.events.find(e => e.id === id);
    if (!event) return;

    if (confirm(`Delete "${event.title}" from your calendar?`)) {
      this.events = this.events.filter(e => e.id !== id);
      this.saveEvents();
      this.renderAll();
      this.showToast("Event deleted", "info");
    }
  }

  saveEvents() {
    this.schedulePersist();
  }

  // ===========================================================================
  // 9d. Study Streak Tracking
  // ===========================================================================

  /**
   * Records that the user did something meaningful today. A day only counts
   * once, so callers can fire this freely on every save.
   */
  recordActivity() {
    const today = this.toDateKey(new Date());
    if (!this.activeDates.includes(today)) {
      this.activeDates.push(today);
      this.schedulePersist();
    }
  }

  /**
   * Backfills history for accounts created before streak tracking existed by
   * inferring activity from the tasks, sessions and events they already have.
   * Stored timestamps are UTC, so they're converted to local dates.
   */
  backfillActivityFromData() {
    if (this.activeDates.length > 0) return;

    const inferred = new Set();
    const addFromISO = (iso) => {
      if (!iso) return;
      const d = new Date(iso);
      if (!isNaN(d)) inferred.add(this.toDateKey(d));
    };

    this.tasks.forEach(t => addFromISO(t.createdAt));
    this.events.forEach(e => {
      addFromISO(e.createdAt);
      if (e.date) inferred.add(e.date);
    });

    if (inferred.size === 0) return;

    this.activeDates = [...inferred];
    this.schedulePersist();
  }

  /**
   * Consecutive days of activity ending today (or yesterday, so a streak isn't
   * considered broken until a full day has been missed).
   */
  getCurrentStreak() {
    const days = new Set(this.activeDates);
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    if (!days.has(this.toDateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
      if (!days.has(this.toDateKey(cursor))) return 0;
    }

    let streak = 0;
    while (days.has(this.toDateKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  // The seven days ending today, for the weekly habit bubbles.
  getWeeklyActivity() {
    const days = new Set(this.activeDates);
    const week = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    cursor.setDate(cursor.getDate() - 6);

    for (let i = 0; i < 7; i++) {
      const key = this.toDateKey(cursor);
      week.push({
        key,
        label: cursor.toLocaleDateString("en-US", { weekday: "narrow" }),
        done: days.has(key),
        isToday: key === this.toDateKey(new Date())
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return week;
  }

  renderStreak() {
    const streak = this.getCurrentStreak();

    // Sidebar badge
    const sidebarStreak = document.getElementById("sidebar-streak");
    if (sidebarStreak) {
      const text = streak === 0 ? "No streak yet"
        : `${streak} Day Streak`;
      sidebarStreak.innerHTML = `<i class="fa-solid fa-fire text-amber"></i> ${text}`;
    }

    // Progress-tab banner
    const titleEl = document.getElementById("streak-banner-title");
    const textEl = document.getElementById("streak-banner-text");
    if (titleEl) {
      if (streak === 0) {
        titleEl.textContent = "No study streak yet";
        if (textEl) textEl.textContent = "Complete an assignment, mark a session done, or finish a focus sprint to start your streak.";
      } else {
        titleEl.textContent = `${streak} Day Study Streak Active!`;
        if (textEl) {
          textEl.textContent = streak === 1
            ? "Nice start — come back tomorrow to keep it going."
            : "You've stayed consistent with your studies. Keep the momentum up!";
        }
      }
    }

    // Weekly bubbles
    const container = document.getElementById("weekly-streak-days");
    if (container) {
      container.innerHTML = this.getWeeklyActivity().map(day => `
        <div class="day-bubble ${day.done ? 'done' : ''} ${day.isToday ? 'today' : ''}">
          <span>${day.label}</span>
          ${day.done ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
      `).join('');
    }
  }

  // ===========================================================================
  // 9c. Reminders & Live Countdowns
  // ===========================================================================
  startReminderTicker() {
    if (this._reminderTick) clearInterval(this._reminderTick);
    this._lastReminderKey = "";
    // Re-render every 30s so countdowns stay live.
    this._reminderTick = setInterval(() => {
      this.renderDashboardReminders();
      if (this.currentTab === "calendar") this.renderAgenda();
    }, 30000);
  }

  showNotification(title, body) {
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      new Notification(title, { body, icon: "favicon.ico" });
    } catch (e) {
      /* Notification API unavailable — the in-app toast still shows. */
    }
  }

  async enableNotifications() {
    if (!("Notification" in window)) {
      this.showToast("This browser doesn't support desktop notifications", "info");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.showToast("Reminders enabled — we'll notify you before each event!");
        this.showNotification("StudyBuddy reminders on", "You'll get a desktop alert before your events start.");
      } else {
        this.showToast("Notifications were blocked — reminders will still appear in the dashboard", "info");
      }
      this.renderDashboardReminders();
    } catch (e) {
      console.warn("Notification permission error:", e);
    }
  }

  // Fires a reminder alert once, when an event crosses its reminder threshold.
  checkDueReminders() {
    const now = Date.now();
    const due = this.events
      .filter(ev => ev.reminderMinutes > 0)
      .map(ev => ({ ev, start: this.eventStart(ev).getTime() }))
      .filter(({ start }) => start > now && start - now <= 60000)
      .sort((a, b) => a.start - b.start);

    if (due.length === 0) {
      this._lastReminderKey = "";
      return;
    }

    const key = due.map(({ ev }) => ev.id).join("|");
    if (key === this._lastReminderKey) return; // already announced this batch
    this._lastReminderKey = key;

    due.forEach(({ ev }) => {
      const subject = ev.subject ? ` (${ev.subject})` : "";
      const message = `${ev.title}${subject} starts at ${this.formatClock(this.eventStart(ev))}`;
      this.showToast(`Reminder: ${message}`, "info");
      this.showNotification("StudyBuddy reminder", message);
    });
  }

  // ===========================================================================
  // 9e. Theme (Light / Dark)
  // ===========================================================================
  setupTheme() {
    // Sync the in-app state with whatever the login screen already applied.
    this.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

    document.getElementById("theme-toggle")?.addEventListener("click", () => this.toggleTheme());
    document.getElementById("theme-toggle-mobile")?.addEventListener("click", () => this.toggleTheme());

    // Follow the OS preference until the user makes an explicit choice.
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => {
        if (!ThemeBootstrap.readStored()) this.applyTheme(e.matches ? "dark" : "light", false);
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  toggleTheme() {
    this.applyTheme(this.theme === "dark" ? "light" : "dark", true);
  }

  applyTheme(theme, persistChoice) {
    ThemeBootstrap.set(theme, persistChoice);
    this.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  // ===========================================================================
  // 10. Rendering & Updating Views
  // ===========================================================================
  renderAll() {
    this.updateSubjectDropdowns();
    this.renderDashboardStats();
    this.renderDashboardReminders();
    this.renderDashboardPriorities();
    this.renderDashboardSchedule();
    this.renderDashboardNotes();
    this.renderTasks();
    this.renderCalendar();
    this.renderAgenda();
    this.renderTimetable();
    this.renderNotes();
    this.renderStreak();
    this.renderProgressStats();
  }

  // Populate dynamic subjects into filter & modal datalists
  updateSubjectDropdowns() {
    const taskSubjects = [...new Set(this.tasks.map(t => t.subject.trim()))];
    const noteSubjects = [...new Set(this.notes.map(n => n.subject.trim()))];
    const eventSubjects = [...new Set(this.events.map(e => (e.subject || "").trim()))];
    const allSubjects = [...new Set([...taskSubjects, ...noteSubjects, ...eventSubjects])].filter(Boolean).sort();

    // Task Filter Dropdown
    const taskFilter = document.getElementById("task-filter-subject");
    if (taskFilter) {
      const current = taskFilter.value;
      taskFilter.innerHTML = '<option value="all">All Subjects</option>' +
        allSubjects.map(s => `<option value="${s}" ${current === s ? 'selected' : ''}>${s}</option>`).join('');
    }

    // Note Filter Dropdown
    const noteFilter = document.getElementById("note-filter-subject");
    if (noteFilter) {
      const current = noteFilter.value;
      noteFilter.innerHTML = '<option value="all">All Subjects</option>' +
        allSubjects.map(s => `<option value="${s}" ${current === s ? 'selected' : ''}>${s}</option>`).join('');
    }
  }

  // Dashboard Stats
  renderDashboardStats() {
    const pendingTasks = this.tasks.filter(t => !t.completed);
    const completedTasks = this.tasks.filter(t => t.completed);

    const pendingBadge = document.getElementById("pending-badge");
    if (pendingBadge) pendingBadge.textContent = pendingTasks.length;

    const statPending = document.getElementById("stat-pending");
    if (statPending) statPending.textContent = pendingTasks.length;

    const statCompleted = document.getElementById("stat-completed");
    if (statCompleted) statCompleted.textContent = completedTasks.length;

    const quickDone = document.getElementById("quick-done-count");
    if (quickDone) quickDone.textContent = `${completedTasks.length} Completed`;

    // Today's Timetable count
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = daysOfWeek[new Date().getDay()];
    const todaySlots = this.timetable.filter(s => s.day === todayName);

    const statTodaySlots = document.getElementById("stat-today-slots");
    if (statTodaySlots) statTodaySlots.textContent = todaySlots.length;

    // Study Time
    const statStudyTime = document.getElementById("stat-study-time");
    if (statStudyTime) {
      const hours = Math.floor(this.focusMinutes / 60);
      const mins = this.focusMinutes % 60;
      statStudyTime.textContent = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    // Weekly Goal Progress Bar
    const totalAssignments = this.tasks.length;
    const completionRate = totalAssignments > 0 ? Math.round((completedTasks.length / totalAssignments) * 100) : 0;

    const dashPercent = document.getElementById("dash-goal-percent");
    if (dashPercent) dashPercent.textContent = `${completionRate}%`;

    const dashFill = document.getElementById("dash-progress-fill");
    if (dashFill) dashFill.style.width = `${completionRate}%`;

    const ratioEl = document.getElementById("dash-completed-ratio");
    if (ratioEl) ratioEl.textContent = `${completedTasks.length} of ${totalAssignments} assignments finished`;

    const encourEl = document.getElementById("dash-encouragement");
    if (encourEl) {
      if (completionRate === 100) encourEl.textContent = "Awesome job! You're all clear! 🌟";
      else if (completionRate >= 50) encourEl.textContent = "More than halfway there! Keep it up! 🚀";
      else encourEl.textContent = "Stay focused today! 💪";
    }
  }

  // Dashboard Upcoming Tasks (Left column)
  renderDashboardPriorities() {
    const container = document.getElementById("dashboard-urgent-tasks");
    if (!container) return;

    const pending = this.tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);

    if (pending.length === 0) {
      container.innerHTML = `
        <div class="p-3 text-center text-muted" style="padding: 1.5rem 0;">
          <i class="fa-solid fa-mug-hot" style="font-size: 1.75rem; color: #bae6fd; margin-bottom: 0.5rem; display: block;"></i>
          <p class="text-sm">No pending assignments right now. Enjoy your free time!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = pending.map(task => {
      const isUrgent = task.priority === "high";
      const dueFormatted = this.formatDueDateBadge(task.dueDate);

      return `
        <div class="compact-task-item ${isUrgent ? 'high' : ''}">
          <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
          <div class="compact-task-title">${this.escapeHTML(task.title)}</div>
          <div class="compact-task-meta">
            <span class="badge ${task.priority === 'high' ? 'badge-high' : 'badge-primary'}">${this.escapeHTML(task.subject)}</span>
            <span class="${dueFormatted.isOverdue ? 'text-rose font-medium' : ''}">${dueFormatted.text}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach checkbox events
    container.querySelectorAll(".task-checkbox").forEach(box => {
      box.addEventListener("change", (e) => {
        const id = e.target.dataset.taskId;
        this.toggleTaskCompletion(id);
      });
    });
  }

  // Dashboard Today's Schedule (Right column)
  renderDashboardSchedule() {
    const container = document.getElementById("dashboard-today-schedule");
    if (!container) return;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = daysOfWeek[new Date().getDay()];
    // If today has no slots (e.g. weekend), default to showing Monday's preview
    let slots = this.timetable.filter(s => s.day === todayName);
    let titleNote = todayName;
    if (slots.length === 0) {
      slots = this.timetable.filter(s => s.day === "Monday");
      titleNote = "Monday (Preview)";
    }

    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (slots.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted" style="padding: 1.5rem 0;">
          <i class="fa-solid fa-calendar-check" style="font-size: 1.75rem; color: #bae6fd; margin-bottom: 0.5rem; display: block;"></i>
          <p class="text-sm">No sessions planned for today.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = slots.slice(0, 3).map(slot => `
      <div class="compact-slot-item">
        <div class="compact-slot-time">
          ${slot.startTime} - ${slot.endTime}
        </div>
        <div class="compact-slot-details">
          <div class="compact-slot-title">${this.escapeHTML(slot.title)}</div>
          <div class="compact-slot-subj">${this.escapeHTML(slot.subject)} • ${this.escapeHTML(slot.type)}</div>
        </div>
        <button class="btn btn-sm ${slot.completed ? 'btn-ghost text-emerald' : 'btn-outline'}" data-slot-id="${slot.id}">
          ${slot.completed ? '<i class="fa-solid fa-check"></i>' : 'Done'}
        </button>
      </div>
    `).join('');

    container.querySelectorAll("button[data-slot-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.toggleTimetableSlotComplete(btn.dataset.slotId);
      });
    });
  }

  // Dashboard Recent Notes
  renderDashboardNotes() {
    const container = document.getElementById("dashboard-recent-notes");
    if (!container) return;

    const recent = this.notes.slice(0, 2);
    if (recent.length === 0) {
      container.innerHTML = `<p class="text-muted text-sm" style="grid-column: span 2;">No notes yet. Create your first note!</p>`;
      return;
    }

    container.innerHTML = recent.map(note => `
      <div class="mini-note-card" data-note-id="${note.id}">
        <div class="mini-note-title">${this.escapeHTML(note.title)}</div>
        <div class="mini-note-preview">${this.escapeHTML(note.content)}</div>
      </div>
    `).join('');

    container.querySelectorAll(".mini-note-card").forEach(card => {
      card.addEventListener("click", () => {
        const note = this.notes.find(n => n.id === card.dataset.noteId);
        if (note) this.openNoteModal(note);
      });
    });
  }

  // Dashboard: upcoming events with live countdowns
  renderDashboardReminders() {
    const container = document.getElementById("dashboard-reminders-list");
    if (!container) return;

    this.checkDueReminders();

    const upcoming = this.getUpcomingEvents(6);

    // Keep the Calendar nav badge showing how many events are still ahead.
    const badge = document.getElementById("calendar-badge");
    if (badge) badge.textContent = upcoming.length;

    if (upcoming.length === 0) {
      container.innerHTML = `
        <div class="empty-inline">
          <i class="fa-regular fa-bell"></i>
          <p class="text-sm">No upcoming tests or events planned. Add one from the Calendar tab!</p>
          <button class="quick-action-chip" data-tab="calendar"><i class="fa-solid fa-plus"></i> Plan an Event</button>
        </div>
      `;
      return;
    }

    container.innerHTML = upcoming.map(ev => {
      const typeInfo = this.eventTypeInfo(ev.type);
      const countdown = this.formatCountdown(ev);
      const isTest = ev.type === "test";
      const urgent = isTest || countdown.state === "urgent" || countdown.state === "now";

      return `
        <div class="reminder-item ${urgent ? 'is-urgent' : ''}">
          <div class="reminder-icon type-${ev.type}">
            <i class="${typeInfo.icon}"></i>
          </div>
          <div class="reminder-info">
            <div class="reminder-title">${this.escapeHTML(ev.title)}</div>
            <div class="reminder-when">
              <i class="fa-regular fa-calendar"></i> ${this.formatLongDate(this.eventStart(ev))}
              <span>·</span>
              <i class="fa-regular fa-clock"></i> ${this.formatClock(this.eventStart(ev))} – ${this.formatClock(this.eventEnd(ev))}
              ${ev.subject ? `<span class="badge badge-sky">${this.escapeHTML(ev.subject)}</span>` : ""}
            </div>
            <span class="reminder-countdown ${countdown.state === 'now' ? 'is-now' : ''} ${countdown.state === 'urgent' ? 'is-urgent' : ''}">
              <i class="fa-solid fa-hourglass-half"></i> ${this.escapeHTML(countdown.text)}
            </span>
          </div>
          <div class="reminder-actions">
            <button class="btn-icon-action edit-event-btn" data-event-id="${ev.id}" title="Edit event">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll(".edit-event-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const ev = this.events.find(e => e.id === btn.dataset.eventId);
        if (ev) this.openEventModal(ev);
      });
    });
  }

  // Calendar month grid
  renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const titleEl = document.getElementById("cal-month-title");
    if (!grid) return;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    if (titleEl) titleEl.textContent = `${monthNames[this.calendarMonth]} ${this.calendarYear}`;

    const firstOfMonth = new Date(this.calendarYear, this.calendarMonth, 1);
    // Monday-first grid offset
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();

    const todayKey = this.toDateKey(new Date());
    const cells = [];

    // Leading days from the previous month
    const prevMonthDays = new Date(this.calendarYear, this.calendarMonth, 0).getDate();
    for (let i = leadingBlanks - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const dateObj = new Date(this.calendarYear, this.calendarMonth - 1, d);
      cells.push({ dateObj, outside: true });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ dateObj: new Date(this.calendarYear, this.calendarMonth, d), outside: false });
    }

    // Trailing days to complete the final week row
    let trailing = cells.length % 7;
    if (trailing !== 0) {
      for (let d = 1; d <= 7 - trailing; d++) {
        cells.push({ dateObj: new Date(this.calendarYear, this.calendarMonth + 1, d), outside: true });
      }
    }

    grid.innerHTML = cells.map(cell => {
      const key = this.toDateKey(cell.dateObj);
      const dayEvents = this.events
        .filter(ev => ev.date === key)
        .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

      const classes = [
        "calendar-day",
        cell.outside ? "outside-month" : "",
        key === todayKey ? "today" : "",
        key === this.selectedDate ? "selected" : ""
      ].filter(Boolean).join(" ");

      const shown = dayEvents.slice(0, 2).map(ev => `
        <span class="day-event-chip type-${ev.type}">
          ${this.escapeHTML((ev.startTime || "").slice(0, 5))} ${this.escapeHTML(ev.title)}
        </span>
      `).join('');

      const more = dayEvents.length > 2
        ? `<span class="day-more">+${dayEvents.length - 2} more</span>`
        : "";

      return `
        <button class="${classes}" data-date="${key}">
          <span class="day-number">${cell.dateObj.getDate()}</span>
          <span class="day-events">${shown}${more}</span>
        </button>
      `;
    }).join('');

    grid.querySelectorAll(".calendar-day").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedDate = btn.dataset.date;
        // Selecting a day from an adjacent month follows it.
        const [y, m] = this.selectedDate.split("-").map(Number);
        if (y !== this.calendarYear || m - 1 !== this.calendarMonth) {
          this.calendarYear = y;
          this.calendarMonth = m - 1;
        }
        this.renderCalendar();
        this.renderAgenda();
      });
    });
  }

  // Agenda for the selected calendar day
  renderAgenda() {
    const container = document.getElementById("agenda-list");
    const emptyState = document.getElementById("agenda-empty-state");
    const titleEl = document.getElementById("agenda-date-title");
    const countEl = document.getElementById("agenda-count");
    if (!container) return;

    const selected = new Date(`${this.selectedDate}T00:00:00`);
    const todayKey = this.toDateKey(new Date());
    const yesterdayKey = this.toDateKey(new Date(Date.now() - 86400000));
    const tomorrowKey = this.toDateKey(new Date(Date.now() + 86400000));

    if (titleEl) {
      let label = this.selectedDate === todayKey ? "Today"
        : this.selectedDate === tomorrowKey ? "Tomorrow"
        : this.selectedDate === yesterdayKey ? "Yesterday"
        : selected.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      titleEl.textContent = `${label}'s Agenda`;
    }

    const dayEvents = this.events
      .filter(ev => ev.date === this.selectedDate)
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

    if (countEl) {
      countEl.textContent = `${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}`;
    }

    if (dayEvents.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    container.innerHTML = dayEvents.map(ev => {
      const typeInfo = this.eventTypeInfo(ev.type);
      const countdown = this.formatCountdown(ev);
      const duration = this.formatDurationShort(
        Math.round((this.eventEnd(ev) - this.eventStart(ev)) / 60000)
      );

      return `
        <div class="agenda-item type-${ev.type}">
          <div class="agenda-time">
            <span>${this.escapeHTML((ev.startTime || "").slice(0, 5))}</span>
            <span class="agenda-duration">${duration}</span>
          </div>
          <div class="agenda-content">
            <div class="agenda-title">${this.escapeHTML(ev.title)}</div>
            <div class="agenda-tags">
              <span class="badge badge-primary">${typeInfo.label}</span>
              ${ev.subject ? `<span class="badge badge-sky">${this.escapeHTML(ev.subject)}</span>` : ""}
              ${ev.location ? `<span class="agenda-meta"><i class="fa-solid fa-location-dot"></i> ${this.escapeHTML(ev.location)}</span>` : ""}
            </div>
            ${ev.notes ? `<p class="agenda-notes">${this.escapeHTML(ev.notes)}</p>` : ""}
          </div>
          <div class="agenda-actions">
            <span class="agenda-countdown ${countdown.state === 'now' ? 'is-now' : ''} ${countdown.state === 'past' ? 'is-past' : ''}">
              ${this.escapeHTML(countdown.text)}
            </span>
            <button class="btn-icon-action" data-event-id="${ev.id}" data-action="edit" title="Edit event">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action delete" data-event-id="${ev.id}" data-action="delete" title="Delete event">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll("[data-action='edit']").forEach(btn => {
      btn.addEventListener("click", () => {
        const ev = this.events.find(e => e.id === btn.dataset.eventId);
        if (ev) this.openEventModal(ev);
      });
    });

    container.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => this.deleteEvent(btn.dataset.eventId));
    });
  }

  // Render To-Do List (Assignments)
  renderTasks() {
    const container = document.getElementById("task-cards-list");
    const emptyState = document.getElementById("tasks-empty-state");
    const countLabel = document.getElementById("tasks-count-label");
    if (!container) return;

    let filtered = this.tasks.filter(t => {
      // Search
      const matchSearch = !this.taskSearch ||
        t.title.toLowerCase().includes(this.taskSearch) ||
        t.subject.toLowerCase().includes(this.taskSearch) ||
        (t.description && t.description.toLowerCase().includes(this.taskSearch));

      // Status
      const matchStatus = this.taskStatusFilter === "all" ? true :
        this.taskStatusFilter === "completed" ? t.completed : !t.completed;

      // Priority
      const matchPriority = this.taskPriorityFilter === "all" ? true : t.priority === this.taskPriorityFilter;

      // Subject
      const matchSubject = this.taskSubjectFilter === "all" ? true : t.subject === this.taskSubjectFilter;

      return matchSearch && matchStatus && matchPriority && matchSubject;
    });

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} assignment${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    container.innerHTML = filtered.map(task => {
      const due = this.formatDueDateBadge(task.dueDate);
      const priorityClass = `badge-${task.priority}`;

      return `
        <div class="task-card ${task.completed ? 'completed' : ''}" id="task-card-${task.id}">
          <div class="task-checkbox-wrapper">
            <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task as complete">
          </div>
          <div class="task-main">
            <div class="task-header-line">
              <span class="task-title">${this.escapeHTML(task.title)}</span>
              <span class="badge ${priorityClass}">${task.priority.toUpperCase()}</span>
              <span class="badge badge-sky">${this.escapeHTML(task.subject)}</span>
            </div>
            ${task.description ? `<p class="task-details">${this.escapeHTML(task.description)}</p>` : ''}
            <div class="task-meta-bar">
              <span class="task-meta-item ${due.isOverdue && !task.completed ? 'overdue' : ''}">
                <i class="fa-regular fa-calendar"></i> ${due.text}
              </span>
              <span class="task-meta-item">
                <i class="fa-regular fa-clock"></i> ~${task.estimatedTime || 45} mins
              </span>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-icon-action edit" data-task-id="${task.id}" title="Edit Assignment" aria-label="Edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action delete" data-task-id="${task.id}" title="Delete Assignment" aria-label="Delete">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    container.querySelectorAll(".task-checkbox").forEach(cb => {
      cb.addEventListener("change", (e) => {
        this.toggleTaskCompletion(e.target.dataset.taskId);
      });
    });

    container.querySelectorAll(".btn-icon-action.edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const task = this.tasks.find(t => t.id === btn.dataset.taskId);
        if (task) this.openTaskModal(task);
      });
    });

    container.querySelectorAll(".btn-icon-action.delete").forEach(btn => {
      btn.addEventListener("click", () => {
        this.deleteTask(btn.dataset.taskId);
      });
    });
  }

  // Render Daily Timetable
  renderTimetable() {
    const container = document.getElementById("timetable-slots-list");
    const emptyState = document.getElementById("timetable-empty-state");
    const dayTitle = document.getElementById("current-selected-day-title");
    const dayCount = document.getElementById("day-slot-count");
    if (!container) return;

    if (dayTitle) dayTitle.textContent = `${this.selectedDay} Study Schedule`;

    const daySlots = this.timetable
      .filter(s => s.day === this.selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (dayCount) {
      dayCount.textContent = `${daySlots.length} Session${daySlots.length === 1 ? '' : 's'} Planned`;
    }

    if (daySlots.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    container.innerHTML = daySlots.map(slot => {
      const durationStr = this.calculateDuration(slot.startTime, slot.endTime);
      return `
        <div class="schedule-card">
          <div class="schedule-time-block">
            <div class="time-range">${slot.startTime} - ${slot.endTime}</div>
            <div class="time-duration">${durationStr}</div>
          </div>
          <div class="schedule-content">
            <div class="schedule-tags">
              <span class="badge badge-primary">${this.escapeHTML(slot.subject)}</span>
              <span class="badge badge-sky">${this.escapeHTML(slot.type)}</span>
              ${slot.completed ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Completed</span>' : ''}
            </div>
            <div class="schedule-title">${this.escapeHTML(slot.title)}</div>
            ${slot.location ? `
              <div class="schedule-location">
                <i class="fa-solid fa-location-dot"></i> ${this.escapeHTML(slot.location)}
              </div>
            ` : ''}
          </div>
          <div class="schedule-actions">
            <button class="btn btn-sm ${slot.completed ? 'btn-ghost text-emerald' : 'btn-outline'}" data-slot-id="${slot.id}" data-action="toggle">
              ${slot.completed ? '<i class="fa-solid fa-check"></i> Done' : 'Mark Done'}
            </button>
            <button class="btn-icon-action" data-slot-id="${slot.id}" data-action="edit" title="Edit session">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action delete" data-slot-id="${slot.id}" data-action="delete" title="Delete session">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach actions
    container.querySelectorAll("[data-action='toggle']").forEach(btn => {
      btn.addEventListener("click", () => this.toggleTimetableSlotComplete(btn.dataset.slotId));
    });
    container.querySelectorAll("[data-action='edit']").forEach(btn => {
      btn.addEventListener("click", () => {
        const slot = this.timetable.find(s => s.id === btn.dataset.slotId);
        if (slot) this.openTimetableModal(slot);
      });
    });
    container.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => this.deleteTimetableSlot(btn.dataset.slotId));
    });
  }

  // Render Notes Section
  renderNotes() {
    const container = document.getElementById("notes-grid");
    const emptyState = document.getElementById("notes-empty-state");
    if (!container) return;

    let filtered = this.notes.filter(note => {
      const matchSearch = !this.noteSearch ||
        note.title.toLowerCase().includes(this.noteSearch) ||
        note.content.toLowerCase().includes(this.noteSearch) ||
        note.subject.toLowerCase().includes(this.noteSearch);

      const matchSubject = this.noteSubjectFilter === "all" ? true : note.subject === this.noteSubjectFilter;

      return matchSearch && matchSubject;
    });

    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");

    container.innerHTML = filtered.map(note => {
      const accent = note.color || "sky";
      return `
        <div class="note-card accent-${accent}">
          <div>
            <div class="note-header">
              <h3 class="note-title">${this.escapeHTML(note.title)}</h3>
              <button class="btn-icon-action delete" data-note-id="${note.id}" title="Delete Note">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
            <span class="note-subject-tag">${this.escapeHTML(note.subject)}</span>
            <p class="note-body">${this.escapeHTML(note.content)}</p>
          </div>
          <div class="note-footer">
            <span><i class="fa-regular fa-calendar"></i> ${note.updatedAt || 'Recent'}</span>
            <button class="btn btn-sm btn-outline edit-note-btn" data-note-id="${note.id}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll(".edit-note-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const note = this.notes.find(n => n.id === btn.dataset.noteId);
        if (note) this.openNoteModal(note);
      });
    });

    container.querySelectorAll(".note-card .delete").forEach(btn => {
      btn.addEventListener("click", () => {
        this.deleteNote(btn.dataset.noteId);
      });
    });
  }

  // Render Progress & Focus Analytics
  renderProgressStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const badge = document.getElementById("completion-percentage-badge");
    if (badge) badge.textContent = `${percent}% Completed`;

    const bar = document.getElementById("progress-assignments-bar");
    if (bar) bar.style.width = `${percent}%`;

    const progComp = document.getElementById("prog-completed-tasks");
    if (progComp) progComp.textContent = completed;

    const progPend = document.getElementById("prog-pending-tasks");
    if (progPend) progPend.textContent = pending;

    const pomoSessionsEl = document.getElementById("pomodoro-sessions-counter");
    if (pomoSessionsEl) pomoSessionsEl.textContent = `${this.pomodoroSessions} Session${this.pomodoroSessions === 1 ? '' : 's'} Logged`;

    // Subject breakdown
    const breakdownContainer = document.getElementById("subject-breakdown-list");
    if (breakdownContainer) {
      const subjectMap = {};
      this.tasks.forEach(t => {
        const subj = t.subject || "General";
        if (!subjectMap[subj]) subjectMap[subj] = { total: 0, completed: 0 };
        subjectMap[subj].total++;
        if (t.completed) subjectMap[subj].completed++;
      });

      const entries = Object.entries(subjectMap);
      if (entries.length === 0) {
        breakdownContainer.innerHTML = `<p class="text-sm text-muted">No subject data available yet.</p>`;
      } else {
        breakdownContainer.innerHTML = entries.map(([subj, data]) => {
          const sPercent = Math.round((data.completed / data.total) * 100);
          return `
            <div class="subject-bar-item">
              <div class="subject-bar-header">
                <span>${this.escapeHTML(subj)}</span>
                <span>${data.completed}/${data.total} tasks (${sPercent}%)</span>
              </div>
              <div class="subject-bar-bg">
                <div class="subject-bar-fill" style="width: ${sPercent}%"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // ===========================================================================
  // 11. Helper Utilities
  // ===========================================================================
  formatDueDateBadge(dueDateStr) {
    if (!dueDateStr) return { text: "No due date", isOverdue: false };

    const due = new Date(dueDateStr + "T23:59:59");
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: "Due Today!", isOverdue: false };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow", isOverdue: false };
    } else {
      return { text: `Due in ${diffDays} days`, isOverdue: false };
    }
  }

  calculateDuration(start, end) {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60; // Overnight wrap
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h} hr${h > 1 ? 's' : ''}`;
      return `${m} mins`;
    } catch (e) {
      return "1h";
    }
  }

  escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// =============================================================================
// 12. Bootstrap: Google Sign-In Gate & App Startup
// =============================================================================
/** Applies and toggles the colour theme before/independent of app init. */
const ThemeBootstrap = {
  KEY: "studybuddy-theme",

  readStored() {
    try {
      const v = localStorage.getItem(this.KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  },

  prefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  },

  applyInitialTheme() {
    const theme = this.readStored() || (this.prefersDark() ? "dark" : "light");
    this.set(theme, false);
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    this.set(current === "dark" ? "light" : "dark", true);
  },

  set(theme, persist) {
    const value = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);

    // Keep every toggle button's icon in sync (sun while dark, moon while light).
    const icon = value === "dark" ? "fa-sun" : "fa-moon";
    document.querySelectorAll(".theme-toggle-btn i").forEach(el => {
      el.classList.remove("fa-sun", "fa-moon");
      el.classList.add(icon);
    });

    if (persist) {
      try {
        localStorage.setItem(this.KEY, value);
      } catch (e) {
        /* Persisting is best-effort. */
      }
    }
  }
};

const AuthGate = {
  screen: null,
  loading: null,
  errorBox: null,
  signInBtn: null,

  init() {
    this.screen = document.getElementById("auth-screen");
    this.loading = document.getElementById("auth-loading");
    this.errorBox = document.getElementById("auth-error");
    this.signInBtn = document.getElementById("google-signin-btn");

    const buildEl = document.getElementById("auth-build");
    if (buildEl) buildEl.textContent = APP_BUILD;

    if (!window.supabase) {
      this.showError(
        "The Supabase library couldn't be loaded from the CDN. Check your internet connection " +
        "and any ad-blocker extension (uBlock Origin, Brave Shields…) that may be blocking " +
        "<code>jsdelivr.net</code> or <code>supabase.co</code>, then reload the page."
      );
      if (this.signInBtn) this.signInBtn.disabled = true;
      return;
    }

    if (!IS_CONFIGURED) {
      this.showError(
        "Supabase isn't configured yet. Open <code>config.js</code>, paste your project URL + anon key, " +
        "run <code>supabase/schema.sql</code> in the SQL editor, and enable the Google provider."
      );
      if (this.signInBtn) this.signInBtn.disabled = true;
      return;
    }

    this.signInBtn?.addEventListener("click", () => this.signInWithGoogle());
  },

  showScreen() { this.screen?.classList.remove("hidden"); },
  hideScreen() { this.screen?.classList.add("hidden"); },

  showLoading(text) {
    const textEl = document.getElementById("auth-loading-text");
    if (text && textEl) textEl.textContent = `${text} (${APP_BUILD})`;
    this.loading?.classList.remove("hidden");
  },

  hideLoading() { this.loading?.classList.add("hidden"); },

  showError(message) {
    if (!this.errorBox) return;
    this.errorBox.innerHTML = message;
    this.errorBox.classList.remove("hidden");
    console.error("[StudyBuddy auth]", message.replace(/<[^>]+>/g, ""));
  },

  hideError() {
    this.errorBox?.classList.add("hidden");
  },

  resetSignInButton() {
    if (this.signInBtn) this.signInBtn.disabled = false;
    const label = document.getElementById("google-signin-label");
    if (label) label.textContent = "Continue with Google";
  },

  /**
   * Supabase/Google send failures back as URL parameters (e.g. ?error=redirect_url_not_allowed
   * or #error=access_denied). Without this, the user would just silently land back on the
   * login screen with no clue why. Parse and explain them.
   */
  consumeUrlAuthErrors() {
    let params;
    try {
      params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      hash.forEach((value, key) => { if (!params.has(key)) params.set(key, value); });
    } catch (e) {
      return false;
    }

    const error = params.get("error") || params.get("error_code");
    const description = params.get("error_description") || "";
    const hadCode = Boolean(params.get("code")); // PKCE callback — consumed by getSession()

    if (!error && !hadCode) return false;

    if (error) {
      let friendly;
      if (error === "redirect_url_not_allowed" || error.includes("redirect")) {
        friendly = "Google signed you in, but Supabase refused to send you back to this site. " +
          "Fix: in Supabase → Authentication → URL Configuration, add <code>" + window.location.origin +
          "</code> to the Redirect URLs list.";
      } else if (error === "access_denied") {
        friendly = "Google sign-in was cancelled or denied. Please try again and choose an account.";
      } else if (error.includes("verify") || error.includes("verification")) {
        friendly = "Your Google account needs to be verified by Supabase first — check your email " +
          "for a verification link, or in Supabase → Authentication → Providers → Google, disable " +
          "\"Confirm email\" for testing.";
      } else {
        friendly = "Sign-in failed: <code>" + this.escapeText(error) + "</code>" +
          (description ? " — " + this.escapeText(decodeURIComponent(description)) : "");
      }
      this.showError(friendly);
    }

    // Clean the URL so a reload doesn't replay the same error / stale OAuth code.
    window.history.replaceState(null, "", window.location.pathname);
    return true;
  },

  escapeText(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  async signInWithGoogle() {
    if (!supabaseClient) return;

    // Google's OAuth flow requires a real http(s) origin to redirect back to.
    if (location.protocol === "file:") {
      this.showError(
        "StudyBuddy is open as a local file, so Google can't redirect back to it. " +
        "Run a local server instead — e.g. <code>python -m http.server 8000</code> — " +
        "then open <code>http://localhost:8000</code>."
      );
      return;
    }

    this.hideError();
    if (this.signInBtn) this.signInBtn.disabled = true;
    const label = document.getElementById("google-signin-label");
    if (label) label.textContent = "Redirecting to Google…";

    const urlBefore = window.location.href;

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;

      // Safety net: if we're still on this page a few seconds later, the redirect
      // silently failed — give the user a way out instead of a dead button.
      setTimeout(() => {
        if (window.location.href === urlBefore) {
          this.resetSignInButton();
          this.showError(
            "The browser didn't redirect to Google. Check your internet connection and any " +
            "ad-blocker/privacy extension blocking <code>supabase.co</code>, then try again."
          );
        }
      }, 3500);
    } catch (err) {
      console.error("[StudyBuddy] Google sign-in failed:", err);
      this.resetSignInButton();
      this.showError(
        "Couldn't start Google sign-in: <code>" + this.escapeText(err?.message || err) + "</code>. " +
        "This is usually caused by a network problem or an ad-blocker/privacy extension blocking " +
        "<code>supabase.co</code> — check the browser console (F12) for details."
      );
    }
  }
};

/**
 * Turn a workspace-load failure into a friendly, actionable message (as HTML).
 */
function describeWorkspaceError(e) {
  const msg = (e && e.message) || String(e);
  if (msg.includes("PGRST205") || /could not find the table/i.test(msg)) {
    return "The database table is missing. Run the contents of <code>supabase/schema.sql</code> " +
      "in the Supabase SQL editor, then reload this page.";
  }
  if (/timed out/i.test(msg)) {
    return "Loading your workspace timed out — an ad-blocker or privacy extension " +
      "(uBlock Origin, Brave Shields, …) is very often the cause. Disable it for this site " +
      "and reload. Technical detail: <code>" + AuthGate.escapeText(msg) + "</code>";
  }
  return "Couldn't load your workspace: <code>" + AuthGate.escapeText(msg) + "</code>. " +
    "Press F12 → Console for details, then reload to try again.";
}

async function bootWithSession(session) {
  if (window.studyBuddy) return; // already booted in this page load

  AuthGate.hideScreen();
  AuthGate.showLoading("Preparing your workspace…");

  // Watchdog: never leave the user on the spinner forever. If boot doesn't
  // finish in 25s, show a real error they can act on.
  const watchdog = setTimeout(() => {
    console.error("[StudyBuddy] Boot timed out after 25s — the request to Supabase never settled.");
    window.studyBuddy = null;
    AuthGate.hideLoading();
    AuthGate.showScreen();
    AuthGate.showError(
      "Loading took too long — the connection to Supabase isn't going through. " +
      "The usual culprit is an ad-blocker/privacy extension or a bad network. " +
      "Press F12 → Console for details, then reload to try again."
    );
  }, 25000);

  try {
    window.studyBuddy = new StudyBuddyApp();
    await window.studyBuddy.startSession(session);
    clearTimeout(watchdog);
    document.getElementById("app-layout")?.classList.remove("hidden");
  } catch (e) {
    clearTimeout(watchdog);
    console.error("[StudyBuddy] Failed to start StudyBuddy:", e);
    window.studyBuddy = null;
    AuthGate.hideLoading();
    AuthGate.showScreen();
    AuthGate.showError(e?.isAuthHtml ? e.message : describeWorkspaceError(e));
    return;
  }

  AuthGate.hideLoading();
}

document.addEventListener("DOMContentLoaded", async () => {
  // Apply the saved/OS theme immediately so the login screen matches too,
  // and wire the login screen's own toggle (the app's setupTheme() wires the rest).
  ThemeBootstrap.applyInitialTheme();
  document.getElementById("theme-toggle-auth")?.addEventListener("click", () => ThemeBootstrap.toggle());

  AuthGate.init();

  if (!supabaseClient) return; // Not configured — the login screen explains what to do.

  // Surface any OAuth error Google/Supabase bounced back in the URL.
  const urlHadAuthParams = AuthGate.consumeUrlAuthErrors();

  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

  if (session) {
    await bootWithSession(session);
    return;
  }

  if (sessionError && !urlHadAuthParams) {
    // The PKCE code exchange (return trip from Google) failed.
    console.error("[StudyBuddy] Session error:", sessionError);
    window.history.replaceState(null, "", window.location.pathname);
    AuthGate.showError(
      "Your sign-in couldn't be completed: <code>" +
      AuthGate.escapeText(sessionError.message || sessionError) + "</code>. Please try again."
    );
  }

  AuthGate.showScreen();

  // React to auth events (e.g. sign-in completed in another tab). The setTimeout
  // releases supabase-js's internal auth lock first — calling async auth methods
  // directly inside this callback is a documented deadlock in supabase-js v2.
  supabaseClient.auth.onAuthStateChange((event, session) => {
    setTimeout(() => {
      if (event === "SIGNED_IN" && session) {
        bootWithSession(session);
      } else if (event === "SIGNED_OUT" && window.studyBuddy) {
        window.location.reload();
      }
    }, 0);
  });
});
