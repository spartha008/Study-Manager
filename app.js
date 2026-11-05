/**
 * StudyBuddy - Modern Student Study Planner
 * Core application logic: cloud sync, rendering, focus timer, command palette
 * and the encrypted journal.
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
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Quality is not an act, it is a habit.", author: "Will Durant" },
  { text: "You will never always be motivated, so you must learn to be disciplined.", author: "Unknown" }
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
const APP_BUILD = "build 2026-11-05a";

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

// =============================================================================
// 3b. Motion helpers — count-ups, exits, ripples, spotlight, theme reveal
// =============================================================================
const ENTER_SELECTOR = [
  ".dash-hero-main", ".dash-next", ".stat-tile", ".dash-grid > .card", ".dash-quote",
  ".toolbar", ".quick-add-row", ".list-summary", ".task-group",
  ".calendar-card", ".calendar-agenda-card", ".day-header-summary", ".schedule-card", ".week-col",
  ".notes-section-label", ".note-card", ".marks-insights > .card", ".mark-row",
  ".timer-card", ".progress-metrics-column > .card",
  ".journal-lock", ".journal-list-card", ".journal-editor-card",
  ".deck-card", ".fc-header", ".fc-add", ".fc-row", ".study-wrap", ".empty-state"
].join(", ");

const RIPPLE_SELECTOR = ".btn, .icon-btn, .nav-item, .bnav-item, .bnav-add, .segmented-btn, .menu-item, .day-chip, .stat-tile, .palette-item, .choice span, .fo-btn, .sidebar-search, .search-trigger";

const Motion = {
  _counters: new WeakMap(),

  reduced() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  },

  /** Web Animations API wrapper that respects reduced motion. */
  animate(el, keyframes, options) {
    if (!el || typeof el.animate !== "function" || this.reduced()) return null;
    return el.animate(keyframes, options);
  },

  /** Counts an element's number up (or down) to `value`. */
  countTo(el, value, format = (v) => String(Math.round(v))) {
    if (!el) return;
    const to = Number(value) || 0;
    const running = this._counters.get(el);
    if (running && running.to === to) return;
    const hasPrev = el.dataset.num !== undefined && el.dataset.num !== "";
    const from = running ? running.current : (hasPrev ? Number(el.dataset.num) : 0);
    el.dataset.num = String(to);
    if (running) {
      cancelAnimationFrame(running.raf);
      clearTimeout(running.fallback);
    }
    if (this.reduced() || from === to || document.hidden) {
      this._counters.delete(el);
      el.textContent = format(to);
      return;
    }
    const duration = 850;
    const state = { to, current: from, raf: 0, fallback: 0 };
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      state.current = from + (to - from) * eased;
      el.textContent = format(state.current);
      if (t < 1) state.raf = requestAnimationFrame(step);
      else this._counters.delete(el);
    };
    // If frames are throttled (background tab), still land on the right number.
    state.fallback = setTimeout(() => {
      if (this._counters.get(el) === state) {
        cancelAnimationFrame(state.raf);
        this._counters.delete(el);
        el.textContent = format(to);
      }
    }, duration + 400);
    this._counters.set(el, state);
    el.textContent = format(from);
    state.raf = requestAnimationFrame(step);
  },

  /** Collapses an element's height to zero (slide + fade), then calls done(). */
  collapseOut(el, done) {
    if (!el || !el.isConnected || this.reduced()) {
      done();
      return;
    }
    el.style.boxSizing = "border-box";
    el.style.height = `${el.offsetHeight}px`;
    void el.offsetHeight;
    el.classList.add("is-leaving");
    el.style.height = "0px";
    el.style.paddingTop = "0px";
    el.style.paddingBottom = "0px";
    el.style.marginTop = "0px";
    el.style.marginBottom = "0px";
    el.style.borderTopWidth = "0px";
    el.style.borderBottomWidth = "0px";
    setTimeout(done, 330);
  },

  ripple(e) {
    if (e.button !== 0 || this.reduced()) return;
    const host = e.target.closest && e.target.closest(RIPPLE_SELECTOR);
    if (!host || host.disabled) return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const wave = document.createElement("span");
    wave.className = "ripple";
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${e.clientX - rect.left - size / 2}px`;
    wave.style.top = `${e.clientY - rect.top - size / 2}px`;
    host.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
    setTimeout(() => wave.remove(), 900);
  },

  spotlight(e) {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const el = e.target.closest && e.target.closest(".card, .stat-tile, .note-card");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  },

  bindGlobal() {
    if (this._bound) return;
    this._bound = true;
    document.addEventListener("pointerdown", (e) => this.ripple(e), { passive: true });
    document.addEventListener("pointermove", (e) => this.spotlight(e), { passive: true });
  },

  /** Runs `apply` (which flips the theme) as a circular reveal from `origin`. */
  themeSwitch(apply, origin) {
    if (!document.startViewTransition || this.reduced()) {
      apply();
      return;
    }
    const root = document.documentElement;
    let x = window.innerWidth - 60;
    let y = 30;
    if (origin && typeof origin.getBoundingClientRect === "function") {
      const r = origin.getBoundingClientRect();
      if (r.width) {
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
    }
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.classList.add("theme-transition");
    try {
      const transition = document.startViewTransition(apply);
      transition.finished.finally(() => root.classList.remove("theme-transition"));
    } catch (e) {
      root.classList.remove("theme-transition");
      apply();
    }
  }
};

// =============================================================================
// 3c. Ambient sound for focus mode — generated noise, no audio files needed
// =============================================================================
const AmbientSound = {
  ctx: null,
  gain: null,
  source: null,
  kind: "off",
  volume: 0.5,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return true;
  },

  makeBuffer(kind) {
    const ctx = this.ctx;
    const length = Math.floor(ctx.sampleRate * 4);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        if (kind === "brown") {
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5;
        } else if (kind === "rain") {
          // Pink noise (Paul Kellet) — filtered below into a soft rainfall.
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        } else {
          data[i] = white * 0.3;
        }
      }
    }
    return buffer;
  },

  play(kind) {
    if (!kind || kind === "off") {
      this.stop();
      return;
    }
    if (!this.ensure()) return;
    const ctx = this.ctx;
    this.stopSource();
    const src = ctx.createBufferSource();
    src.buffer = this.makeBuffer(kind);
    src.loop = true;
    let node = src;
    if (kind === "rain") {
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 450;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 6500;
      src.connect(hp);
      hp.connect(lp);
      node = lp;
    } else if (kind === "brown") {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1000;
      src.connect(lp);
      node = lp;
    }
    node.connect(this.gain);
    src.start();
    this.source = src;
    this.kind = kind;
    const now = ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(this.volume * 0.6, now + 1.5);
  },

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.ctx && this.source) this.gain.gain.setTargetAtTime(this.volume * 0.6, this.ctx.currentTime, 0.15);
  },

  stopSource() {
    if (!this.source) return;
    try { this.source.stop(); } catch (e) { /* already stopped */ }
    this.source.disconnect();
    this.source = null;
  },

  stop() {
    this.kind = "off";
    if (!this.ctx || !this.source) return;
    const src = this.source;
    this.source = null;
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0, now + 0.6);
    setTimeout(() => {
      try { src.stop(); } catch (e) { /* already stopped */ }
      src.disconnect();
    }, 700);
  }
};

class ConfettiFX {
  /** Bursts confetti from (x, y) — defaults to the middle of the screen. */
  static launch(x, y) {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas || Motion.reduced()) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ConfettiFX.dpr = dpr;
    ConfettiFX.particles = ConfettiFX.particles || [];
    const ox = typeof x === "number" ? x : w / 2;
    const oy = typeof y === "number" ? y : h / 2;
    const colors = ["#5b4cf0", "#8b5cf6", "#ec4899", "#22c3a6", "#f5b83d", "#38bdf8", "#ff7a59"];
    for (let i = 0; i < 110; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
      const speed = 6 + Math.random() * 11;
      ConfettiFX.particles.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 6,
        h: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        circle: Math.random() < 0.22,
        life: 0,
        maxLife: 90 + Math.random() * 60,
        wobble: Math.random() * 10
      });
    }
    if (!ConfettiFX.running) {
      ConfettiFX.running = true;
      requestAnimationFrame(ConfettiFX.frame);
    }
  }

  static frame() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) { ConfettiFX.running = false; return; }
    const ctx = canvas.getContext("2d");
    const dpr = ConfettiFX.dpr || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ConfettiFX.particles = ConfettiFX.particles.filter(p => p.life < p.maxLife);
    for (const p of ConfettiFX.particles) {
      p.life++;
      p.vy += 0.32;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx + Math.sin((p.life + p.wobble) / 7) * 0.7;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, (p.maxLife - p.life) / 30));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.scale(1, Math.cos(p.life / 6));
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }
    if (ConfettiFX.particles.length) {
      requestAnimationFrame(ConfettiFX.frame);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ConfettiFX.running = false;
    }
  }
}

// =============================================================================
// 4. Main Application Class
// =============================================================================
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TAB_ORDER = ["dashboard", "assignments", "calendar", "timetable", "notes", "flashcards", "marks", "progress", "journal"];
const TAB_META = {
  dashboard: { title: "Today", subtitle: null, icon: "fa-solid fa-house" },
  assignments: { title: "Assignments", subtitle: "Coursework, homework and projects — grouped by when they're due", icon: "fa-solid fa-list-check" },
  calendar: { title: "Calendar", subtitle: "Tests, classes and events, plus every assignment deadline", icon: "fa-regular fa-calendar" },
  timetable: { title: "Timetable", subtitle: "Your weekly study rhythm — sessions repeat every week", icon: "fa-solid fa-table-cells" },
  notes: { title: "Notes", subtitle: "Lecture takeaways, formulas and exam tips", icon: "fa-regular fa-note-sticky" },
  flashcards: { title: "Flashcards", subtitle: "Spaced repetition — review what's due, skip what you already know", icon: "fa-solid fa-layer-group" },
  marks: { title: "Marks & Grades", subtitle: "Scores, averages and where to focus next", icon: "fa-solid fa-award" },
  progress: { title: "Focus & Progress", subtitle: "Pomodoro timer, focus history and study habits", icon: "fa-solid fa-stopwatch" },
  journal: { title: "Journal", subtitle: "Private and encrypted — one page a day", icon: "fa-solid fa-feather-pointed" }
};
const DEFAULT_SETTINGS = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  focusGoal: 60,
  autoStart: false,
  sounds: true,
  confetti: true,
  ambient: "off",
  ambientVolume: 50
};
const DEFAULT_SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Chemistry", "Biology", "History", "Literature", "Economics"];
const IS_MAC = /Mac|iPhone|iPad|iPod/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent || "");
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

class StudyBuddyApp {
  constructor() {
    // Workspace data — hydrated from the signed-in user's cloud profile in startSession().
    this.user = null;
    this.firstName = "";
    this.tasks = [];
    this.timetable = [];
    this.notes = [];
    this.events = [];
    this.marks = [];
    this.decks = [];
    this.settings = { ...DEFAULT_SETTINGS };
    this.focusLog = {};               // { "YYYY-MM-DD": minutes focused that day }

    // Private journal. `journalEntries` only ever lives in memory and only
    // while unlocked; `journalBlob` is the encrypted, cloud-synced form of it.
    this.journalBlob = null;          // { v:2, data:{iv,data}, pw:{salt,verifier,iv,key}, recovery?, updatedAt }
    this.journalEntries = [];
    this.journalKey = null;           // AES-GCM data key that seals the entries while unlocked
    this.journalUnlocked = false;
    this.journalSelectedDate = this.toDateKey(new Date());
    this.journalSearch = "";
    this.journalDirty = false;
    this.journalPendingImport = null; // backup file waiting to be restored
    this.journalResetMode = false;    // lock card is asking the recovery question
    this.journalPromptOffset = 0;
    this._journalSaveTimer = null;
    this._journalMood = null;
    this._journalEditorDate = null;
    this._journalLockMode = null;

    this.focusMinutes = 0;
    this.pomodoroSessions = 0;
    this.activeDates = [];
    this._persistTimer = null;
    this._reminderTick = null;
    this._initialized = false;
    this._flash = null;
    this._lastSubject = "";
    this._editingSubtasks = [];
    this._expandedTasks = new Set();

    // Flashcards
    this.fcView = "decks"; // decks | deck | study
    this.fcDeckId = null;
    this.fcSession = null;
    this.deckSearch = "";

    this.currentTab = "dashboard";
    this.selectedDay = this.todayName();
    this.timetableView = "day";

    // Calendar state
    const now = new Date();
    this.calendarYear = now.getFullYear();
    this.calendarMonth = now.getMonth(); // 0-indexed
    this.selectedDate = this.toDateKey(now);

    // Pomodoro timer — runs off a wall-clock end time so it stays accurate
    // even when the browser throttles background tabs.
    this.timerMode = "pomodoro"; // pomodoro | shortBreak | longBreak
    this.timeLeft = this.modeSeconds("pomodoro");
    this.timerInterval = null;
    this.timerEndsAt = null;
    this.isTimerRunning = false;
    this.timerTaskId = "";
    this.cycleCount = 0;

    // Filters & search
    this.taskSearch = "";
    this.taskStatusFilter = "pending";
    this.taskPriorityFilter = "all";
    this.taskSubjectFilter = "all";
    this.taskSort = "due";

    this.noteSearch = "";
    this.noteSubjectFilter = "all";

    this.markSearch = "";
    this.markSubjectFilter = "all";
    this.markSort = "recent"; // recent | oldest | highest | lowest

    // Command palette & dialogs
    this.paletteItems = [];
    this.paletteIndex = 0;
    this._confirmResolve = null;
    this._lastFocus = null;

    this.theme = "light";

    this.init();
  }

  init() {
    if (this._initialized) return;
    this._initialized = true;

    this.setupNavigation();
    this.setupModals();
    this.setupConfirmDialog();
    this.setupQuickAdd();
    this.setupPalette();
    this.setupShortcuts();
    this.setupSettings();
    this.setupDashboardEvents();
    this.setupTaskEvents();
    this.setupTimetableEvents();
    this.setupNoteEvents();
    this.setupCalendarEvents();
    this.setupMarkEvents();
    this.setupJournalEvents();
    this.setupPomodoroEvents();
    this.setupFlashcards();
    this.setupFocusMode();
    this.setupSubtaskEditor();
    this.setupGradeCalculator();
    this.setupSidebarCollapse();
    Motion.bindGlobal();
    this.setupQuotes();
    this.setupTheme();
    this.startReminderTicker();
    this.updateShortcutLabels();
    this.updatePageHeader();

    this.renderAll();
  }

  // ===========================================================================
  // Session & Cloud Sync
  // ===========================================================================
  /**
   * Called after Google sign-in: loads this user's workspace from Supabase,
   * then boots the UI.
   */
  async startSession(session) {
    this.user = session.user;
    this.renderUserProfile();

    AuthGate.showLoading("Loading your workspace…");

    let saved = null;
    try {
      // RemoteStore.load resolves to the raw Supabase response
      // { data: row | null, error } — and the row itself is { data: <jsonb> }.
      // Both levels have to come off here; reading `saved.tasks` off the raw
      // response always yields `undefined`, which silently boots an EMPTY
      // workspace on every reload (that's how saved data looks "lost").
      const response = await RemoteStore.load(this.user.id);
      if (response && response.error) throw response.error;
      saved = (response && response.data && response.data.data) || null;
    } catch (e) {
      // Don't silently degrade: entering the app empty could overwrite the
      // real cloud workspace on the next save. Surface an actionable error.
      console.error("[StudyBuddy] Failed to load cloud workspace:", e);
      const err = new Error(describeWorkspaceError(e));
      err.isAuthHtml = true;
      throw err;
    }

    if (saved && typeof saved === "object") {
      this.applyWorkspaceState(saved);

      // One-time cleanup: accounts that signed up while the app still shipped
      // with sample data had that demo content saved into their workspace.
      if (this.removeDemoContent()) this.persist();

      // Keep the device-level mirror in step with the known-good cloud copy.
      this.writeWorkspaceMirror(this.workspaceSnapshot());
    } else {
      // The cloud has no row for this account. Usually that's a first sign-in,
      // but it also happens when older builds failed to get saves into the
      // cloud. The per-account device mirror — if this browser has one — is
      // strictly newer than "nothing", so restore it and push it back up.
      const mirror = this.readWorkspaceMirror();
      if (mirror) {
        this.applyWorkspaceState(mirror);
        this.persist();
        this.showToast("Restored your last saved workspace from this device", "success");
      } else {
        this.applyWorkspaceState({});
        this.persist();
      }
    }
    AuthGate.showLoading("Starting StudyBuddy…");
    this.backfillActivityFromData();
    this.init();
    // The constructor already ran init() (a no-op via the _initialized guard),
    // so paint the loaded workspace explicitly.
    this.renderAll();
  }

  /** Removes any leftover sample/demo items. Returns true if anything was removed. */
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

  // Fill the sidebar with the signed-in Google profile.
  renderUserProfile() {
    if (!this.user) return;
    const meta = this.user.user_metadata || {};
    const fullName = meta.full_name || meta.name || this.user.email || "Student";
    this.firstName = String(fullName).split(/[\s@]/)[0];
    const avatarUrl = meta.avatar_url || meta.picture;

    const nameEl = document.getElementById("display-user-name");
    if (nameEl) nameEl.textContent = fullName;

    const avatarWrap = document.getElementById("sidebar-avatar");
    if (avatarWrap) {
      if (avatarUrl) {
        avatarWrap.innerHTML = `<img src="${this.escapeHTML(avatarUrl)}" alt="" referrerpolicy="no-referrer">`;
      } else {
        const initials = String(fullName).split(/\s+/).map(p => p[0] || "").join("").slice(0, 2).toUpperCase();
        avatarWrap.textContent = initials || "S";
      }
    }
    this.renderDashboardHero();
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
    const state = this.workspaceSnapshot();

    // Refresh the device-level safety net first, so even if this cloud write
    // fails right now the data can still be recovered on the next sign-in.
    this.writeWorkspaceMirror(state);

    const res = await RemoteStore.save(this.user.id, state).catch(e => ({ error: e }));
    if (res && res.error) {
      // supabase-js resolves with `{ error }` instead of throwing — surface it.
      console.error("Cloud save failed:", res.error);
      this.showToast("Couldn't sync your latest changes to the cloud", "alert");
    }
  }

  // The single JSON shape shared by the cloud row, the device mirror and exports.
  workspaceSnapshot() {
    return {
      tasks: this.tasks,
      timetable: this.timetable,
      notes: this.notes,
      events: this.events,
      marks: this.marks,
      decks: this.decks,
      journal: this.journalBlob,
      focusMinutes: this.focusMinutes,
      pomodoroSessions: this.pomodoroSessions,
      activeDates: this.activeDates,
      focusLog: this.focusLog,
      settings: this.settings
    };
  }

  // Applies a saved workspace object (cloud jsonb, device mirror or import)
  // onto the in-memory state, defaulting anything missing to a clean value.
  applyWorkspaceState(saved) {
    const s = (saved && typeof saved === "object" && !Array.isArray(saved)) ? saved : {};
    this.tasks = Array.isArray(s.tasks) ? s.tasks : [];
    this.timetable = Array.isArray(s.timetable) ? s.timetable : [];
    this.notes = Array.isArray(s.notes) ? s.notes : [];
    this.events = Array.isArray(s.events) ? s.events : [];
    this.marks = Array.isArray(s.marks) ? s.marks : [];
    this.decks = Array.isArray(s.decks) ? s.decks.map(d => this.normalizeDeck(d)).filter(Boolean) : [];
    this.journalBlob = (s.journal && typeof s.journal === "object") ? s.journal : null;
    this.focusMinutes = Number(s.focusMinutes) || 0;
    this.pomodoroSessions = Number(s.pomodoroSessions) || 0;
    this.activeDates = Array.isArray(s.activeDates) ? s.activeDates : [];
    this.focusLog = (s.focusLog && typeof s.focusLog === "object" && !Array.isArray(s.focusLog)) ? { ...s.focusLog } : {};
    const savedSettings = (s.settings && typeof s.settings === "object" && !Array.isArray(s.settings)) ? s.settings : {};
    this.settings = { ...DEFAULT_SETTINGS, ...savedSettings };

    this.timetable.forEach(slot => this.normalizeSlot(slot));
    if (!this.isTimerRunning) this.timeLeft = this.modeSeconds(this.timerMode);
  }

  // ---------------------------------------------------------------------------
  // Device-level safety net: a per-account copy of the last state we tried to
  // save, kept in localStorage and keyed by user id.
  // ---------------------------------------------------------------------------
  workspaceMirrorKey() {
    return `studybuddy-workspace-mirror:${this.user && this.user.id}`;
  }

  writeWorkspaceMirror(state) {
    if (!this.user) return;
    try {
      localStorage.setItem(this.workspaceMirrorKey(), JSON.stringify(state));
    } catch (e) {
      // Storage full / private mode — the mirror is best-effort only.
    }
  }

  readWorkspaceMirror() {
    if (!this.user) return null;
    try {
      const parsed = JSON.parse(localStorage.getItem(this.workspaceMirrorKey()) || "null");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return this.looksLikeWorkspace(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  looksLikeWorkspace(obj) {
    return Boolean(obj) && typeof obj === "object" && (
      Array.isArray(obj.tasks) || Array.isArray(obj.timetable) || Array.isArray(obj.notes) ||
      Array.isArray(obj.events) || Array.isArray(obj.marks) || Array.isArray(obj.decks) || Boolean(obj.journal)
    );
  }

  // Quote of the day — stable for the whole day instead of changing on every reload.
  setupQuotes() {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((Date.now() - start) / 86400000);
    const quote = MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
    const textEl = document.getElementById("quote-text");
    const authorEl = document.getElementById("quote-author");
    if (textEl && authorEl) {
      textEl.textContent = `“${quote.text}”`;
      authorEl.textContent = `— ${quote.author}`;
    }
  }

  // ===========================================================================
  // Navigation
  // ===========================================================================
  setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => this.switchTab(btn.dataset.tab));
      const label = btn.querySelector("span")?.textContent?.trim();
      if (label) btn.title = label;
    });

    // Sliding "active" pill behind the nav items.
    const menu = document.querySelector(".nav-menu");
    if (menu && !menu.querySelector(".nav-indicator")) {
      this._navIndicator = document.createElement("span");
      this._navIndicator.className = "nav-indicator";
      this._navIndicator.setAttribute("aria-hidden", "true");
      menu.prepend(this._navIndicator);
      if (window.ResizeObserver) new ResizeObserver(() => this.updateNavIndicator(true)).observe(menu);
      window.addEventListener("resize", () => this.updateNavIndicator(true));
    } else if (menu) {
      this._navIndicator = menu.querySelector(".nav-indicator");
    }

    // Any other element carrying data-tab (stat tiles, "View all" links, bottom nav).
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-tab]");
      if (link && !link.classList.contains("nav-item")) this.switchTab(link.dataset.tab);
    });

    // Mobile drawer
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const openDrawer = () => {
      this.closeQuickAdd();
      sidebar?.classList.add("open");
      overlay?.classList.add("active");
    };
    this.closeDrawer = () => {
      sidebar?.classList.remove("open");
      overlay?.classList.remove("active");
    };
    document.getElementById("mobile-menu-btn")?.addEventListener("click", openDrawer);
    document.getElementById("bnav-more-btn")?.addEventListener("click", openDrawer);
    document.getElementById("close-sidebar-btn")?.addEventListener("click", this.closeDrawer);
    overlay?.addEventListener("click", this.closeDrawer);

    // Search & settings entry points
    document.getElementById("sidebar-search-btn")?.addEventListener("click", () => this.openPalette());
    document.getElementById("open-palette-btn")?.addEventListener("click", () => this.openPalette());
    document.getElementById("open-settings-btn")?.addEventListener("click", () => this.openSettings());

    // Sign out
    document.getElementById("sign-out-btn")?.addEventListener("click", async () => {
      if (!supabaseClient) return;
      const ok = await this.confirmDialog({
        title: "Sign out of StudyBuddy?",
        message: "Your data stays safe in your account — sign back in any time.",
        confirmLabel: "Sign out",
        tone: "info",
        icon: "fa-arrow-right-from-bracket"
      });
      if (!ok) return;
      if (this.journalUnlocked) this.lockJournal();
      await this.persist();
      await supabaseClient.auth.signOut();
      window.location.reload();
    });

    // Topbar gets a hairline once the page scrolls under it.
    const topbar = document.querySelector(".topbar");
    window.addEventListener("scroll", () => {
      topbar?.classList.toggle("is-scrolled", window.scrollY > 4);
    }, { passive: true });
  }

  switchTab(tabId) {
    if (!TAB_META[tabId]) return;
    const changed = tabId !== this.currentTab;
    this.currentTab = tabId;

    document.querySelectorAll(".nav-menu .nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.tab === tabId);
    });
    const bottomTabs = ["dashboard", "assignments", "calendar"];
    document.querySelectorAll(".bottom-nav .bnav-item").forEach(item => {
      const active = item.dataset.tab ? item.dataset.tab === tabId : !bottomTabs.includes(tabId);
      item.classList.toggle("active", active);
    });

    if (changed) this.resetCounters(document.getElementById(`tab-${tabId}`));
    document.querySelectorAll(".tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `tab-${tabId}`);
    });

    this.closeDrawer?.();
    this.closeQuickAdd();

    // The journal is a private space: leaving it re-locks it, so opening the
    // tab again always asks for the password (unless the user opted out).
    if (tabId !== "journal" && this.journalUnlocked && !this.isJournalKeepUnlocked()) {
      this.lockJournal();
    }

    this.updatePageHeader(changed);
    if (changed) window.scrollTo({ top: 0, behavior: "auto" });
    this.renderAll();
    this.updateNavIndicator();
    if (changed) this.playEnter(tabId);
  }

  updatePageHeader(animate = false) {
    const meta = TAB_META[this.currentTab] || TAB_META.dashboard;
    if (animate && !Motion.reduced()) {
      const wrap = document.querySelector(".topbar-title");
      wrap?.classList.remove("swap");
      void wrap?.offsetWidth;
      wrap?.classList.add("swap");
    }
    const titleEl = document.getElementById("page-title");
    const subEl = document.getElementById("page-subtitle");
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) {
      subEl.textContent = meta.subtitle ||
        new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    }
    this.updateDocumentTitle();
  }

  updateDocumentTitle() {
    if (this.isTimerRunning) {
      const label = this.timerMode === "pomodoro" ? "Focus" : "Break";
      document.title = `${this.formatTimer(this.timeLeft)} · ${label} — StudyBuddy`;
      return;
    }
    const meta = TAB_META[this.currentTab] || TAB_META.dashboard;
    document.title = `${meta.title} · StudyBuddy`;
  }

  // ===========================================================================
  // Toasts, confirm dialog & undo
  // ===========================================================================
  showToast(message, type = "success", options = {}) {
    const container = document.getElementById("toast-container");
    if (!container) return () => {};

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", type === "alert" ? "alert" : "status");
    const icon = type === "info" ? "fa-circle-info" : type === "alert" ? "fa-triangle-exclamation" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span class="toast-message"></span>`;
    toast.querySelector(".toast-message").textContent = message;

    let timer = null;
    const dismiss = () => {
      clearTimeout(timer);
      toast.classList.add("leaving");
      setTimeout(() => toast.remove(), 260);
    };

    if (options.action) {
      const actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.className = "toast-action";
      actionBtn.textContent = options.action.label;
      actionBtn.addEventListener("click", () => {
        dismiss();
        options.action.onClick();
      });
      toast.appendChild(actionBtn);
    }

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "Dismiss");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.addEventListener("click", dismiss);
    toast.appendChild(closeBtn);

    const duration = options.duration || (options.action ? 6500 : 3400);
    const bar = document.createElement("span");
    bar.className = "toast-progress";
    bar.style.animationDuration = `${duration}ms`;
    toast.appendChild(bar);

    container.appendChild(toast);
    while (container.children.length > 4) container.firstElementChild.remove();

    let remaining = duration;
    let startedAt = Date.now();
    const startTimer = () => {
      startedAt = Date.now();
      clearTimeout(timer);
      timer = setTimeout(dismiss, remaining);
    };
    toast.addEventListener("mouseenter", () => {
      clearTimeout(timer);
      remaining = Math.max(900, remaining - (Date.now() - startedAt));
    });
    toast.addEventListener("mouseleave", startTimer);
    startTimer();
    return dismiss;
  }

  /**
   * Removes an item from one of the workspace lists and offers a one-click
   * Undo instead of a blocking "Are you sure?" prompt.
   */
  removeWithUndo(listName, id, label) {
    const list = this[listName];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return;
    const el = this.findItemElement(listName, id);
    const [removed] = list.splice(index, 1);
    if (listName === "tasks" && this.timerTaskId === id) this.timerTaskId = "";
    this.schedulePersist();
    Motion.collapseOut(el, () => this.renderAll());

    this.showToast(`${label} deleted`, "info", {
      action: {
        label: "Undo",
        onClick: () => {
          const target = this[listName];
          if (target.some(item => item.id === removed.id)) return;
          target.splice(Math.min(index, target.length), 0, removed);
          this._flash = { listName, id: removed.id };
          this.schedulePersist();
          this.renderAll();
        }
      }
    });
  }

  setupConfirmDialog() {
    document.getElementById("confirm-modal-ok")?.addEventListener("click", () => this.resolveConfirm(true));
    document.getElementById("confirm-modal-cancel")?.addEventListener("click", () => this.resolveConfirm(false));
  }

  /** Styled replacement for window.confirm(). Resolves to true / false. */
  confirmDialog({ title, message = "", confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "danger", icon = "" } = {}) {
    const modal = document.getElementById("confirm-modal");
    if (!modal) return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    if (this._confirmResolve) this.resolveConfirm(false);

    document.getElementById("confirm-modal-title").textContent = title || "Are you sure?";
    document.getElementById("confirm-modal-text").textContent = message;
    const okBtn = document.getElementById("confirm-modal-ok");
    const cancelBtn = document.getElementById("confirm-modal-cancel");
    okBtn.textContent = confirmLabel;
    okBtn.className = `btn ${tone === "danger" ? "btn-danger" : "btn-primary"}`;
    cancelBtn.textContent = cancelLabel;
    const iconEl = document.getElementById("confirm-modal-icon");
    iconEl.className = `confirm-icon ${tone === "danger" ? "" : "is-info"}`;
    iconEl.innerHTML = `<i class="fa-solid ${icon || (tone === "danger" ? "fa-triangle-exclamation" : "fa-circle-question")}"></i>`;

    this.openModal(modal, tone === "danger" ? cancelBtn : okBtn);
    return new Promise(resolve => { this._confirmResolve = resolve; });
  }

  resolveConfirm(value) {
    const resolve = this._confirmResolve;
    this._confirmResolve = null;
    this.closeModal(document.getElementById("confirm-modal"), { fromConfirm: true });
    if (resolve) resolve(value);
  }

  // ===========================================================================
  // Modals
  // ===========================================================================
  setupModals() {
    const bind = (id, fn) => document.getElementById(id)?.addEventListener("click", fn);

    bind("add-assignment-modal-btn", () => this.openTaskModal());
    bind("empty-state-add-task-btn", () => this.openTaskModal());
    bind("add-timetable-slot-btn", () => this.openTimetableModal());
    bind("empty-state-add-slot-btn", () => this.openTimetableModal());
    bind("add-note-btn", () => this.openNoteModal());
    bind("empty-state-add-note-btn", () => this.openNoteModal());
    bind("add-event-btn", () => this.openEventModal());
    bind("empty-state-add-event-btn", () => this.openEventModal());
    bind("agenda-add-btn", () => this.openEventModal());
    bind("add-mark-btn", () => this.openMarkModal());
    bind("empty-state-add-mark-btn", () => this.openMarkModal());

    const closers = {
      "task-modal": ["close-task-modal-btn", "cancel-task-btn"],
      "timetable-modal": ["close-timetable-modal-btn", "cancel-timetable-btn"],
      "note-modal": ["close-note-modal-btn", "cancel-note-btn"],
      "event-modal": ["close-event-modal-btn", "cancel-event-btn"],
      "mark-modal": ["close-mark-modal-btn", "cancel-mark-btn"],
      "settings-modal": ["close-settings-modal-btn", "cancel-settings-btn"],
      "deck-modal": ["close-deck-modal-btn", "cancel-deck-btn"],
      "card-modal": ["close-card-modal-btn", "cancel-card-btn"],
      "journal-password-modal": ["close-journal-password-modal-btn", "cancel-journal-password-btn"],
      "journal-question-modal": ["close-journal-question-modal-btn", "cancel-journal-question-btn"]
    };
    Object.entries(closers).forEach(([modalId, buttons]) => {
      buttons.forEach(btnId => bind(btnId, () => this.closeModal(document.getElementById(modalId))));
    });
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => this.closeModal(btn.closest(".modal-backdrop")));
    });

    // Close on a click that starts AND ends on the backdrop (dragging a text
    // selection out of a field must not throw away a half-filled form).
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      let pressedOnBackdrop = false;
      modal.addEventListener("mousedown", (e) => { pressedOnBackdrop = e.target === modal; });
      modal.addEventListener("click", (e) => {
        if (e.target === modal && pressedOnBackdrop) this.closeModal(modal);
      });
    });

    // Escape closes the top-most layer only.
    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (this.isPaletteOpen()) { this.closePalette(); e.preventDefault(); return; }
      if (this.isQuickAddOpen()) { this.closeQuickAdd(); e.preventDefault(); return; }
      const open = [...document.querySelectorAll(".modal-backdrop.active")];
      if (open.length) {
        e.preventDefault();
        this.closeModal(open[open.length - 1]);
        return;
      }
      if (this.isFocusModeOpen()) {
        e.preventDefault();
        this.closeFocusMode();
        return;
      }
      this.closeDrawer?.();
    });

    // "Today / Tomorrow / Next week" shortcuts under date fields.
    document.querySelectorAll(".date-shortcuts").forEach(group => {
      group.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-offset]");
        const input = document.getElementById(group.dataset.target);
        if (!btn || !input) return;
        const d = new Date();
        d.setDate(d.getDate() + Number(btn.dataset.offset));
        input.value = this.toDateKey(d);
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  openModal(modal, focusTarget = null) {
    if (!modal) return;
    this.closeQuickAdd();
    if (!document.querySelector(".modal-backdrop.active")) this._lastFocus = document.activeElement;
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    const target = focusTarget || modal.querySelector(
      ".modal-body input:not([type=hidden]):not([type=radio]):not([type=checkbox]), .modal-body textarea, .modal-body select"
    );
    // Focus right away (the backdrop becomes visible synchronously) so keys
    // typed immediately after opening land in the first field.
    target?.focus({ preventScroll: true });
    if (target && document.activeElement !== target) {
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  }

  closeModal(modal, { fromConfirm = false } = {}) {
    if (!modal || !modal.classList.contains("active")) return;
    modal.classList.remove("active");
    if (modal.id === "confirm-modal" && !fromConfirm && this._confirmResolve) {
      const resolve = this._confirmResolve;
      this._confirmResolve = null;
      resolve(false);
    }
    if (!document.querySelector(".modal-backdrop.active")) {
      document.body.classList.remove("modal-open");
      const last = this._lastFocus;
      this._lastFocus = null;
      if (last && typeof last.focus === "function" && document.contains(last)) last.focus({ preventScroll: true });
    }
  }

  // ===========================================================================
  // Quick-add menu ("+ New")
  // ===========================================================================
  setupQuickAdd() {
    const menu = document.getElementById("quick-add-menu");
    const desktopBtn = document.getElementById("quick-add-btn");
    const mobileBtn = document.getElementById("bnav-add-btn");
    if (!menu) return;

    desktopBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleQuickAdd(desktopBtn, false);
    });
    mobileBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleQuickAdd(mobileBtn, true);
    });
    menu.addEventListener("click", (e) => {
      const item = e.target.closest("[data-create]");
      if (!item) return;
      this.closeQuickAdd();
      this.createItem(item.dataset.create);
    });
    menu.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const items = [...menu.querySelectorAll(".menu-item")];
      const idx = items.indexOf(document.activeElement);
      const next = (idx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    });
    document.addEventListener("click", (e) => {
      if (this.isQuickAddOpen() && !menu.contains(e.target)) this.closeQuickAdd();
    });
    window.addEventListener("resize", () => this.closeQuickAdd());
  }

  isQuickAddOpen() {
    return Boolean(document.getElementById("quick-add-menu")?.classList.contains("open"));
  }

  toggleQuickAdd(anchor, asSheet) {
    const menu = document.getElementById("quick-add-menu");
    if (!menu) return;
    if (this.isQuickAddOpen()) {
      this.closeQuickAdd();
      return;
    }
    menu.classList.toggle("is-sheet", asSheet);
    if (!asSheet && anchor) {
      const rect = anchor.getBoundingClientRect();
      menu.style.top = `${rect.bottom + 6}px`;
      menu.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
      menu.style.left = "auto";
      menu.style.bottom = "auto";
    }
    menu.classList.add("open");
    anchor?.setAttribute("aria-expanded", "true");
    if (asSheet) anchor?.classList.add("is-open");
    menu.querySelector(".menu-item")?.focus({ preventScroll: true });
  }

  closeQuickAdd() {
    const menu = document.getElementById("quick-add-menu");
    if (!menu || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    document.getElementById("quick-add-btn")?.setAttribute("aria-expanded", "false");
    document.getElementById("bnav-add-btn")?.classList.remove("is-open");
  }

  createItem(kind) {
    switch (kind) {
      case "task": this.openTaskModal(); break;
      case "event": this.openEventModal(); break;
      case "slot": this.openTimetableModal(); break;
      case "note": this.openNoteModal(); break;
      case "mark": this.openMarkModal(); break;
      case "deck": this.openDeckModal(); break;
      default: break;
    }
  }

  // ===========================================================================
  // Command palette (Ctrl/⌘ + K)
  // ===========================================================================
  setupPalette() {
    const backdrop = document.getElementById("palette");
    const input = document.getElementById("palette-input");
    const results = document.getElementById("palette-results");
    if (!backdrop || !input || !results) return;

    input.addEventListener("input", () => {
      this.paletteIndex = 0;
      this.renderPalette();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); this.movePalette(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this.movePalette(-1); }
      else if (e.key === "Enter") { e.preventDefault(); this.runPaletteItem(this.paletteIndex); }
    });
    results.addEventListener("click", (e) => {
      const el = e.target.closest("[data-index]");
      if (el) this.runPaletteItem(Number(el.dataset.index));
    });
    results.addEventListener("mousemove", (e) => {
      const el = e.target.closest("[data-index]");
      if (!el) return;
      const idx = Number(el.dataset.index);
      if (idx !== this.paletteIndex) {
        this.paletteIndex = idx;
        this.highlightPalette(false);
      }
    });
    backdrop.addEventListener("mousedown", (e) => {
      if (e.target === backdrop) this.closePalette();
    });
  }

  isPaletteOpen() {
    return Boolean(document.getElementById("palette")?.classList.contains("open"));
  }

  openPalette(initial = "") {
    const backdrop = document.getElementById("palette");
    const input = document.getElementById("palette-input");
    if (!backdrop || !input) return;
    this.closeDrawer?.();
    this.closeQuickAdd();
    if (!this.isPaletteOpen()) this._paletteReturnFocus = document.activeElement;
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    input.value = initial;
    this.paletteIndex = 0;
    this.renderPalette();
    input.focus();
    const palette = backdrop.querySelector(".palette");
    palette?.classList.add("is-opening");
    clearTimeout(this._paletteOpenTimer);
    this._paletteOpenTimer = setTimeout(() => palette?.classList.remove("is-opening"), 600);
  }

  closePalette() {
    const backdrop = document.getElementById("palette");
    if (!backdrop || !backdrop.classList.contains("open")) return;
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    const ret = this._paletteReturnFocus;
    this._paletteReturnFocus = null;
    if (ret && typeof ret.focus === "function" && document.contains(ret)) ret.focus({ preventScroll: true });
  }

  paletteCommands() {
    const due = this.totalDueCards();
    const nav = TAB_ORDER.map((tab, i) => ({
      group: "nav",
      title: `Go to ${TAB_META[tab].title}`,
      icon: TAB_META[tab].icon,
      hint: String(i + 1),
      keywords: `go open ${tab} ${TAB_META[tab].title}`,
      run: () => this.switchTab(tab)
    }));
    return [
      { group: "create", title: "New assignment", icon: "fa-solid fa-list-check", hint: "A", keywords: "add create task homework assignment", run: () => this.openTaskModal() },
      { group: "create", title: "New event or test", icon: "fa-regular fa-calendar-plus", hint: "E", keywords: "add create event exam test calendar", run: () => this.openEventModal() },
      { group: "create", title: "New note", icon: "fa-regular fa-note-sticky", hint: "N", keywords: "add create note", run: () => this.openNoteModal() },
      { group: "create", title: "Record a mark", icon: "fa-solid fa-award", hint: "M", keywords: "add create mark grade score result", run: () => this.openMarkModal() },
      { group: "create", title: "Add timetable slot", icon: "fa-solid fa-table-cells", hint: "S", keywords: "add create slot session timetable lecture", run: () => this.openTimetableModal() },
      { group: "create", title: "New flashcard deck", icon: "fa-solid fa-layer-group", hint: "D", keywords: "add create flashcard deck cards", run: () => this.openDeckModal() },
      { group: "create", title: due ? `Review ${due} due flashcard${due === 1 ? "" : "s"}` : "Review flashcards", icon: "fa-solid fa-rotate", hint: "R", keywords: "review flashcards study spaced repetition quiz", run: () => this.reviewDueCards() },
      { group: "create", title: "Full-screen focus mode", icon: "fa-solid fa-expand", hint: "⇧F", keywords: "focus mode fullscreen immersive ambient rain noise", run: () => { this.switchTab("progress"); this.openFocusMode(); } },
      {
        group: "create",
        title: this.isTimerRunning ? "Pause focus timer" : "Start a focus session",
        icon: this.isTimerRunning ? "fa-solid fa-pause" : "fa-solid fa-play",
        hint: "F",
        keywords: "focus timer pomodoro start pause study",
        run: () => this.toggleTimer()
      },
      ...nav,
      { group: "more", title: "Toggle dark mode", icon: "fa-solid fa-circle-half-stroke", hint: "T", keywords: "theme dark light mode", run: () => this.toggleTheme() },
      { group: "more", title: "Settings", icon: "fa-solid fa-gear", hint: "", keywords: "settings preferences timer durations sounds", run: () => this.openSettings() },
      { group: "more", title: "Export workspace", icon: "fa-solid fa-download", hint: "", keywords: "export backup download json data", run: () => this.exportWorkspace() },
      { group: "more", title: "Keyboard shortcuts", icon: "fa-regular fa-keyboard", hint: "?", keywords: "keyboard shortcuts help keys", run: () => this.openModal(document.getElementById("shortcuts-modal")) }
    ];
  }

  // Data that can be searched from the palette (journal entries are never included).
  paletteDataItems() {
    const items = [];
    this.tasks.forEach(t => items.push({
      group: "Assignments",
      title: t.title,
      sub: `${t.subject || "No subject"} · ${t.completed ? "Done" : this.formatDueDateBadge(t.dueDate).text}`,
      icon: "fa-solid fa-list-check",
      color: this.subjectColor(t.subject),
      haystack: `${t.title} ${t.subject} ${t.description || ""}`,
      run: () => { this.switchTab("assignments"); this.openTaskModal(t); }
    }));
    this.events.forEach(ev => items.push({
      group: "Events",
      title: ev.title,
      sub: `${this.formatLongDate(this.eventStart(ev))} · ${this.formatClock(this.eventStart(ev))}${ev.subject ? ` · ${ev.subject}` : ""}`,
      icon: this.eventTypeInfo(ev.type).icon,
      color: `var(--type-${this.eventTypeKey(ev.type)})`,
      haystack: `${ev.title} ${ev.subject || ""} ${ev.location || ""} ${ev.notes || ""}`,
      run: () => {
        this.selectCalendarDate(ev.date);
        this.switchTab("calendar");
        this.openEventModal(ev);
      }
    }));
    this.notes.forEach(n => items.push({
      group: "Notes",
      title: n.title,
      sub: `${n.subject || ""} · ${String(n.content || "").replace(/\s+/g, " ").slice(0, 70)}`,
      icon: "fa-regular fa-note-sticky",
      color: `var(--note-${n.color || "sky"})`,
      haystack: `${n.title} ${n.subject} ${n.content}`,
      run: () => { this.switchTab("notes"); this.openNoteModal(n); }
    }));
    this.marks.forEach(m => {
      const p = this.markPercent(m);
      items.push({
        group: "Marks",
        title: m.title,
        sub: `${m.subject || ""} · ${p === null ? "—" : p + "%"} · ${this.markGrade(p)}`,
        icon: "fa-solid fa-award",
        color: this.subjectColor(m.subject),
        haystack: `${m.title} ${m.subject} ${m.notes || ""}`,
        run: () => { this.switchTab("marks"); this.openMarkModal(m); }
      });
    });
    this.timetable.forEach(s => items.push({
      group: "Timetable",
      title: s.title,
      sub: `${s.day} · ${this.formatHM(s.startTime)} – ${this.formatHM(s.endTime)}${s.location ? ` · ${s.location}` : ""}`,
      icon: "fa-solid fa-table-cells",
      color: this.subjectColor(s.subject),
      haystack: `${s.title} ${s.subject} ${s.location || ""} ${s.day}`,
      run: () => {
        this.selectedDay = s.day;
        this.setTimetableView("day");
        this.switchTab("timetable");
        this.openTimetableModal(s);
      }
    }));
    this.decks.forEach(deck => {
      const dueCount = this.deckDueCards(deck).length;
      items.push({
        group: "Flashcards",
        title: deck.name,
        sub: `Deck · ${deck.cards.length} cards${dueCount ? ` · ${dueCount} due` : ""}`,
        icon: "fa-solid fa-layer-group",
        color: this.subjectColor(deck.subject || deck.name),
        haystack: `${deck.name} ${deck.subject}`,
        run: () => { this.switchTab("flashcards"); this.openDeck(deck.id); }
      });
      deck.cards.forEach(card => items.push({
        group: "Flashcards",
        title: card.front,
        sub: `${deck.name} · ${card.back.replace(/\s+/g, " ").slice(0, 60)}`,
        icon: "fa-regular fa-clone",
        color: this.subjectColor(deck.subject || deck.name),
        haystack: `${card.front} ${card.back}`,
        run: () => { this.switchTab("flashcards"); this.openDeck(deck.id); this.openCardModal(card); }
      }));
    });
    return items;
  }

  renderPalette() {
    const input = document.getElementById("palette-input");
    const results = document.getElementById("palette-results");
    if (!input || !results) return;
    const query = input.value.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const commands = this.paletteCommands();
    const groups = [];

    if (!tokens.length) {
      groups.push({ label: "Create", items: commands.filter(c => c.group === "create") });
      groups.push({ label: "Jump to", items: commands.filter(c => c.group === "nav") });
      groups.push({ label: "More", items: commands.filter(c => c.group === "more") });
    } else {
      const matches = (text) => tokens.every(tok => text.toLowerCase().includes(tok));
      const score = (title) => {
        const t = String(title || "").toLowerCase();
        if (t.startsWith(query)) return 3;
        if (t.includes(query)) return 2;
        return 1;
      };
      const cmdMatches = commands
        .filter(c => matches(`${c.title} ${c.keywords}`))
        .sort((a, b) => score(b.title) - score(a.title))
        .slice(0, 5);
      if (cmdMatches.length) groups.push({ label: "Commands", items: cmdMatches });

      const byGroup = {};
      this.paletteDataItems()
        .filter(item => matches(item.haystack))
        .sort((a, b) => score(b.title) - score(a.title))
        .forEach(item => {
          byGroup[item.group] = byGroup[item.group] || [];
          if (byGroup[item.group].length < 6) byGroup[item.group].push(item);
        });
      ["Assignments", "Events", "Notes", "Flashcards", "Marks", "Timetable"].forEach(label => {
        if (byGroup[label]) groups.push({ label, items: byGroup[label] });
      });
    }

    this.paletteItems = groups.flatMap(g => g.items);
    if (this.paletteIndex >= this.paletteItems.length) this.paletteIndex = 0;

    if (!this.paletteItems.length) {
      results.innerHTML = `<div class="palette-empty">No results for “${this.escapeHTML(input.value.trim())}”.<br>Try a subject, a title or a command like “new note”.</div>`;
      return;
    }

    let index = 0;
    results.innerHTML = groups.map(group => `
      <div class="palette-group-label">${this.escapeHTML(group.label)}</div>
      ${group.items.map(item => {
        const i = index++;
        return `
          <button type="button" class="palette-item ${i === this.paletteIndex ? "active" : ""}" data-index="${i}" role="option" aria-selected="${i === this.paletteIndex}" style="--pi: ${Math.min(i, 14)}">
            <span class="palette-item-icon" ${item.color ? `style="--subj: ${item.color}"` : ""}><i class="${item.icon}"></i></span>
            <span class="palette-item-text">
              <span class="palette-item-title">${this.highlightMatch(item.title, query)}</span>
              ${item.sub ? `<span class="palette-item-sub">${this.escapeHTML(item.sub)}</span>` : ""}
            </span>
            ${item.hint ? `<kbd class="kbd palette-item-hint">${this.escapeHTML(item.hint)}</kbd>` : ""}
          </button>`;
      }).join("")}
    `).join("");
  }

  highlightMatch(text, query) {
    const raw = String(text || "");
    if (!query) return this.escapeHTML(raw);
    const idx = raw.toLowerCase().indexOf(query);
    if (idx === -1) return this.escapeHTML(raw);
    return this.escapeHTML(raw.slice(0, idx)) +
      `<mark>${this.escapeHTML(raw.slice(idx, idx + query.length))}</mark>` +
      this.escapeHTML(raw.slice(idx + query.length));
  }

  movePalette(delta) {
    if (!this.paletteItems.length) return;
    this.paletteIndex = (this.paletteIndex + delta + this.paletteItems.length) % this.paletteItems.length;
    this.highlightPalette(true);
  }

  highlightPalette(scroll) {
    document.querySelectorAll("#palette-results .palette-item").forEach(el => {
      const active = Number(el.dataset.index) === this.paletteIndex;
      el.classList.toggle("active", active);
      el.setAttribute("aria-selected", String(active));
      if (active && scroll) el.scrollIntoView({ block: "nearest" });
    });
  }

  runPaletteItem(index) {
    const item = this.paletteItems[index];
    if (!item) return;
    this.closePalette();
    setTimeout(() => item.run(), 10);
  }

  // ===========================================================================
  // Keyboard shortcuts
  // ===========================================================================
  setupShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (window.studyBuddy && window.studyBuddy !== this) return;
      if (document.getElementById("app-layout")?.classList.contains("hidden")) return;

      const key = e.key;
      if ((e.ctrlKey || e.metaKey) && !e.altKey && key.toLowerCase() === "k" && !this.isFocusModeOpen()) {
        e.preventDefault();
        if (this.isPaletteOpen()) this.closePalette();
        else this.openPalette();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (this.isTypingTarget(e.target)) return;
      if (this.isPaletteOpen() || document.querySelector(".modal-backdrop.active")) return;
      if (this.isFocusModeOpen() || this.isStudying()) return;

      const lower = key.toLowerCase();
      let handled = true;
      if (key === "/") this.openPalette();
      else if (key === "?") this.openModal(document.getElementById("shortcuts-modal"));
      else if (lower === "a") this.openTaskModal();
      else if (lower === "e") this.openEventModal();
      else if (lower === "n") this.openNoteModal();
      else if (lower === "m") this.openMarkModal();
      else if (lower === "s") this.openTimetableModal();
      else if (lower === "d") this.openDeckModal();
      else if (lower === "r") this.reviewDueCards();
      else if (lower === "f" && e.shiftKey) { this.switchTab("progress"); this.openFocusMode(); }
      else if (lower === "f") this.toggleTimer();
      else if (lower === "t") this.toggleTheme(document.getElementById("theme-toggle"));
      else if (/^[1-9]$/.test(key)) this.switchTab(TAB_ORDER[Number(key) - 1]);
      else handled = false;
      if (handled) e.preventDefault();
    });
  }

  isTypingTarget(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  }

  updateShortcutLabels() {
    document.querySelectorAll("[data-shortcut-label]").forEach(el => {
      el.textContent = IS_MAC ? "⌘ K" : "Ctrl K";
    });
  }

  // ===========================================================================
  // Settings, export / import, clear data
  // ===========================================================================
  setupSettings() {
    document.getElementById("timer-settings-btn")?.addEventListener("click", () => this.openSettings());
    document.getElementById("settings-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveSettingsFromForm();
    });
    document.getElementById("export-data-btn")?.addEventListener("click", () => this.exportWorkspace());
    document.getElementById("import-data-btn")?.addEventListener("click", () => {
      document.getElementById("import-data-file")?.click();
    });
    document.getElementById("import-data-file")?.addEventListener("change", (e) => {
      this.importWorkspaceFile(e.target.files?.[0]);
    });
    document.getElementById("clear-all-data-btn")?.addEventListener("click", () => this.clearAllData());
  }

  openSettings() {
    const s = this.settings;
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
    const check = (id, value) => { const el = document.getElementById(id); if (el) el.checked = Boolean(value); };
    set("set-focus-min", s.focusMin);
    set("set-short-min", s.shortMin);
    set("set-long-min", s.longMin);
    set("set-focus-goal", s.focusGoal);
    check("set-autostart", s.autoStart);
    check("set-sounds", s.sounds);
    check("set-confetti", s.confetti);
    const build = document.getElementById("settings-build");
    if (build) build.textContent = APP_BUILD;
    this.closeDrawer?.();
    this.openModal(document.getElementById("settings-modal"));
  }

  saveSettingsFromForm() {
    const num = (id, min, max, fallback) => {
      const v = parseInt(document.getElementById(id)?.value, 10);
      return isNaN(v) ? fallback : Math.min(max, Math.max(min, v));
    };
    const next = {
      ...this.settings,
      focusMin: num("set-focus-min", 5, 120, DEFAULT_SETTINGS.focusMin),
      shortMin: num("set-short-min", 1, 30, DEFAULT_SETTINGS.shortMin),
      longMin: num("set-long-min", 5, 60, DEFAULT_SETTINGS.longMin),
      focusGoal: num("set-focus-goal", 10, 600, DEFAULT_SETTINGS.focusGoal),
      autoStart: Boolean(document.getElementById("set-autostart")?.checked),
      sounds: Boolean(document.getElementById("set-sounds")?.checked),
      confetti: Boolean(document.getElementById("set-confetti")?.checked)
    };
    const durationsChanged = ["focusMin", "shortMin", "longMin"].some(k => next[k] !== this.settings[k]);
    this.settings = next;
    if (durationsChanged && !this.isTimerRunning) this.timeLeft = this.modeSeconds(this.timerMode);

    this.schedulePersist();
    this.closeModal(document.getElementById("settings-modal"));
    this.renderAll();
    this.showToast(durationsChanged && this.isTimerRunning
      ? "Settings saved — new durations apply from the next session"
      : "Settings saved");
  }

  downloadJSON(filename, data) {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async exportWorkspace() {
    if (this.journalUnlocked && this.journalDirty) await this.saveJournalEntry();
    this.downloadJSON(`studybuddy-workspace-${this.toDateKey(new Date())}.json`, {
      app: "StudyBuddy",
      type: "studybuddy-workspace",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: this.workspaceSnapshot()
    });
    this.showToast("Workspace exported — journal pages stay encrypted in the file");
  }

  async importWorkspaceFile(file) {
    const input = document.getElementById("import-data-file");
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const data = (parsed && parsed.type === "studybuddy-workspace" && parsed.data) ? parsed.data : parsed;
      if (!this.looksLikeWorkspace(data)) throw new Error("not a StudyBuddy workspace export");

      const count = (arr, word) => {
        const n = Array.isArray(arr) ? arr.length : 0;
        return `${n} ${word}${n === 1 ? "" : "s"}`;
      };
      const ok = await this.confirmDialog({
        title: "Replace your workspace?",
        message: `This file has ${count(data.tasks, "assignment")}, ${count(data.events, "event")}, ${count(data.notes, "note")} and ${count(data.marks, "mark")}. ` +
          "Everything currently in your workspace — including your journal — will be replaced.",
        confirmLabel: "Replace workspace"
      });
      if (!ok) return;

      this.lockJournal({ skipSave: true });
      this.pauseTimer();
      this.applyWorkspaceState(data);
      this.persist();
      this.closeModal(document.getElementById("settings-modal"));
      this.renderAll();
      this.showToast("Workspace imported");
    } catch (e) {
      console.warn("[StudyBuddy] Import rejected:", e);
      this.showToast("That file isn't a StudyBuddy workspace export", "alert");
    } finally {
      if (input) input.value = "";
    }
  }

  async clearAllData() {
    const ok = await this.confirmDialog({
      title: "Clear your entire workspace?",
      message: "This permanently deletes all your assignments, timetable slots, notes, events, marks, focus history — and your private journal, including every saved entry. Consider exporting first.",
      confirmLabel: "Delete everything"
    });
    if (!ok) return;

    this.lockJournal({ skipSave: true });
    this.pauseTimer();
    this.tasks = [];
    this.timetable = [];
    this.notes = [];
    this.events = [];
    this.marks = [];
    this.decks = [];
    this.fcSession = null;
    this.fcView = "decks";
    this.journalBlob = null;
    this.focusMinutes = 0;
    this.pomodoroSessions = 0;
    this.activeDates = [];
    this.focusLog = {};
    this.timerTaskId = "";
    this.cycleCount = 0;
    this._journalLockMode = null;
    this.persist();
    this.closeModal(document.getElementById("settings-modal"));
    this.renderAll();
    this.showToast("All data cleared", "info");
  }

  // ===========================================================================
  // Assignments
  // ===========================================================================
  setupTaskEvents() {
    document.getElementById("task-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveTaskFromForm();
    });

    document.getElementById("task-search-input")?.addEventListener("input", (e) => {
      this.taskSearch = e.target.value.toLowerCase().trim();
      this.renderTasks();
    });

    document.getElementById("task-status-segmented")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-status]");
      if (!btn) return;
      this.taskStatusFilter = btn.dataset.status;
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

    document.getElementById("task-sort-select")?.addEventListener("change", (e) => {
      this.taskSort = e.target.value;
      this.renderTasks();
    });

    // Quick add: type a title, press Enter, finish the details in the modal.
    document.getElementById("task-quick-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("task-quick-input");
      const title = (input?.value || "").trim();
      if (!title) return;
      input.value = "";
      this.openTaskModal(null, { title });
    });

    document.getElementById("clear-completed-tasks-btn")?.addEventListener("click", () => {
      const completed = this.tasks.filter(t => t.completed);
      if (completed.length === 0) {
        this.showToast("No completed assignments to clear", "info");
        return;
      }
      const before = this.tasks.slice();
      this.tasks = this.tasks.filter(t => !t.completed);
      this.schedulePersist();
      this.renderAll();
      this.showToast(`Cleared ${completed.length} completed assignment${completed.length === 1 ? "" : "s"}`, "info", {
        action: {
          label: "Undo",
          onClick: () => {
            const restored = before.filter(t => t.completed && !this.tasks.some(x => x.id === t.id));
            this.tasks = [...this.tasks, ...restored];
            this.schedulePersist();
            this.renderAll();
          }
        }
      });
    });

    // One delegated listener handles every card action.
    document.getElementById("task-cards-list")?.addEventListener("click", (e) => {
      const card = e.target.closest(".task-card");
      if (!card) return;
      const id = card.dataset.taskId;
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "toggle") this.toggleTaskCompletion(id);
      else if (action === "delete") this.deleteTask(id);
      else if (action === "focus") this.focusOnTask(id);
      else if (action === "subtasks") {
        if (this._expandedTasks.has(id)) this._expandedTasks.delete(id);
        else this._expandedTasks.add(id);
        this.renderTasks();
      } else if (action === "subtask") {
        const subId = e.target.closest("[data-sub-id]")?.dataset.subId;
        if (subId) this.toggleSubtask(id, subId);
      }
      else if (action === "edit") this.openTaskModal(this.tasks.find(t => t.id === id));
    });
  }

  openTaskModal(task = null, prefill = {}) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");
    const titleEl = document.getElementById("task-modal-title");
    if (!modal || !form) return;

    form.reset();
    const setPriority = (value) => {
      const radio = form.querySelector(`input[name="task-priority"][value="${value}"]`) ||
        form.querySelector('input[name="task-priority"][value="medium"]');
      if (radio) radio.checked = true;
    };

    let focusTarget = null;
    if (task) {
      titleEl.textContent = "Edit assignment";
      document.getElementById("task-id").value = task.id;
      document.getElementById("task-title-input").value = task.title || "";
      document.getElementById("task-subject-input").value = task.subject || "";
      setPriority(task.priority);
      document.getElementById("task-due-date-input").value = task.dueDate || "";
      document.getElementById("task-estimated-time-input").value = task.estimatedTime || 45;
      document.getElementById("task-description-input").value = task.description || "";
      document.getElementById("save-task-btn").textContent = "Save changes";
      this._editingSubtasks = (Array.isArray(task.subtasks) ? task.subtasks : []).map(sub => ({ ...sub }));
    } else {
      titleEl.textContent = "New assignment";
      document.getElementById("task-id").value = "";
      document.getElementById("task-title-input").value = prefill.title || "";
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById("task-due-date-input").value = prefill.dueDate || this.toDateKey(tomorrow);
      setPriority(prefill.priority || "medium");
      document.getElementById("save-task-btn").textContent = "Add assignment";
      this._editingSubtasks = [];
      if (prefill.title) {
        const subjectInput = document.getElementById("task-subject-input");
        if (this._lastSubject) subjectInput.value = this._lastSubject;
        focusTarget = subjectInput;
      }
    }

    const newStep = document.getElementById("subtask-new-input");
    if (newStep) newStep.value = "";
    this.renderSubtaskEditor();
    this.openModal(modal, focusTarget);
    if (focusTarget && focusTarget.value) focusTarget.select();
  }

  saveTaskFromForm() {
    const id = document.getElementById("task-id").value;
    const title = document.getElementById("task-title-input").value.trim();
    const subject = document.getElementById("task-subject-input").value.trim();
    const priority = document.querySelector('input[name="task-priority"]:checked')?.value || "medium";
    const dueDate = document.getElementById("task-due-date-input").value;
    const estimatedTime = parseInt(document.getElementById("task-estimated-time-input").value, 10) || 45;
    const description = document.getElementById("task-description-input").value.trim();
    const pendingStep = document.getElementById("subtask-new-input")?.value.trim();
    if (pendingStep) this._editingSubtasks.push({ id: `st-${Date.now()}`, text: pendingStep, done: false });
    const subtasks = this._editingSubtasks
      .map(sub => ({ ...sub, text: String(sub.text || "").trim() }))
      .filter(sub => sub.text);

    if (!title || !subject || !dueDate) {
      this.showToast("Please fill in the title, subject and due date", "alert");
      return;
    }

    if (id) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], title, subject, priority, dueDate, estimatedTime, description, subtasks };
        this.showToast("Assignment updated");
      }
    } else {
      const newTask = {
        id: "task-" + Date.now(),
        title,
        subject,
        priority,
        dueDate,
        estimatedTime,
        description,
        subtasks,
        completed: false,
        createdAt: new Date().toISOString()
      };
      this.tasks.unshift(newTask);
      this._flash = { listName: "tasks", id: newTask.id };
      if (this.taskStatusFilter === "completed") this.taskStatusFilter = "pending";
      this.showToast(`Added “${title}” — ${this.formatDueDateBadge(dueDate).text.toLowerCase()}`);
    }

    this._lastSubject = subject;
    this.schedulePersist();
    this.recordActivity();
    this.closeModal(document.getElementById("task-modal"));
    this.renderAll();
  }

  toggleTaskCompletion(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    const el = this.findItemElement("tasks", id);

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    this.schedulePersist();

    if (task.completed) {
      const check = el?.querySelector(".check");
      this.playSound("success");
      this.celebrate(check || el);
      this.recordActivity();
      if (this.timerTaskId === id) this.timerTaskId = "";
      this.showToast(`Done: ${task.title} 🎉`, "success", {
        action: {
          label: "Undo",
          onClick: () => {
            task.completed = false;
            task.completedAt = null;
            this._flash = { listName: "tasks", id };
            this.schedulePersist();
            this.renderAll();
          }
        }
      });

      // Let the check pop and the title strike through before the row leaves.
      if (el && !Motion.reduced()) {
        el.classList.add("is-completing");
        check?.classList.add("checked", "pop");
        const leaves = el.classList.contains("compact-task-item") ||
          (el.classList.contains("task-card") && this.taskStatusFilter === "pending");
        setTimeout(() => {
          if (leaves) Motion.collapseOut(el, () => this.renderAll());
          else this.renderAll();
        }, 420);
        return;
      }
    }

    this.renderAll();
  }

  deleteTask(id) {
    this.removeWithUndo("tasks", id, "Assignment");
  }

  focusOnTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    this.timerTaskId = id;
    if (this.timerMode !== "pomodoro") this.setTimerMode("pomodoro");
    this.switchTab("progress");
    if (!this.isTimerRunning) this.startTimer();
    this.showToast(`Focusing on “${task.title}”`, "info");
  }

  /** Days from today until a YYYY-MM-DD date (negative = past). */
  daysUntil(dateKey) {
    if (!dateKey) return null;
    const [y, m, d] = String(dateKey).split("-").map(Number);
    if (!y || !m || !d) return null;
    const target = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
  }

  taskBucket(task) {
    if (task.completed) return "completed";
    const days = this.daysUntil(task.dueDate);
    if (days === null) return "nodate";
    if (days < 0) return "overdue";
    if (days === 0) return "today";
    if (days === 1) return "tomorrow";
    if (days <= 7) return "week";
    return "later";
  }

  compareByDue(a, b) {
    const da = a.dueDate || "9999-99-99";
    const db = b.dueDate || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);
  }

  renderTasks() {
    const container = document.getElementById("task-cards-list");
    const emptyState = document.getElementById("tasks-empty-state");
    const countLabel = document.getElementById("tasks-count-label");
    if (!container) return;

    const pendingCount = this.tasks.filter(t => !t.completed).length;
    const doneCount = this.tasks.length - pendingCount;
    document.querySelectorAll("#task-status-segmented [data-status]").forEach(btn => {
      const status = btn.dataset.status;
      btn.classList.toggle("active", status === this.taskStatusFilter);
      const n = status === "pending" ? pendingCount : status === "completed" ? doneCount : this.tasks.length;
      const label = status === "pending" ? "To do" : status === "completed" ? "Done" : "All";
      btn.innerHTML = `${label} <span class="seg-count">${n}</span>`;
    });

    const search = this.taskSearch;
    const filtered = this.tasks.filter(t => {
      const matchSearch = !search ||
        (t.title || "").toLowerCase().includes(search) ||
        (t.subject || "").toLowerCase().includes(search) ||
        (t.description || "").toLowerCase().includes(search);
      const matchStatus = this.taskStatusFilter === "all" ? true
        : this.taskStatusFilter === "completed" ? t.completed : !t.completed;
      const matchPriority = this.taskPriorityFilter === "all" || t.priority === this.taskPriorityFilter;
      const matchSubject = this.taskSubjectFilter === "all" || t.subject === this.taskSubjectFilter;
      return matchSearch && matchStatus && matchPriority && matchSubject;
    });

    const filtersActive = Boolean(search) || this.taskPriorityFilter !== "all" || this.taskSubjectFilter !== "all";
    if (countLabel) {
      countLabel.textContent = `${filtered.length} assignment${filtered.length === 1 ? "" : "s"}${filtersActive ? " match your filters" : ""}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      const titleEl = document.getElementById("tasks-empty-title");
      const textEl = document.getElementById("tasks-empty-text");
      if (this.tasks.length === 0) {
        titleEl.textContent = "No assignments yet";
        textEl.textContent = "Add your first assignment — StudyBuddy groups everything by when it's due.";
      } else if (filtersActive) {
        titleEl.textContent = "No matches";
        textEl.textContent = "Nothing matches your search or filters. Try clearing them.";
      } else if (this.taskStatusFilter === "pending") {
        titleEl.textContent = "All caught up 🎉";
        textEl.textContent = "Every assignment is done. Enjoy the free time — or get ahead on the next one.";
      } else {
        titleEl.textContent = "Nothing here yet";
        textEl.textContent = "Completed assignments will show up here.";
      }
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    let groups;
    if (this.taskSort === "due") {
      const defs = [
        { key: "overdue", label: "Overdue", icon: "fa-solid fa-triangle-exclamation" },
        { key: "today", label: "Due today", icon: "fa-solid fa-sun" },
        { key: "tomorrow", label: "Tomorrow", icon: "fa-regular fa-calendar" },
        { key: "week", label: "Next 7 days", icon: "fa-regular fa-calendar-days" },
        { key: "later", label: "Later", icon: "fa-regular fa-clock" },
        { key: "nodate", label: "No due date", icon: "fa-regular fa-circle" },
        { key: "completed", label: "Completed", icon: "fa-solid fa-circle-check" }
      ];
      groups = defs.map(def => ({
        ...def,
        items: filtered.filter(t => this.taskBucket(t) === def.key).sort((a, b) => {
          if (def.key === "completed") return String(b.completedAt || "").localeCompare(String(a.completedAt || ""));
          return this.compareByDue(a, b);
        })
      })).filter(g => g.items.length);
    } else {
      const sorted = filtered.slice().sort((a, b) => {
        if (this.taskSort === "priority") {
          const r = (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1);
          return r !== 0 ? r : this.compareByDue(a, b);
        }
        return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      });
      groups = [{ key: "all", label: null, items: sorted }];
    }

    container.innerHTML = groups.map(group => `
      <section class="task-group is-${group.key}">
        ${group.label ? `
          <h4 class="task-group-header">
            <i class="${group.icon}"></i> ${group.label}
            <span class="task-group-count">${group.items.length}</span>
          </h4>` : ""}
        <div class="task-group-list">
          ${group.items.map(task => this.renderTaskCard(task)).join("")}
        </div>
      </section>
    `).join("");

  }

  renderTaskCard(task) {
    const due = this.formatDueDateBadge(task.dueDate);
    const priority = PRIORITY_RANK[task.priority] !== undefined ? task.priority : "medium";
    const focused = Number(task.focusMinutes) || 0;
    const dueClass = task.completed ? "" : due.isOverdue ? "overdue" : due.isToday ? "is-today" : "";
    const subs = Array.isArray(task.subtasks) ? task.subtasks : [];
    const subsDone = subs.filter(sub => sub.done).length;
    const expanded = this._expandedTasks.has(task.id);
    const subtaskToggle = subs.length ? `
      <button type="button" class="subtask-toggle ${expanded ? "open" : ""}" data-action="subtasks" aria-expanded="${expanded}" title="${expanded ? "Hide" : "Show"} checklist">
        <i class="fa-solid fa-chevron-right"></i>
        <span class="task-progress"><span class="task-progress-bar"><span style="width: ${Math.round((subsDone / subs.length) * 100)}%"></span></span>${subsDone}/${subs.length} steps</span>
      </button>` : "";
    const subtaskList = subs.length && expanded ? `
      <ul class="card-subtasks">
        ${subs.map(sub => `
          <li class="${sub.done ? "done" : ""}" data-sub-id="${this.escapeHTML(sub.id)}">
            <button type="button" class="check check-sm ${sub.done ? "checked" : ""}" data-action="subtask" aria-label="${sub.done ? "Mark step as not done" : "Mark step as done"}"><i class="fa-solid fa-check"></i></button>
            <span>${this.escapeHTML(sub.text)}</span>
          </li>`).join("")}
      </ul>` : "";
    return `
      <div class="task-card ${task.completed ? "completed" : ""}" data-task-id="${this.escapeHTML(task.id)}">
        <button type="button" class="check p-${priority} ${task.completed ? "checked" : ""}" data-action="toggle"
          aria-label="${task.completed ? "Mark as not done" : "Mark as done"}" aria-pressed="${task.completed}">
          <i class="fa-solid fa-check"></i>
        </button>
        <div class="task-main" data-action="edit">
          <div class="task-title">${this.escapeHTML(task.title)}</div>
          ${task.description ? `<p class="task-details">${this.escapeHTML(task.description)}</p>` : ""}
          <div class="task-meta-bar">
            <span class="chip" style="--subj: ${this.subjectColor(task.subject)}">${this.escapeHTML(task.subject || "General")}</span>
            <span class="task-meta-item ${dueClass}"><i class="fa-regular fa-calendar"></i> ${this.escapeHTML(due.text)}</span>
            ${!task.completed ? `<span class="priority-flag p-${priority}"><i class="fa-${priority === "low" ? "regular" : "solid"} fa-flag"></i> ${priority[0].toUpperCase() + priority.slice(1)}</span>` : ""}
            <span class="task-meta-item"><i class="fa-regular fa-clock"></i> ~${this.formatMinutes(Number(task.estimatedTime) || 45)}</span>
            ${focused ? `<span class="task-meta-item"><i class="fa-solid fa-stopwatch"></i> ${this.formatMinutes(focused)} focused</span>` : ""}
            ${subtaskToggle}
          </div>
          ${subtaskList}
        </div>
        <div class="task-actions">
          ${!task.completed ? `<button type="button" class="icon-btn icon-btn-sm" data-action="focus" title="Start a focus session on this" aria-label="Focus on this"><i class="fa-solid fa-play"></i></button>` : ""}
          <button type="button" class="icon-btn icon-btn-sm" data-action="edit" title="Edit" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" title="Delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // Timetable
  // ===========================================================================
  todayName() {
    return WEEKDAYS[(new Date().getDay() + 6) % 7];
  }

  /** Date key of the given weekday in the current (Monday-first) week. */
  dateKeyForWeekday(dayName) {
    const idx = WEEKDAYS.indexOf(dayName);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const todayIdx = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() + ((idx === -1 ? todayIdx : idx) - todayIdx));
    return this.toDateKey(d);
  }

  currentWeekDates() {
    return WEEKDAYS.map(day => this.dateKeyForWeekday(day));
  }

  /**
   * Slots repeat weekly, so "done" is tracked per date rather than as one
   * permanent flag (the old `completed: true` stayed ticked forever).
   */
  normalizeSlot(slot) {
    if (!slot || typeof slot !== "object") return slot;
    if (!Array.isArray(slot.doneDates)) {
      slot.doneDates = slot.completed ? [this.dateKeyForWeekday(slot.day)] : [];
    }
    if ("completed" in slot) delete slot.completed;
    // Keep the list short — only recent weeks matter.
    if (slot.doneDates.length > 30) slot.doneDates = slot.doneDates.slice(-30);
    return slot;
  }

  isSlotDone(slot) {
    return Array.isArray(slot.doneDates) && slot.doneDates.includes(this.dateKeyForWeekday(slot.day));
  }

  isSlotNow(slot) {
    if (slot.day !== this.todayName()) return false;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = String(slot.startTime || "0:0").split(":").map(Number);
    const [eh, em] = String(slot.endTime || "0:0").split(":").map(Number);
    return mins >= sh * 60 + sm && mins < eh * 60 + em;
  }

  setTimetableView(view) {
    this.timetableView = view === "week" ? "week" : "day";
    document.getElementById("tab-timetable")?.classList.toggle("view-week", this.timetableView === "week");
    document.querySelectorAll("#tt-view-toggle [data-view]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === this.timetableView);
    });
    this.renderTimetable();
  }

  setupTimetableEvents() {
    document.getElementById("days-nav")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".day-chip");
      if (!chip) return;
      this.selectedDay = chip.dataset.day;
      this.renderTimetable();
    });

    document.getElementById("tt-view-toggle")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (btn) this.setTimetableView(btn.dataset.view);
    });

    document.getElementById("timetable-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveTimetableFromForm();
    });

    document.getElementById("timetable-slots-list")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const id = btn.dataset.slotId;
      const slot = this.timetable.find(s => s.id === id);
      if (!slot) return;
      if (btn.dataset.action === "toggle") this.toggleTimetableSlotComplete(id);
      else if (btn.dataset.action === "edit") this.openTimetableModal(slot);
      else if (btn.dataset.action === "duplicate") this.openTimetableModal(null, { ...slot, title: slot.title });
      else if (btn.dataset.action === "delete") this.deleteTimetableSlot(id);
    });

    document.getElementById("timetable-week-view")?.addEventListener("click", (e) => {
      const slotBtn = e.target.closest("[data-slot-id]");
      if (slotBtn) {
        const slot = this.timetable.find(s => s.id === slotBtn.dataset.slotId);
        if (slot) this.openTimetableModal(slot);
        return;
      }
      const addBtn = e.target.closest("[data-add-day]");
      if (addBtn) {
        this.openTimetableModal(null, { day: addBtn.dataset.addDay });
        return;
      }
      const dayBtn = e.target.closest("[data-open-day]");
      if (dayBtn) {
        this.selectedDay = dayBtn.dataset.openDay;
        this.setTimetableView("day");
      }
    });
  }

  openTimetableModal(slot = null, prefill = null) {
    const modal = document.getElementById("timetable-modal");
    const form = document.getElementById("timetable-form");
    const titleEl = document.getElementById("timetable-modal-title");
    if (!modal || !form) return;

    form.reset();

    const source = slot || prefill;
    if (slot) {
      titleEl.textContent = "Edit study slot";
      document.getElementById("slot-id").value = slot.id;
      document.getElementById("save-timetable-btn").textContent = "Save changes";
    } else {
      titleEl.textContent = prefill && prefill.id ? "Duplicate slot" : "Add study slot";
      document.getElementById("slot-id").value = "";
      document.getElementById("save-timetable-btn").textContent = "Add slot";
    }

    document.getElementById("slot-day-select").value = (source && source.day) || this.selectedDay;
    document.getElementById("slot-title-input").value = (source && source.title) || "";
    document.getElementById("slot-subject-input").value = (source && source.subject) || "";
    document.getElementById("slot-type-select").value = (source && source.type) || "Lecture";
    document.getElementById("slot-start-time").value = (source && source.startTime) || "10:00";
    document.getElementById("slot-end-time").value = (source && source.endTime) || "11:30";
    document.getElementById("slot-location-input").value = (source && source.location) || "";

    // A duplicate usually goes on another day — start there.
    const focus = prefill && prefill.id ? document.getElementById("slot-day-select") : null;
    this.openModal(modal, focus);
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
    if (startTime >= endTime) {
      this.showToast("The end time must be after the start time", "alert");
      return;
    }

    if (id) {
      const index = this.timetable.findIndex(s => s.id === id);
      if (index !== -1) {
        this.timetable[index] = { ...this.timetable[index], day, title, subject, type, startTime, endTime, location };
        this.showToast("Timetable updated");
      }
    } else {
      this.timetable.push({
        id: "slot-" + Date.now(),
        day, title, subject, type, startTime, endTime, location,
        doneDates: []
      });
      this._flash = { listName: "timetable", id: this.timetable[this.timetable.length - 1].id };
      this.showToast(`Added to ${day}s`);
    }

    this.selectedDay = day;
    this.schedulePersist();
    this.closeModal(document.getElementById("timetable-modal"));
    this.renderAll();
  }

  deleteTimetableSlot(id) {
    this.removeWithUndo("timetable", id, "Study slot");
  }

  toggleTimetableSlotComplete(id) {
    const slot = this.timetable.find(s => s.id === id);
    if (!slot) return;
    this.normalizeSlot(slot);
    const key = this.dateKeyForWeekday(slot.day);
    if (slot.doneDates.includes(key)) {
      slot.doneDates = slot.doneDates.filter(d => d !== key);
    } else {
      slot.doneDates.push(key);
      this.playSound("success");
      this.showToast("Session marked as done");
      this.recordActivity();
    }
    this.schedulePersist();
    this.renderAll();
  }

  slotMinutes(slot) {
    const [sh, sm] = String(slot.startTime || "0:0").split(":").map(Number);
    const [eh, em] = String(slot.endTime || "0:0").split(":").map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    return diff;
  }

  renderTimetable() {
    const today = this.todayName();
    const byDay = {};
    WEEKDAYS.forEach(d => { byDay[d] = []; });
    this.timetable.forEach(s => { if (byDay[s.day]) byDay[s.day].push(s); });
    Object.values(byDay).forEach(list => list.sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))));

    // Day chips
    document.querySelectorAll("#days-nav .day-chip").forEach(chip => {
      const day = chip.dataset.day;
      chip.classList.toggle("active", day === this.selectedDay);
      chip.classList.toggle("is-today", day === today);
      const n = byDay[day]?.length || 0;
      chip.innerHTML = `${day.slice(0, 3)}${n ? `<span class="day-chip-count">${n}</span>` : ""}`;
      chip.setAttribute("aria-label", `${day}${day === today ? " (today)" : ""}, ${n} session${n === 1 ? "" : "s"}`);
    });

    const dayView = document.getElementById("timetable-day-view");
    const weekView = document.getElementById("timetable-week-view");
    document.getElementById("tab-timetable")?.classList.toggle("view-week", this.timetableView === "week");
    dayView?.classList.toggle("hidden", this.timetableView === "week");
    weekView?.classList.toggle("hidden", this.timetableView !== "week");

    if (this.timetableView === "week") {
      this.renderTimetableWeek(byDay, today);
      return;
    }

    const container = document.getElementById("timetable-slots-list");
    const emptyState = document.getElementById("timetable-empty-state");
    const dayTitle = document.getElementById("current-selected-day-title");
    const dayCount = document.getElementById("day-slot-count");
    if (!container) return;

    const daySlots = byDay[this.selectedDay] || [];
    if (dayTitle) dayTitle.textContent = this.selectedDay === today ? `${this.selectedDay} · Today` : this.selectedDay;
    if (dayCount) {
      const total = daySlots.reduce((sum, s) => sum + this.slotMinutes(s), 0);
      dayCount.textContent = daySlots.length
        ? `${daySlots.length} session${daySlots.length === 1 ? "" : "s"} · ${this.formatMinutes(total)} planned`
        : "No sessions";
    }

    if (daySlots.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    container.innerHTML = daySlots.map(slot => {
      const done = this.isSlotDone(slot);
      const now = this.isSlotNow(slot);
      const id = this.escapeHTML(slot.id);
      return `
        <div class="schedule-card ${done ? "is-done" : ""} ${now ? "is-now" : ""}" data-slot-id="${id}" style="--subj: ${this.subjectColor(slot.subject)}">
          <div class="schedule-time-block">
            <span class="time-range">${this.formatHM(slot.startTime)}</span>
            <span class="time-end">to ${this.formatHM(slot.endTime)}</span>
            <span class="time-duration">${this.calculateDuration(slot.startTime, slot.endTime)}</span>
          </div>
          <div class="schedule-content">
            <div class="schedule-tags">
              ${now ? '<span class="badge badge-success"><i class="fa-solid fa-circle"></i> Now</span>' : ""}
              <span class="chip" style="--subj: ${this.subjectColor(slot.subject)}">${this.escapeHTML(slot.subject)}</span>
              <span class="chip chip-plain">${this.escapeHTML(slot.type)}</span>
            </div>
            <div class="schedule-title">${this.escapeHTML(slot.title)}</div>
            ${slot.location ? `<div class="schedule-location"><i class="fa-solid fa-location-dot"></i> ${this.linkifyLocation(slot.location)}</div>` : ""}
          </div>
          <div class="schedule-actions">
            <button type="button" class="btn btn-sm ${done ? "is-done" : "btn-outline"}" data-slot-id="${id}" data-action="toggle" aria-pressed="${done}">
              <i class="fa-solid fa-check"></i> <span>${done ? "Done" : "Mark done"}</span>
            </button>
            <button type="button" class="icon-btn icon-btn-sm" data-slot-id="${id}" data-action="duplicate" title="Duplicate to another day" aria-label="Duplicate"><i class="fa-regular fa-copy"></i></button>
            <button type="button" class="icon-btn icon-btn-sm" data-slot-id="${id}" data-action="edit" title="Edit" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-slot-id="${id}" data-action="delete" title="Delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    }).join("");
  }

  renderTimetableWeek(byDay, today) {
    const container = document.getElementById("timetable-week-view");
    if (!container) return;
    container.innerHTML = WEEKDAYS.map(day => {
      const slots = byDay[day] || [];
      const total = slots.reduce((sum, s) => sum + this.slotMinutes(s), 0);
      return `
        <div class="week-col ${day === today ? "is-today" : ""}">
          <div class="week-col-header">
            <button type="button" data-open-day="${day}" title="Open ${day}">${day.slice(0, 3)}</button>
            <span>${slots.length ? this.formatMinutes(total) : ""}</span>
          </div>
          ${slots.length ? slots.map(slot => `
            <button type="button" class="week-slot ${this.isSlotDone(slot) ? "is-done" : ""}" data-slot-id="${this.escapeHTML(slot.id)}" style="--subj: ${this.subjectColor(slot.subject)}">
              <span class="week-slot-time">${this.formatHM(slot.startTime)}</span>
              <span class="week-slot-title">${this.escapeHTML(slot.title)}</span>
            </button>
          `).join("") : '<div class="week-col-empty">Free</div>'}
          <button type="button" class="week-col-add" data-add-day="${day}" aria-label="Add a slot on ${day}"><i class="fa-solid fa-plus"></i></button>
        </div>
      `;
    }).join("");
  }

  // ===========================================================================
  // Notes
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

    const grid = document.getElementById("notes-grid");
    grid?.addEventListener("click", (e) => {
      const card = e.target.closest(".note-card");
      if (!card) return;
      const id = card.dataset.noteId;
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "pin") this.toggleNotePin(id);
      else if (action === "delete") this.deleteNote(id);
      else {
        const note = this.notes.find(n => n.id === id);
        if (note) this.openNoteModal(note);
      }
    });
    grid?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !e.target.classList?.contains("note-card")) return;
      const note = this.notes.find(n => n.id === e.target.dataset.noteId);
      if (note) this.openNoteModal(note);
    });
  }

  openNoteModal(note = null) {
    const modal = document.getElementById("note-modal");
    const form = document.getElementById("note-form");
    const titleEl = document.getElementById("note-modal-title");
    if (!modal || !form) return;

    form.reset();
    const setColor = (color) => {
      const radio = form.querySelector(`input[name="note-color"][value="${color}"]`) ||
        form.querySelector('input[name="note-color"][value="sky"]');
      if (radio) radio.checked = true;
    };

    if (note) {
      titleEl.textContent = "Edit note";
      document.getElementById("note-id").value = note.id;
      document.getElementById("note-title-input").value = note.title || "";
      document.getElementById("note-subject-input").value = note.subject || "";
      document.getElementById("note-content-input").value = note.content || "";
      document.getElementById("note-pinned-input").checked = Boolean(note.pinned);
      setColor(note.color || "sky");
      document.getElementById("save-note-btn").textContent = "Save changes";
    } else {
      titleEl.textContent = "New note";
      document.getElementById("note-id").value = "";
      if (this.noteSubjectFilter !== "all") document.getElementById("note-subject-input").value = this.noteSubjectFilter;
      setColor("sky");
      document.getElementById("save-note-btn").textContent = "Save note";
    }

    this.openModal(modal);
  }

  saveNoteFromForm() {
    const id = document.getElementById("note-id").value;
    const title = document.getElementById("note-title-input").value.trim();
    const subject = document.getElementById("note-subject-input").value.trim();
    const color = document.querySelector('input[name="note-color"]:checked')?.value || "sky";
    const content = document.getElementById("note-content-input").value.trim();
    const pinned = Boolean(document.getElementById("note-pinned-input")?.checked);

    if (!title || !content || !subject) {
      this.showToast("Please fill in the title, subject and content", "alert");
      return;
    }

    const now = new Date();
    const updatedAt = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const updatedAtISO = now.toISOString();

    if (id) {
      const idx = this.notes.findIndex(n => n.id === id);
      if (idx !== -1) {
        this.notes[idx] = { ...this.notes[idx], title, subject, color, content, pinned, updatedAt, updatedAtISO };
        this.showToast("Note updated");
      }
    } else {
      this.notes.unshift({ id: "note-" + Date.now(), title, subject, color, content, pinned, updatedAt, updatedAtISO });
      this._flash = { listName: "notes", id: this.notes[0].id };
      this.showToast("Note created");
    }

    this.schedulePersist();
    this.recordActivity();
    this.closeModal(document.getElementById("note-modal"));
    this.renderAll();
  }

  toggleNotePin(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return;
    note.pinned = !note.pinned;
    this.schedulePersist();
    this.renderAll();
    this.showToast(note.pinned ? "Pinned to the top" : "Unpinned", "info");
  }

  deleteNote(id) {
    this.removeWithUndo("notes", id, "Note");
  }

  /** Lightweight, safe formatting: "- " bullets, "# " headings, **bold**, `code`. */
  renderNoteBody(content) {
    const inline = (text) => this.escapeHTML(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+?)`/g, "<code>$1</code>");
    const lines = String(content || "").split(/\r?\n/);
    let html = "";
    let inList = false;
    let para = [];
    const flushPara = () => {
      if (para.length) html += `<p>${para.map(inline).join("<br>")}</p>`;
      para = [];
    };
    lines.forEach(line => {
      const trimmed = line.trim();
      const bullet = trimmed.match(/^([-*•])\s+(.*)$/);
      if (bullet) {
        flushPara();
        if (!inList) { html += "<ul>"; inList = true; }
        html += `<li>${inline(bullet[2])}</li>`;
        return;
      }
      if (inList) { html += "</ul>"; inList = false; }
      const heading = trimmed.match(/^#{1,3}\s+(.*)$/);
      if (heading) {
        flushPara();
        html += `<h4>${inline(heading[1])}</h4>`;
      } else if (!trimmed) {
        flushPara();
      } else {
        para.push(trimmed);
      }
    });
    if (inList) html += "</ul>";
    flushPara();
    return html;
  }

  renderNotes() {
    const container = document.getElementById("notes-grid");
    const emptyState = document.getElementById("notes-empty-state");
    if (!container) return;

    const search = this.noteSearch;
    const filtered = this.notes.filter(note => {
      const matchSearch = !search ||
        (note.title || "").toLowerCase().includes(search) ||
        (note.content || "").toLowerCase().includes(search) ||
        (note.subject || "").toLowerCase().includes(search);
      const matchSubject = this.noteSubjectFilter === "all" || note.subject === this.noteSubjectFilter;
      return matchSearch && matchSubject;
    });

    if (filtered.length === 0) {
      container.innerHTML = "";
      const titleEl = document.getElementById("notes-empty-title");
      const textEl = document.getElementById("notes-empty-text");
      if (this.notes.length === 0) {
        titleEl.textContent = "No notes yet";
        textEl.textContent = "Capture formulas, definitions and lecture takeaways here.";
      } else {
        titleEl.textContent = "No matching notes";
        textEl.textContent = "Try a different search or subject filter.";
      }
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    // Most recently edited first; legacy notes (no timestamp) keep their order.
    const ordered = filtered
      .map((note, index) => ({ note, index }))
      .sort((a, b) => {
        const ta = a.note.updatedAtISO || "";
        const tb = b.note.updatedAtISO || "";
        if (ta !== tb) return tb.localeCompare(ta);
        return a.index - b.index;
      })
      .map(x => x.note);
    const pinned = ordered.filter(n => n.pinned);
    const others = ordered.filter(n => !n.pinned);

    const renderCard = (note) => {
      const accent = ["sky", "emerald", "purple", "amber", "rose"].includes(note.color) ? note.color : "sky";
      const long = String(note.content || "").length > 520 || String(note.content || "").split("\n").length > 14;
      return `
        <article class="note-card accent-${accent}" data-note-id="${this.escapeHTML(note.id)}" tabindex="0" aria-label="${this.escapeHTML(note.title)}">
          <div class="note-header">
            <h3 class="note-title">${this.escapeHTML(note.title)}</h3>
            <button type="button" class="icon-btn icon-btn-sm note-pin ${note.pinned ? "is-pinned" : ""}" data-action="pin"
              title="${note.pinned ? "Unpin" : "Pin to top"}" aria-label="${note.pinned ? "Unpin" : "Pin to top"}" aria-pressed="${Boolean(note.pinned)}">
              <i class="fa-solid fa-thumbtack"></i>
            </button>
          </div>
          <div class="note-subject"><span class="chip" style="--subj: ${this.subjectColor(note.subject)}">${this.escapeHTML(note.subject)}</span></div>
          <div class="note-body ${long ? "is-clamped" : ""}">${this.renderNoteBody(note.content)}</div>
          <div class="note-footer">
            <span><i class="fa-regular fa-clock"></i> ${this.escapeHTML(note.updatedAt || "Recently")}</span>
            <div class="note-actions">
              <button type="button" class="icon-btn icon-btn-sm" data-action="edit" title="Edit" aria-label="Edit"><i class="fa-solid fa-pen"></i></button>
              <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" title="Delete" aria-label="Delete"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        </article>
      `;
    };

    let html = "";
    if (pinned.length) {
      html += `<div class="notes-section-label"><i class="fa-solid fa-thumbtack"></i> Pinned</div>`;
      html += `<div class="notes-masonry">${pinned.map(renderCard).join("")}</div>`;
      if (others.length) html += `<div class="notes-section-label">Other notes</div>`;
    }
    if (others.length) html += `<div class="notes-masonry">${others.map(renderCard).join("")}</div>`;
    container.innerHTML = html;
  }

  // ===========================================================================
  // Pomodoro Focus Timer
  // ===========================================================================
  modeSeconds(mode) {
    const s = this.settings || DEFAULT_SETTINGS;
    const minutes = mode === "shortBreak" ? s.shortMin : mode === "longBreak" ? s.longMin : s.focusMin;
    return Math.max(1, Number(minutes) || 1) * 60;
  }

  setupPomodoroEvents() {
    document.getElementById("timer-toggle-btn")?.addEventListener("click", () => this.toggleTimer());
    document.getElementById("sidebar-timer-start-btn")?.addEventListener("click", () => this.toggleTimer());
    document.getElementById("timer-reset-btn")?.addEventListener("click", () => this.resetTimer());
    document.getElementById("sidebar-timer-reset-btn")?.addEventListener("click", () => this.resetTimer());
    document.getElementById("timer-skip-btn")?.addEventListener("click", () => this.skipTimer());

    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => this.setTimerMode(btn.dataset.mode));
    });

    document.getElementById("timer-task-select")?.addEventListener("change", (e) => {
      this.timerTaskId = e.target.value;
      this.renderTimerMeta();
    });

    // Catch up immediately when the tab becomes visible again.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isTimerRunning) this.tickTimer();
    });

    this.renderTimerMeta();
    this.updateTimerDisplay();
  }

  setTimerMode(mode) {
    if (!["pomodoro", "shortBreak", "longBreak"].includes(mode)) return;
    this.pauseTimer();
    this.timerMode = mode;
    this.timeLeft = this.modeSeconds(mode);
    this.renderTimerMeta();
    this.updateTimerDisplay();
  }

  toggleTimer() {
    if (this.isTimerRunning) this.pauseTimer();
    else this.startTimer();
  }

  startTimer() {
    if (this.isTimerRunning) return;
    if (this.timeLeft <= 0) this.timeLeft = this.modeSeconds(this.timerMode);
    this.isTimerRunning = true;
    this.timerEndsAt = Date.now() + this.timeLeft * 1000;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tickTimer(), 250);
    this.renderTimerMeta();
    this.updateTimerDisplay();
  }

  tickTimer() {
    if (!this.isTimerRunning || !this.timerEndsAt) return;
    const left = Math.max(0, Math.ceil((this.timerEndsAt - Date.now()) / 1000));
    if (left !== this.timeLeft) {
      this.timeLeft = left;
      this.updateTimerDisplay();
    }
    if (left <= 0) this.onTimerComplete();
  }

  pauseTimer() {
    if (this.isTimerRunning && this.timerEndsAt) {
      this.timeLeft = Math.max(0, Math.ceil((this.timerEndsAt - Date.now()) / 1000));
    }
    this.isTimerRunning = false;
    this.timerEndsAt = null;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.renderTimerMeta();
    this.updateTimerDisplay();
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.modeSeconds(this.timerMode);
    this.renderTimerMeta();
    this.updateTimerDisplay();
  }

  skipTimer() {
    this.pauseTimer();
    this.setTimerMode(this.timerMode === "pomodoro" ? "shortBreak" : "pomodoro");
  }

  onTimerComplete() {
    const finished = this.timerMode;
    this.pauseTimer();
    this.playSound("chime");

    if (finished === "pomodoro") {
      const minutes = Number(this.settings.focusMin) || 25;
      const today = this.toDateKey(new Date());
      this.pomodoroSessions++;
      this.focusMinutes += minutes;
      this.focusLog[today] = (Number(this.focusLog[today]) || 0) + minutes;
      const task = this.timerTaskId ? this.tasks.find(t => t.id === this.timerTaskId) : null;
      if (task) task.focusMinutes = (Number(task.focusMinutes) || 0) + minutes;
      this.cycleCount++;
      this.recordActivity();
      this.schedulePersist();
      this.celebrate();

      const next = this.cycleCount % 4 === 0 ? "longBreak" : "shortBreak";
      const message = `Focus session done — ${minutes} min logged${task ? ` on “${task.title}”` : ""}. Time for a ${next === "longBreak" ? "long" : "short"} break ☕`;
      this.showToast(message, "success", { duration: 6000 });
      this.showNotification("Focus session complete", message);
      this.setTimerMode(next);
    } else {
      this.showToast("Break's over — ready for the next session? 📚", "info", { duration: 6000 });
      this.showNotification("Break's over", "Ready for the next focus session?");
      this.setTimerMode("pomodoro");
    }

    if (this.settings.autoStart) this.startTimer();
    this.renderDashboard();
    this.renderProgressStats();
    this.renderStreak();
    this.renderTasks();
  }

  formatTimer(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  updateTimerDisplay() {
    const formatted = this.formatTimer(this.timeLeft);
    const mainDisplay = document.getElementById("timer-display");
    const sidebarDisplay = document.getElementById("sidebar-timer-time");
    if (mainDisplay) mainDisplay.textContent = formatted;
    if (sidebarDisplay) sidebarDisplay.textContent = formatted;

    const total = this.modeSeconds(this.timerMode);
    const fraction = Math.min(1, Math.max(0, (total - this.timeLeft) / total));
    const circle = document.getElementById("timer-progress-circle");
    if (circle) {
      const circumference = 2 * Math.PI * 90;
      circle.style.strokeDasharray = String(circumference);
      circle.style.strokeDashoffset = String(circumference * (1 - fraction));
    }
    const bar = document.getElementById("sidebar-timer-bar");
    if (bar) bar.style.width = `${fraction * 100}%`;

    this.renderFocusOverlay(true);
    this.updateDocumentTitle();
  }

  /** Everything around the digits: labels, buttons, mode colours, cycle dots, task picker. */
  renderTimerMeta() {
    const mode = this.timerMode;
    const running = this.isTimerRunning;
    const total = this.modeSeconds(mode);
    const started = this.timeLeft < total;

    document.getElementById("timer-card")?.setAttribute("data-mode", mode);
    document.getElementById("sidebar-widget")?.setAttribute("data-mode", mode);
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
      const mins = Math.round(this.modeSeconds(btn.dataset.mode) / 60);
      const label = btn.dataset.mode === "pomodoro" ? "Focus" : btn.dataset.mode === "shortBreak" ? "Short break" : "Long break";
      btn.textContent = `${label} · ${mins}m`;
    });

    const toggleBtn = document.getElementById("timer-toggle-btn");
    if (toggleBtn) {
      toggleBtn.innerHTML = running ? '<i class="fa-solid fa-pause"></i> Pause'
        : started ? '<i class="fa-solid fa-play"></i> Resume' : '<i class="fa-solid fa-play"></i> Start';
    }
    const sidebarBtn = document.getElementById("sidebar-timer-start-btn");
    if (sidebarBtn) {
      sidebarBtn.innerHTML = running ? '<i class="fa-solid fa-pause"></i> Pause'
        : started ? '<i class="fa-solid fa-play"></i> Resume' : '<i class="fa-solid fa-play"></i> Start';
    }
    const sidebarTag = document.getElementById("sidebar-timer-mode");
    if (sidebarTag) sidebarTag.textContent = mode === "pomodoro" ? "Focus" : mode === "shortBreak" ? "Break" : "Rest";
    document.getElementById("nav-timer-live")?.classList.toggle("hidden", !running);
    document.getElementById("timer-card")?.classList.toggle("is-running", running);
    document.getElementById("sidebar-widget")?.classList.toggle("is-running", running);

    // Task picker
    const select = document.getElementById("timer-task-select");
    const task = this.timerTaskId ? this.tasks.find(t => t.id === this.timerTaskId && !t.completed) : null;
    if (!task) this.timerTaskId = "";
    if (select) {
      const pending = this.tasks.filter(t => !t.completed).sort((a, b) => this.compareByDue(a, b));
      select.innerHTML = '<option value="">Just focusing</option>' + pending.map(t =>
        `<option value="${this.escapeHTML(t.id)}">${this.escapeHTML(t.title)} — ${this.escapeHTML(t.subject || "")}</option>`
      ).join("");
      select.value = this.timerTaskId;
    }

    const status = document.getElementById("timer-status-text");
    if (status) {
      let text;
      if (mode === "pomodoro") {
        text = running ? (task ? `Focusing on ${task.title}` : "Stay with it — you've got this")
          : started ? "Paused" : (task ? `Ready to work on ${task.title}` : "Ready to focus");
      } else if (mode === "shortBreak") {
        text = running ? "Stretch, hydrate, look away from the screen" : started ? "Break paused" : "Take a short break";
      } else {
        text = running ? "Long break — you've earned it" : started ? "Break paused" : "Recharge with a long break";
      }
      status.textContent = text;
    }

    const dots = document.getElementById("timer-cycle-dots");
    if (dots) {
      let filled = this.cycleCount % 4;
      if (filled === 0 && this.cycleCount > 0 && mode === "longBreak") filled = 4;
      dots.innerHTML = [0, 1, 2, 3].map(i => `<span class="cycle-dot ${i < filled ? "filled" : ""}"></span>`).join("");
    }
    this.renderFocusOverlay();
    this.updateDocumentTitle();
  }

  // ===========================================================================
  // Calendar & Events
  // ===========================================================================

  // Local-time date key (YYYY-MM-DD) — avoids the UTC off-by-one of toISOString().
  toDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

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

  // "Starts in 45 mins", "Happening now · ends in 20m", "In 2 days · 4h" …
  formatCountdown(event) {
    const now = Date.now();
    const start = this.eventStart(event).getTime();
    const end = this.eventEnd(event).getTime();

    if (now >= start && now <= end) {
      const minsLeft = Math.ceil((end - now) / 60000);
      return { text: minsLeft <= 1 ? "Happening now" : `Happening now · ends in ${this.formatDurationShort(minsLeft)}`, state: "now", minutes: 0 };
    }

    const minutes = Math.ceil((start - now) / 60000);
    if (minutes <= 0) return { text: "Finished", state: "past", minutes: -1 };

    const state = minutes <= 60 ? "urgent" : "upcoming";
    let text;
    if (minutes < 60) text = `Starts in ${minutes} min${minutes === 1 ? "" : "s"}`;
    else if (minutes < 24 * 60) text = `Starts in ${this.formatDurationShort(minutes)}`;
    else {
      const days = this.daysUntil(event.date);
      text = days <= 1 ? "Tomorrow" : `In ${days} days`;
    }
    return { text, state, minutes };
  }

  /** Compact countdown for pills: "Now", "in 35m", "in 3h 20m", "Tomorrow", "in 4 days". */
  formatCountdownShort(event) {
    const now = Date.now();
    const start = this.eventStart(event).getTime();
    const end = this.eventEnd(event).getTime();
    if (now >= start && now <= end) return { text: "Now", state: "now" };
    const minutes = Math.ceil((start - now) / 60000);
    if (minutes <= 0) return { text: "Done", state: "past" };
    if (minutes < 24 * 60) return { text: `in ${this.formatDurationShort(minutes)}`, state: minutes <= 60 ? "urgent" : "soon" };
    const days = this.daysUntil(event.date);
    if (days === 1) return { text: "Tomorrow", state: "upcoming" };
    return { text: `in ${days} days`, state: "upcoming" };
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

  eventTypeKey(type) {
    return ["test", "class", "study"].includes(type) ? type : "event";
  }

  eventTypeInfo(type) {
    switch (type) {
      case "test": return { icon: "fa-solid fa-file-pen", label: "Test / Exam" };
      case "class": return { icon: "fa-solid fa-chalkboard-user", label: "Class" };
      case "study": return { icon: "fa-solid fa-book-open-reader", label: "Study" };
      default: return { icon: "fa-solid fa-star", label: "Event" };
    }
  }

  selectCalendarDate(dateKey) {
    if (!dateKey) return;
    const [y, m] = dateKey.split("-").map(Number);
    this.selectedDate = dateKey;
    this.calendarYear = y;
    this.calendarMonth = m - 1;
  }

  setupCalendarEvents() {
    document.getElementById("event-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveEventFromForm();
    });

    document.getElementById("cal-prev-btn")?.addEventListener("click", () => {
      this._calSlide = "prev";
      this.calendarMonth--;
      if (this.calendarMonth < 0) { this.calendarMonth = 11; this.calendarYear--; }
      this.renderCalendar();
    });

    document.getElementById("cal-next-btn")?.addEventListener("click", () => {
      this._calSlide = "next";
      this.calendarMonth++;
      if (this.calendarMonth > 11) { this.calendarMonth = 0; this.calendarYear++; }
      this.renderCalendar();
    });

    document.getElementById("cal-today-btn")?.addEventListener("click", () => {
      this._calSlide = "today";
      this.selectCalendarDate(this.toDateKey(new Date()));
      this.renderCalendar();
      this.renderAgenda();
    });

    const grid = document.getElementById("calendar-grid");
    grid?.addEventListener("click", (e) => {
      const cell = e.target.closest(".calendar-day");
      if (!cell) return;
      this.selectCalendarDate(cell.dataset.date);
      this.renderCalendar();
      this.renderAgenda();
      // On phones the agenda sits below the grid — bring it into view.
      if (window.matchMedia && window.matchMedia("(max-width: 1100px)").matches) {
        document.querySelector(".calendar-agenda-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    grid?.addEventListener("dblclick", (e) => {
      const cell = e.target.closest(".calendar-day");
      if (cell) this.openEventModal(null, { date: cell.dataset.date });
    });

    document.getElementById("agenda-list")?.addEventListener("click", (e) => {
      const taskItem = e.target.closest("[data-task-id]");
      if (taskItem) {
        const id = taskItem.dataset.taskId;
        if (e.target.closest("[data-action='toggle-task']")) this.toggleTaskCompletion(id);
        else this.openTaskModal(this.tasks.find(t => t.id === id));
        return;
      }
      const evItem = e.target.closest("[data-event-id]");
      if (!evItem) return;
      const id = evItem.dataset.eventId;
      if (e.target.closest("[data-action='delete']")) this.deleteEvent(id);
      else {
        const ev = this.events.find(x => x.id === id);
        if (ev) this.openEventModal(ev);
      }
    });

    document.getElementById("delete-event-in-modal-btn")?.addEventListener("click", () => {
      const id = document.getElementById("event-id")?.value;
      if (!id) return;
      this.closeModal(document.getElementById("event-modal"));
      this.deleteEvent(id);
    });

    // Requests notification permission on a user gesture (required by browsers).
    document.getElementById("enable-notifications-btn")?.addEventListener("click", () => this.enableNotifications());
  }

  openEventModal(event = null, prefill = {}) {
    const modal = document.getElementById("event-modal");
    const form = document.getElementById("event-form");
    const titleEl = document.getElementById("event-modal-title");
    if (!modal || !form) return;

    form.reset();
    const setType = (type) => {
      const radio = form.querySelector(`input[name="event-type"][value="${this.eventTypeKey(type)}"]`);
      if (radio) radio.checked = true;
    };
    const deleteBtn = document.getElementById("delete-event-in-modal-btn");

    if (event) {
      titleEl.textContent = "Edit event";
      document.getElementById("event-id").value = event.id;
      document.getElementById("event-title-input").value = event.title || "";
      setType(event.type || "event");
      document.getElementById("event-subject-input").value = event.subject || "";
      document.getElementById("event-date-input").value = event.date;
      document.getElementById("event-start-time").value = event.startTime || "09:00";
      document.getElementById("event-end-time").value = event.endTime || "10:00";
      document.getElementById("event-reminder-select").value = String(event.reminderMinutes ?? 0);
      document.getElementById("event-location-input").value = event.location || "";
      document.getElementById("event-notes-input").value = event.notes || "";
      document.getElementById("save-event-btn").textContent = "Save changes";
      deleteBtn?.classList.remove("hidden");
    } else {
      titleEl.textContent = "New event";
      document.getElementById("event-id").value = "";
      const defaultDate = prefill.date || (this.currentTab === "calendar" ? this.selectedDate : this.toDateKey(new Date()));
      document.getElementById("event-date-input").value = defaultDate;
      document.getElementById("event-start-time").value = "09:00";
      document.getElementById("event-end-time").value = "10:00";
      setType(prefill.type || "event");
      document.getElementById("save-event-btn").textContent = "Add event";
      deleteBtn?.classList.add("hidden");
    }

    this.openModal(modal);
  }

  saveEventFromForm() {
    const id = document.getElementById("event-id").value;
    const title = document.getElementById("event-title-input").value.trim();
    const type = document.querySelector('input[name="event-type"]:checked')?.value || "event";
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
      this.showToast("The end time must be after the start time", "alert");
      return;
    }

    if (id) {
      const index = this.events.findIndex(e => e.id === id);
      if (index !== -1) {
        this.events[index] = { ...this.events[index], title, type, subject, date, startTime, endTime, reminderMinutes, location, notes };
        this.showToast("Event updated");
      }
    } else {
      this.events.push({
        id: "event-" + Date.now(),
        title, type, subject, date, startTime, endTime,
        reminderMinutes, location, notes,
        createdAt: new Date().toISOString()
      });
      this._flash = { listName: "events", id: this.events[this.events.length - 1].id };
      this.showToast(`Added to your calendar — ${this.formatLongDate(new Date(`${date}T00:00:00`))}`);
    }

    // Jump the calendar to the saved event so it's immediately visible.
    this.selectCalendarDate(date);

    this.schedulePersist();
    this.recordActivity();
    this.closeModal(document.getElementById("event-modal"));
    this.renderAll();
  }

  deleteEvent(id) {
    this.removeWithUndo("events", id, "Event");
  }

  // ===========================================================================
  // Study streak
  // ===========================================================================

  /** Records that the user did something meaningful today (counted once per day). */
  recordActivity() {
    const today = this.toDateKey(new Date());
    if (!this.activeDates.includes(today)) {
      this.activeDates.push(today);
      this.schedulePersist();
    }
  }

  /**
   * Backfills history for accounts created before streak tracking existed by
   * inferring activity from the tasks and events they already have.
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

  /** Consecutive active days ending today (or yesterday, so it isn't broken until a full day is missed). */
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
    const todayKey = this.toDateKey(new Date());

    for (let i = 0; i < 7; i++) {
      const key = this.toDateKey(cursor);
      week.push({
        key,
        label: cursor.toLocaleDateString("en-US", { weekday: "narrow" }),
        done: days.has(key),
        isToday: key === todayKey
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return week;
  }

  renderStreak() {
    const streak = this.getCurrentStreak();

    const sidebarStreak = document.getElementById("sidebar-streak");
    if (sidebarStreak) {
      sidebarStreak.innerHTML = `<i class="fa-solid fa-fire"></i> ${streak === 0 ? "No streak yet" : `${streak} day streak`}`;
      sidebarStreak.classList.toggle("is-hot", streak > 0);
    }
    const statStreak = document.getElementById("stat-streak");
    Motion.countTo(statStreak, streak);
    statStreak?.closest(".stat-tile")?.querySelector(".stat-tile-icon")?.classList.toggle("is-hot", streak > 0);
    document.querySelector(".streak-banner")?.classList.toggle("is-hot", streak > 0);

    const titleEl = document.getElementById("streak-banner-title");
    const textEl = document.getElementById("streak-banner-text");
    if (titleEl) {
      if (streak === 0) {
        titleEl.textContent = "No study streak yet";
        if (textEl) textEl.textContent = "Complete an assignment, mark a session done, or finish a focus sprint to start one.";
      } else {
        titleEl.textContent = `${streak} day streak${streak >= 3 ? " 🔥" : ""}`;
        if (textEl) {
          textEl.textContent = streak === 1
            ? "Nice start — come back tomorrow to keep it going."
            : "You've stayed consistent. Keep the momentum up!";
        }
      }
    }

    const container = document.getElementById("weekly-streak-days");
    if (container) {
      container.innerHTML = this.getWeeklyActivity().map((day, i) => `
        <div class="day-bubble ${day.done ? "done" : ""} ${day.isToday ? "today" : ""}" title="${day.key}" style="--d: ${i}">
          <span>${day.label}</span>
          ${day.done ? '<i class="fa-solid fa-check"></i>' : ""}
        </div>
      `).join("");
    }
  }

  // ===========================================================================
  // Reminders & live countdowns
  // ===========================================================================
  startReminderTicker() {
    if (this._reminderTick) clearInterval(this._reminderTick);
    // Re-render every 30s so countdowns and "now" markers stay live.
    this._reminderTick = setInterval(() => {
      this.checkDueReminders();
      this.renderDashboardReminders();
      this.renderDashboardNextUp();
      this.renderDashboardToday();
      if (this.currentTab === "calendar") this.renderAgenda();
      if (this.currentTab === "timetable") this.renderTimetable();
    }, 30000);
  }

  showNotification(title, body) {
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      new Notification(title, { body });
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
        this.showToast("Reminders on — you'll get an alert before each event");
        this.showNotification("StudyBuddy reminders on", "You'll get a desktop alert before your events start.");
      } else {
        this.showToast("Notifications are blocked — reminders will still appear inside StudyBuddy", "info");
      }
    } catch (e) {
      console.warn("Notification permission error:", e);
    }
    this.renderNotificationButton();
  }

  renderNotificationButton() {
    const btn = document.getElementById("enable-notifications-btn");
    if (!btn) return;
    if (!("Notification" in window)) {
      btn.classList.add("hidden");
      return;
    }
    const perm = Notification.permission;
    btn.disabled = perm !== "default";
    btn.title = perm === "denied" ? "Notifications are blocked in your browser settings" : "";
    btn.innerHTML = perm === "granted"
      ? '<i class="fa-solid fa-bell"></i> <span>Reminders on</span>'
      : perm === "denied"
        ? '<i class="fa-regular fa-bell-slash"></i> <span>Reminders blocked</span>'
        : '<i class="fa-regular fa-bell"></i> <span>Enable reminders</span>';
  }

  remindedKeys() {
    if (!this._reminded) {
      try {
        this._reminded = new Set(JSON.parse(localStorage.getItem("studybuddy-reminded") || "[]"));
      } catch (e) {
        this._reminded = new Set();
      }
    }
    return this._reminded;
  }

  /**
   * Fires each event's reminder once, when "now" enters its reminder window
   * (e.g. 30 minutes before the start). Fired keys are remembered on this
   * device so reloads don't repeat the alert.
   */
  checkDueReminders() {
    const now = Date.now();
    const fired = this.remindedKeys();
    let changed = false;

    this.events.forEach(ev => {
      const mins = Number(ev.reminderMinutes) || 0;
      if (!mins) return;
      const start = this.eventStart(ev).getTime();
      const key = `${ev.id}@${ev.date}T${ev.startTime}`;
      if (now >= start - mins * 60000 && now < start && !fired.has(key)) {
        fired.add(key);
        changed = true;
        const when = this.formatCountdown(ev).text.replace(/^Starts in/, "starts in");
        const message = `${ev.title}${ev.subject ? ` (${ev.subject})` : ""} ${when.toLowerCase().startsWith("in ") ? `is ${when.toLowerCase()}` : when} — ${this.formatClock(this.eventStart(ev))}`;
        this.showToast(`Reminder: ${message}`, "info", { duration: 9000 });
        this.showNotification("StudyBuddy reminder", message);
      }
    });

    if (changed) {
      try {
        localStorage.setItem("studybuddy-reminded", JSON.stringify([...fired].slice(-200)));
      } catch (e) { /* best-effort */ }
    }
  }

  // ===========================================================================
  // Theme (light / dark)
  // ===========================================================================
  setupTheme() {
    this.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    document.getElementById("theme-toggle")?.addEventListener("click", (e) => this.toggleTheme(e.currentTarget));

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

  toggleTheme(origin = document.getElementById("theme-toggle")) {
    const next = this.theme === "dark" ? "light" : "dark";
    Motion.themeSwitch(() => this.applyTheme(next, true), origin);
  }

  applyTheme(theme, persistChoice) {
    ThemeBootstrap.set(theme, persistChoice);
    this.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  // ===========================================================================
  // Marks & Grades
  // ===========================================================================
  markPercent(mark) {
    const max = Number(mark.maxMarks);
    const score = Number(mark.score);
    if (!max || max <= 0 || isNaN(max) || isNaN(score)) return null;
    return Math.round((score / max) * 1000) / 10; // one decimal place
  }

  markGrade(percent) {
    if (percent === null || percent === undefined) return "—";
    if (percent >= 90) return "A+";
    if (percent >= 85) return "A";
    if (percent >= 80) return "A-";
    if (percent >= 75) return "B+";
    if (percent >= 70) return "B";
    if (percent >= 65) return "B-";
    if (percent >= 60) return "C+";
    if (percent >= 55) return "C";
    if (percent >= 50) return "D";
    return "F";
  }

  markGradeBand(percent) {
    if (percent === null || percent === undefined) return "mid";
    if (percent >= 75) return "high";
    if (percent >= 50) return "mid";
    return "low";
  }

  markTypeLabel(type) {
    switch (String(type || "").toLowerCase()) {
      case "exam": return "Exam";
      case "quiz": return "Quiz";
      case "assignment": return "Assignment";
      case "project": return "Project";
      case "oral": return "Oral";
      default: return "Test";
    }
  }

  // Weighted percentage across all marks (simple average when no weights are given).
  marksOverallPercent() {
    const scored = this.marks.filter(m => this.markPercent(m) !== null);
    if (scored.length === 0) return null;

    const weighted = scored.filter(m => Number(m.weight) > 0);
    if (weighted.length > 0) {
      let totalWeight = 0;
      let sum = 0;
      weighted.forEach(m => {
        const w = Number(m.weight);
        totalWeight += w;
        sum += this.markPercent(m) * w;
      });
      if (totalWeight > 0) return Math.round((sum / totalWeight) * 10) / 10;
    }

    const avg = scored.reduce((acc, m) => acc + this.markPercent(m), 0) / scored.length;
    return Math.round(avg * 10) / 10;
  }

  // [{ subject, percent, count }] sorted by strongest first.
  marksSubjectAverages() {
    const groups = {};
    this.marks.forEach(m => {
      const p = this.markPercent(m);
      if (p === null) return;
      const subject = (m.subject || "General").trim();
      if (!groups[subject]) groups[subject] = { subject, sum: 0, count: 0 };
      groups[subject].sum += p;
      groups[subject].count++;
    });

    return Object.values(groups)
      .map(g => ({ subject: g.subject, percent: Math.round((g.sum / g.count) * 10) / 10, count: g.count }))
      .sort((a, b) => b.percent - a.percent);
  }

  setupMarkEvents() {
    document.getElementById("mark-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveMarkFromForm();
    });

    document.getElementById("mark-search-input")?.addEventListener("input", (e) => {
      this.markSearch = e.target.value.toLowerCase().trim();
      this.renderMarks();
    });

    document.getElementById("mark-filter-subject")?.addEventListener("change", (e) => {
      this.markSubjectFilter = e.target.value;
      this.renderMarks();
    });

    document.getElementById("mark-sort-select")?.addEventListener("change", (e) => {
      this.markSort = e.target.value;
      this.renderMarks();
    });

    const updatePreview = () => this.updateMarkPercentPreview();
    document.getElementById("mark-score-input")?.addEventListener("input", updatePreview);
    document.getElementById("mark-max-input")?.addEventListener("input", updatePreview);

    document.getElementById("marks-list")?.addEventListener("click", (e) => {
      const row = e.target.closest("[data-mark-id]");
      if (!row) return;
      const id = row.dataset.markId;
      if (e.target.closest("[data-action='delete']")) this.deleteMark(id);
      else {
        const mark = this.marks.find(m => m.id === id);
        if (mark) this.openMarkModal(mark);
      }
    });
  }

  updateMarkPercentPreview() {
    const el = document.getElementById("mark-percent-preview");
    if (!el) return;

    const score = parseFloat(document.getElementById("mark-score-input")?.value);
    const max = parseFloat(document.getElementById("mark-max-input")?.value);
    const percent = this.markPercent({ score, maxMarks: max });

    if (percent === null) {
      el.className = "form-hint";
      el.innerHTML = `<i class="fa-solid fa-calculator"></i> Enter a score to see the percentage.`;
      return;
    }

    const band = this.markGradeBand(percent);
    el.className = `form-hint ${band === "high" ? "percent-good" : band === "low" ? "percent-low" : ""}`.trim();
    el.innerHTML = `<i class="fa-solid fa-calculator"></i> That's <strong>${percent}%</strong> — grade ${this.markGrade(percent)}.`;
  }

  openMarkModal(mark = null) {
    const modal = document.getElementById("mark-modal");
    const form = document.getElementById("mark-form");
    const titleEl = document.getElementById("mark-modal-title");
    if (!modal || !form) return;

    form.reset();

    if (mark) {
      titleEl.textContent = "Edit mark";
      document.getElementById("mark-id").value = mark.id;
      document.getElementById("mark-title-input").value = mark.title || "";
      document.getElementById("mark-subject-input").value = mark.subject || "";
      document.getElementById("mark-date-input").value = mark.date || this.toDateKey(new Date());
      document.getElementById("mark-score-input").value = mark.score;
      document.getElementById("mark-max-input").value = mark.maxMarks;
      document.getElementById("mark-type-select").value = String(mark.type || "test").toLowerCase();
      document.getElementById("mark-weight-input").value = mark.weight || "";
      document.getElementById("mark-notes-input").value = mark.notes || "";
      document.getElementById("save-mark-btn").textContent = "Save changes";
    } else {
      titleEl.textContent = "Record a mark";
      document.getElementById("mark-id").value = "";
      document.getElementById("mark-date-input").value = this.toDateKey(new Date());
      document.getElementById("mark-type-select").value = "test";
      if (this.markSubjectFilter !== "all") document.getElementById("mark-subject-input").value = this.markSubjectFilter;
      document.getElementById("save-mark-btn").textContent = "Save mark";
    }

    this.updateMarkPercentPreview();
    this.openModal(modal);
  }

  saveMarkFromForm() {
    const id = document.getElementById("mark-id").value;
    const title = document.getElementById("mark-title-input").value.trim();
    const subject = document.getElementById("mark-subject-input").value.trim();
    const date = document.getElementById("mark-date-input").value;
    const score = parseFloat(document.getElementById("mark-score-input").value);
    const maxMarks = parseFloat(document.getElementById("mark-max-input").value);
    const type = document.getElementById("mark-type-select").value;
    const weightRaw = document.getElementById("mark-weight-input").value;
    const weight = weightRaw === "" ? null : parseFloat(weightRaw);
    const notes = document.getElementById("mark-notes-input").value.trim();

    if (!title || !subject || !date) {
      this.showToast("Please fill in the title, subject and date", "alert");
      return;
    }
    if (isNaN(score) || isNaN(maxMarks) || maxMarks <= 0) {
      this.showToast("Please enter a valid score and maximum mark", "alert");
      return;
    }
    if (score < 0 || score > maxMarks) {
      this.showToast("The score must be between 0 and the maximum mark", "alert");
      return;
    }
    if (weight !== null && (isNaN(weight) || weight < 0 || weight > 100)) {
      this.showToast("Weight must be between 0 and 100", "alert");
      return;
    }

    if (id) {
      const index = this.marks.findIndex(m => m.id === id);
      if (index !== -1) {
        this.marks[index] = { ...this.marks[index], title, subject, date, score, maxMarks, type, weight, notes };
        this.showToast("Mark updated");
      }
    } else {
      this.marks.unshift({
        id: "mark-" + Date.now(),
        title, subject, date, score, maxMarks, type, weight, notes,
        createdAt: new Date().toISOString()
      });
      this._flash = { listName: "marks", id: this.marks[0].id };
      const percent = this.markPercent({ score, maxMarks });
      this.showToast(`Mark saved — ${percent}% (${this.markGrade(percent)})`);
    }

    this.schedulePersist();
    this.recordActivity();
    this.closeModal(document.getElementById("mark-modal"));
    this.renderAll();
  }

  deleteMark(id) {
    this.removeWithUndo("marks", id, "Mark");
  }

  // ===========================================================================
  // Rendering
  // ===========================================================================
  renderAll() {
    this.updateSubjectDropdowns();
    this.renderBadges();
    this.renderDashboard();
    this.renderTasks();
    this.renderCalendar();
    this.renderAgenda();
    this.renderTimetable();
    this.renderNotes();
    this.renderFlashcards();
    this.renderMarks();
    this.renderJournal();
    this.renderStreak();
    this.renderProgressStats();
    this.renderTimerMeta();
    this.updateTimerDisplay();
    this.applyFlash();
  }

  // Populate dynamic subjects into filters and the shared datalist.
  updateSubjectDropdowns() {
    const all = new Set();
    [this.tasks, this.notes, this.events, this.marks, this.timetable, this.decks].forEach(list => {
      list.forEach(item => {
        const s = String(item.subject || "").trim();
        if (s) all.add(s);
      });
    });
    const allSubjects = [...all].sort((a, b) => a.localeCompare(b));

    const fill = (id, allLabel) => {
      const select = document.getElementById(id);
      if (!select) return;
      const current = select.value;
      select.innerHTML = `<option value="all">${allLabel}</option>` +
        allSubjects.map(s => `<option value="${this.escapeHTML(s)}">${this.escapeHTML(s)}</option>`).join("");
      select.value = allSubjects.includes(current) ? current : "all";
    };
    fill("task-filter-subject", "All subjects");
    fill("note-filter-subject", "All subjects");
    fill("mark-filter-subject", "All subjects");
    if (!allSubjects.includes(this.taskSubjectFilter)) this.taskSubjectFilter = "all";
    if (!allSubjects.includes(this.noteSubjectFilter)) this.noteSubjectFilter = "all";
    if (!allSubjects.includes(this.markSubjectFilter)) this.markSubjectFilter = "all";

    const datalist = document.getElementById("subject-suggestions");
    if (datalist) {
      const merged = [...new Set([...allSubjects, ...DEFAULT_SUBJECTS])];
      datalist.innerHTML = merged.map(s => `<option value="${this.escapeHTML(s)}"></option>`).join("");
    }
  }

  renderBadges() {
    const setCount = (id, n) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = n;
      el.dataset.zero = String(!n);
    };
    setCount("pending-badge", this.tasks.filter(t => !t.completed).length);
    setCount("calendar-badge", this.getUpcomingEvents(99).length);
    setCount("marks-badge", this.marks.length);
    setCount("flashcards-badge", this.totalDueCards());
  }

  // ---------------------------------------------------------------------------
  // Today (dashboard)
  // ---------------------------------------------------------------------------
  setupDashboardEvents() {
    const bind = (id, fn) => document.getElementById(id)?.addEventListener("click", fn);
    bind("dash-start-focus-btn", () => {
      this.switchTab("progress");
      if (!this.isTimerRunning) {
        if (this.timerMode !== "pomodoro") this.setTimerMode("pomodoro");
        this.startTimer();
      }
    });
    bind("dash-add-task-btn", () => this.openTaskModal());
    bind("dash-add-event-btn", () => this.openEventModal(null, { date: this.toDateKey(new Date()) }));
    bind("dash-new-note-btn", () => this.openNoteModal());
    bind("dash-review-btn", () => this.reviewDueCards());

    document.getElementById("dashboard-urgent-tasks")?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-task-id]");
      if (!item) return;
      const id = item.dataset.taskId;
      if (e.target.closest("[data-action='toggle']")) this.toggleTaskCompletion(id);
      else this.openTaskModal(this.tasks.find(t => t.id === id));
    });

    document.getElementById("dash-today-list")?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-kind]");
      if (!item) return;
      const { kind, id } = item.dataset;
      const toggle = e.target.closest("[data-action='toggle']");
      if (kind === "task") {
        if (toggle) this.toggleTaskCompletion(id);
        else this.openTaskModal(this.tasks.find(t => t.id === id));
      } else if (kind === "slot") {
        if (toggle) this.toggleTimetableSlotComplete(id);
        else {
          const slot = this.timetable.find(s => s.id === id);
          if (slot) this.openTimetableModal(slot);
        }
      } else if (kind === "event") {
        const ev = this.events.find(x => x.id === id);
        if (ev) this.openEventModal(ev);
      }
    });

    document.getElementById("dashboard-reminders-list")?.addEventListener("click", (e) => {
      const item = e.target.closest("[data-event-id]");
      if (!item) return;
      const ev = this.events.find(x => x.id === item.dataset.eventId);
      if (ev) this.openEventModal(ev);
    });

    document.getElementById("dashboard-recent-notes")?.addEventListener("click", (e) => {
      const card = e.target.closest("[data-note-id]");
      if (!card) return;
      const note = this.notes.find(n => n.id === card.dataset.noteId);
      if (note) this.openNoteModal(note);
    });

    document.getElementById("dash-next-up")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-next-action]");
      if (!btn) return;
      const { nextAction, id } = btn.dataset;
      if (nextAction === "focus") this.focusOnTask(id);
      else if (nextAction === "event") {
        const ev = this.events.find(x => x.id === id);
        if (ev) this.openEventModal(ev);
      } else if (nextAction === "slot") {
        this.toggleTimetableSlotComplete(id);
      } else if (nextAction === "plan") {
        this.openEventModal(null, { date: this.toDateKey(new Date()) });
      }
    });
  }

  renderDashboard() {
    this.renderDashboardHero();
    this.renderDashboardStats();
    this.renderDashboardNextUp();
    this.renderDashboardToday();
    this.renderDashboardPriorities();
    this.renderDashboardWeek();
    this.renderDashboardReminders();
    this.renderDashboardNotes();
    this.renderNotificationButton();
  }

  renderDashboardHero() {
    const hour = new Date().getHours();
    const part = hour < 5 ? "Burning the midnight oil" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const greeting = document.getElementById("dash-greeting");
    const greetingText = this.firstName ? `${part}, ${this.firstName}` : part;
    if (greeting && greeting.dataset.text !== greetingText) {
      greeting.dataset.text = greetingText;
      greeting.innerHTML = `${this.escapeHTML(greetingText)} <span class="wave" aria-hidden="true">👋</span>`;
    }
    const dueCards = this.totalDueCards();
    const reviewBtn = document.getElementById("dash-review-btn");
    if (reviewBtn) {
      reviewBtn.classList.toggle("hidden", !dueCards);
      const label = reviewBtn.querySelector("span");
      if (label) label.textContent = `Review ${dueCards} card${dueCards === 1 ? "" : "s"}`;
    }
    const dateEl = document.getElementById("dash-date");
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const summary = document.getElementById("dash-summary");
    if (summary) summary.innerHTML = this.buildDaySummary();
  }

  buildDaySummary() {
    const pending = this.tasks.filter(t => !t.completed);
    const overdue = pending.filter(t => (this.daysUntil(t.dueDate) ?? 0) < 0).length;
    const dueToday = pending.filter(t => this.daysUntil(t.dueDate) === 0).length;
    const dueWeek = pending.filter(t => { const d = this.daysUntil(t.dueDate); return d !== null && d >= 1 && d <= 7; }).length;
    const sessions = this.timetable.filter(s => s.day === this.todayName() && !this.isSlotDone(s)).length;
    const nextTest = this.getUpcomingEvents(50).find(ev => ev.type === "test");
    const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

    const parts = [];
    if (dueToday) parts.push(`<strong>${plural(dueToday, "assignment")} due today</strong>`);
    if (overdue) parts.push(`<strong>${overdue} overdue</strong>`);
    if (dueWeek) parts.push(`${dueWeek} more due this week`);
    if (sessions) parts.push(`${plural(sessions, "session")} on your timetable`);
    const cardsDue = this.totalDueCards();
    if (cardsDue) parts.push(`${plural(cardsDue, "flashcard")} to review`);

    let sentence;
    if (parts.length) {
      const joined = parts.length === 1 ? parts[0]
        : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
      sentence = `You have ${joined}.`;
    } else if (this.tasks.length || this.events.length || this.timetable.length) {
      sentence = "Nothing urgent today — a good moment to get ahead or review your notes.";
    } else {
      sentence = "Welcome! Add an assignment, a test or your timetable and StudyBuddy will plan your day around it.";
    }

    if (nextTest) {
      const days = this.daysUntil(nextTest.date);
      if (days !== null && days <= 14) {
        const when = days <= 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
        sentence += ` Your next test, <strong>${this.escapeHTML(nextTest.title)}</strong>, is ${when}.`;
      }
    }
    return sentence;
  }

  renderDashboardStats() {
    const pending = this.tasks.filter(t => !t.completed);
    const overdue = pending.filter(t => (this.daysUntil(t.dueDate) ?? 0) < 0).length;
    const dueWeek = pending.filter(t => { const d = this.daysUntil(t.dueDate); return d !== null && d >= 0 && d <= 7; }).length;
    const todayFocus = Number(this.focusLog[this.toDateKey(new Date())]) || 0;
    const goal = Number(this.settings.focusGoal) || 60;

    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    Motion.countTo(document.getElementById("stat-due-week"), dueWeek);
    Motion.countTo(document.getElementById("stat-overdue"), overdue);
    document.getElementById("stat-overdue")?.closest(".stat-tile")?.classList.toggle("is-alert", overdue > 0);
    Motion.countTo(document.getElementById("stat-focus-today"), todayFocus, v => this.formatMinutes(v));
    set("stat-focus-goal-label", `Focus today · goal ${this.formatMinutes(goal)}`);
    const bar = document.getElementById("stat-focus-goal-bar");
    if (bar) bar.style.width = `${Math.min(100, (todayFocus / goal) * 100)}%`;
  }

  /** The single most relevant thing coming up: something now/soon, an urgent deadline, or the next event. */
  getNextUp() {
    const now = Date.now();
    const todayKey = this.toDateKey(new Date());
    const timed = [];
    this.events.forEach(ev => {
      const start = this.eventStart(ev).getTime();
      const end = this.eventEnd(ev).getTime();
      if (end >= now) timed.push({ kind: "event", item: ev, start, end });
    });
    this.timetable
      .filter(s => s.day === this.todayName() && !this.isSlotDone(s))
      .forEach(slot => {
        const start = new Date(`${todayKey}T${slot.startTime}:00`).getTime();
        const end = new Date(`${todayKey}T${slot.endTime}:00`).getTime();
        if (end >= now) timed.push({ kind: "slot", item: slot, start, end });
      });
    timed.sort((a, b) => a.start - b.start);

    const urgentTask = this.tasks
      .filter(t => !t.completed)
      .sort((a, b) => this.compareByDue(a, b))[0];

    const soon = timed.find(t => t.start - now <= 24 * 3600000);
    if (soon) return soon;
    if (urgentTask && (this.daysUntil(urgentTask.dueDate) ?? 99) <= 3) return { kind: "task", item: urgentTask };
    if (timed.length) return timed[0];
    if (urgentTask) return { kind: "task", item: urgentTask };
    return null;
  }

  renderDashboardNextUp() {
    const container = document.getElementById("dash-next-up");
    if (!container) return;
    const next = this.getNextUp();
    container.classList.remove("is-live");

    if (!next) {
      container.innerHTML = `
        <span class="eyebrow">Next up</span>
        <h3 class="next-title">Nothing scheduled</h3>
        <p class="next-empty">Plan a study session or add your next test — it'll show up here with a live countdown.</p>
        <button type="button" class="btn btn-sm" data-next-action="plan"><i class="fa-solid fa-plus"></i> Plan something</button>
      `;
      return;
    }

    const now = Date.now();
    if (next.kind === "task") {
      const t = next.item;
      const due = this.formatDueDateBadge(t.dueDate);
      const days = this.daysUntil(t.dueDate);
      const big = days === null ? "—" : days < 0 ? `${Math.abs(days)}d late` : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`;
      container.innerHTML = `
        <span class="eyebrow">Next deadline</span>
        <span class="next-kind"><i class="fa-solid fa-list-check"></i> Assignment</span>
        <h3 class="next-title">${this.escapeHTML(t.title)}</h3>
        <div class="next-meta"><span>${this.escapeHTML(t.subject || "")}</span><span>${this.escapeHTML(due.text)}</span></div>
        <div class="next-countdown">${big}<small>${days !== null && days < 0 ? "past the due date" : "until it's due"}</small></div>
        <button type="button" class="btn btn-sm" data-next-action="focus" data-id="${this.escapeHTML(t.id)}"><i class="fa-solid fa-play"></i> Focus on this</button>
      `;
      return;
    }

    const isEvent = next.kind === "event";
    const item = next.item;
    const happening = now >= next.start && now <= next.end;
    container.classList.toggle("is-live", happening);
    const minsToStart = Math.ceil((next.start - now) / 60000);
    const minsToEnd = Math.ceil((next.end - now) / 60000);
    const big = happening ? "Now" : minsToStart < 24 * 60 ? this.formatDurationShort(minsToStart)
      : `${this.daysUntil(item.date)} days`;
    const small = happening ? `ends in ${this.formatDurationShort(Math.max(1, minsToEnd))}` : "until it starts";
    const typeInfo = isEvent ? this.eventTypeInfo(item.type) : { icon: "fa-solid fa-table-cells", label: item.type || "Timetable" };
    const dateLabel = isEvent
      ? `${this.daysUntil(item.date) === 0 ? "Today" : this.formatLongDate(this.eventStart(item))} · ${this.formatClock(this.eventStart(item))}`
      : `Today · ${this.formatHM(item.startTime)} – ${this.formatHM(item.endTime)}`;

    container.innerHTML = `
      <span class="eyebrow">${happening ? "Happening now" : "Next up"}</span>
      <span class="next-kind"><i class="${typeInfo.icon}"></i> ${this.escapeHTML(typeInfo.label)}</span>
      <h3 class="next-title">${this.escapeHTML(item.title)}</h3>
      <div class="next-meta">
        <span>${this.escapeHTML(dateLabel)}</span>
        ${item.location ? `<span><i class="fa-solid fa-location-dot"></i> ${this.escapeHTML(item.location)}</span>` : ""}
      </div>
      <div class="next-countdown">${big}<small>${small}</small></div>
      ${isEvent
        ? `<button type="button" class="btn btn-sm" data-next-action="event" data-id="${this.escapeHTML(item.id)}"><i class="fa-solid fa-pen"></i> Details</button>`
        : `<button type="button" class="btn btn-sm" data-next-action="slot" data-id="${this.escapeHTML(item.id)}"><i class="fa-solid fa-check"></i> Mark done</button>`}
    `;
  }

  renderDashboardToday() {
    const container = document.getElementById("dash-today-list");
    if (!container) return;
    const todayKey = this.toDateKey(new Date());
    const now = Date.now();
    const items = [];

    this.tasks.filter(t => t.dueDate === todayKey).forEach(t => items.push({
      kind: "task", id: t.id, sort: "", time: "Due", title: t.title, done: t.completed, now: false,
      color: this.subjectColor(t.subject), meta: [`Assignment · ${t.subject || "General"}`]
    }));
    this.timetable.filter(s => s.day === this.todayName()).forEach(s => items.push({
      kind: "slot", id: s.id, sort: s.startTime, time: this.formatHM(s.startTime), title: s.title,
      done: this.isSlotDone(s), now: this.isSlotNow(s), color: this.subjectColor(s.subject),
      meta: [`${s.type} · ${s.subject}`, s.location ? s.location : ""]
    }));
    this.events.filter(ev => ev.date === todayKey).forEach(ev => {
      const start = this.eventStart(ev).getTime();
      const end = this.eventEnd(ev).getTime();
      items.push({
        kind: "event", id: ev.id, sort: ev.startTime, time: this.formatHM(ev.startTime), title: ev.title,
        done: end < now, now: now >= start && now <= end, color: `var(--type-${this.eventTypeKey(ev.type)})`,
        meta: [`${this.eventTypeInfo(ev.type).label}${ev.subject ? ` · ${ev.subject}` : ""}`, ev.location || ""]
      });
    });
    items.sort((a, b) => String(a.sort).localeCompare(String(b.sort)));

    const countEl = document.getElementById("dash-today-count");
    if (countEl) countEl.textContent = items.length ? `${items.filter(i => i.done).length}/${items.length} done` : "";

    if (!items.length) {
      container.innerHTML = `
        <div class="empty-inline">
          <i class="fa-regular fa-calendar-check"></i>
          <span>Nothing on the schedule today.</span>
          <button type="button" class="btn btn-sm btn-soft" data-tab="timetable"><i class="fa-solid fa-plus"></i> Plan your week</button>
        </div>`;
      return;
    }

    container.innerHTML = items.map((item, i) => `
      <div class="tl-item ${item.done ? "is-done" : ""} ${item.now ? "is-now" : ""}" data-kind="${item.kind}" data-id="${this.escapeHTML(item.id)}" style="--subj: ${item.color}; --d: ${i}">
        <span class="tl-time">${this.escapeHTML(item.time)}</span>
        <span class="tl-dot"></span>
        <div class="tl-body" role="button" tabindex="0">
          <div class="tl-title">${this.escapeHTML(item.title)}</div>
          <div class="tl-meta">
            ${item.now ? '<span class="tl-now-tag">● Now</span>' : ""}
            ${item.meta.filter(Boolean).map(m => `<span>${this.escapeHTML(m)}</span>`).join("")}
          </div>
        </div>
        ${item.kind !== "event" ? `
          <button type="button" class="check tl-action ${item.done ? "checked" : ""}" data-action="toggle" aria-label="${item.done ? "Mark as not done" : "Mark as done"}">
            <i class="fa-solid fa-check"></i>
          </button>` : "<span></span>"}
      </div>
    `).join("");
  }

  renderDashboardPriorities() {
    const container = document.getElementById("dashboard-urgent-tasks");
    if (!container) return;

    const pending = this.tasks.filter(t => !t.completed).sort((a, b) => this.compareByDue(a, b));
    const countEl = document.getElementById("dash-due-count");
    if (countEl) countEl.textContent = pending.length ? `${pending.length} open` : "";

    if (pending.length === 0) {
      container.innerHTML = `
        <div class="empty-inline">
          <i class="fa-solid fa-mug-hot"></i>
          <span>${this.tasks.length ? "All caught up — enjoy the free time." : "No assignments yet."}</span>
          <button type="button" class="btn btn-sm btn-soft" data-tab="assignments"><i class="fa-solid fa-plus"></i> Add assignment</button>
        </div>`;
      return;
    }

    container.innerHTML = pending.slice(0, 5).map(task => {
      const due = this.formatDueDateBadge(task.dueDate);
      const priority = PRIORITY_RANK[task.priority] !== undefined ? task.priority : "medium";
      const subs = Array.isArray(task.subtasks) ? task.subtasks : [];
      const subsDone = subs.filter(sub => sub.done).length;
      return `
        <div class="compact-task-item" data-task-id="${this.escapeHTML(task.id)}">
          <button type="button" class="check p-${priority}" data-action="toggle" aria-label="Mark as done"><i class="fa-solid fa-check"></i></button>
          <div class="compact-task-body">
            <div class="compact-task-title">${this.escapeHTML(task.title)}</div>
            <div class="compact-task-meta">
              <span class="chip" style="--subj: ${this.subjectColor(task.subject)}">${this.escapeHTML(task.subject || "General")}</span>
              <span class="due-text ${due.isOverdue ? "is-overdue" : due.isToday ? "is-today" : ""}">${this.escapeHTML(due.text)}</span>
              ${subs.length ? `<span class="task-progress"><span class="task-progress-bar"><span style="width: ${Math.round((subsDone / subs.length) * 100)}%"></span></span>${subsDone}/${subs.length}</span>` : ""}
              ${priority === "high" ? '<span class="priority-flag p-high"><i class="fa-solid fa-flag"></i></span>' : ""}
            </div>
          </div>
        </div>
      `;
    }).join("") + (pending.length > 5
      ? `<button type="button" class="btn btn-sm btn-ghost" data-tab="assignments" style="align-self:flex-start;margin-top:.25rem">+${pending.length - 5} more</button>`
      : "");
  }

  renderDashboardWeek() {
    this.renderWeekChart(document.getElementById("dash-focus-chart"));
    const week = this.currentWeekDates();
    const total = week.reduce((sum, k) => sum + (Number(this.focusLog[k]) || 0), 0);
    const totalEl = document.getElementById("dash-focus-week-total");
    if (totalEl) totalEl.textContent = `${this.formatMinutes(total)} focused this week`;

    const thisWeek = this.tasks.filter(t => week.includes(t.dueDate));
    const pool = thisWeek.length ? thisWeek : this.tasks;
    const done = pool.filter(t => t.completed).length;
    const label = document.getElementById("dash-completion-label");
    if (label) {
      label.textContent = pool.length
        ? `${done}/${pool.length} ${thisWeek.length ? "due this week" : "assignments"} done`
        : "No assignments yet";
    }
    const fill = document.getElementById("dash-progress-fill");
    if (fill) fill.style.width = `${pool.length ? Math.round((done / pool.length) * 100) : 0}%`;
  }

  /** Mon–Sun bar chart of focus minutes with a dashed daily-goal marker. */
  renderWeekChart(container) {
    if (!container) return;
    const week = this.currentWeekDates();
    const todayKey = this.toDateKey(new Date());
    const goal = Number(this.settings.focusGoal) || 60;
    const values = week.map(k => Number(this.focusLog[k]) || 0);
    const max = Math.max(goal * 1.15, ...values) || 1;
    const goalPct = (goal / max) * 100;

    container.innerHTML = week.map((key, i) => {
      const v = values[i];
      const pct = Math.min(100, (v / max) * 100);
      const label = WEEKDAYS[i].slice(0, 1);
      return `
        <div class="wc-col ${key === todayKey ? "is-today" : ""} ${v >= goal ? "met-goal" : ""}" style="--d: ${i}" title="${WEEKDAYS[i]}: ${this.formatMinutes(v)}">
          <span class="wc-value">${v ? this.formatMinutes(v) : ""}</span>
          <div class="wc-bar">
            <span class="wc-goal" style="bottom: ${goalPct}%"></span>
            <div class="wc-fill" style="height: ${pct}%"></div>
          </div>
          <span class="wc-label">${label}</span>
        </div>
      `;
    }).join("");
  }

  renderDashboardReminders() {
    const container = document.getElementById("dashboard-reminders-list");
    if (!container) return;

    const upcoming = this.getUpcomingEvents(5);
    if (upcoming.length === 0) {
      container.innerHTML = `
        <div class="empty-inline">
          <i class="fa-regular fa-bell"></i>
          <span>No upcoming tests or events.</span>
          <button type="button" class="btn btn-sm btn-soft" id="dash-plan-event-btn"><i class="fa-solid fa-plus"></i> Add a test or event</button>
        </div>`;
      document.getElementById("dash-plan-event-btn")?.addEventListener("click", () => this.openEventModal(null, { type: "test" }));
      return;
    }

    container.innerHTML = upcoming.map(ev => {
      const start = this.eventStart(ev);
      const countdown = this.formatCountdownShort(ev);
      const type = this.eventTypeKey(ev.type);
      const pillClass = countdown.state === "now" ? "is-now" : countdown.state === "urgent" ? "is-urgent" : type === "test" ? "is-test" : "";
      return `
        <div class="reminder-item" data-event-id="${this.escapeHTML(ev.id)}" role="button" tabindex="0">
          <div class="reminder-date type-${type}">
            <span class="reminder-date-month">${start.toLocaleDateString("en-US", { month: "short" })}</span>
            <span class="reminder-date-day">${start.getDate()}</span>
          </div>
          <div class="reminder-info">
            <div class="reminder-title">${this.escapeHTML(ev.title)}</div>
            <div class="reminder-when">
              <span>${start.toLocaleDateString("en-US", { weekday: "short" })} · ${this.formatClock(start)}</span>
              ${ev.subject ? `<span class="chip" style="--subj: ${this.subjectColor(ev.subject)}">${this.escapeHTML(ev.subject)}</span>` : ""}
              ${Number(ev.reminderMinutes) > 0 ? '<i class="fa-regular fa-bell" title="Reminder set"></i>' : ""}
            </div>
          </div>
          <span class="reminder-countdown ${pillClass}">${this.escapeHTML(countdown.text)}</span>
        </div>
      `;
    }).join("");
  }

  renderDashboardNotes() {
    const container = document.getElementById("dashboard-recent-notes");
    if (!container) return;

    const recent = this.notes
      .map((note, index) => ({ note, index }))
      .sort((a, b) => {
        if (Boolean(b.note.pinned) !== Boolean(a.note.pinned)) return b.note.pinned ? 1 : -1;
        const ta = a.note.updatedAtISO || "";
        const tb = b.note.updatedAtISO || "";
        if (ta !== tb) return tb.localeCompare(ta);
        return a.index - b.index;
      })
      .slice(0, 4)
      .map(x => x.note);

    if (recent.length === 0) {
      container.innerHTML = `
        <div class="empty-inline" style="grid-column: 1 / -1;">
          <i class="fa-regular fa-note-sticky"></i>
          <span>No notes yet — jot down a formula or a lecture takeaway.</span>
        </div>`;
      return;
    }

    container.innerHTML = recent.map(note => `
      <button type="button" class="mini-note-card accent-${this.escapeHTML(note.color || "sky")}" data-note-id="${this.escapeHTML(note.id)}" style="--nc: var(--note-${this.escapeHTML(note.color || "sky")})">
        <div class="mini-note-title">${note.pinned ? '<i class="fa-solid fa-thumbtack" style="font-size:.7em;opacity:.6"></i> ' : ""}${this.escapeHTML(note.title)}</div>
        <div class="mini-note-preview">${this.escapeHTML(String(note.content || "").replace(/\*\*|`/g, "").replace(/^#{1,3}\s+/gm, ""))}</div>
      </button>
    `).join("");
  }

  // ---------------------------------------------------------------------------
  // Calendar rendering
  // ---------------------------------------------------------------------------
  renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const titleEl = document.getElementById("cal-month-title");
    if (!grid) return;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    if (titleEl) titleEl.textContent = `${monthNames[this.calendarMonth]} ${this.calendarYear}`;

    const firstOfMonth = new Date(this.calendarYear, this.calendarMonth, 1);
    const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first grid
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
    const todayKey = this.toDateKey(new Date());
    const cells = [];

    const prevMonthDays = new Date(this.calendarYear, this.calendarMonth, 0).getDate();
    for (let i = leadingBlanks - 1; i >= 0; i--) {
      cells.push({ dateObj: new Date(this.calendarYear, this.calendarMonth - 1, prevMonthDays - i), outside: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ dateObj: new Date(this.calendarYear, this.calendarMonth, d), outside: false });
    }
    const trailing = cells.length % 7;
    if (trailing !== 0) {
      for (let d = 1; d <= 7 - trailing; d++) {
        cells.push({ dateObj: new Date(this.calendarYear, this.calendarMonth + 1, d), outside: true });
      }
    }

    const eventsByDate = {};
    this.events.forEach(ev => { (eventsByDate[ev.date] = eventsByDate[ev.date] || []).push(ev); });
    const dueByDate = {};
    this.tasks.forEach(t => { if (t.dueDate) (dueByDate[t.dueDate] = dueByDate[t.dueDate] || []).push(t); });

    grid.innerHTML = cells.map((cell, idx) => {
      const key = this.toDateKey(cell.dateObj);
      const dayEvents = (eventsByDate[key] || []).slice().sort((a, b) => String(a.startTime || "").localeCompare(String(b.startTime || "")));
      const dueTasks = dueByDate[key] || [];
      const items = [
        ...dueTasks.map(t => ({ cls: "type-due", label: t.title, done: t.completed })),
        ...dayEvents.map(ev => ({ cls: `type-${this.eventTypeKey(ev.type)}`, label: `${this.formatHMShort(ev.startTime)} ${ev.title}`, done: false }))
      ];
      const weekend = cell.dateObj.getDay() === 0 || cell.dateObj.getDay() === 6;
      const classes = [
        "calendar-day",
        cell.outside ? "outside-month" : "",
        weekend ? "weekend" : "",
        key === todayKey ? "today" : "",
        key === this.selectedDate ? "selected" : ""
      ].filter(Boolean).join(" ");

      const shown = items.slice(0, 3).map(i =>
        `<span class="day-event-chip ${i.cls} ${i.done ? "is-done" : ""}">${this.escapeHTML(i.label)}</span>`
      ).join("");
      const more = items.length > 3 ? `<span class="day-more">+${items.length - 3} more</span>` : "";
      const dots = items.slice(0, 4).map(i => `<i class="${i.cls}"></i>`).join("");
      const aria = `${cell.dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${items.length ? `, ${items.length} item${items.length === 1 ? "" : "s"}` : ""}`;

      return `
        <button type="button" class="${classes}" data-date="${key}" style="--d: ${Math.floor(idx / 7) + (idx % 7)}" aria-label="${this.escapeHTML(aria)}" ${key === this.selectedDate ? 'aria-pressed="true"' : ""}>
          <span class="day-number">${cell.dateObj.getDate()}</span>
          <span class="day-events">${shown}${more}</span>
          <span class="day-dots">${dots}</span>
        </button>
      `;
    }).join("");

    if (this._calSlide) {
      const dir = this._calSlide;
      this._calSlide = null;
      grid.classList.remove("slide-next", "slide-prev", "cells-in");
      void grid.offsetWidth;
      grid.classList.add("cells-in");
      if (dir === "next" || dir === "prev") grid.classList.add(`slide-${dir}`);
      clearTimeout(this._calSlideTimer);
      this._calSlideTimer = setTimeout(() => grid.classList.remove("slide-next", "slide-prev", "cells-in"), 900);
    }
  }

  renderAgenda() {
    const container = document.getElementById("agenda-list");
    const emptyState = document.getElementById("agenda-empty-state");
    const titleEl = document.getElementById("agenda-date-title");
    const countEl = document.getElementById("agenda-count");
    if (!container) return;

    const selected = new Date(`${this.selectedDate}T00:00:00`);
    const days = this.daysUntil(this.selectedDate);
    if (titleEl) {
      titleEl.textContent = days === 0 ? "Today" : days === 1 ? "Tomorrow" : days === -1 ? "Yesterday"
        : selected.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    }

    const dayEvents = this.events
      .filter(ev => ev.date === this.selectedDate)
      .sort((a, b) => String(a.startTime || "").localeCompare(String(b.startTime || "")));
    const dueTasks = this.tasks.filter(t => t.dueDate === this.selectedDate);
    const total = dayEvents.length + dueTasks.length;

    if (countEl) countEl.textContent = `${total} item${total === 1 ? "" : "s"}`;

    if (total === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");

    const taskHtml = dueTasks.map(t => `
      <div class="agenda-item type-due ${t.completed ? "is-done" : ""}" data-task-id="${this.escapeHTML(t.id)}" role="button" tabindex="0">
        <div class="agenda-time">
          <button type="button" class="check ${t.completed ? "checked" : ""}" data-action="toggle-task" aria-label="${t.completed ? "Mark as not done" : "Mark as done"}"><i class="fa-solid fa-check"></i></button>
        </div>
        <div class="agenda-content">
          <div class="agenda-title">${this.escapeHTML(t.title)}</div>
          <div class="agenda-tags">
            <span class="badge badge-violet"><i class="fa-solid fa-list-check"></i> Assignment due</span>
            <span class="chip" style="--subj: ${this.subjectColor(t.subject)}">${this.escapeHTML(t.subject || "General")}</span>
          </div>
        </div>
      </div>
    `).join("");

    const eventHtml = dayEvents.map(ev => {
      const typeInfo = this.eventTypeInfo(ev.type);
      const countdown = this.formatCountdown(ev);
      const duration = this.formatDurationShort(Math.round((this.eventEnd(ev) - this.eventStart(ev)) / 60000));
      return `
        <div class="agenda-item type-${this.eventTypeKey(ev.type)}" data-event-id="${this.escapeHTML(ev.id)}" role="button" tabindex="0">
          <div class="agenda-time">
            <span>${this.formatHM(ev.startTime)}</span>
            <span class="agenda-duration">${duration}</span>
          </div>
          <div class="agenda-content">
            <div class="agenda-title">${this.escapeHTML(ev.title)}</div>
            <div class="agenda-tags">
              <span class="chip chip-plain"><i class="${typeInfo.icon}"></i>&nbsp;${typeInfo.label}</span>
              ${ev.subject ? `<span class="chip" style="--subj: ${this.subjectColor(ev.subject)}">${this.escapeHTML(ev.subject)}</span>` : ""}
              ${ev.location ? `<span class="agenda-meta"><i class="fa-solid fa-location-dot"></i> ${this.linkifyLocation(ev.location)}</span>` : ""}
            </div>
            ${ev.notes ? `<p class="agenda-notes">${this.escapeHTML(ev.notes)}</p>` : ""}
            <span class="agenda-countdown ${countdown.state === "now" ? "is-now" : ""} ${countdown.state === "past" ? "is-past" : ""}">${this.escapeHTML(countdown.text)}</span>
          </div>
          <div class="agenda-actions">
            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" title="Delete event" aria-label="Delete event"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = taskHtml + eventHtml;
  }

  // ---------------------------------------------------------------------------
  // Marks rendering
  // ---------------------------------------------------------------------------
  renderMarks() {
    this.renderMarksSummary();
    this.renderMarksSubjects();
    this.renderMarksTrend();
    this.renderGradeCalculator();

    const container = document.getElementById("marks-list");
    const emptyState = document.getElementById("marks-empty-state");
    if (!container) return;

    const filtered = this.marks.filter(mark => {
      const haystack = `${mark.title} ${mark.subject}`.toLowerCase();
      const matchSearch = !this.markSearch || haystack.includes(this.markSearch);
      const matchSubject = this.markSubjectFilter === "all" || (mark.subject || "") === this.markSubjectFilter;
      return matchSearch && matchSubject;
    });

    const dateOf = m => (m.date ? new Date(m.date + "T00:00:00").getTime() : 0);
    switch (this.markSort) {
      case "oldest": filtered.sort((a, b) => dateOf(a) - dateOf(b)); break;
      case "highest": filtered.sort((a, b) => (this.markPercent(b) ?? -1) - (this.markPercent(a) ?? -1)); break;
      case "lowest": filtered.sort((a, b) => (this.markPercent(a) ?? 101) - (this.markPercent(b) ?? 101)); break;
      default: filtered.sort((a, b) => dateOf(b) - dateOf(a));
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState?.classList.remove("hidden");
      const h = emptyState?.querySelector("h3");
      const p = emptyState?.querySelector("p");
      if (h && p) {
        if (this.marks.length) { h.textContent = "No matching marks"; p.textContent = "Try a different search or subject filter."; }
        else { h.textContent = "No marks recorded yet"; p.textContent = "Add a test or exam score to start tracking your average."; }
      }
      return;
    }
    emptyState?.classList.add("hidden");

    container.innerHTML = filtered.map(mark => {
      const percent = this.markPercent(mark);
      const band = this.markGradeBand(percent);
      const grade = this.markGrade(percent);
      const dateLabel = mark.date
        ? new Date(mark.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "No date";
      return `
        <div class="mark-row" data-mark-id="${this.escapeHTML(mark.id)}" role="button" tabindex="0">
          <div class="mark-score grade-${band}">
            <span class="mark-percent">${percent === null ? "—" : `${percent}%`}</span>
            <span class="mark-fraction">${this.formatScore(mark.score)}/${this.formatScore(mark.maxMarks)}</span>
          </div>
          <div class="mark-main">
            <div class="mark-title">${this.escapeHTML(mark.title)}</div>
            <div class="mark-meta">
              <span class="chip" style="--subj: ${this.subjectColor(mark.subject)}">${this.escapeHTML(mark.subject)}</span>
              <span>${this.markTypeLabel(mark.type)}</span>
              <span><i class="fa-regular fa-calendar"></i> ${dateLabel}</span>
              ${Number(mark.weight) > 0 ? `<span>${this.escapeHTML(String(mark.weight))}% weight</span>` : ""}
            </div>
            ${mark.notes ? `<p class="mark-notes">${this.escapeHTML(mark.notes)}</p>` : ""}
          </div>
          <span class="mark-grade-chip mark-grade-big band-${band}">${grade}</span>
          <div class="mark-actions">
            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" title="Delete mark" aria-label="Delete mark"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Formats a score without trailing ".0" for whole numbers.
  formatScore(value) {
    const n = Number(value);
    if (isNaN(n)) return "—";
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, "");
  }

  renderMarksSummary() {
    const overall = this.marksOverallPercent();
    const averages = this.marksSubjectAverages();
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const percentEl = document.getElementById("marks-overall-percent");
    if (overall === null) {
      if (percentEl) {
        percentEl.dataset.num = "";
        percentEl.textContent = "—";
      }
    } else {
      Motion.countTo(percentEl, overall, v => `${Math.round(v * 10) / 10}%`);
    }
    set("marks-overall-grade", this.markGrade(overall));
    Motion.countTo(document.getElementById("marks-count"), this.marks.length);
    set("marks-best-subject", averages.length > 0 ? averages[0].subject : "—");
  }

  renderMarksSubjects() {
    const container = document.getElementById("marks-subject-list");
    if (!container) return;

    const averages = this.marksSubjectAverages();
    if (averages.length === 0) {
      container.innerHTML = `<div class="empty-inline"><i class="fa-solid fa-chart-simple"></i><span>Subject averages appear once you record a mark.</span></div>`;
      return;
    }

    container.innerHTML = averages.map(({ subject, percent, count }) => {
      const band = this.markGradeBand(percent);
      return `
        <div class="marks-subject-row" style="--subj: ${this.subjectColor(subject)}">
          <div class="marks-subject-header">
            <span class="marks-subject-name">
              <span class="dot" style="--subj: ${this.subjectColor(subject)}"></span>
              <span>${this.escapeHTML(subject)}</span>
              <span class="mark-grade-chip band-${band}">${this.markGrade(percent)}</span>
            </span>
            <span class="marks-subject-meta">${percent}% · ${count} result${count === 1 ? "" : "s"}</span>
          </div>
          <div class="marks-bar-bg">
            <div class="marks-bar-fill band-${band}" style="width: ${Math.min(percent, 100)}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  /** Line chart of the last 10 results (by date) as percentages. */
  renderMarksTrend() {
    const container = document.getElementById("marks-trend-chart");
    if (!container) return;
    const points = this.marks
      .filter(m => this.markPercent(m) !== null)
      .slice()
      .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
      .slice(-10);

    const hint = document.getElementById("marks-trend-hint");
    if (points.length < 2) {
      if (hint) hint.textContent = "";
      container.innerHTML = `<div class="empty-inline"><i class="fa-solid fa-chart-line"></i><span>Record at least two marks to see your trend.</span></div>`;
      return;
    }

    const W = 560, H = 170, padL = 30, padR = 12, padT = 12, padB = 22;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const x = i => padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = p => padT + innerH - (Math.max(0, Math.min(100, p)) / 100) * innerH;
    const coords = points.map((m, i) => ({ x: x(i), y: y(this.markPercent(m)), m }));
    const line = coords.map((c, i) => `${i ? "L" : "M"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${(padT + innerH).toFixed(1)} L${coords[0].x.toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

    const first = this.markPercent(points[0]);
    const last = this.markPercent(points[points.length - 1]);
    if (hint) {
      const diff = Math.round((last - first) * 10) / 10;
      hint.textContent = `Last ${points.length} · ${diff >= 0 ? "▲" : "▼"} ${Math.abs(diff)} pts`;
    }

    const gridLines = [0, 50, 100].map(v => `
      <line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}"></line>
      <text x="${padL - 6}" y="${y(v) + 3}" text-anchor="end">${v}</text>`).join("");
    const labels = coords.map((c, i) => (i === 0 || i === coords.length - 1 || coords.length <= 6)
      ? `<text x="${c.x}" y="${H - 4}" text-anchor="middle">${c.m.date ? new Date(c.m.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</text>`
      : "").join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Trend of your last ${points.length} marks, from ${first}% to ${last}%">
        <g class="trend-grid">${gridLines}${labels}</g>
        <path class="trend-area" d="${area}"></path>
        <path class="trend-line" d="${line}" pathLength="1"></path>
        ${coords.map((c, i) => `<circle style="--d: ${i}" class="trend-point band-${this.markGradeBand(this.markPercent(c.m))}" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="4"><title>${this.escapeHTML(c.m.title)} — ${this.markPercent(c.m)}%</title></circle>`).join("")}
      </svg>`;
  }

  // ---------------------------------------------------------------------------
  // Focus & progress rendering
  // ---------------------------------------------------------------------------
  renderProgressStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    Motion.countTo(document.getElementById("completion-percentage-badge"), percent, v => `${Math.round(v)}% done`);
    const bar = document.getElementById("progress-assignments-bar");
    if (bar) bar.style.width = `${percent}%`;
    Motion.countTo(document.getElementById("prog-completed-tasks"), completed);
    Motion.countTo(document.getElementById("prog-pending-tasks"), pending);

    const todayFocus = Number(this.focusLog[this.toDateKey(new Date())]) || 0;
    set("pomodoro-sessions-counter", `${this.pomodoroSessions} session${this.pomodoroSessions === 1 ? "" : "s"} · ${this.formatMinutes(this.focusMinutes)} total`);
    set("focus-goal-badge", `Today ${this.formatMinutes(todayFocus)} / ${this.formatMinutes(Number(this.settings.focusGoal) || 60)}`);
    const week = this.currentWeekDates();
    const weekTotal = week.reduce((sum, k) => sum + (Number(this.focusLog[k]) || 0), 0);
    Motion.countTo(document.getElementById("focus-week-total"), weekTotal, v => this.formatMinutes(v));
    this.renderWeekChart(document.getElementById("focus-week-chart"));

    const breakdown = document.getElementById("subject-breakdown-list");
    if (breakdown) {
      const map = {};
      this.tasks.forEach(t => {
        const subj = t.subject || "General";
        if (!map[subj]) map[subj] = { total: 0, completed: 0 };
        map[subj].total++;
        if (t.completed) map[subj].completed++;
      });
      const entries = Object.entries(map).sort((a, b) => b[1].total - a[1].total);
      breakdown.innerHTML = entries.length === 0 ? "" : entries.map(([subj, data]) => {
        const p = Math.round((data.completed / data.total) * 100);
        return `
          <div class="subject-bar-item" style="--subj: ${this.subjectColor(subj)}">
            <div class="subject-bar-header">
              <span class="chip" style="--subj: ${this.subjectColor(subj)}">${this.escapeHTML(subj)}</span>
              <span>${data.completed}/${data.total} · ${p}%</span>
            </div>
            <div class="subject-bar-bg"><div class="subject-bar-fill" style="width: ${p}%"></div></div>
          </div>
        `;
      }).join("");
    }
  }

  // ===========================================================================
  // 11. Private Journal — password-gated, end-to-end encrypted daily pages
  // ===========================================================================
  /**
   * The journal never stores readable text outside the browser. Entries are
   * sealed with a random AES-GCM data key, and that key is wrapped twice:
   * once under a key derived from the journal password (PBKDF2, 150k
   * iterations) and once under the normalized recovery answer — so a forgotten
   * password can be reset without anyone re-encrypting every page. Only the
   * ciphertext — `this.journalBlob` — is synced to the user's Supabase row or
   * written into a downloaded backup file. Neither secret is ever stored;
   * verifier hashes tell a wrong secret apart from a damaged file.
   */

  // --- Crypto primitives ----------------------------------------------------
  journalBytesToB64(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return btoa(binary);
  }

  journalB64ToBytes(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  /** PBKDF2(password, salt) -> AES-GCM key + a verifier used to spot typos. */
  async journalDerive(password, saltBytes) {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: saltBytes, iterations: 150000, hash: "SHA-256" },
      baseKey,
      256
    ));
    const label = encoder.encode("studybuddy-journal-v1");
    const material = new Uint8Array(bits.length + label.length);
    material.set(bits, 0);
    material.set(label, bits.length);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", material));
    const key = await crypto.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt", "decrypt"]);
    return { key, verifier: this.journalBytesToB64(digest) };
  }

  /** Encrypts the entries array with an existing key (no password needed). */
  async journalSeal(entries, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const payload = new TextEncoder().encode(JSON.stringify(entries));
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);
    return { iv: this.journalBytesToB64(iv), data: this.journalBytesToB64(new Uint8Array(data)) };
  }

  async journalUnseal(blob, key) {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: this.journalB64ToBytes(blob.iv) },
      key,
      this.journalB64ToBytes(blob.data)
    );
    const parsed = JSON.parse(new TextDecoder().decode(plain));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(e => e && typeof e.date === "string")
      .map(e => ({
        id: String(e.id || `jr-${e.date}`),
        date: e.date,
        mood: typeof e.mood === "number" ? e.mood : null,
        title: String(e.title || ""),
        body: String(e.body || ""),
        createdAt: e.createdAt || e.date,
        updatedAt: e.updatedAt || e.createdAt || e.date
      }));
  }

  /**
   * Normalizes a recovery answer so "  New York " and "new york" unlock alike
   * (case, surrounding spaces and double spaces never hide a real answer).
   */
  journalNormalizeAnswer(answer) {
    return String(answer || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  /** Fresh random 256-bit data key — the entries are sealed with this, not with the password directly. */
  async journalMakeDataKey() {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    return crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
  }

  /**
   * Wraps (encrypts) the data key under a secret — the journal password or the
   * normalized recovery answer. Each secret gets its own salt + verifier, so
   * either one alone can hand back the same data key.
   */
  async journalWrapKey(dataKey, secret) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const { key: wrapKey, verifier } = await this.journalDerive(secret, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const raw = await crypto.subtle.exportKey("raw", dataKey);
    const wrapped = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, wrapKey, raw);
    return {
      salt: this.journalBytesToB64(salt),
      verifier,
      iv: this.journalBytesToB64(iv),
      key: this.journalBytesToB64(new Uint8Array(wrapped))
    };
  }

  /** Unwraps the data key with a secret. Throws an Error with a `.code`. */
  async journalUnwrapKey(wrapper, secret, failCode = "wrong-password") {
    const fail = (code, message) => {
      const err = new Error(message);
      err.code = code;
      return err;
    };
    const wrongSecret = failCode === "wrong-answer"
      ? "That answer doesn't match this journal."
      : "That's not the password for this journal.";
    if (!wrapper || typeof wrapper.salt !== "string" || typeof wrapper.iv !== "string" || typeof wrapper.key !== "string") {
      throw fail("invalid-file", "This journal is missing its lock data.");
    }

    let wrapKey, verifier;
    try {
      ({ key: wrapKey, verifier } = await this.journalDerive(secret, this.journalB64ToBytes(wrapper.salt)));
    } catch (e) {
      throw fail("invalid-file", "The journal's lock data couldn't be read.");
    }
    if (wrapper.verifier && verifier !== wrapper.verifier) {
      throw fail(failCode, wrongSecret);
    }

    let raw;
    try {
      raw = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: this.journalB64ToBytes(wrapper.iv) },
        wrapKey,
        this.journalB64ToBytes(wrapper.key)
      );
    } catch (e) {
      throw fail(failCode, wrongSecret);
    }
    return crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
  }

  /**
   * First-time creation: a fresh data key seals the entries, then gets wrapped
   * under the password — and, when a security question is given, under the
   * recovery answer too, so a forgotten password can be reset later.
   */
  async journalCreate(entries, password, { question = "", answer = "" } = {}) {
    const dataKey = await this.journalMakeDataKey();
    const sealed = await this.journalSeal(entries, dataKey);
    const pw = await this.journalWrapKey(dataKey, password);
    const recovery = (question && answer)
      ? { question: String(question).trim(), ...await this.journalWrapKey(dataKey, this.journalNormalizeAnswer(answer)) }
      : undefined;
    return {
      key: dataKey,
      blob: {
        v: 2,
        data: sealed,
        pw,
        recovery,
        updatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Unlocks a blob with the journal password. Wrapped-key (v2) blobs hand back
   * the data key; old (v1) blobs are re-wrapped into the current format on the
   * way out and the upgraded blob is returned so the caller can persist it.
   * Throws an Error with a `.code`.
   */
  async journalUnlock(blob, password) {
    const fail = (code, message) => {
      const err = new Error(message);
      err.code = code;
      return err;
    };
    const isWrapped = blob && blob.v === 2 && blob.data && typeof blob.data === "object";
    const valid = isWrapped
      ? typeof blob.pw?.salt === "string" && typeof blob.pw?.iv === "string" && typeof blob.pw?.key === "string"
      : typeof blob?.salt === "string" && typeof blob?.iv === "string" && typeof blob?.data === "string";
    if (!valid) {
      throw fail("invalid-file", "This isn't a valid StudyBuddy journal backup.");
    }

    if (isWrapped) {
      const dataKey = await this.journalUnwrapKey(blob.pw, password, "wrong-password");
      let entries;
      try {
        entries = await this.journalUnseal(blob.data, dataKey);
      } catch (e) {
        throw fail("corrupt", "The journal couldn't be decrypted — the backup file looks damaged.");
      }
      return { key: dataKey, entries };
    }

    // --- Legacy v1 blob: entries sealed directly under the password key ---
    let key, verifier;
    try {
      ({ key, verifier } = await this.journalDerive(password, this.journalB64ToBytes(blob.salt)));
    } catch (e) {
      throw fail("invalid-file", "The backup file couldn't be read.");
    }

    if (blob.verifier && verifier !== blob.verifier) {
      throw fail("wrong-password", "That's not the password for this journal.");
    }

    let entries;
    try {
      entries = await this.journalUnseal(blob, key);
    } catch (e) {
      throw fail("corrupt", "The journal couldn't be decrypted — the backup file looks damaged.");
    }
    const upgraded = await this.journalCreate(entries, password);
    return { key: upgraded.key, entries, blob: upgraded.blob };
  }

  /**
   * Password reset: prove knowledge of the recovery answer, get the data key
   * back, then re-wrap that same key under a brand-new password. The entries
   * (and the recovery wrapper itself) are never touched.
   */
  async journalResetPassword(blob, answer, newPassword) {
    const dataKey = await this.journalUnwrapKey(blob?.recovery, this.journalNormalizeAnswer(answer), "wrong-answer");
    let entries;
    try {
      entries = await this.journalUnseal(blob.data, dataKey);
    } catch (e) {
      const err = new Error("The journal couldn't be decrypted — the data looks damaged.");
      err.code = "corrupt";
      throw err;
    }
    const pw = await this.journalWrapKey(dataKey, newPassword);
    return { key: dataKey, entries, blob: { ...blob, pw, updatedAt: new Date().toISOString() } };
  }

  // --- Lock / unlock lifecycle ---------------------------------------------
  journalLockMode() {
    if (this.journalPendingImport) return "restore";
    if (this.journalResetMode && this.journalBlob?.recovery) return "reset";
    this.journalResetMode = false;
    return this.journalBlob ? "unlock" : "create";
  }

  isJournalKeepUnlocked() {
    try {
      return localStorage.getItem("studybuddy-journal-keep-unlocked") === "1";
    } catch (e) {
      return false;
    }
  }

  showJournalLockError(message) {
    const box = document.getElementById("journal-lock-error");
    if (!box) return;
    box.textContent = message;
    box.classList.remove("hidden");
    const card = document.getElementById("journal-lock");
    card?.classList.remove("shake");
    void card?.offsetWidth; // restart the animation
    card?.classList.add("shake");
  }

  clearJournalLockError() {
    document.getElementById("journal-lock-error")?.classList.add("hidden");
  }

  async handleJournalLockSubmit(e) {
    e.preventDefault();
    const mode = this.journalLockMode();
    const passwordInput = document.getElementById("journal-password-input");
    const confirmInput = document.getElementById("journal-password-confirm");
    const answerInput = document.getElementById("journal-answer-input");
    const answerConfirmInput = document.getElementById("journal-answer-confirm");
    const password = passwordInput?.value || "";
    const confirm = confirmInput?.value || "";
    const answer = answerInput?.value || "";
    const answerConfirm = answerConfirmInput?.value || "";
    const submitBtn = document.getElementById("journal-lock-submit");
    const submitLabel = document.getElementById("journal-lock-submit-label");

    this.clearJournalLockError();

    if (password.length < 6) {
      this.showJournalLockError("Use at least 6 characters — this password protects every page.");
      return;
    }

    if ((mode === "create" || mode === "reset") && password !== confirm) {
      this.showJournalLockError("The two passwords don't match yet.");
      return;
    }

    if (mode === "create") {
      if (!this.readJournalQuestion()) {
        this.showJournalLockError("Pick a security question — it's your way back in if you ever forget the password.");
        return;
      }
      if (answer.trim().length < 3) {
        this.showJournalLockError("Use at least 3 characters for the security answer.");
        return;
      }
      if (answer !== answerConfirm) {
        this.showJournalLockError("The two answers don't match yet.");
        return;
      }
    } else if (mode === "reset" && answer.trim().length < 3) {
      this.showJournalLockError("Type the answer to your security question.");
      return;
    }

    const workingLabel = mode === "create" ? "Sealing your journal…" : mode === "reset" ? "Resetting…" : "Decrypting…";
    const idleLabel = mode === "create" ? "Create My Journal" : mode === "reset" ? "Reset & Unlock" : mode === "restore" ? "Restore & Unlock" : "Unlock Journal";
    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = workingLabel;

    try {
      if (mode === "create") {
        const question = this.readJournalQuestion();
        const { key, blob } = await this.journalCreate(this.journalEntries, password, { question, answer });
        this.journalBlob = blob;
        this.persist();
        this.openJournalSession(key, this.journalEntries.slice());
        this.showToast("Your private journal is ready — it locks itself when you leave", "success");
      } else if (mode === "restore") {
        const imported = this.journalPendingImport;
        const result = await this.journalUnlock(imported, password);
        this.journalBlob = result.blob || imported; // an old (v1) file is upgraded to the wrapped-key format
        this.journalPendingImport = null;
        this.persist();
        this.openJournalSession(result.key, result.entries);
        this.showToast(`Backup restored — ${result.entries.length} ${result.entries.length === 1 ? "entry" : "entries"} recovered`, "success");
      } else if (mode === "reset") {
        const result = await this.journalResetPassword(this.journalBlob, answer, password);
        this.journalBlob = result.blob;
        this.persist();
        this.openJournalSession(result.key, result.entries);
        this.showToast("Password reset — your journal is unlocked", "success");
      } else {
        const result = await this.journalUnlock(this.journalBlob, password);
        if (result.blob) { // a v1 blob was just re-wrapped into the current format
          this.journalBlob = result.blob;
          this.persist();
          if (!result.blob.recovery) {
            this.showToast("Tip: set a recovery question so a forgotten password can be reset", "info");
          }
        }
        this.openJournalSession(result.key, result.entries);
      }
    } catch (err) {
      console.warn("[StudyBuddy] Journal unlock failed:", err);
      this.showJournalLockError(err?.message || "Couldn't unlock the journal — try again.");
    } finally {
      if (passwordInput) passwordInput.value = "";
      if (confirmInput) confirmInput.value = "";
      if (answerInput) answerInput.value = "";
      if (answerConfirmInput) answerConfirmInput.value = "";
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = idleLabel;
      if (mode === "reset") answerInput?.focus();
      else passwordInput?.focus();
    }
  }

  /** Enters the unlocked view: populates the editor for today. */
  openJournalSession(key, entries) {
    this.journalKey = key;
    this.journalEntries = Array.isArray(entries) ? entries : [];
    this.journalUnlocked = true;
    this.journalDirty = false;
    this.journalSearch = "";
    this.journalPromptOffset = 0;
    this.journalSelectedDate = this.toDateKey(new Date());
    this.journalResetMode = false;
    this._journalEditorDate = null;
    this._journalMood = null;

    const searchInput = document.getElementById("journal-search-input");
    if (searchInput) searchInput.value = "";

    this.renderJournal();
    document.getElementById("journal-title-input")?.focus({ preventScroll: true });
  }

  /**
   * Re-locks the journal. Unsaved words are encrypted and synced first (the
   * crypto runs off the captured key/entries), so nothing typed is ever lost.
   */
  lockJournal({ skipSave = false } = {}) {
    if (!this.journalUnlocked) return;
    if (!skipSave && this.journalDirty) this.encryptAndSyncJournal();

    this.journalUnlocked = false;
    this.journalKey = null;
    this.journalEntries = [];
    this.journalDirty = false;
    this.journalSearch = "";
    this.journalResetMode = false;
    this._journalMood = null;
    this._journalEditorDate = null;
    this.journalSelectedDate = this.toDateKey(new Date());

    const titleInput = document.getElementById("journal-title-input");
    const bodyInput = document.getElementById("journal-body-input");
    const searchInput = document.getElementById("journal-search-input");
    if (titleInput) titleInput.value = "";
    if (bodyInput) bodyInput.value = "";
    if (searchInput) searchInput.value = "";

    this.clearJournalLockError();
    this.renderJournal();
  }

  // --- Saving ---------------------------------------------------------------
  markJournalDirty() {
    if (!this.journalUnlocked) return;
    this.journalDirty = true;
    this.updateJournalSaveState(false);
    clearTimeout(this._journalSaveTimer);
    this._journalSaveTimer = setTimeout(() => this.saveJournalEntry(), 1500);
  }

  /** Re-encrypts the in-memory entries and pushes them to the cloud. */
  async encryptAndSyncJournal() {
    const key = this.journalKey;     // captured before any await on purpose
    const entries = this.journalEntries;
    const blob = this.journalBlob;
    if (!key || !blob) return;

    try {
      const sealed = await this.journalSeal(entries, key);
      // v2: the data key never changes, so the password/recovery wrappers stay valid.
      this.journalBlob = (blob.v === 2 && blob.pw)
        ? { ...blob, data: sealed, updatedAt: new Date().toISOString() }
        : { v: 1, salt: blob.salt, verifier: blob.verifier, ...sealed, updatedAt: new Date().toISOString() };
      this.updateJournalSaveState(true);
      this.schedulePersist();
    } catch (e) {
      console.error("[StudyBuddy] Journal encryption failed:", e);
      this.updateJournalSaveState(false);
      this.showToast("Couldn't encrypt your journal just now", "alert");
    }
  }

  async saveJournalEntry(announce = false) {
    if (!this.journalUnlocked) return false;
    clearTimeout(this._journalSaveTimer);

    const date = this.journalSelectedDate;
    const title = document.getElementById("journal-title-input")?.value.trim() || "";
    const body = document.getElementById("journal-body-input")?.value.trim() || "";
    const mood = typeof this._journalMood === "number" ? this._journalMood : null;
    const index = this.journalEntries.findIndex(entry => entry.date === date);
    const isEmpty = !title && !body && mood === null;

    if (isEmpty) {
      if (index !== -1) this.journalEntries.splice(index, 1);
      else {
        this.journalDirty = false;
        return true; // nothing written and nothing stored — nothing to seal
      }
    } else if (index === -1) {
      this.journalEntries.push({
        id: `jr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date,
        mood,
        title,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      Object.assign(this.journalEntries[index], {
        mood,
        title,
        body,
        updatedAt: new Date().toISOString()
      });
    }

    this.journalDirty = false;
    await this.encryptAndSyncJournal();
    this.renderJournalList();
    this.renderJournalStats();
    if (announce) this.showToast("Entry saved & encrypted", "success");
    return true;
  }

  updateJournalSaveState(saved) {
    const el = document.getElementById("journal-save-state");
    if (!el) return;
    if (saved) {
      el.classList.remove("dirty");
      el.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Saved &amp; encrypted';
    } else {
      el.classList.add("dirty");
      el.innerHTML = '<i class="fa-solid fa-pen"></i> Unsaved changes';
    }
  }

  updateJournalWordCount() {
    const el = document.getElementById("journal-word-count");
    const body = document.getElementById("journal-body-input")?.value || "";
    if (!el) return;
    const words = body.trim() ? body.trim().split(/\s+/).length : 0;
    el.textContent = `${words} ${words === 1 ? "word" : "words"}`;
  }

  // --- Navigation & editor state --------------------------------------------
  journalFormatDate(dateKey) {
    return new Date(`${dateKey}T00:00:00`)
      .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  journalRelativeLabel(dateKey) {
    const today = this.toDateKey(new Date());
    if (dateKey === today) return "Today";
    if (dateKey === this.toDateKey(new Date(Date.now() - 86400000))) return "Yesterday";
    if (dateKey > today) return "Later this week";
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" });
  }

  selectJournalDate(dateKey, force = true) {
    // Seal the day you're leaving before the editor moves on, so the 1.5s
    // autosave debounce can never file today's words under tomorrow's date.
    if (this.journalDirty && dateKey !== this.journalSelectedDate) this.saveJournalEntry();
    this.journalSelectedDate = dateKey;
    this.renderJournalEditor(force);
    this.renderJournalList();
  }

  shiftJournalDate(deltaDays) {
    const [y, m, d] = this.journalSelectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d + deltaDays);
    const key = this.toDateKey(date);
    if (key > this.toDateKey(new Date())) return; // no journaling ahead of today
    this.selectJournalDate(key);
  }

  syncMoodButtons() {
    document.querySelectorAll(".journal-mood-btn").forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.mood) === this._journalMood);
    });
  }

  currentJournalPrompt(dateKey) {
    const prompts = [
      "What made today feel like yours?",
      "What's something small that went right today?",
      "What are you carrying right now that you'd like to put down?",
      "Who did you think about today, and why?",
      "Which moment from today would you happily replay?",
      "What surprised you today?",
      "What did you avoid today — and what would starting look like?",
      "Describe today to next week's you in three sentences.",
      "What are you grateful for that you almost missed?",
      "What did today teach you about yourself?"
    ];
    let hash = 0;
    for (const ch of dateKey) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return prompts[(hash + this.journalPromptOffset) % prompts.length];
  }

  journalStreak() {
    const days = new Set(this.journalEntries.map(e => e.date));
    const today = this.toDateKey(new Date());
    let cursor = new Date();
    if (!days.has(today)) {
      cursor = new Date(Date.now() - 86400000); // today's page may not be written yet
      if (!days.has(this.toDateKey(cursor))) return 0;
    }
    let streak = 0;
    while (days.has(this.toDateKey(cursor))) {
      streak++;
      cursor = new Date(cursor.getTime() - 86400000);
    }
    return streak;
  }

  // --- Rendering -------------------------------------------------------------
  renderJournal() {
    const lockCard = document.getElementById("journal-lock");
    const view = document.getElementById("journal-view");
    if (!lockCard || !view) return;

    if (!this.journalUnlocked) {
      this.renderJournalLock();
      lockCard.classList.remove("hidden");
      view.classList.add("hidden");
      return;
    }

    lockCard.classList.add("hidden");
    view.classList.remove("hidden");
    this.renderJournalList();
    this.renderJournalEditor(false);
    this.renderJournalStats();
  }

  renderJournalLock() {
    const mode = this.journalLockMode();
    // The unlock screen also changes when a recovery question appears or is removed.
    const cacheKey = `${mode}:${this.journalBlob?.recovery ? "q" : "noq"}`;
    if (cacheKey === this._journalLockMode) return; // copy only changes on mode switches
    this._journalLockMode = cacheKey;

    const title = document.getElementById("journal-lock-title");
    const subtitle = document.getElementById("journal-lock-subtitle");
    const label = document.getElementById("journal-password-label");
    const input = document.getElementById("journal-password-input");
    const confirmGroup = document.getElementById("journal-confirm-group");
    const submitLabel = document.getElementById("journal-lock-submit-label");
    const keepRow = document.getElementById("journal-keep-row");
    const restoreBtn = document.getElementById("journal-lock-restore-btn");
    const backBtn = document.getElementById("journal-restore-cancel-btn");
    const backLabel = document.getElementById("journal-back-btn-label");
    const forgotBtn = document.getElementById("journal-forgot-btn");
    const questionBlock = document.getElementById("journal-question-block");
    const questionPick = document.getElementById("journal-question-pick");
    const questionDisplay = document.getElementById("journal-question-display");
    const questionSelect = document.getElementById("journal-question-select");
    const questionCustom = document.getElementById("journal-question-custom");
    const answerLabel = document.getElementById("journal-answer-label");
    const answerConfirmGroup = document.getElementById("journal-answer-confirm-group");

    this.clearJournalLockError();
    if (input) input.value = "";
    const confirmInput = document.getElementById("journal-password-confirm");
    if (confirmInput) confirmInput.value = "";
    const answerInput = document.getElementById("journal-answer-input");
    if (answerInput) answerInput.value = "";
    const answerConfirmInput = document.getElementById("journal-answer-confirm");
    if (answerConfirmInput) answerConfirmInput.value = "";
    if (questionSelect) questionSelect.value = "";
    if (questionCustom) { questionCustom.value = ""; questionCustom.classList.add("hidden"); }

    const question = this.journalBlob?.recovery?.question || "";
    questionBlock?.classList.toggle("hidden", mode !== "create" && mode !== "reset");
    questionPick?.classList.toggle("hidden", mode !== "create");
    questionDisplay?.classList.toggle("hidden", mode !== "reset");
    if (questionDisplay && mode === "reset") questionDisplay.textContent = `Security question: ${question}`;
    if (answerLabel) answerLabel.textContent = mode === "create" ? "Answer *" : "Answer";
    answerConfirmGroup?.classList.toggle("hidden", mode !== "create");
    forgotBtn?.classList.toggle("hidden", mode !== "unlock" || !question);

    if (mode === "create") {
      if (title) title.textContent = "Create your journal password";
      if (subtitle) subtitle.textContent =
        "This is the only key to your private pages — set it once, then enter it every time you open the journal. It is never stored, so nobody else can open your journal, not even with your account. Pick a security question below: it's your way back in if you ever forget.";
      if (label) label.textContent = "Choose a journal password (6+ characters)";
      if (input) { input.placeholder = "At least 6 characters"; input.autocomplete = "new-password"; }
      confirmGroup?.classList.remove("hidden");
      if (submitLabel) submitLabel.textContent = "Create My Journal";
      keepRow?.classList.add("hidden");
      restoreBtn?.classList.remove("hidden");
      backBtn?.classList.add("hidden");
    } else if (mode === "restore") {
      if (title) title.textContent = "Restore a journal backup";
      if (subtitle) subtitle.textContent =
        "You picked a backup file. Enter the password that protects it to bring those pages back into your account.";
      if (label) label.textContent = "Backup password";
      if (input) { input.placeholder = "Enter the backup's password"; input.autocomplete = "current-password"; }
      confirmGroup?.classList.add("hidden");
      if (submitLabel) submitLabel.textContent = "Restore & Unlock";
      keepRow?.classList.add("hidden");
      restoreBtn?.classList.add("hidden");
      if (backLabel) backLabel.textContent = "Cancel restore";
      backBtn?.classList.remove("hidden");
    } else if (mode === "reset") {
      if (title) title.textContent = "Reset your journal password";
      if (subtitle) subtitle.textContent =
        "Answer your security question to prove this journal is yours, then choose a new password. Your entries stay untouched.";
      if (label) label.textContent = "New journal password (6+ characters)";
      if (input) { input.placeholder = "At least 6 characters"; input.autocomplete = "new-password"; }
      confirmGroup?.classList.remove("hidden");
      if (submitLabel) submitLabel.textContent = "Reset & Unlock";
      keepRow?.classList.add("hidden");
      restoreBtn?.classList.add("hidden");
      if (backLabel) backLabel.textContent = "Back to unlock";
      backBtn?.classList.remove("hidden");
    } else {
      if (title) title.textContent = "Your journal is locked";
      if (subtitle) subtitle.textContent =
        "Enter your journal password to step inside. This space is yours alone.";
      if (label) label.textContent = "Journal password";
      if (input) { input.placeholder = "Enter your journal password"; input.autocomplete = "current-password"; }
      confirmGroup?.classList.add("hidden");
      if (submitLabel) submitLabel.textContent = "Unlock Journal";
      keepRow?.classList.remove("hidden");
      restoreBtn?.classList.remove("hidden");
      backBtn?.classList.add("hidden");
    }
  }

  renderJournalList() {
    const container = document.getElementById("journal-entries-list");
    const emptyState = document.getElementById("journal-list-empty-state");
    const countLabel = document.getElementById("journal-count-label");
    if (!container) return;

    const search = this.journalSearch;
    const filtered = this.journalEntries
      .filter(entry => !search ||
        (entry.title || "").toLowerCase().includes(search) ||
        (entry.body || "").toLowerCase().includes(search))
      .sort((a, b) => b.date.localeCompare(a.date));

    if (countLabel) {
      const total = this.journalEntries.length;
      const totalLabel = `${total} ${total === 1 ? "entry" : "entries"}`;
      countLabel.textContent = (search && filtered.length !== total)
        ? `${filtered.length} of ${totalLabel}`
        : totalLabel;
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      const searching = Boolean(search);
      const titleEl = document.getElementById("journal-empty-title");
      const textEl = document.getElementById("journal-empty-text");
      if (titleEl) titleEl.textContent = searching ? "No matching memories" : "Your story starts today";
      if (textEl) textEl.textContent = searching
        ? "Try a different word — your entries are still safe here."
        : "Write your first entry — even two sentences count as showing up for yourself.";
      emptyState?.classList.remove("hidden");
      return;
    }

    emptyState?.classList.add("hidden");
    const moods = ["😞", "😕", "😐", "🙂", "🤩"];
    const today = this.toDateKey(new Date());

    container.innerHTML = filtered.map(entry => {
      const dateObj = new Date(`${entry.date}T00:00:00`);
      const label = entry.date === today
        ? "Today"
        : dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const preview = entry.body ||
        (entry.mood !== null ? `Felt ${["rough", "low", "okay", "good", "great"][entry.mood] || "something"} — no words today.` : "No words yet.");
      const mood = typeof entry.mood === "number" ? moods[entry.mood] : "";
      return `
        <button type="button" class="journal-entry-item ${entry.date === this.journalSelectedDate ? "active" : ""}" data-date="${entry.date}">
          <span class="journal-entry-item-top">
            <span class="journal-entry-date-label">${label}</span>
            ${mood ? `<span class="journal-entry-mood">${mood}</span>` : ""}
          </span>
          <span class="journal-entry-title">${this.escapeHTML(entry.title || "Untitled day")}</span>
          <span class="journal-entry-preview">${this.escapeHTML(preview)}</span>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".journal-entry-item").forEach(btn => {
      btn.addEventListener("click", () => this.selectJournalDate(btn.dataset.date));
    });
  }

  renderJournalEditor(force = false) {
    const date = this.journalSelectedDate;
    if (!force && this._journalEditorDate === date) return; // never fight live typing

    const entry = this.journalEntries.find(e => e.date === date) || null;
    const dateEl = document.getElementById("journal-entry-date");
    const relativeEl = document.getElementById("journal-entry-relative");
    const picker = document.getElementById("journal-date-picker");
    const titleInput = document.getElementById("journal-title-input");
    const bodyInput = document.getElementById("journal-body-input");
    const promptEl = document.getElementById("journal-prompt-text");
    const nextBtn = document.getElementById("journal-next-day-btn");

    if (dateEl) dateEl.textContent = this.journalFormatDate(date);
    if (relativeEl) relativeEl.textContent = this.journalRelativeLabel(date);
    if (picker) picker.value = date;
    if (titleInput) titleInput.value = entry?.title || "";
    if (bodyInput) bodyInput.value = entry?.body || "";
    if (promptEl) promptEl.textContent = this.currentJournalPrompt(date);

    this._journalMood = typeof entry?.mood === "number" ? entry.mood : null;
    this.syncMoodButtons();
    this.updateJournalWordCount();
    this.updateJournalSaveState(!this.journalDirty);

    if (nextBtn) nextBtn.disabled = date >= this.toDateKey(new Date());

    this._journalEditorDate = date;
  }

  renderJournalStats() {
    const streak = this.journalStreak();
    const badge = document.getElementById("journal-streak-badge");
    if (badge) {
      badge.innerHTML = streak > 0
        ? `<i class="fa-solid fa-fire"></i> ${streak} day${streak === 1 ? "" : "s"} streak`
        : '<i class="fa-solid fa-fire"></i> Start your streak';
    }
    const sync = document.getElementById("journal-sync-badge");
    if (sync && this.journalBlob?.updatedAt) {
      sync.title = `Last encrypted sync: ${new Date(this.journalBlob.updatedAt).toLocaleString()}`;
    }

    const setQuestionBtn = document.getElementById("journal-set-question-btn");
    if (setQuestionBtn) {
      setQuestionBtn.classList.toggle("hidden", !this.journalUnlocked);
      const hasQuestion = Boolean(this.journalBlob?.recovery);
      const labelEl = document.getElementById("journal-set-question-label");
      if (labelEl) labelEl.textContent = hasQuestion ? "Recovery question" : "Set recovery question";
      setQuestionBtn.title = hasQuestion
        ? "View or change the question that can reset a forgotten password"
        : "Pick a question that can reset a forgotten password";
    }
  }

  // --- Backup & restore -------------------------------------------------------
  async exportJournalBackup() {
    if (!this.journalUnlocked || !this.journalBlob) {
      this.showToast("Unlock the journal before downloading a backup", "alert");
      return;
    }
    if (this.journalDirty) await this.saveJournalEntry();

    const payload = {
      app: "StudyBuddy",
      type: "studybuddy-journal-backup",
      version: 2,
      exportedAt: new Date().toISOString(),
      entries: this.journalEntries.length,
      note: "Encrypted with your journal password — or reset with your security answer. Neither can be recovered without them.",
      blob: this.journalBlob
    };

    const file = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `studybuddy-journal-backup-${this.toDateKey(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.showToast("Encrypted backup downloaded — drop it into Google Drive to keep it forever", "success");
  }

  async handleJournalBackupFile(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const blob = (parsed && typeof parsed === "object" && parsed.blob) ? parsed.blob : parsed;
      const wrapped = blob && blob.v === 2 && typeof blob.data === "object" && blob.data !== null;
      const looksValid = wrapped
        ? typeof blob.pw?.salt === "string" && typeof blob.data?.data === "string"
        : typeof blob?.salt === "string" && typeof blob?.iv === "string" && typeof blob?.data === "string";
      if (!looksValid) {
        throw new Error("not a StudyBuddy journal backup");
      }
      this.journalPendingImport = blob;
      if (this.journalUnlocked) this.lockJournal(); // saves any unsaved words first
      this._journalLockMode = null;                  // force the lock card into restore mode
      this.renderJournal();
      document.getElementById("journal-password-input")?.focus();
    } catch (e) {
      console.warn("[StudyBuddy] Backup restore rejected:", e);
      this.journalPendingImport = null;
      this.showToast("That file isn't a valid StudyBuddy journal backup", "alert");
    } finally {
      const input = document.getElementById("journal-backup-file-input");
      if (input) input.value = "";
    }
  }

  // --- Change password ---------------------------------------------------------
  openJournalPasswordModal() {
    if (!this.journalUnlocked) return;
    const form = document.getElementById("journal-password-form");
    form?.reset();
    document.getElementById("journal-password-modal-error")?.classList.add("hidden");
    this.openModal(document.getElementById("journal-password-modal"));
  }

  async saveJournalPasswordFromForm(e) {
    e.preventDefault();
    const errorBox = document.getElementById("journal-password-modal-error");
    const current = document.getElementById("journal-current-password")?.value || "";
    const next = document.getElementById("journal-new-password")?.value || "";
    const confirm = document.getElementById("journal-new-password-confirm")?.value || "";
    const fail = (message) => {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
      }
    };

    errorBox?.classList.add("hidden");
    if (next !== confirm) return fail("The new passwords don't match.");
    if (next.length < 6) return fail("Use at least 6 characters for the new password.");

    const submitBtn = document.getElementById("save-journal-password-btn");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await this.journalUnlock(this.journalBlob, current); // verifies the current password
      if (this.journalDirty) await this.saveJournalEntry();

      if (this.journalBlob?.v === 2 && this.journalBlob?.pw && this.journalKey) {
        // Same data key, new lock on the door — the entries never get re-encrypted.
        const pw = await this.journalWrapKey(this.journalKey, next);
        this.journalBlob = { ...this.journalBlob, pw, updatedAt: new Date().toISOString() };
      } else {
        const { key, blob } = await this.journalCreate(this.journalEntries, next);
        this.journalBlob = blob;
        this.journalKey = key;
      }
      this.persist();
      this.closeModal(document.getElementById("journal-password-modal"));
      this.showToast("Journal password updated — it will be asked for next time", "success");
    } catch (err) {
      fail(err?.code === "wrong-password" ? "Your current password is incorrect."
        : err?.message || "Couldn't update the password.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      document.getElementById("journal-current-password") && (document.getElementById("journal-current-password").value = "");
      document.getElementById("journal-new-password") && (document.getElementById("journal-new-password").value = "");
      document.getElementById("journal-new-password-confirm") && (document.getElementById("journal-new-password-confirm").value = "");
    }
  }

  // --- Recovery question ------------------------------------------------------
  /**
   * Reads the question select used by the lock card or the modal. Preset
   * options carry their text as the value; "__custom" falls through to the
   * free-text input. Returns "" when nothing usable was picked.
   */
  readJournalQuestion(selectId = "journal-question-select", customId = "journal-question-custom") {
    const select = document.getElementById(selectId);
    const value = (select?.value || "").trim();
    if (!value) return "";
    if (value === "__custom") return (document.getElementById(customId)?.value || "").trim();
    return value;
  }

  openJournalQuestionModal() {
    if (!this.journalUnlocked || !this.journalKey) return;
    const form = document.getElementById("journal-question-form");
    form?.reset();
    document.getElementById("jq-error")?.classList.add("hidden");
    const custom = document.getElementById("jq-question-custom");
    if (custom) { custom.value = ""; custom.classList.add("hidden"); }

    // Pre-fill the current question so it can be reviewed or changed.
    const select = document.getElementById("jq-question-select");
    const current = this.journalBlob?.recovery?.question || "";
    if (select && current) {
      const isPreset = Array.from(select.options).some(o => o.value && o.value !== "__custom" && o.value === current);
      if (isPreset) {
        select.value = current;
      } else {
        select.value = "__custom";
        if (custom) {
          custom.value = current;
          custom.classList.remove("hidden");
        }
      }
    }
    this.openModal(document.getElementById("journal-question-modal"));
  }

  async saveJournalQuestionFromForm(e) {
    e.preventDefault();
    const errorBox = document.getElementById("jq-error");
    const fail = (message) => {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
      }
    };
    errorBox?.classList.add("hidden");

    const question = this.readJournalQuestion("jq-question-select", "jq-question-custom");
    const answer = document.getElementById("jq-answer")?.value || "";
    const confirm = document.getElementById("jq-answer-confirm")?.value || "";

    if (!question) return fail("Pick a security question first.");
    if (answer.trim().length < 3) return fail("Use at least 3 characters for the answer.");
    if (answer !== confirm) return fail("The two answers don't match.");
    if (!this.journalUnlocked || !this.journalKey) return fail("Re-lock and unlock the journal, then try again.");
    if (this.journalBlob?.v !== 2 || !this.journalBlob?.pw) return fail("Re-lock and unlock the journal once more, then try again.");

    const submitBtn = document.getElementById("save-journal-question-btn");
    if (submitBtn) submitBtn.disabled = true;
    try {
      if (this.journalDirty) await this.saveJournalEntry();
      // The data key stays the same — only a second wrapped copy of it is added.
      const wrapper = await this.journalWrapKey(this.journalKey, this.journalNormalizeAnswer(answer));
      this.journalBlob = {
        ...this.journalBlob,
        v: 2,
        recovery: { question, ...wrapper },
        updatedAt: new Date().toISOString()
      };
      this.persist();
      this.closeModal(document.getElementById("journal-question-modal"));
      this.renderJournalStats();
      this.showToast("Recovery question saved — it can reset a forgotten password", "success");
    } catch (err) {
      console.warn("[StudyBuddy] Recovery question failed:", err);
      fail("Couldn't save the question — try again.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      const answerInput = document.getElementById("jq-answer");
      if (answerInput) answerInput.value = "";
      const answerConfirmInput = document.getElementById("jq-answer-confirm");
      if (answerConfirmInput) answerConfirmInput.value = "";
    }
  }

  setupJournalEvents() {
    // Lock / create / restore form
    document.getElementById("journal-lock-form")?.addEventListener("submit", (e) => this.handleJournalLockSubmit(e));

    document.getElementById("journal-lock-restore-btn")?.addEventListener("click", () => {
      document.getElementById("journal-backup-file-input")?.click();
    });
    document.getElementById("journal-restore-btn")?.addEventListener("click", () => {
      document.getElementById("journal-backup-file-input")?.click();
    });
    // One "back" button shared by restore mode (cancel) and reset mode (undo)
    document.getElementById("journal-restore-cancel-btn")?.addEventListener("click", () => {
      this.journalPendingImport = null;
      this.journalResetMode = false;
      this._journalLockMode = null;
      this.clearJournalLockError();
      this.renderJournalLock();
    });
    // Forgotten password → recovery-question reset mode
    document.getElementById("journal-forgot-btn")?.addEventListener("click", () => {
      if (!this.journalBlob?.recovery) return;
      this.journalResetMode = true;
      this._journalLockMode = null;
      this.clearJournalLockError();
      this.renderJournalLock();
      document.getElementById("journal-answer-input")?.focus();
    });
    // "Write my own question" reveals the free-text field
    [["journal-question-select", "journal-question-custom"], ["jq-question-select", "jq-question-custom"]].forEach(([selectId, customId]) => {
      const select = document.getElementById(selectId);
      const custom = document.getElementById(customId);
      select?.addEventListener("change", () => {
        const showCustom = select.value === "__custom";
        custom?.classList.toggle("hidden", !showCustom);
        if (showCustom) custom?.focus();
      });
    });
    document.getElementById("journal-backup-file-input")?.addEventListener("change", (e) => {
      this.handleJournalBackupFile(e.target.files?.[0]);
    });

    // "Keep unlocked" preference
    const keepInput = document.getElementById("journal-keep-unlocked-input");
    if (keepInput) {
      keepInput.checked = this.isJournalKeepUnlocked();
      keepInput.addEventListener("change", () => {
        try {
          localStorage.setItem("studybuddy-journal-keep-unlocked", keepInput.checked ? "1" : "0");
        } catch (err) { /* preference is best-effort */ }
      });
    }

    // Toolbar
    document.getElementById("journal-lock-btn")?.addEventListener("click", () => this.lockJournal());
    document.getElementById("journal-export-btn")?.addEventListener("click", () => this.exportJournalBackup());
    document.getElementById("journal-change-pass-btn")?.addEventListener("click", () => this.openJournalPasswordModal());
    document.getElementById("journal-password-form")?.addEventListener("submit", (e) => this.saveJournalPasswordFromForm(e));
    document.getElementById("journal-set-question-btn")?.addEventListener("click", () => this.openJournalQuestionModal());
    document.getElementById("journal-question-form")?.addEventListener("submit", (e) => this.saveJournalQuestionFromForm(e));

    // Editor navigation
    document.getElementById("journal-today-btn")?.addEventListener("click", () => {
      this.selectJournalDate(this.toDateKey(new Date()));
    });
    document.getElementById("journal-prev-day-btn")?.addEventListener("click", () => this.shiftJournalDate(-1));
    document.getElementById("journal-next-day-btn")?.addEventListener("click", () => this.shiftJournalDate(1));
    document.getElementById("journal-date-picker")?.addEventListener("change", (e) => {
      if (e.target.value) this.selectJournalDate(e.target.value);
    });

    // Search
    document.getElementById("journal-search-input")?.addEventListener("input", (e) => {
      this.journalSearch = e.target.value.toLowerCase().trim();
      this.renderJournalList();
    });

    // Mood picker
    document.getElementById("journal-mood-buttons")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".journal-mood-btn");
      if (!btn) return;
      const mood = Number(btn.dataset.mood);
      this._journalMood = this._journalMood === mood ? null : mood;
      this.syncMoodButtons();
      this.markJournalDirty();
    });

    // Writing
    document.getElementById("journal-prompt-refresh-btn")?.addEventListener("click", () => {
      this.journalPromptOffset++;
      const promptEl = document.getElementById("journal-prompt-text");
      if (promptEl) promptEl.textContent = this.currentJournalPrompt(this.journalSelectedDate);
    });
    const onWrite = () => {
      this.updateJournalWordCount();
      this.markJournalDirty();
    };
    document.getElementById("journal-title-input")?.addEventListener("input", onWrite);
    document.getElementById("journal-body-input")?.addEventListener("input", onWrite);

    document.getElementById("journal-save-btn")?.addEventListener("click", () => this.saveJournalEntry(true));
    document.getElementById("journal-delete-btn")?.addEventListener("click", async () => {
      const date = this.journalSelectedDate;
      const index = this.journalEntries.findIndex(entry => entry.date === date);
      if (index === -1) {
        this.showToast("There's no entry for this day yet", "info");
        return;
      }
      const ok = await this.confirmDialog({
        title: "Delete this journal entry?",
        message: `The entry for ${this.journalFormatDate(date)} will be permanently deleted. This can't be undone.`,
        confirmLabel: "Delete entry"
      });
      if (!ok) return;
      this.journalEntries.splice(index, 1);
      this.journalDirty = false;
      await this.encryptAndSyncJournal();
      this.renderJournalEditor(true);
      this.renderJournalList();
      this.renderJournalStats();
      this.showToast("Entry deleted", "info");
    });

    // The private space re-locks whenever the journal is out of sight.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.journalUnlocked && !this.isJournalKeepUnlocked()) this.lockJournal();
    });
  }

  // ===========================================================================
  // 11b. Motion glue — entrances, nav indicator, flashes
  // ===========================================================================
  /** Staggers the blocks of a tab in, grows its charts and counts its numbers up. */
  playEnter(tabId = this.currentTab) {
    if (Motion.reduced()) return;
    const pane = document.getElementById(`tab-${tabId}`);
    if (!pane) return;
    const targets = [...pane.querySelectorAll(ENTER_SELECTOR)].filter(el => el.getClientRects().length);
    targets.forEach((el, i) => {
      el.classList.add("anim-in");
      el.style.setProperty("--i", Math.min(i, 12));
    });
    pane.classList.remove("is-entering");
    void pane.offsetWidth;
    pane.classList.add("is-entering");
    clearTimeout(this._enterTimer);
    this._enterTimer = setTimeout(() => pane.classList.remove("is-entering"), 1700);
  }

  /** Clears remembered counter values so numbers count up from zero again. */
  resetCounters(pane) {
    pane?.querySelectorAll("[data-num]").forEach(el => { el.dataset.num = ""; });
  }

  updateNavIndicator(instant = false) {
    const menu = document.querySelector(".nav-menu");
    const indicator = this._navIndicator;
    if (!menu || !indicator) return;
    const active = menu.querySelector(".nav-item.active");
    if (!active || !active.offsetHeight) {
      indicator.style.opacity = "0";
      return;
    }
    if (instant) indicator.classList.add("no-anim");
    indicator.style.opacity = "1";
    indicator.style.height = `${active.offsetHeight}px`;
    indicator.style.transform = `translateY(${active.offsetTop}px)`;
    if (instant) {
      void indicator.offsetWidth;
      indicator.classList.remove("no-anim");
    }
  }

  itemSelector(listName, id) {
    const attr = {
      tasks: "data-task-id",
      notes: "data-note-id",
      marks: "data-mark-id",
      events: "data-event-id",
      timetable: "data-slot-id",
      decks: "data-deck-id"
    }[listName];
    return attr ? `[${attr}="${CSS.escape(String(id))}"]` : null;
  }

  /** The visible element showing an item in the current tab (not its inner action buttons). */
  findItemElement(listName, id) {
    const selector = this.itemSelector(listName, id);
    const pane = document.getElementById(`tab-${this.currentTab}`);
    if (!selector || !pane) return null;
    return [...pane.querySelectorAll(selector)].find(el => !el.matches("button") && el.getClientRects().length) || null;
  }

  applyFlash() {
    if (!this._flash) return;
    const { listName, id } = this._flash;
    this._flash = null;
    const el = this.findItemElement(listName, id);
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1700);
  }

  setupSidebarCollapse() {
    const btn = document.getElementById("collapse-sidebar-btn");
    if (!btn) return;
    const apply = (collapsed) => {
      document.body.classList.toggle("sidebar-collapsed", collapsed);
      btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
      btn.setAttribute("aria-label", btn.title);
      setTimeout(() => this.updateNavIndicator(true), 380);
    };
    let collapsed = false;
    try { collapsed = localStorage.getItem("studybuddy-sidebar-collapsed") === "1"; } catch (e) { /* ignore */ }
    apply(collapsed);
    btn.addEventListener("click", () => {
      collapsed = !document.body.classList.contains("sidebar-collapsed");
      apply(collapsed);
      try { localStorage.setItem("studybuddy-sidebar-collapsed", collapsed ? "1" : "0"); } catch (e) { /* ignore */ }
    });
  }

  // ===========================================================================
  // 11c. Assignment checklists (subtasks)
  // ===========================================================================
  setupSubtaskEditor() {
    const list = document.getElementById("subtask-list");
    const input = document.getElementById("subtask-new-input");
    if (!list || !input) return;

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      this._editingSubtasks.push({ id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text, done: false });
      input.value = "";
      this.renderSubtaskEditor();
    });

    list.addEventListener("click", (e) => {
      const row = e.target.closest("[data-sub-id]");
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (!row || !action) return;
      const idx = this._editingSubtasks.findIndex(s => s.id === row.dataset.subId);
      if (idx === -1) return;
      if (action === "toggle") this._editingSubtasks[idx].done = !this._editingSubtasks[idx].done;
      else if (action === "remove") this._editingSubtasks.splice(idx, 1);
      this.renderSubtaskEditor();
    });

    list.addEventListener("input", (e) => {
      const row = e.target.closest("[data-sub-id]");
      if (!row || !e.target.matches('input[type="text"]')) return;
      const sub = this._editingSubtasks.find(s => s.id === row.dataset.subId);
      if (sub) sub.text = e.target.value;
    });

    // Enter inside a step jumps to "add step" instead of submitting the form.
    list.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches('input[type="text"]')) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  renderSubtaskEditor() {
    const list = document.getElementById("subtask-list");
    if (!list) return;
    list.innerHTML = this._editingSubtasks.map(sub => `
      <li class="subtask-row ${sub.done ? "done" : ""}" data-sub-id="${this.escapeHTML(sub.id)}">
        <button type="button" class="check check-sm ${sub.done ? "checked" : ""}" data-action="toggle" aria-label="${sub.done ? "Mark step as not done" : "Mark step as done"}"><i class="fa-solid fa-check"></i></button>
        <input type="text" value="${this.escapeHTML(sub.text)}" aria-label="Checklist step">
        <button type="button" class="icon-btn icon-btn-sm" data-action="remove" aria-label="Remove step" title="Remove step"><i class="fa-solid fa-xmark"></i></button>
      </li>
    `).join("");
  }

  toggleSubtask(taskId, subId) {
    const task = this.tasks.find(t => t.id === taskId);
    const sub = task?.subtasks?.find(s => s.id === subId);
    if (!sub) return;
    sub.done = !sub.done;
    this.schedulePersist();
    if (sub.done) {
      this.recordActivity();
      this.playSound("success");
    }
    this.renderAll();
    const allDone = task.subtasks.length > 0 && task.subtasks.every(s => s.done);
    if (sub.done && allDone && !task.completed) {
      this.showToast(`Every step of “${task.title}” is done`, "success", {
        action: { label: "Complete it", onClick: () => this.toggleTaskCompletion(task.id) }
      });
    }
  }

  // ===========================================================================
  // 11d. Grade calculator — "what do I need on the next test?"
  // ===========================================================================
  setupGradeCalculator() {
    ["calc-subject", "calc-target", "calc-weight"].forEach(id => {
      const el = document.getElementById(id);
      el?.addEventListener("input", () => this.renderGradeCalculator());
      el?.addEventListener("change", () => this.renderGradeCalculator());
    });
  }

  renderGradeCalculator() {
    const select = document.getElementById("calc-subject");
    const result = document.getElementById("calc-result");
    if (!select || !result) return;

    const subjects = [...new Set(this.marks.map(m => String(m.subject || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    const current = select.value;
    select.innerHTML = '<option value="all">All subjects</option>' +
      subjects.map(s => `<option value="${this.escapeHTML(s)}">${this.escapeHTML(s)}</option>`).join("");
    select.value = subjects.includes(current) ? current : "all";

    const subject = select.value;
    const target = parseFloat(document.getElementById("calc-target")?.value);
    const weight = parseFloat(document.getElementById("calc-weight")?.value);
    const pool = this.marks.filter(m => this.markPercent(m) !== null && (subject === "all" || m.subject === subject));
    const show = (band, value, text) => {
      result.className = `calc-result ${band}`;
      result.innerHTML = `<span class="calc-result-value">${value}</span><span class="calc-result-text">${text}</span>`;
    };

    if (!pool.length) {
      show("", "—", subject === "all" ? "Record a mark first to see what you need." : `Record a ${this.escapeHTML(subject)} mark first to see what you need.`);
      return;
    }
    if (!(target > 0 && target <= 100) || !(weight > 0 && weight <= 100)) {
      show("", "—", "Enter a target and a weight between 1 and 100.");
      return;
    }

    // Weighted marks if the student gave weights, otherwise everything recorded
    // so far is treated as the rest of the grade.
    const weighted = pool.filter(m => Number(m.weight) > 0);
    let average;
    let done;
    if (weighted.length) {
      done = weighted.reduce((sum, m) => sum + Number(m.weight), 0);
      average = weighted.reduce((sum, m) => sum + this.markPercent(m) * Number(m.weight), 0) / done;
    } else {
      average = pool.reduce((sum, m) => sum + this.markPercent(m), 0) / pool.length;
      done = Math.max(1, 100 - weight);
    }
    const needed = Math.round(((target * (done + weight) - average * done) / weight) * 10) / 10;
    const avg = Math.round(average * 10) / 10;
    const scope = subject === "all" ? "overall" : `in ${this.escapeHTML(subject)}`;

    if (needed <= 0) {
      show("band-ok", "✓", `You're on track for ${target}% ${scope} whatever you score (currently ${avg}%).`);
    } else if (needed > 100) {
      const best = Math.round(((average * done + 100 * weight) / (done + weight)) * 10) / 10;
      show("band-no", `${needed}%`, `Out of reach with one test worth ${weight}% — a perfect score gets you to ${best}% ${scope}.`);
    } else {
      show(needed > 85 ? "band-hard" : "band-ok", `${needed}%`,
        `needed on a test worth ${weight}% to reach ${target}% ${scope} (currently ${avg}%).`);
    }
  }

  // ===========================================================================
  // 11e. Focus mode — full-screen timer with ambient sound
  // ===========================================================================
  setupFocusMode() {
    const overlay = document.getElementById("focus-overlay");
    if (!overlay) return;
    document.getElementById("focus-mode-btn")?.addEventListener("click", () => this.openFocusMode());
    document.getElementById("fo-exit-btn")?.addEventListener("click", () => this.closeFocusMode());
    document.getElementById("fo-toggle-btn")?.addEventListener("click", () => this.toggleTimer());
    document.getElementById("fo-reset-btn")?.addEventListener("click", () => this.resetTimer());
    document.getElementById("fo-skip-btn")?.addEventListener("click", () => this.skipTimer());
    document.getElementById("fo-sound")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sound]");
      if (btn) this.setAmbient(btn.dataset.sound);
    });
    const volume = document.getElementById("fo-volume");
    volume?.addEventListener("input", () => {
      const v = Number(volume.value) || 0;
      AmbientSound.setVolume(v / 100);
      this.settings.ambientVolume = v;
      clearTimeout(this._volumeTimer);
      this._volumeTimer = setTimeout(() => this.schedulePersist(), 600);
    });

    document.addEventListener("keydown", (e) => {
      if (!this.isFocusModeOpen() || (window.studyBuddy && window.studyBuddy !== this)) return;
      if (e.key === " " && !this.isTypingTarget(e.target)) {
        e.preventDefault();
        this.toggleTimer();
      }
    });
    // Leaving browser full screen (Esc) also leaves focus mode.
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && this._focusFullscreen && this.isFocusModeOpen()) {
        this._focusFullscreen = false;
        this.closeFocusMode();
      }
    });
  }

  isFocusModeOpen() {
    return Boolean(document.getElementById("focus-overlay")?.classList.contains("open"));
  }

  openFocusMode() {
    const overlay = document.getElementById("focus-overlay");
    if (!overlay || this.isFocusModeOpen()) return;
    this.closePalette();
    this.closeQuickAdd();
    this.closeDrawer?.();
    overlay.classList.add("open");
    document.body.classList.add("modal-open");
    this._focusFullscreen = false;
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
          .then(() => { this._focusFullscreen = true; })
          .catch(() => { /* full screen is optional */ });
      }
    } catch (e) { /* ignore */ }

    const volume = document.getElementById("fo-volume");
    const v = Number(this.settings.ambientVolume ?? 50);
    if (volume) volume.value = String(v);
    AmbientSound.setVolume(v / 100);
    const sound = this.settings.ambient || "off";
    if (sound !== "off") this.setAmbient(sound, false);
    else this.syncSoundButtons("off");

    this.renderFocusOverlay();
    document.getElementById("fo-toggle-btn")?.focus({ preventScroll: true });
  }

  closeFocusMode() {
    const overlay = document.getElementById("focus-overlay");
    if (!overlay || !this.isFocusModeOpen()) return;
    overlay.classList.remove("open");
    if (!document.querySelector(".modal-backdrop.active")) document.body.classList.remove("modal-open");
    AmbientSound.stop();
    if (document.fullscreenElement && document.exitFullscreen) {
      this._focusFullscreen = false;
      document.exitFullscreen().catch(() => { /* ignore */ });
    }
    document.getElementById("focus-mode-btn")?.focus({ preventScroll: true });
  }

  setAmbient(kind, persist = true) {
    const volume = Number(document.getElementById("fo-volume")?.value ?? this.settings.ambientVolume ?? 50);
    AmbientSound.setVolume(volume / 100);
    AmbientSound.play(kind);
    this.syncSoundButtons(kind);
    if (persist) {
      this.settings.ambient = kind;
      this.schedulePersist();
    }
  }

  syncSoundButtons(kind) {
    document.querySelectorAll("#fo-sound [data-sound]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.sound === kind);
      btn.setAttribute("aria-pressed", String(btn.dataset.sound === kind));
    });
  }

  renderFocusOverlay(timeOnly = false) {
    if (!this.isFocusModeOpen()) return;
    const overlay = document.getElementById("focus-overlay");
    const total = this.modeSeconds(this.timerMode);
    const fraction = Math.min(1, Math.max(0, (total - this.timeLeft) / total));
    const timeEl = document.getElementById("fo-time");
    if (timeEl) timeEl.textContent = this.formatTimer(this.timeLeft);
    const ring = document.getElementById("fo-progress");
    if (ring) {
      const c = 2 * Math.PI * 92;
      ring.style.strokeDasharray = String(c);
      ring.style.strokeDashoffset = String(c * (1 - fraction));
    }
    if (timeOnly) return;

    overlay.dataset.mode = this.timerMode;
    overlay.classList.toggle("is-running", this.isTimerRunning);
    const label = this.timerMode === "pomodoro" ? "Focus" : this.timerMode === "shortBreak" ? "Short break" : "Long break";
    const modeEl = document.getElementById("fo-mode");
    if (modeEl) modeEl.textContent = label;
    const task = this.timerTaskId ? this.tasks.find(t => t.id === this.timerTaskId) : null;
    const taskEl = document.getElementById("fo-task");
    if (taskEl) {
      taskEl.textContent = this.timerMode !== "pomodoro" ? "Breathe. Stretch. Look out of a window."
        : task ? task.title : "Just focusing";
    }
    const toggle = document.getElementById("fo-toggle-btn");
    if (toggle) {
      toggle.innerHTML = this.isTimerRunning ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
      toggle.setAttribute("aria-label", this.isTimerRunning ? "Pause" : "Start");
    }
    const dots = document.getElementById("fo-dots");
    if (dots) {
      let filled = this.cycleCount % 4;
      if (filled === 0 && this.cycleCount > 0 && this.timerMode === "longBreak") filled = 4;
      dots.innerHTML = [0, 1, 2, 3].map(i => `<span class="${i < filled ? "filled" : ""}"></span>`).join("");
    }
  }

  // ===========================================================================
  // 11f. Flashcards — Leitner-style spaced repetition
  // ===========================================================================
  /** Days until the next review for each box (0 = new / forgotten). */
  static get FC_INTERVALS() { return [0, 1, 2, 4, 8, 16]; }

  fcAddDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return this.toDateKey(d);
  }

  normalizeDeck(deck) {
    if (!deck || typeof deck !== "object") return null;
    deck.id = String(deck.id || `deck-${Date.now()}`);
    deck.name = String(deck.name || "Untitled deck");
    deck.subject = String(deck.subject || "");
    deck.cards = Array.isArray(deck.cards) ? deck.cards.filter(c => c && typeof c === "object") : [];
    deck.cards.forEach(c => {
      c.id = String(c.id || `card-${Math.random().toString(36).slice(2)}`);
      c.front = String(c.front || "");
      c.back = String(c.back || "");
      c.box = Math.max(0, Math.min(5, Number(c.box) || 0));
      c.due = typeof c.due === "string" && c.due ? c.due : this.toDateKey(new Date());
      c.reviews = Number(c.reviews) || 0;
    });
    return deck;
  }

  deckDueCards(deck) {
    const today = this.toDateKey(new Date());
    return deck.cards.filter(c => !c.due || c.due <= today);
  }

  totalDueCards() {
    return this.decks.reduce((sum, deck) => sum + this.deckDueCards(deck).length, 0);
  }

  fcIntervalLabel(days) {
    if (days <= 0) return "today";
    if (days === 1) return "tomorrow";
    if (days < 14) return `in ${days} days`;
    return `in ${Math.round(days / 7)} weeks`;
  }

  isStudying() {
    return this.currentTab === "flashcards" && this.fcView === "study" && Boolean(this.fcSession) && !this.fcSession.finished;
  }

  setFcView(view) {
    this.fcView = view;
    if (view !== "study") this.fcSession = view === "deck" || view === "decks" ? null : this.fcSession;
    this.renderFlashcards();
    if (this.currentTab === "flashcards") this.playEnter("flashcards");
  }

  openDeck(id) {
    this.fcDeckId = id;
    this.setFcView("deck");
  }

  setupFlashcards() {
    const bind = (id, fn) => document.getElementById(id)?.addEventListener("click", fn);
    bind("add-deck-btn", () => this.openDeckModal());
    bind("empty-state-add-deck-btn", () => this.openDeckModal());
    bind("fc-back-btn", () => this.setFcView("decks"));
    bind("fc-edit-deck-btn", () => this.openDeckModal(this.decks.find(d => d.id === this.fcDeckId)));
    bind("fc-delete-deck-btn", () => this.deleteDeck(this.fcDeckId));
    bind("fc-study-btn", () => this.startStudy(this.fcDeckId));
    bind("fc-study-exit-btn", () => this.endStudy());
    bind("fc-done-back-btn", () => this.setFcView("decks"));
    bind("card-delete-btn", () => {
      const id = document.getElementById("card-id")?.value;
      this.closeModal(document.getElementById("card-modal"));
      if (id) this.deleteCard(this.fcDeckId, id);
    });

    document.getElementById("deck-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveDeckFromForm();
    });
    document.getElementById("card-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveCardFromForm();
    });
    document.getElementById("deck-search-input")?.addEventListener("input", (e) => {
      this.deckSearch = e.target.value.toLowerCase().trim();
      this.renderFlashcards();
    });

    document.getElementById("deck-grid")?.addEventListener("click", (e) => {
      const card = e.target.closest("[data-deck-id]");
      if (!card) return;
      const id = card.dataset.deckId;
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "delete") this.deleteDeck(id);
      else if (action === "study") this.startStudy(id);
      else this.openDeck(id);
    });

    const addForm = document.getElementById("fc-add-form");
    addForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addCardFromForm();
    });
    ["fc-front-input", "fc-back-input"].forEach(id => {
      document.getElementById(id)?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.addCardFromForm();
        }
      });
    });

    document.getElementById("fc-card-list")?.addEventListener("click", (e) => {
      const row = e.target.closest("[data-card-id]");
      if (!row) return;
      const deck = this.decks.find(d => d.id === this.fcDeckId);
      const card = deck?.cards.find(c => c.id === row.dataset.cardId);
      if (!card) return;
      if (e.target.closest("[data-action='delete']")) this.deleteCard(deck.id, card.id);
      else this.openCardModal(card);
    });

    const flip = document.getElementById("fc-flip-card");
    flip?.addEventListener("click", () => this.flipStudyCard());
    document.getElementById("fc-grade-buttons")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-grade]");
      if (btn) this.gradeStudyCard(btn.dataset.grade);
    });

    document.addEventListener("keydown", (e) => {
      if (window.studyBuddy && window.studyBuddy !== this) return;
      if (!this.isStudying() || this.isTypingTarget(e.target)) return;
      if (document.querySelector(".modal-backdrop.active") || this.isPaletteOpen()) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this.flipStudyCard();
      } else if (["1", "2", "3"].includes(e.key) && this.fcSession?.flipped) {
        e.preventDefault();
        this.gradeStudyCard({ 1: "again", 2: "good", 3: "easy" }[e.key]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.endStudy();
      }
    });
  }

  openDeckModal(deck = null) {
    const modal = document.getElementById("deck-modal");
    const form = document.getElementById("deck-form");
    if (!modal || !form) return;
    form.reset();
    document.getElementById("deck-id").value = deck ? deck.id : "";
    document.getElementById("deck-name-input").value = deck ? deck.name : "";
    document.getElementById("deck-subject-input").value = deck ? deck.subject : "";
    document.getElementById("deck-modal-title").textContent = deck ? "Rename deck" : "New deck";
    document.getElementById("save-deck-btn").textContent = deck ? "Save" : "Create deck";
    this.openModal(modal);
  }

  saveDeckFromForm() {
    const id = document.getElementById("deck-id").value;
    const name = document.getElementById("deck-name-input").value.trim();
    const subject = document.getElementById("deck-subject-input").value.trim();
    if (!name) {
      this.showToast("Give the deck a name", "alert");
      return;
    }
    if (id) {
      const deck = this.decks.find(d => d.id === id);
      if (deck) Object.assign(deck, { name, subject });
      this.closeModal(document.getElementById("deck-modal"));
      this.schedulePersist();
      this.renderAll();
      this.showToast("Deck updated");
      return;
    }
    const deck = { id: `deck-${Date.now()}`, name, subject, cards: [], createdAt: new Date().toISOString() };
    this.decks.unshift(deck);
    this.closeModal(document.getElementById("deck-modal"));
    this.schedulePersist();
    this.recordActivity();
    this.fcDeckId = deck.id;
    this.fcView = "deck";
    if (this.currentTab !== "flashcards") this.switchTab("flashcards");
    else this.setFcView("deck");
    this.showToast(`Deck “${name}” created — add your first card`);
    setTimeout(() => document.getElementById("fc-front-input")?.focus(), 60);
  }

  deleteDeck(id) {
    const deck = this.decks.find(d => d.id === id);
    if (!deck) return;
    if (this.fcView !== "decks") {
      this.fcView = "decks";
      this.fcSession = null;
      this.renderFlashcards();
    }
    this.removeWithUndo("decks", id, `Deck “${deck.name}”`);
  }

  addCardFromForm() {
    const deck = this.decks.find(d => d.id === this.fcDeckId);
    const frontEl = document.getElementById("fc-front-input");
    const backEl = document.getElementById("fc-back-input");
    if (!deck || !frontEl || !backEl) return;
    const front = frontEl.value.trim();
    const back = backEl.value.trim();
    if (!front || !back) {
      this.showToast("Fill in both sides of the card", "alert");
      (front ? backEl : frontEl).focus();
      return;
    }
    const card = { id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, front, back, box: 0, due: this.toDateKey(new Date()), reviews: 0, createdAt: new Date().toISOString() };
    deck.cards.push(card);
    frontEl.value = "";
    backEl.value = "";
    frontEl.focus();
    this.schedulePersist();
    this.recordActivity();
    this.renderAll();
    const row = document.querySelector(`#fc-card-list [data-card-id="${CSS.escape(card.id)}"]`);
    row?.classList.add("flash");
  }

  openCardModal(card) {
    const modal = document.getElementById("card-modal");
    if (!modal || !card) return;
    document.getElementById("card-form").reset();
    document.getElementById("card-id").value = card.id;
    document.getElementById("card-front-input").value = card.front;
    document.getElementById("card-back-input").value = card.back;
    this.openModal(modal);
  }

  saveCardFromForm() {
    const deck = this.decks.find(d => d.id === this.fcDeckId);
    const card = deck?.cards.find(c => c.id === document.getElementById("card-id").value);
    if (!card) return;
    const front = document.getElementById("card-front-input").value.trim();
    const back = document.getElementById("card-back-input").value.trim();
    if (!front || !back) {
      this.showToast("Fill in both sides of the card", "alert");
      return;
    }
    Object.assign(card, { front, back });
    if (document.getElementById("card-reset-input")?.checked) {
      card.box = 0;
      card.due = this.toDateKey(new Date());
    }
    this.closeModal(document.getElementById("card-modal"));
    this.schedulePersist();
    this.renderAll();
    this.showToast("Card updated");
  }

  deleteCard(deckId, cardId) {
    const deck = this.decks.find(d => d.id === deckId);
    if (!deck) return;
    const index = deck.cards.findIndex(c => c.id === cardId);
    if (index === -1) return;
    const row = document.querySelector(`#fc-card-list [data-card-id="${CSS.escape(cardId)}"]`);
    const [removed] = deck.cards.splice(index, 1);
    this.schedulePersist();
    Motion.collapseOut(row, () => this.renderAll());
    this.showToast("Card deleted", "info", {
      action: {
        label: "Undo",
        onClick: () => {
          if (deck.cards.some(c => c.id === removed.id)) return;
          deck.cards.splice(Math.min(index, deck.cards.length), 0, removed);
          this.schedulePersist();
          this.renderAll();
        }
      }
    });
  }

  startStudy(deckId) {
    const deck = this.decks.find(d => d.id === deckId);
    if (!deck) return;
    if (!deck.cards.length) {
      this.fcDeckId = deckId;
      this.setFcView("deck");
      this.showToast("Add a few cards to this deck first", "info");
      return;
    }
    let queue = this.deckDueCards(deck);
    const practice = queue.length === 0;
    if (practice) queue = deck.cards.slice();
    queue = queue.map(c => c.id);
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    this.fcDeckId = deckId;
    this.fcSession = { deckId, queue, index: 0, total: queue.length, done: 0, again: 0, good: 0, easy: 0, flipped: false, practice, finished: false };
    if (this.currentTab !== "flashcards") {
      this.fcView = "study";
      this.switchTab("flashcards");
    } else {
      this.setFcView("study");
    }
    this.renderStudyCard();
  }

  reviewDueCards() {
    const deck = this.decks
      .map(d => ({ d, due: this.deckDueCards(d).length }))
      .filter(x => x.due > 0)
      .sort((a, b) => b.due - a.due)[0];
    if (deck) this.startStudy(deck.d.id);
    else {
      this.switchTab("flashcards");
      this.showToast(this.decks.length ? "Nothing due — you're all caught up" : "Create a deck to start reviewing", "info");
    }
  }

  renderStudyCard() {
    const s = this.fcSession;
    const deck = s && this.decks.find(d => d.id === s.deckId);
    if (!s || !deck) return;
    const card = deck.cards.find(c => c.id === s.queue[s.index]);
    if (!card) {
      this.finishStudy();
      return;
    }
    s.flipped = false;
    document.getElementById("fc-study-stage")?.classList.remove("hidden");
    document.getElementById("fc-study-done")?.classList.add("hidden");
    const flip = document.getElementById("fc-flip-card");
    flip?.classList.remove("is-flipped");
    document.getElementById("fc-front-text").textContent = card.front;
    document.getElementById("fc-back-text").textContent = card.back;
    document.getElementById("fc-front-label").textContent = deck.name;
    document.getElementById("fc-grade-buttons")?.classList.add("is-hidden");
    document.getElementById("fc-study-bar").style.width = `${(s.done / s.total) * 100}%`;
    document.getElementById("fc-study-count").textContent = `${Math.min(s.done + 1, s.total)} / ${s.total}`;

    const intervals = StudyBuddyApp.FC_INTERVALS;
    const goodDays = intervals[Math.min(5, card.box + 1)];
    const easyDays = intervals[Math.min(5, card.box + 2)];
    document.getElementById("fc-int-again").textContent = "1 · again today";
    document.getElementById("fc-int-good").textContent = `2 · ${this.fcIntervalLabel(goodDays)}`;
    document.getElementById("fc-int-easy").textContent = `3 · ${this.fcIntervalLabel(easyDays)}`;

    Motion.animate(flip, [
      { opacity: 0, transform: "translateX(48px) rotate(3deg) scale(0.96)" },
      { opacity: 1, transform: "none" }
    ], { duration: 420, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
    flip?.focus({ preventScroll: true });
  }

  flipStudyCard() {
    const s = this.fcSession;
    if (!s || s.finished) return;
    s.flipped = !s.flipped;
    document.getElementById("fc-flip-card")?.classList.toggle("is-flipped", s.flipped);
    if (s.flipped) document.getElementById("fc-grade-buttons")?.classList.remove("is-hidden");
  }

  gradeStudyCard(grade) {
    const s = this.fcSession;
    const deck = s && this.decks.find(d => d.id === s.deckId);
    const card = deck?.cards.find(c => c.id === s.queue[s.index]);
    if (!s || !card || !s.flipped || s.busy) return;
    const intervals = StudyBuddyApp.FC_INTERVALS;
    if (grade === "again") {
      card.box = 0;
      card.due = this.toDateKey(new Date());
      card.lapses = (Number(card.lapses) || 0) + 1;
      s.again++;
      s.queue.push(card.id); // see it again later in this session
    } else {
      card.box = Math.min(5, card.box + (grade === "easy" ? 2 : 1));
      card.due = this.fcAddDays(intervals[card.box]);
      s[grade]++;
      s.done++;
    }
    card.reviews = (Number(card.reviews) || 0) + 1;
    card.lastReviewed = this.toDateKey(new Date());
    this.recordActivity();
    this.schedulePersist();

    s.busy = true;
    const flip = document.getElementById("fc-flip-card");
    const dir = grade === "again" ? -1 : 1;
    const anim = Motion.animate(flip, [
      { opacity: 1, transform: flip?.classList.contains("is-flipped") ? "none" : "none" },
      { opacity: 0, transform: `translateX(${dir * -60}px) rotate(${dir * -4}deg) scale(0.95)` }
    ], { duration: 260, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
    const next = () => {
      anim?.cancel();
      s.busy = false;
      s.index++;
      if (s.index >= s.queue.length) this.finishStudy();
      else this.renderStudyCard();
    };
    if (anim) anim.finished.then(next).catch(next);
    else next();
  }

  finishStudy() {
    const s = this.fcSession;
    if (!s) return;
    s.finished = true;
    const deck = this.decks.find(d => d.id === s.deckId);
    document.getElementById("fc-study-stage")?.classList.add("hidden");
    const done = document.getElementById("fc-study-done");
    done?.classList.remove("hidden");
    document.getElementById("fc-study-bar").style.width = "100%";
    document.getElementById("fc-study-count").textContent = `${s.total} / ${s.total}`;
    document.getElementById("fc-done-title").textContent = s.practice ? "Practice round done" : "All caught up!";
    const nextDue = deck ? deck.cards.map(c => c.due).filter(Boolean).sort()[0] : null;
    const nextDays = nextDue ? this.daysUntil(nextDue) : null;
    document.getElementById("fc-done-text").textContent = nextDays !== null && nextDays > 0
      ? `Your next review for this deck is ${this.fcIntervalLabel(nextDays)}.`
      : "Come back later to keep these fresh.";
    document.getElementById("fc-done-stats").innerHTML = `
      <div><strong>${s.total}</strong><span>cards</span></div>
      <div><strong>${s.good + s.easy}</strong><span>remembered</span></div>
      <div><strong>${s.again}</strong><span>to repeat</span></div>`;
    Motion.animate(done, [{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
    this.playSound("success");
    this.celebrate(done);
    this.renderBadges();
  }

  endStudy() {
    if (!this.fcSession) return;
    this.fcSession = null;
    this.setFcView(this.fcDeckId && this.decks.some(d => d.id === this.fcDeckId) ? "deck" : "decks");
  }

  renderFlashcards() {
    const views = {
      decks: document.getElementById("fc-decks-view"),
      deck: document.getElementById("fc-deck-view"),
      study: document.getElementById("fc-study-view")
    };
    if (!views.decks) return;
    if (this.fcView === "deck" && !this.decks.some(d => d.id === this.fcDeckId)) this.fcView = "decks";
    if (this.fcView === "study" && !this.fcSession) this.fcView = this.decks.some(d => d.id === this.fcDeckId) ? "deck" : "decks";
    Object.entries(views).forEach(([name, el]) => el?.classList.toggle("hidden", name !== this.fcView));

    if (this.fcView === "decks") this.renderDeckGrid();
    else if (this.fcView === "deck") this.renderDeckDetail();
  }

  renderDeckGrid() {
    const grid = document.getElementById("deck-grid");
    const empty = document.getElementById("decks-empty-state");
    const summary = document.getElementById("fc-summary");
    if (!grid) return;
    const totalCards = this.decks.reduce((sum, d) => sum + d.cards.length, 0);
    const due = this.totalDueCards();
    if (summary) summary.textContent = this.decks.length ? `${totalCards} cards · ${due} due today` : "";

    const q = this.deckSearch;
    const decks = this.decks.filter(d => !q ||
      d.name.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q) ||
      d.cards.some(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)));

    if (!decks.length) {
      grid.innerHTML = "";
      document.getElementById("decks-empty-title").textContent = this.decks.length ? "No matching decks" : "Make your first deck";
      document.getElementById("decks-empty-text").textContent = this.decks.length
        ? "Try another word — search looks inside cards too."
        : "Turn definitions, formulas and dates into flashcards. StudyBuddy schedules reviews so the cards you struggle with come back sooner.";
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");

    grid.innerHTML = decks.map(deck => {
      const dueCount = this.deckDueCards(deck).length;
      const mastered = deck.cards.filter(c => c.box >= 4).length;
      const avgBox = deck.cards.length ? deck.cards.reduce((s, c) => s + c.box, 0) / deck.cards.length : 0;
      const segments = Math.round(avgBox);
      return `
        <article class="deck-card" data-deck-id="${this.escapeHTML(deck.id)}" style="--subj: ${this.subjectColor(deck.subject || deck.name)}" tabindex="0" aria-label="${this.escapeHTML(deck.name)}">
          <div class="deck-top">
            <span class="deck-icon"><i class="fa-solid fa-layer-group"></i></span>
            <div style="flex: 1; min-width: 0;">
              <div class="deck-name">${this.escapeHTML(deck.name)}</div>
              ${deck.subject ? `<span class="chip" style="--subj: ${this.subjectColor(deck.subject)}; margin-top: .35rem">${this.escapeHTML(deck.subject)}</span>` : ""}
            </div>
            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" aria-label="Delete deck" title="Delete deck"><i class="fa-regular fa-trash-can"></i></button>
          </div>
          <div class="deck-stats">
            <span><strong>${deck.cards.length}</strong>cards</span>
            <span class="${dueCount ? "is-due" : ""}"><strong>${dueCount}</strong>due today</span>
            <span><strong>${mastered}</strong>mastered</span>
          </div>
          <div class="deck-mastery" title="Average memory strength: ${avgBox.toFixed(1)} / 5">
            ${[1, 2, 3, 4, 5].map(i => `<span class="${i <= segments ? "on" : ""}"></span>`).join("")}
          </div>
          <div class="deck-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="study"><i class="fa-solid fa-play"></i> ${dueCount ? `Review ${dueCount}` : deck.cards.length ? "Practice" : "Add cards"}</button>
            <button type="button" class="btn btn-sm btn-outline" data-action="manage"><i class="fa-regular fa-clone"></i> Cards</button>
          </div>
        </article>
      `;
    }).join("");
  }

  renderDeckDetail() {
    const deck = this.decks.find(d => d.id === this.fcDeckId);
    if (!deck) return;
    document.getElementById("fc-deck-title").textContent = deck.name;
    const due = this.deckDueCards(deck).length;
    const label = document.getElementById("fc-study-label");
    if (label) label.textContent = due ? `Review ${due} due` : "Practice all";
    const studyBtn = document.getElementById("fc-study-btn");
    if (studyBtn) studyBtn.disabled = deck.cards.length === 0;

    const list = document.getElementById("fc-card-list");
    const empty = document.getElementById("fc-cards-empty");
    if (!list) return;
    if (!deck.cards.length) {
      list.innerHTML = "";
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");
    const today = this.toDateKey(new Date());
    list.innerHTML = deck.cards.map(card => {
      const isDue = !card.due || card.due <= today;
      const days = this.daysUntil(card.due);
      return `
        <div class="fc-row" data-card-id="${this.escapeHTML(card.id)}" role="button" tabindex="0">
          <div class="fc-row-front">${this.escapeHTML(card.front)}</div>
          <div class="fc-row-back">${this.escapeHTML(card.back)}</div>
          <span class="box-badge b${card.box}" title="Memory strength ${card.box}/5">${card.reviews ? (isDue ? "Due now" : `Next ${this.fcIntervalLabel(days)}`) : "New"}</span>
          <div class="fc-row-actions">
            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger" data-action="delete" aria-label="Delete card" title="Delete card"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    }).join("");
  }

  // ===========================================================================
  // 12. Helper Utilities
  // ===========================================================================
  formatDueDateBadge(dueDateStr) {
    const days = this.daysUntil(dueDateStr);
    if (days === null) return { text: "No due date", isOverdue: false, isToday: false, days: null };
    if (days < 0) {
      const n = Math.abs(days);
      return { text: `Overdue by ${n} day${n === 1 ? "" : "s"}`, isOverdue: true, isToday: false, days };
    }
    if (days === 0) return { text: "Due today", isOverdue: false, isToday: true, days };
    if (days === 1) return { text: "Due tomorrow", isOverdue: false, isToday: false, days };
    const date = new Date(`${dueDateStr}T00:00:00`);
    if (days < 7) {
      return { text: `Due ${date.toLocaleDateString("en-US", { weekday: "long" })}`, isOverdue: false, isToday: false, days };
    }
    const sameYear = date.getFullYear() === new Date().getFullYear();
    const label = date.toLocaleDateString("en-US", sameYear ? { month: "short", day: "numeric" } : { month: "short", day: "numeric", year: "numeric" });
    return { text: `Due ${label} · ${days} days`, isOverdue: false, isToday: false, days };
  }

  calculateDuration(start, end) {
    try {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60; // Overnight wrap
      return this.formatMinutes(diff);
    } catch (e) {
      return "1h";
    }
  }

  /** 95 -> "1h 35m", 45 -> "45m", 120 -> "2h". */
  formatMinutes(total) {
    const mins = Math.max(0, Math.round(Number(total) || 0));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  }

  /** "14:30" -> "2:30 PM" */
  formatHM(hm) {
    if (!hm) return "";
    const [h, m] = String(hm).split(":").map(Number);
    if (isNaN(h)) return String(hm);
    const d = new Date();
    d.setHours(h, m || 0, 0, 0);
    return this.formatClock(d);
  }

  /** "14:30" -> "2:30p", "09:00" -> "9a" — for tight calendar cells. */
  formatHMShort(hm) {
    if (!hm) return "";
    const [h, m] = String(hm).split(":").map(Number);
    if (isNaN(h)) return "";
    const suffix = h < 12 ? "a" : "p";
    const h12 = h % 12 || 12;
    return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
  }

  /** Stable colour for a subject name, picked from the 8 subject hues. */
  subjectColor(subject) {
    const name = String(subject || "General").trim().toLowerCase();
    let hash = 2166136261;
    for (let i = 0; i < name.length; i++) {
      hash ^= name.charCodeAt(i);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return `var(--hue-${hash % 8})`;
  }

  /** Escapes a location and turns a bare http(s) link into a clickable one. */
  linkifyLocation(location) {
    const text = String(location || "");
    const match = text.match(/https?:\/\/[^\s]+/);
    if (!match) return this.escapeHTML(text);
    const url = match[0];
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + url.length);
    let host = url;
    try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (e) { /* keep raw */ }
    return `${this.escapeHTML(before)}<a href="${this.escapeHTML(url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${this.escapeHTML(host)}</a>${this.escapeHTML(after)}`;
  }

  playSound(kind) {
    if (this.settings && this.settings.sounds === false) return;
    if (kind === "chime") SoundFX.playChime();
    else SoundFX.playSuccess();
  }

  /** Confetti burst — from `origin` (an element) when given, else the screen centre. */
  celebrate(origin = null) {
    if (this.settings && this.settings.confetti === false) return;
    let x;
    let y;
    if (origin && typeof origin.getBoundingClientRect === "function") {
      const r = origin.getBoundingClientRect();
      if (r.width) {
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
      }
    }
    ConfettiFX.launch(x, y);
  }

  escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// =============================================================================
// 13. Bootstrap: Google Sign-In Gate & App Startup
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

  toggle(origin) {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    Motion.themeSwitch(() => this.set(current === "dark" ? "light" : "dark", true), origin);
  },

  set(theme, persist) {
    const value = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);

    // Keep every toggle button's icon in sync (sun while dark, moon while light).
    const icon = value === "dark" ? "fa-sun" : "fa-moon";
    document.querySelectorAll(".theme-toggle-btn i").forEach(el => {
      el.classList.remove("fa-sun", "fa-moon", "spin");
      el.classList.add(icon);
      if (persist) {
        void el.offsetWidth;
        el.classList.add("spin");
      }
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
    window.studyBuddy.updateNavIndicator(true);
    window.studyBuddy.playEnter();
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
  document.getElementById("theme-toggle-auth")?.addEventListener("click", (e) => ThemeBootstrap.toggle(e.currentTarget));

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
