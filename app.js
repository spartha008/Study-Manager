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

/**
 * RemoteStore - reads/writes the signed-in user's single workspace row in
 * Supabase. Row Level Security (see supabase/schema.sql) guarantees that each
 * user can only ever touch their own data.
 */
class RemoteStore {
  static async load(userId) {
    const { data, error } = await supabaseClient
      .from("studybuddy_state")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data?.data || null;
  }

  static async save(userId, state) {
    const { error } = await supabaseClient
      .from("studybuddy_state")
      .upsert(
        { user_id: userId, data: state, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) throw error;
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
    } catch (e) {}
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
    this.focusMinutes = 0;
    this.pomodoroSessions = 0;
    this._persistTimer = null;
    this._initialized = false;

    this.currentTab = "dashboard";
    this.selectedDay = "Monday";

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
    this.setupPomodoroEvents();
    this.setupQuotes();
    
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

    let saved = null;
    try {
      saved = await RemoteStore.load(this.user.id);
    } catch (e) {
      console.error("Failed to load cloud workspace:", e);
      this.showToast("Couldn't load your cloud workspace. Is the supabase/schema.sql table created?", "alert");
    }

    if (saved && typeof saved === "object") {
      this.tasks = Array.isArray(saved.tasks) ? saved.tasks : JSON.parse(JSON.stringify(DEFAULT_TASKS));
      this.timetable = Array.isArray(saved.timetable) ? saved.timetable : JSON.parse(JSON.stringify(DEFAULT_TIMETABLE));
      this.notes = Array.isArray(saved.notes) ? saved.notes : JSON.parse(JSON.stringify(DEFAULT_NOTES));
      this.focusMinutes = Number(saved.focusMinutes) || 0;
      this.pomodoroSessions = Number(saved.pomodoroSessions) || 0;
    } else {
      // First sign-in on this account: seed the friendly sample workspace.
      this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
      this.timetable = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE));
      this.notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
      this.focusMinutes = 75;
      this.pomodoroSessions = 3;
      this.persist();
    }

    this.init();
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
      focusMinutes: this.focusMinutes,
      pomodoroSessions: this.pomodoroSessions
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

    // Reset Demo Data
    const resetBtn = document.getElementById("reset-demo-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset StudyBuddy to initial sample study data? This will refresh your tasks, timetable, and notes.")) {
          this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
          this.timetable = JSON.parse(JSON.stringify(DEFAULT_TIMETABLE));
          this.notes = JSON.parse(JSON.stringify(DEFAULT_NOTES));
          this.focusMinutes = 75;
          this.pomodoroSessions = 3;
          this.persist();
          this.renderAll();
          this.showToast("Demo data reset successfully!", "info");
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

    // Close on backdrop click
    [taskModal, timetableModal, noteModal].forEach(modal => {
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
  // 10. Rendering & Updating Views
  // ===========================================================================
  renderAll() {
    this.updateSubjectDropdowns();
    this.renderDashboardStats();
    this.renderDashboardPriorities();
    this.renderDashboardSchedule();
    this.renderDashboardNotes();
    this.renderTasks();
    this.renderTimetable();
    this.renderNotes();
    this.renderProgressStats();
  }

  // Populate dynamic subjects into filter & modal datalists
  updateSubjectDropdowns() {
    const taskSubjects = [...new Set(this.tasks.map(t => t.subject.trim()))];
    const noteSubjects = [...new Set(this.notes.map(n => n.subject.trim()))];
    const allSubjects = [...new Set([...taskSubjects, ...noteSubjects])].filter(Boolean).sort();

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
    if (text && textEl) textEl.textContent = text;
    this.loading?.classList.remove("hidden");
  },

  hideLoading() { this.loading?.classList.add("hidden"); },

  showError(message) {
    if (!this.errorBox) return;
    this.errorBox.innerHTML = message;
    this.errorBox.classList.remove("hidden");
  },

  resetSignInButton() {
    if (this.signInBtn) this.signInBtn.disabled = false;
    const label = document.getElementById("google-signin-label");
    if (label) label.textContent = "Continue with Google";
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

    if (this.signInBtn) this.signInBtn.disabled = true;
    const label = document.getElementById("google-signin-label");
    if (label) label.textContent = "Redirecting to Google…";

    const { error } = await supabaseClient.auth.signInWithProvider("google", {
      options: { redirectTo: window.location.origin }
    });

    if (error) {
      console.error("Google sign-in failed:", error);
      this.showError(
        "Sign-in failed: " + error.message +
        " — double-check that the Google provider is enabled and your site URL is in " +
        "Supabase's Authentication → URL Configuration allow list."
      );
      this.resetSignInButton();
    }
  }
};

async function bootWithSession(session) {
  if (window.studyBuddy) return; // already booted in this page load

  AuthGate.hideScreen();
  AuthGate.showLoading("Preparing your workspace…");

  try {
    window.studyBuddy = new StudyBuddyApp();
    await window.studyBuddy.startSession(session);
    document.getElementById("app-layout")?.classList.remove("hidden");
  } catch (e) {
    console.error("Failed to start StudyBuddy:", e);
    window.studyBuddy = null;
    AuthGate.hideLoading();
    AuthGate.showScreen();
    AuthGate.showError("Something went wrong while loading your workspace. Please sign in again.");
    await supabaseClient?.auth.signOut();
    return;
  }

  AuthGate.hideLoading();
}

document.addEventListener("DOMContentLoaded", async () => {
  AuthGate.init();

  if (!supabaseClient) return; // Not configured — the login screen explains what to do.

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    await bootWithSession(session);
  } else {
    AuthGate.showScreen();
  }

  // React to auth events (e.g. sign-out from another tab).
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      bootWithSession(session);
    } else if (event === "SIGNED_OUT" && window.studyBuddy) {
      window.location.reload();
    }
  });
});
