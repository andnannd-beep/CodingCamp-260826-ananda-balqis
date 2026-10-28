/**
 * The Tortured Poets Dashboard
 * ─────────────────────────────────────────────────────────────────
 * Vanilla JS · localStorage persistence · No frameworks
 *
 * Modules (in order):
 *  1. Utilities
 *  2. Theme (light / dark)
 *  3. Clock & Greeting
 *  4. Focus Timer (Pomodoro)
 *  5. To-Do List
 *  6. Quick Links
 *  7. Init
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. UTILITIES
═══════════════════════════════════════════════════════════════ */

/**
 * Safe localStorage get — returns parsed JSON or fallback on error.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safe localStorage set — silently ignores write errors (private mode, quota, etc.).
 * @param {string} key
 * @param {*} value
 */
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — degrade gracefully
  }
}

/**
 * Show or hide an element using display style.
 * @param {HTMLElement} el
 * @param {boolean}     visible
 * @param {string}      [displayVal]  — e.g. 'flex', 'block' (default 'block')
 */
function show(el, visible, displayVal) {
  if (!el) return;
  el.style.display = visible ? (displayVal || 'block') : 'none';
}

/**
 * Show an accessible error message on an element.
 * @param {HTMLElement} el   — the error <p> element
 * @param {string}      msg  — message string (empty to clear)
 */
function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  show(el, !!msg);
}

/**
 * Sanitise text to prevent XSS when injecting into the DOM.
 * Uses textContent assignment — never innerHTML with raw user input.
 * @param {string} str
 * @returns {string}
 */
function sanitise(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Add a one-shot CSS animation class and remove it after the animation ends.
 * @param {HTMLElement} el
 * @param {string}      cls
 */
function animateOnce(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  // Force reflow so removing+adding the same class re-triggers the animation
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}


/* ═══════════════════════════════════════════════════════════════
   2. THEME  (light / dark)
═══════════════════════════════════════════════════════════════ */

const ThemeModule = (() => {
  const STORAGE_KEY = 'ttpd-theme';
  const toggleBtn   = document.getElementById('theme-toggle');
  const iconSun     = document.getElementById('icon-sun');
  const iconMoon    = document.getElementById('icon-moon');

  /**
   * Apply a theme without touching localStorage.
   * @param {'light'|'dark'} theme
   */
  function apply(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(isDark));
      toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (iconSun)  iconSun.style.display  = isDark ? 'block' : 'none';
    if (iconMoon) iconMoon.style.display = isDark ? 'none'  : 'block';
  }

  function toggle() {
    const current = storageGet(STORAGE_KEY, 'light');
    const next    = current === 'dark' ? 'light' : 'dark';
    storageSet(STORAGE_KEY, next);
    apply(next);
  }

  function init() {
    // Respect stored preference, then OS preference, then default to light
    const stored = storageGet(STORAGE_KEY, null);
    let theme;
    if (stored === 'dark' || stored === 'light') {
      theme = stored;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    apply(theme);

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   3. CLOCK & GREETING
═══════════════════════════════════════════════════════════════ */

const ClockModule = (() => {
  const STORAGE_KEY   = 'ttpd-name';
  const clockTimeEl   = document.getElementById('clock-time');
  const clockDateEl   = document.getElementById('clock-date');
  const greetingEl    = document.getElementById('greeting-text');
  const nameForm      = document.getElementById('name-form');
  const nameInput     = document.getElementById('name-input');
  const nameError     = document.getElementById('name-error');

  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  /**
   * Return a greeting string based on hour (0–23).
   * @param {number} hour
   * @param {string} name  — empty string if not set
   * @returns {string}
   */
  function buildGreeting(hour, name) {
    let salutation;
    if (hour >= 5  && hour < 12) salutation = 'Good morning';
    else if (hour >= 12 && hour < 17) salutation = 'Good afternoon';
    else if (hour >= 17 && hour < 21) salutation = 'Good evening';
    else                               salutation = 'Good night';

    return name ? `${salutation}, ${name}.` : `${salutation}.`;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    const s    = now.getSeconds();

    // Clock display (12-hour with AM/PM)
    const h12  = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    if (clockTimeEl) {
      clockTimeEl.textContent = `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
    }

    // Date line
    if (clockDateEl) {
      clockDateEl.textContent =
        `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    }

    // Greeting (only update the text, preserving element attributes)
    if (greetingEl) {
      const name = storageGet(STORAGE_KEY, '');
      greetingEl.textContent = buildGreeting(h, name);
    }
  }

  function saveName(e) {
    e.preventDefault();
    const raw  = nameInput ? nameInput.value : '';
    const name = raw.trim();

    if (!name) {
      showError(nameError, 'Please enter your name.');
      nameInput && nameInput.focus();
      return;
    }
    if (name.length > 40) {
      showError(nameError, 'Name must be 40 characters or fewer.');
      return;
    }

    showError(nameError, '');
    storageSet(STORAGE_KEY, name);
    tick(); // update greeting immediately

    if (nameInput) nameInput.value = '';
  }

  function init() {
    // Pre-fill input if a name is stored
    const stored = storageGet(STORAGE_KEY, '');
    if (nameInput && stored) nameInput.placeholder = `Currently: ${stored}`;

    tick();
    setInterval(tick, 1000);

    if (nameForm) nameForm.addEventListener('submit', saveName);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   4. FOCUS TIMER  (Pomodoro)
═══════════════════════════════════════════════════════════════ */

const TimerModule = (() => {
  const displayEl       = document.getElementById('timer-display');
  const statusLabelEl   = document.getElementById('timer-status-label');
  const ringEl          = document.getElementById('timer-ring');
  const finishedBanner  = document.getElementById('timer-finished-banner');
  const startBtn        = document.getElementById('timer-start');
  const stopBtn         = document.getElementById('timer-stop');
  const resetBtn        = document.getElementById('timer-reset');
  const durationInput   = document.getElementById('timer-duration-input');
  const setDurationBtn  = document.getElementById('timer-set-duration');
  const durationError   = document.getElementById('timer-duration-error');

  // SVG ring geometry
  const CIRCUMFERENCE = 2 * Math.PI * 54; // r = 54 → ≈ 339.29

  // Timer state
  let totalSeconds  = 25 * 60;  // default 25 min
  let remaining     = totalSeconds;
  let intervalId    = null;      // single interval reference
  let isRunning     = false;

  /** Format seconds into MM:SS */
  function fmt(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /** Update the SVG progress ring */
  function updateRing(secs) {
    if (!ringEl) return;
    const progress  = secs / totalSeconds;           // 1 = full, 0 = empty
    const offset    = CIRCUMFERENCE * (1 - progress);
    ringEl.style.strokeDashoffset = offset;
  }

  /** Sync UI to current state */
  function render() {
    if (displayEl)     displayEl.textContent  = fmt(remaining);
    if (displayEl)     displayEl.setAttribute('aria-label', `${fmt(remaining)} remaining`);
    if (statusLabelEl) statusLabelEl.textContent = isRunning ? 'Running' : (remaining === 0 ? "Done" : 'Paused');
    updateRing(remaining);

    // Button states
    if (startBtn)  startBtn.disabled = isRunning || remaining === 0;
    if (stopBtn)   stopBtn.disabled  = !isRunning;
    if (resetBtn)  resetBtn.disabled = false;

    // Finished banner
    if (finishedBanner) {
      show(finishedBanner, remaining === 0);
      if (remaining === 0) {
        finishedBanner.classList.add('timer-pulse');
      } else {
        finishedBanner.classList.remove('timer-pulse');
      }
    }
  }

  /** Advance the timer by one second */
  function tick() {
    if (remaining <= 0) {
      finish();
      return;
    }
    remaining -= 1;
    render();
    if (remaining === 0) finish();
  }

  function finish() {
    clearInterval(intervalId);
    intervalId = null;
    isRunning  = false;
    remaining  = 0;
    render();
    if (statusLabelEl) statusLabelEl.textContent = 'Done!';
    // Notify screen readers
    if (finishedBanner) finishedBanner.focus && finishedBanner.focus();
  }

  function start() {
    if (isRunning || remaining === 0) return;
    // Guard: clear any stale interval before creating a new one
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning  = true;
    intervalId = setInterval(tick, 1000);
    render();
  }

  function stop() {
    if (!isRunning) return;
    clearInterval(intervalId);
    intervalId = null;
    isRunning  = false;
    render();
    if (statusLabelEl) statusLabelEl.textContent = 'Paused';
  }

  function reset() {
    clearInterval(intervalId);
    intervalId = null;
    isRunning  = false;
    remaining  = totalSeconds;
    render();
    if (statusLabelEl) statusLabelEl.textContent = 'Ready';
  }

  function setDuration() {
    const raw = durationInput ? parseInt(durationInput.value, 10) : NaN;
    if (isNaN(raw) || raw < 1 || raw > 90) {
      showError(durationError, 'Enter a number between 1 and 90.');
      return;
    }
    showError(durationError, '');
    if (isRunning) stop();
    totalSeconds = raw * 60;
    remaining    = totalSeconds;
    render();
    if (statusLabelEl) statusLabelEl.textContent = 'Ready';
  }

  function init() {
    render();
    if (startBtn)       startBtn.addEventListener('click', start);
    if (stopBtn)        stopBtn.addEventListener('click', stop);
    if (resetBtn)       resetBtn.addEventListener('click', reset);
    if (setDurationBtn) setDurationBtn.addEventListener('click', setDuration);
    if (durationInput) {
      durationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); setDuration(); }
      });
    }
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   5. TO-DO LIST
═══════════════════════════════════════════════════════════════ */

const TodoModule = (() => {
  const STORAGE_KEY = 'ttpd-todos';

  const formEl      = document.getElementById('todo-form');
  const inputEl     = document.getElementById('todo-input');
  const errorEl     = document.getElementById('todo-error');
  const listEl      = document.getElementById('todo-list');
  const emptyEl     = document.getElementById('todo-empty');
  const countEl     = document.getElementById('todo-count');
  const filterBtns  = document.querySelectorAll('.todo-filter-btn');

  // Edit modal elements
  const editModal    = document.getElementById('edit-modal');
  const editBackdrop = document.getElementById('edit-modal-backdrop');
  const editForm     = document.getElementById('edit-form');
  const editInput    = document.getElementById('edit-input');
  const editError    = document.getElementById('edit-error');
  const editCancel   = document.getElementById('edit-cancel');

  /** @type {Array<{id: string, text: string, done: boolean, createdAt: number}>} */
  let todos  = [];
  let filter = 'all';   // 'all' | 'active' | 'done'
  let editingId = null; // id of the task currently being edited

  /* ── Persistence ── */

  function load() {
    const raw = storageGet(STORAGE_KEY, []);
    // Validate shape — filter out malformed entries
    todos = Array.isArray(raw)
      ? raw.filter(t =>
          t && typeof t.id === 'string' &&
          typeof t.text === 'string' &&
          typeof t.done === 'boolean'
        )
      : [];
  }

  function save() {
    storageSet(STORAGE_KEY, todos);
  }

  /* ── Helpers ── */

  function generateId() {
    return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  /**
   * Check whether a task text already exists (case- and space-insensitive).
   * @param {string} text
   * @param {string} [excludeId]  — skip this id when editing
   */
  function isDuplicate(text, excludeId = null) {
    const norm = text.trim().toLowerCase();
    return todos.some(t => t.id !== excludeId && t.text.trim().toLowerCase() === norm);
  }

  /* ── Render ── */

  function getFiltered() {
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'done')   return todos.filter(t => t.done);
    return todos;
  }

  function render() {
    if (!listEl) return;

    const visible = getFiltered();

    // Update count badge
    const total  = todos.length;
    const active = todos.filter(t => !t.done).length;
    if (countEl) {
      countEl.textContent = `${active} active / ${total} total`;
    }

    // Toggle empty state
    const isEmpty = visible.length === 0;
    if (emptyEl) show(emptyEl, isEmpty, 'flex');
    if (listEl)  show(listEl,  !isEmpty, 'flex');

    // Clear and re-render (simple approach — fine for typical list sizes)
    listEl.innerHTML = '';

    visible.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item fade-in group${todo.done ? ' completed' : ''}`;
      li.dataset.id = todo.id;
      li.setAttribute('role', 'listitem');

      // Accessible label combines state and text for screen readers
      const srLabel = `Task: ${todo.text}. ${todo.done ? 'Completed.' : 'Active.'}`;

      li.innerHTML = `
        <input type="checkbox"
               class="checkbox-custom"
               id="check-${sanitise(todo.id)}"
               ${todo.done ? 'checked' : ''}
               aria-label="${sanitise(srLabel)}" />
        <label for="check-${sanitise(todo.id)}"
               class="todo-text">
          ${sanitise(todo.text)}
        </label>
        <div class="todo-item-actions">
          <button class="btn-ghost todo-edit"
                  aria-label="Edit task: ${sanitise(todo.text)}"
                  title="Edit task"
                  data-id="${sanitise(todo.id)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H6v-3a4 4 0 011.172-2.828z"/>
            </svg>
          </button>
          <button class="btn-danger todo-delete"
                  aria-label="Delete task: ${sanitise(todo.text)}"
                  title="Delete task"
                  data-id="${sanitise(todo.id)}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `;

      listEl.appendChild(li);
    });
  }

  /* ── Add ── */

  function addTask(e) {
    e.preventDefault();
    if (!inputEl) return;

    const text = inputEl.value.trim();

    if (!text) {
      showError(errorEl, 'Please write a task first.');
      inputEl.focus();
      return;
    }
    if (isDuplicate(text)) {
      showError(errorEl, 'This task already exists — try a different name.');
      inputEl.focus();
      return;
    }

    showError(errorEl, '');
    todos.unshift({
      id:        generateId(),
      text:      text,
      done:      false,
      createdAt: Date.now(),
    });
    save();
    render();
    inputEl.value = '';
    inputEl.focus();
  }

  /* ── Toggle complete ── */

  function toggleDone(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.done = !todo.done;
    save();
    render();

    // Animate the checkbox
    const checkbox = listEl && listEl.querySelector(`#check-${id}`);
    if (checkbox) animateOnce(checkbox, 'check-pop');
  }

  /* ── Delete ── */

  function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }

  /* ── Edit (modal) ── */

  function openEditModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo || !editModal || !editInput) return;

    editingId         = id;
    editInput.value   = todo.text;
    showError(editError, '');
    editModal.style.display = 'flex';
    editModal.removeAttribute('aria-hidden');

    // Focus the input after a frame for animation smoothness
    requestAnimationFrame(() => editInput.focus());
  }

  function closeEditModal() {
    if (!editModal) return;
    editModal.style.display = 'none';
    editModal.setAttribute('aria-hidden', 'true');
    editingId = null;
    showError(editError, '');
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editInput) return;

    const text = editInput.value.trim();

    if (!text) {
      showError(editError, 'Task text cannot be empty.');
      editInput.focus();
      return;
    }
    if (isDuplicate(text, editingId)) {
      showError(editError, 'Another task with this name already exists.');
      editInput.focus();
      return;
    }

    const todo = todos.find(t => t.id === editingId);
    if (todo) {
      todo.text = text;
      save();
      render();
    }
    closeEditModal();
  }

  /* ── Filter ── */

  // Classes that make a filter button look ACTIVE (Fearless gold fill)
  const FILTER_ACTIVE_CLASSES = [
    'bg-fearless-accent', 'dark:bg-dark-fearless', 'text-white', 'dark:text-dark-bg',
    'border-fearless-accent', 'dark:border-dark-fearless',
  ];
  // Classes that make a filter button look INACTIVE (neutral outline)
  const FILTER_INACTIVE_CLASSES = [
    'bg-transparent', 'text-era-muted', 'dark:text-dark-muted',
    'border-fearless-accent/40', 'dark:border-dark-border',
    'hover:bg-fearless-light', 'hover:text-fearless-deep',
    'dark:hover:bg-dark-raise', 'dark:hover:text-dark-fearless',
  ];

  function setFilter(value) {
    filter = value;
    filterBtns.forEach(btn => {
      const active = btn.dataset.filter === value;
      btn.setAttribute('aria-pressed', String(active));
      if (active) {
        btn.classList.add(...FILTER_ACTIVE_CLASSES);
        btn.classList.remove(...FILTER_INACTIVE_CLASSES);
      } else {
        btn.classList.remove(...FILTER_ACTIVE_CLASSES);
        btn.classList.add(...FILTER_INACTIVE_CLASSES);
      }
    });
    render();
  }

  /* ── Event delegation ── */

  function handleListClick(e) {
    // Checkbox toggle
    const checkbox = e.target.closest('.checkbox-custom');
    if (checkbox) {
      const li = checkbox.closest('[data-id]');
      if (li) toggleDone(li.dataset.id);
      return;
    }

    // Edit button
    const editBtn = e.target.closest('.todo-edit');
    if (editBtn && editBtn.dataset.id) {
      openEditModal(editBtn.dataset.id);
      return;
    }

    // Delete button
    const deleteBtn = e.target.closest('.todo-delete');
    if (deleteBtn && deleteBtn.dataset.id) {
      deleteTask(deleteBtn.dataset.id);
    }
  }

  /* ── Keyboard trap for modal ── */

  function isModalOpen() {
    return editingId !== null;
  }

  function trapFocus(e) {
    if (!editModal || !isModalOpen()) return;
    const focusable = editModal.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === 'Escape') closeEditModal();
  }

  function init() {
    load();
    setFilter('all');  // renders via setFilter

    if (formEl)  formEl.addEventListener('submit', addTask);
    if (listEl)  listEl.addEventListener('click', handleListClick);

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Edit modal
    if (editForm)     editForm.addEventListener('submit', saveEdit);
    if (editCancel)   editCancel.addEventListener('click', closeEditModal);
    if (editBackdrop) editBackdrop.addEventListener('click', closeEditModal);
    document.addEventListener('keydown', trapFocus);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   6. QUICK LINKS
═══════════════════════════════════════════════════════════════ */

const LinksModule = (() => {
  const STORAGE_KEY  = 'ttpd-links';
  const ALLOWED_PROTOCOLS = ['http:', 'https:'];

  const formEl      = document.getElementById('link-form');
  const nameInputEl = document.getElementById('link-name-input');
  const urlInputEl  = document.getElementById('link-url-input');
  const errorEl     = document.getElementById('link-error');
  const listEl      = document.getElementById('links-list');
  const emptyEl     = document.getElementById('links-empty');

  /** @type {Array<{id: string, name: string, url: string, createdAt: number}>} */
  let links = [];

  /* ── Persistence ── */

  function load() {
    const raw = storageGet(STORAGE_KEY, []);
    links = Array.isArray(raw)
      ? raw.filter(l =>
          l && typeof l.id === 'string' &&
          typeof l.name === 'string' &&
          typeof l.url  === 'string'
        )
      : [];
  }

  function save() {
    storageSet(STORAGE_KEY, links);
  }

  /* ── URL validation ── */

  /**
   * Validate a URL string.
   * @param {string} raw
   * @returns {{ ok: boolean, url?: URL, error?: string }}
   */
  function validateUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return { ok: false, error: 'Please enter a URL.' };

    let parsed;
    try {
      // If the user omitted the protocol, prepend https://
      const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      parsed = new URL(candidate);
    } catch {
      return { ok: false, error: 'That doesn\'t look like a valid URL.' };
    }

    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { ok: false, error: 'Only http:// and https:// links are allowed.' };
    }

    // Basic hostname sanity check — must have at least one dot
    if (!parsed.hostname.includes('.')) {
      return { ok: false, error: 'Please enter a full URL, e.g. https://example.com' };
    }

    return { ok: true, url: parsed };
  }

  /* ── Generate ID ── */

  function generateId() {
    return `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  /* ── Render ── */

  function render() {
    if (!listEl) return;

    const isEmpty = links.length === 0;
    if (emptyEl) show(emptyEl, isEmpty, 'flex');

    listEl.innerHTML = '';

    links.forEach(link => {
      const wrapper = document.createElement('div');
      wrapper.className = 'link-entry fade-in';
      wrapper.dataset.id = link.id;

      // Anchor — opens safely in new tab
      const a = document.createElement('a');
      a.href             = link.url;
      a.textContent      = link.name;
      a.target           = '_blank';
      a.rel              = 'noopener noreferrer';
      a.className        = 'link-chip';
      a.style.flex       = '1';
      a.style.minWidth   = '0';
      a.setAttribute('aria-label', `${link.name} — opens in new tab`);

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.type         = 'button';
      delBtn.dataset.id   = link.id;
      delBtn.className    = 'btn-danger';
      delBtn.style.flexShrink = '0';
      delBtn.setAttribute('aria-label', `Delete link: ${link.name}`);
      delBtn.title        = 'Delete link';
      delBtn.innerHTML    = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>`;

      wrapper.appendChild(a);
      wrapper.appendChild(delBtn);
      listEl.appendChild(wrapper);
    });
  }

  /* ── Add ── */

  function addLink(e) {
    e.preventDefault();
    const name = nameInputEl ? nameInputEl.value.trim() : '';
    const rawUrl = urlInputEl ? urlInputEl.value.trim() : '';

    if (!name) {
      showError(errorEl, 'Please enter a site name.');
      nameInputEl && nameInputEl.focus();
      return;
    }
    if (name.length > 60) {
      showError(errorEl, 'Site name must be 60 characters or fewer.');
      return;
    }

    const validation = validateUrl(rawUrl);
    if (!validation.ok) {
      showError(errorEl, validation.error);
      urlInputEl && urlInputEl.focus();
      return;
    }

    showError(errorEl, '');
    links.unshift({
      id:        generateId(),
      name:      name,
      url:       validation.url.href,
      createdAt: Date.now(),
    });
    save();
    render();

    if (nameInputEl) nameInputEl.value = '';
    if (urlInputEl)  urlInputEl.value  = '';
    nameInputEl && nameInputEl.focus();
  }

  /* ── Delete ── */

  function handleListClick(e) {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    links = links.filter(l => l.id !== btn.dataset.id);
    save();
    render();
  }

  function init() {
    load();
    render();

    if (formEl) formEl.addEventListener('submit', addLink);
    if (listEl) listEl.addEventListener('click', handleListClick);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   7. NOTES
═══════════════════════════════════════════════════════════════ */

const NotesModule = (() => {
  const STORAGE_KEY = 'kawaii-notes';
  const textareaEl  = document.getElementById('notes-input');
  const statusEl    = document.getElementById('notes-status');

  let debounceTimer = null;

  function load() {
    if (!textareaEl) return;
    const saved = storageGet(STORAGE_KEY, '');
    // Only restore if the value is a non-empty string to avoid overwriting
    if (typeof saved === 'string') textareaEl.value = saved;
  }

  function save() {
    if (!textareaEl) return;
    storageSet(STORAGE_KEY, textareaEl.value);
    if (statusEl) {
      statusEl.textContent = 'Saved ✓';
      // Clear the status message after 2 seconds
      setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2000);
    }
  }

  function onInput() {
    // Debounce: wait 400ms after the user stops typing before saving
    clearTimeout(debounceTimer);
    if (statusEl) statusEl.textContent = 'Saving…';
    debounceTimer = setTimeout(save, 400);
  }

  function init() {
    load();
    if (textareaEl) textareaEl.addEventListener('input', onInput);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   8. MOOD TRACKER
═══════════════════════════════════════════════════════════════ */

const MoodModule = (() => {
  const STORAGE_KEY  = 'kawaii-mood';
  const moodButtons  = document.querySelectorAll('.mood-btn');
  const emojiEl      = document.getElementById('mood-emoji');
  const labelEl      = document.getElementById('mood-label');

  // Map data-mood → display emoji and friendly label
  const MOOD_MAP = {
    happy:  { emoji: '😊', label: 'Feeling happy today! ★' },
    sunny:  { emoji: '🌤', label: 'A bright, golden day ✦' },
    meh:    { emoji: '😐', label: 'Just okay — that\'s valid too.' },
    rainy:  { emoji: '🌧', label: 'A little gloomy today. It passes.' },
    sleepy: { emoji: '😴', label: 'Could use a little more rest…' },
  };

  // Classes applied to the currently selected mood button
  const SELECTED_CLASSES = ['border-debut-accent', 'bg-debut-light', 'dark:bg-dark-raise', 'dark:border-dark-debut'];

  function applyMood(mood) {
    const data = MOOD_MAP[mood];
    if (!data) return;

    // Update the recap display
    if (emojiEl)  emojiEl.textContent  = data.emoji;
    if (labelEl)  labelEl.textContent  = data.label;

    // Update button pressed states
    moodButtons.forEach(btn => {
      const isSelected = btn.dataset.mood === mood;
      btn.setAttribute('aria-pressed', String(isSelected));
      if (isSelected) {
        btn.classList.add(...SELECTED_CLASSES);
      } else {
        btn.classList.remove(...SELECTED_CLASSES);
      }
    });
  }

  function onButtonClick(e) {
    const btn = e.target.closest('.mood-btn');
    if (!btn) return;
    const mood = btn.dataset.mood;
    if (!mood) return;
    applyMood(mood);
    storageSet(STORAGE_KEY, mood);
    // Small accessibility wiggle animation
    animateOnce(btn, 'animate-wiggle');
  }

  function init() {
    // Restore saved mood
    const saved = storageGet(STORAGE_KEY, null);
    if (saved && MOOD_MAP[saved]) applyMood(saved);

    // Delegate click handling to the mood-buttons container
    const container = document.getElementById('mood-buttons');
    if (container) container.addEventListener('click', onButtonClick);
  }

  return { init };
})();


/* ═══════════════════════════════════════════════════════════════
   9. INIT  — boot all modules
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Theme must be applied first to avoid flash of wrong color
  ThemeModule.init();
  ClockModule.init();
  TimerModule.init();
  TodoModule.init();
  LinksModule.init();
  NotesModule.init();
  MoodModule.init();
});
