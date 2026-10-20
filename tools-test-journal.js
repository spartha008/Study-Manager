/**
 * End-to-end smoke test for the Journal feature (run: node tools-test-journal.js).
 * Serves this folder, drives real Edge (headless) and asserts the full flow:
 * create password + recovery question -> write -> encrypt -> cloud blob ->
 * lock/unlock -> backup file -> restore -> change password -> auto-lock ->
 * forgot-password reset via the security answer -> v1 blob upgrade.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const root = __dirname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

let passed = 0;
let failed = 0;
const check = (name, cond, extra = "") => {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}${extra ? "  [" + extra + "]" : ""}`); }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const pageErrors = [];
  page.on("pageerror", e => pageErrors.push(String(e)));

  // Block third-party CDNs (fonts/icons/supabase) — this test is about local logic.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => typeof StudyBuddyApp !== "undefined");

  // Boot an app instance with no cloud session; persist() is a no-op without a user.
  await page.evaluate(() => {
    ["auth-screen", "auth-loading"].forEach(id => document.getElementById(id)?.classList.add("hidden"));
    window.app = new StudyBuddyApp();
    document.getElementById("app-layout").classList.remove("hidden");
  });

  console.log("\n1. Opening the journal tab shows the lock screen (first run = create)");
  await page.click('.nav-item[data-tab="journal"]');
  check("lock card visible", await page.isVisible("#journal-lock"));
  check("editor hidden", !(await page.isVisible("#journal-view")));
  check("create copy", (await page.textContent("#journal-lock-title")).includes("Create your journal password"));
  check("confirm field shown", await page.isVisible("#journal-password-confirm"));
  check("security question asked at creation", await page.isVisible("#journal-question-block"));
  check("forgot link hidden before there is a journal", !(await page.isVisible("#journal-forgot-btn")));

  console.log("\n2. Password rules are enforced");
  await page.fill("#journal-password-input", "secret12");
  await page.fill("#journal-password-confirm", "mismatch1");
  await page.click("#journal-lock-submit");
  await sleep(150);
  const mismatchErr = await page.textContent("#journal-lock-error");
  check("mismatch reported", mismatchErr.includes("don't match"), mismatchErr);
  check("still locked", !(await page.isVisible("#journal-view")));

  await page.fill("#journal-password-input", "secret12");
  await page.fill("#journal-password-confirm", "secret12");
  await page.click("#journal-lock-submit");
  await sleep(150);
  const noQuestionErr = await page.textContent("#journal-lock-error");
  check("security question required", noQuestionErr.includes("security question"), noQuestionErr);

  console.log("\n3. Creating the journal derives a key and seals the blob");
  await page.fill("#journal-password-input", "secret12");
  await page.fill("#journal-password-confirm", "secret12");
  await page.selectOption("#journal-question-select", { label: "What city were you born in?" });
  await page.fill("#journal-answer-input", "Cairo");
  await page.fill("#journal-answer-confirm", "Cairo");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("unlocked", await page.isVisible("#journal-view"));
  const sealed = await page.evaluate(() => window.app.journalBlob);
  check("blob v2: sealed data + wrapped key",
    Boolean(sealed && sealed.v === 2 && sealed.pw?.salt && sealed.pw?.verifier && sealed.data?.iv && sealed.data?.data),
    JSON.stringify(Object.keys(sealed || {})));
  check("recovery wrapper stored alongside",
    sealed?.recovery?.question === "What city were you born in?" && Boolean(sealed.recovery?.key));
  check("no plaintext words in the blob", !JSON.stringify(sealed).toLowerCase().includes("hello"));

  console.log("\n4. Writing today's entry (mood + title + body) and saving");
  await page.fill("#journal-title-input", "Today's page");
  await page.fill("#journal-body-input", "Hello journal day one, encrypted from the start.");
  await page.click('.journal-mood-btn[data-mood="3"]');
  await page.click("#journal-save-btn");
  await page.waitForFunction(() => window.app.journalEntries.length === 1, null, { timeout: 5000 });
  const wordCount = await page.textContent("#journal-word-count");
  check("word count updates", wordCount.includes("8 words"), wordCount);
  check("mood stored", await page.evaluate(() => window.app.journalEntries[0].mood === 3));
  check("streak badge", (await page.textContent("#journal-streak-badge")).includes("1 day"));

  console.log("\n5. Yesterday's entry survives day navigation");
  await page.click("#journal-prev-day-btn");
  await page.fill("#journal-title-input", "Yesterday's page");
  await page.fill("#journal-body-input", "Yesterday words live here too.");
  await page.click("#journal-save-btn");
  await sleep(200);
  await page.click("#journal-today-btn");
  check("today restored", (await page.inputValue("#journal-title-input")) === "Today's page");
  await page.click("#journal-prev-day-btn");
  check("yesterday restored", (await page.inputValue("#journal-title-input")) === "Yesterday's page");
  check("two entries listed", (await page.$$(".journal-entry-item")).length === 2);
  await page.click("#journal-today-btn");

  console.log("\n6. Leaving the tab re-locks it (per your chosen lock behavior)");
  await page.click('.nav-item[data-tab="notes"]');
  check("auto-locked", await page.evaluate(() => window.app.journalUnlocked === false));
  await page.click('.nav-item[data-tab="journal"]');
  check("lock screen on return", await page.isVisible("#journal-lock"));
  check("unlock copy", (await page.textContent("#journal-lock-title")).includes("locked"));

  console.log("\n7. Wrong password is rejected, right password decrypts");
  await page.fill("#journal-password-input", "wrongpass");
  await page.click("#journal-lock-submit");
  await sleep(600);
  const wrongErr = await page.textContent("#journal-lock-error");
  check("wrong password reported", wrongErr.includes("not the password"), wrongErr);
  check("still locked", await page.evaluate(() => window.app.journalUnlocked === false));
  await page.fill("#journal-password-input", "secret12");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("entries recovered", await page.evaluate(() => window.app.journalEntries.length === 2));
  check("today's body recovered",
    (await page.inputValue("#journal-body-input")).includes("Hello journal day one"));

  console.log("\n8. 'Keep unlocked' preference");
  await page.evaluate(() => localStorage.setItem("studybuddy-journal-keep-unlocked", "1"));
  await page.click('.nav-item[data-tab="notes"]');
  check("stays unlocked when opted in", await page.evaluate(() => window.app.journalUnlocked === true));
  await page.evaluate(() => localStorage.setItem("studybuddy-journal-keep-unlocked", "0"));
  await page.click('.nav-item[data-tab="journal"]');
  await page.evaluate(() => localStorage.removeItem("studybuddy-journal-keep-unlocked"));

  console.log("\n9. Encrypted backup file downloads (for Google Drive)");
  await page.click('.nav-item[data-tab="journal"]');
  if (!(await page.isVisible("#journal-view"))) {
    await page.fill("#journal-password-input", "secret12");
    await page.click("#journal-lock-submit");
    await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  }
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.click("#journal-export-btn")
  ]);
  const dlName = download.suggestedFilename();
  check("dated backup filename", /^studybuddy-journal-backup-\d{4}-\d{2}-\d{2}\.json$/.test(dlName), dlName);
  const dlPath = await download.path();
  const backupJson = fs.readFileSync(dlPath, "utf8");
  const backup = JSON.parse(backupJson);
  check("backup is the sealed blob", backup.type === "studybuddy-journal-backup" && Boolean(backup.blob?.data));
  check("backup hides the plaintext", !backupJson.includes("Hello journal day one"));

  console.log("\n10. Restore on a 'fresh device' (no blob stored) asks for the backup password");
  await page.evaluate(() => {
    window.app.lockJournal({ skipSave: true });
    window.app.journalBlob = null;   // simulate another device / cleared storage
    window.app.renderJournal();
  });
  check("create mode again", (await page.textContent("#journal-lock-title")).includes("Create your journal password"));
  const restored = await page.evaluate(async (json) => {
    const file = new File([json], "backup.json", { type: "application/json" });
    await window.app.handleJournalBackupFile(file);
    return window.app.journalLockMode();
  }, backupJson);
  check("switches to restore mode", restored === "restore", restored);
  check("restore copy", (await page.textContent("#journal-lock-title")).includes("Restore a journal backup"));
  await page.fill("#journal-password-input", "secret12");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("backup entries recovered", await page.evaluate(() => window.app.journalEntries.length === 2));
  check("cloud blob restored", await page.evaluate(() => Boolean(window.app.journalBlob?.data)));

  console.log("\n11. Change password re-seals everything");
  await page.click("#journal-change-pass-btn");
  check("modal open", await page.isVisible("#journal-password-modal"));
  await page.fill("#journal-current-password", "secret12");
  await page.fill("#journal-new-password", "newpass99");
  await page.fill("#journal-new-password-confirm", "newpass99");
  await page.click("#save-journal-password-btn");
  await page.waitForFunction(() => !document.getElementById("journal-password-modal").classList.contains("active"), null, { timeout: 10000 });
  check("still unlocked after change", await page.evaluate(() => window.app.journalUnlocked === true));
  await page.click("#journal-lock-btn");
  await page.fill("#journal-password-input", "secret12");
  await page.click("#journal-lock-submit");
  await sleep(600);
  check("old password rejected", (await page.textContent("#journal-lock-error")).includes("not the password"));
  await page.fill("#journal-password-input", "newpass99");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("new password unlocks", await page.evaluate(() => window.app.journalEntries.length === 2));

  console.log("\n12. Leaving the tab one last time re-locks the journal");
  await page.click('.nav-item[data-tab="dashboard"]');
  check("locked", await page.evaluate(() => window.app.journalUnlocked === false && window.app.journalKey === null));
  check("entries wiped from memory", await page.evaluate(() => window.app.journalEntries.length === 0));
  check("encrypted blob still stored", await page.evaluate(() => Boolean(window.app.journalBlob?.data)));

  console.log("\n13. Forgotten password → the security answer resets it");
  await page.click('.nav-item[data-tab="journal"]');
  check("forgot link visible on the lock screen", await page.isVisible("#journal-forgot-btn"));
  await page.click("#journal-forgot-btn");
  check("reset copy", (await page.textContent("#journal-lock-title")).includes("Reset your journal password"));
  check("question shown during reset", (await page.textContent("#journal-question-display")).includes("What city"));
  check("answer confirm hidden during reset", !(await page.isVisible("#journal-answer-confirm")));
  await page.fill("#journal-password-input", "resetpass1");
  await page.fill("#journal-password-confirm", "resetpass1");
  await page.fill("#journal-answer-input", "wrongtown");
  await page.click("#journal-lock-submit");
  await sleep(600);
  const answerErr = await page.textContent("#journal-lock-error");
  check("wrong answer rejected", answerErr.includes("doesn't match"), answerErr);
  check("still locked after wrong answer", await page.evaluate(() => window.app.journalUnlocked === false));
  await page.fill("#journal-password-input", "resetpass1");
  await page.fill("#journal-password-confirm", "resetpass1");
  await page.fill("#journal-answer-input", "  CAIRO ");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("entries intact after reset", await page.evaluate(() => window.app.journalEntries.length === 2));
  check("recovery wrapper survives the reset", await page.evaluate(() => Boolean(window.app.journalBlob?.recovery)));
  await page.click("#journal-lock-btn");
  await page.fill("#journal-password-input", "newpass99");
  await page.click("#journal-lock-submit");
  await sleep(600);
  check("old password rejected after reset", (await page.textContent("#journal-lock-error")).includes("not the password"));
  await page.fill("#journal-password-input", "resetpass1");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("new password unlocks after reset", await page.evaluate(() => window.app.journalEntries.length === 2));

  console.log("\n14. Old (v1) blobs upgrade on unlock and can add a question");
  await page.evaluate(() => window.app.lockJournal({ skipSave: true }));
  const legacyBlob = await page.evaluate(async () => {
    const app = window.app;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const { key, verifier } = await app.journalDerive("legacy1", salt);
    const sealed = await app.journalSeal([{
      id: "jr-legacy",
      date: "2026-01-05",
      mood: 2,
      title: "Legacy page",
      body: "Written in the old format.",
      createdAt: "2026-01-05",
      updatedAt: "2026-01-05"
    }], key);
    return { v: 1, salt: app.journalBytesToB64(salt), verifier, ...sealed, updatedAt: new Date().toISOString() };
  });
  await page.evaluate((blob) => {
    window.app.journalBlob = blob;
    window.app._journalLockMode = null;
    window.app.renderJournal();
  }, legacyBlob);
  check("forgot link hidden without a question", !(await page.isVisible("#journal-forgot-btn")));
  await page.fill("#journal-password-input", "legacy1");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  const upgraded = await page.evaluate(() => window.app.journalBlob);
  check("v1 upgraded to wrapped-key format", upgraded?.v === 2 && Boolean(upgraded.pw?.key), JSON.stringify(Object.keys(upgraded || {})));
  check("no recovery wrapper yet", !upgraded?.recovery);
  check("'set recovery question' button appears", await page.isVisible("#journal-set-question-btn"));
  check("legacy entry decrypted", await page.evaluate(() => window.app.journalEntries[0]?.title === "Legacy page"));

  await page.click("#journal-set-question-btn");
  check("question modal opens", await page.isVisible("#journal-question-modal"));
  await page.selectOption("#jq-question-select", { label: "What was the name of your first pet?" });
  await page.fill("#jq-answer", "Whiskers");
  await page.fill("#jq-answer-confirm", "Whiskers");
  await page.click("#save-journal-question-btn");
  await page.waitForFunction(() => !document.getElementById("journal-question-modal").classList.contains("active"), null, { timeout: 10000 });
  check("recovery wrapper added to the upgraded blob",
    await page.evaluate(() => window.app.journalBlob?.recovery?.question === "What was the name of your first pet?"));

  await page.click("#journal-lock-btn");
  check("forgot link visible once a question exists", await page.isVisible("#journal-forgot-btn"));
  await page.click("#journal-forgot-btn");
  check("new question shown during reset",
    (await page.textContent("#journal-question-display")).includes("first pet"));
  await page.fill("#journal-answer-input", "whiskers");
  await page.fill("#journal-password-input", "petpass77");
  await page.fill("#journal-password-confirm", "petpass77");
  await page.click("#journal-lock-submit");
  await page.waitForFunction(() => window.app.journalUnlocked === true, null, { timeout: 10000 });
  check("legacy journal reset via its question", await page.evaluate(() => window.app.journalEntries.length === 1));
  check("legacy entry still readable",
    await page.evaluate(() => window.app.journalEntries[0]?.body === "Written in the old format."));

  // ---------------------------------------------------------------------------
  // 15. Workspace persistence: the Supabase row is unwrapped on load, load
  // errors surface, and the per-account device mirror rescues an empty row.
  // ---------------------------------------------------------------------------
  console.log("\n15. Cloud workspace persistence (row unwrap + device mirror)");
  const probe = await page.evaluate(async () => {
    const state = {
      tasks: [{
        id: "task-probe", title: "Probe task", subject: "Mathematics", priority: "high",
        dueDate: "2026-10-25", estimatedTime: "60", description: "", completed: false,
        createdAt: "2026-10-20T10:00:00.000Z"
      }],
      timetable: [],
      notes: [],
      events: [],
      marks: [{
        id: "mark-probe", title: "Probe exam", subject: "Physics", date: "2026-10-19",
        score: 91, maxMarks: 100, type: "Exam", weight: "20", notes: "",
        createdAt: "2026-10-19T10:00:00.000Z"
      }],
      journal: { v: 2, data: { iv: "x", data: "y" }, pw: { salt: "s", verifier: "v", iv: "i", key: "k" } },
      focusMinutes: 12,
      pomodoroSessions: 3,
      activeDates: ["2026-10-20"]
    };
    const session = { user: { id: "u-probe", user_metadata: { full_name: "Probe User" } } };

    // A real Supabase response: { data: { data: <workspace jsonb> }, error: null }.
    RemoteStore.load = async () => ({ data: { data: JSON.parse(JSON.stringify(state)) }, error: null });
    RemoteStore.save = async () => ({ data: null, error: null });

    const a1 = new StudyBuddyApp();
    await a1.startSession(session);
    document.getElementById("auth-loading")?.classList.add("hidden");
    const fromCloud = {
      tasks: a1.tasks.length,
      marks: a1.marks.length,
      journal: Boolean(a1.journalBlob),
      focus: a1.focusMinutes
    };

    // Cloud now reports no row at all (e.g. an older build never saved):
    // the per-account device mirror written above must bring the data back.
    RemoteStore.load = async () => ({ data: null, error: null });
    const a2 = new StudyBuddyApp();
    await a2.startSession(session);
    document.getElementById("auth-loading")?.classList.add("hidden");
    const fromMirror = { tasks: a2.tasks.length, marks: a2.marks.length, journal: Boolean(a2.journalBlob) };

    // A load error must surface as an actionable message, not boot empty.
    let loadThrew = false;
    RemoteStore.load = async () => ({
      data: null,
      error: { message: "Could not find the table 'public.studybuddy_state' in the schema cache" }
    });
    try {
      await new StudyBuddyApp().startSession(session);
    } catch (e) {
      loadThrew = /database table is missing/i.test(e.message || "");
    }
    document.getElementById("auth-loading")?.classList.add("hidden");

    return { fromCloud, fromMirror, loadThrew };
  });
  check("cloud row unwrapped: tasks restored", probe.fromCloud.tasks === 1, JSON.stringify(probe.fromCloud));
  check("cloud row unwrapped: marks restored", probe.fromCloud.marks === 1);
  check("cloud row unwrapped: journal blob + stats restored",
    probe.fromCloud.journal === true && probe.fromCloud.focus === 12);
  check("device mirror rescues an empty cloud row",
    probe.fromMirror.tasks === 1 && probe.fromMirror.marks === 1 && probe.fromMirror.journal === true,
    JSON.stringify(probe.fromMirror));
  check("load errors surface as an actionable message", probe.loadThrew === true);

  // Remove the probe account's mirror so it can't leak into anything else.
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("studybuddy-workspace-mirror:")) localStorage.removeItem(k);
    }
  });

  const realErrors = pageErrors.filter(e => !/supabase|Failed to fetch|network|abort/i.test(e));
  check("no unexpected page errors", realErrors.length === 0, realErrors.join(" | "));

  await browser.close();
  server.close();

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(err => {
  console.error("Test crashed:", err);
  server.close();
  process.exit(1);
});
