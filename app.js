// ==========================================
//  Serenity — Mental Wellness Hub  |  app.js
// ==========================================

/* ---- Affirmations ---- */
const AFFIRMATIONS = [
  "You are enough, exactly as you are right now.",
  "Every day you wake up is a fresh start. Choose yourself today.",
  "Your feelings are valid. It's okay not to be okay.",
  "Small steps still move you forward. Progress is progress.",
  "You have survived every difficult day so far. You are stronger than you know.",
  "It's okay to rest. Rest is not giving up — it's recharging.",
  "You deserve the same compassion you give to others.",
  "Breathe. This moment is temporary, and brighter ones are ahead.",
  "You are not your worst day. You are your whole story.",
  "Healing isn't linear. Be patient with yourself.",
  "You bring something unique to the world that no one else can.",
  "It's brave to ask for help. You don't have to do this alone.",
  "Your mental health is just as important as your physical health.",
  "You are worthy of love and belonging, always.",
  "Today, you are doing better than you think.",
  "Even on hard days, you are making a difference by being here.",
  "Be gentle with yourself — you are a work in progress, and that's beautiful.",
  "You have overcome challenges before, and you will overcome this one too.",
  "Joy is your birthright. It's okay to let yourself feel it.",
  "You matter more than you realize.",
];

let currentAffirmationIdx = 0;
let autoplayTimer = null;

function initAffirmations() {
  currentAffirmationIdx = Math.floor(Math.random() * AFFIRMATIONS.length);
  renderAffirmation();

  document.getElementById('nextAffirmation').addEventListener('click', nextAffirmation);
  document.getElementById('autoplayAffirmation').addEventListener('click', toggleAutoplay);
}

function renderAffirmation(direction = 'in') {
  const el = document.getElementById('affirmationText');
  const counter = document.getElementById('affirmationCounter');
  el.classList.add('fade');
  setTimeout(() => {
    el.textContent = AFFIRMATIONS[currentAffirmationIdx];
    counter.textContent = `${currentAffirmationIdx + 1} / ${AFFIRMATIONS.length}`;
    el.classList.remove('fade');
  }, 220);
}

function nextAffirmation() {
  currentAffirmationIdx = (currentAffirmationIdx + 1) % AFFIRMATIONS.length;
  renderAffirmation();
}

function toggleAutoplay() {
  const btn = document.getElementById('autoplayAffirmation');
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    btn.innerHTML = '▶ Auto-play';
  } else {
    autoplayTimer = setInterval(nextAffirmation, 5000);
    btn.innerHTML = '⏹ Stop';
    nextAffirmation();
  }
}

/* ---- Breathing Exercise (4-7-8 technique) ---- */
const BREATHING_PHASES = [
  { name: 'Inhale', emoji: '🫁', duration: 4, scale: 1.15 },
  { name: 'Hold',   emoji: '✋', duration: 7, scale: 1.15 },
  { name: 'Exhale', emoji: '💨', duration: 8, scale: 0.8  },
];

const TOTAL_CYCLES = 4;
let breathingActive = false;
let breathingCycle  = 0;
let breathingPhase  = 0;
let breathingCountdown = 0;
let breathingInterval  = null;

function initBreathing() {
  renderCycleDots();
  document.getElementById('breathStart').addEventListener('click', toggleBreathing);
  renderBreathingIdle();
}

function renderCycleDots() {
  const wrap = document.getElementById('cycleDots');
  wrap.innerHTML = '';
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const dot = document.createElement('span');
    dot.className = 'cycle-dot';
    dot.id = `dot-${i}`;
    wrap.appendChild(dot);
  }
}

function renderBreathingIdle() {
  const circle = document.getElementById('breathingCircle');
  const phaseEl = document.getElementById('breathPhase');
  const countEl = document.getElementById('breathCount');
  const labelEl = document.getElementById('breathLabel');
  const emojiEl = document.getElementById('breathEmoji');
  circle.className = 'breathing-circle';
  phaseEl.textContent = 'Ready';
  countEl.textContent = '';
  labelEl.textContent = 'Press Start';
  emojiEl.textContent = '🌿';
}

function toggleBreathing() {
  if (breathingActive) {
    stopBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  breathingActive = true;
  breathingCycle = 0;
  breathingPhase = 0;
  document.getElementById('breathStart').textContent = '⏹ Stop';
  renderCycleDots();
  runBreathingPhase();
}

function stopBreathing() {
  breathingActive = false;
  clearInterval(breathingInterval);
  breathingInterval = null;
  document.getElementById('breathStart').textContent = '▶ Start';
  renderBreathingIdle();
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) { dot.className = 'cycle-dot'; }
  }
}

function runBreathingPhase() {
  if (!breathingActive) return;
  if (breathingCycle >= TOTAL_CYCLES) {
    stopBreathing();
    showToast('🎉 Great work! You completed 4 breathing cycles.');
    return;
  }

  const phase = BREATHING_PHASES[breathingPhase];
  breathingCountdown = phase.duration;

  // Update dot status
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) continue;
    if (i < breathingCycle) dot.className = 'cycle-dot done';
    else if (i === breathingCycle) dot.className = 'cycle-dot active';
    else dot.className = 'cycle-dot';
  }

  const circle = document.getElementById('breathingCircle');
  const phaseEl = document.getElementById('breathPhase');
  const countEl = document.getElementById('breathCount');
  const labelEl = document.getElementById('breathLabel');
  const emojiEl = document.getElementById('breathEmoji');

  circle.className = `breathing-circle ${breathingPhase === 0 ? 'expand' : breathingPhase === 1 ? 'hold' : 'shrink'}`;
  phaseEl.textContent = phase.name;
  emojiEl.textContent = phase.emoji;
  labelEl.textContent = 'seconds';
  countEl.textContent = breathingCountdown;

  clearInterval(breathingInterval);
  breathingInterval = setInterval(() => {
    breathingCountdown--;
    countEl.textContent = breathingCountdown;
    if (breathingCountdown <= 0) {
      clearInterval(breathingInterval);
      breathingPhase++;
      if (breathingPhase >= BREATHING_PHASES.length) {
        breathingPhase = 0;
        breathingCycle++;
      }
      setTimeout(runBreathingPhase, 300);
    }
  }, 1000);
}

/* ---- Mood Tracker ---- */
const MOODS = [
  { emoji: '😄', label: 'Great',   msg: 'Wonderful! Hold on to this joy — you deserve it. 🌟' },
  { emoji: '🙂', label: 'Good',    msg: 'Good days are worth celebrating. Keep it up! 😊' },
  { emoji: '😐', label: 'Okay',    msg: "Neutral is okay. Sometimes steady is exactly what we need. 💛" },
  { emoji: '😞', label: 'Low',     msg: "It's okay to have low moments. Be extra kind to yourself today. 🤍" },
  { emoji: '😢', label: 'Sad',     msg: "Feeling sad is human. Reach out if you need support — you're not alone. 💙" },
];

let moodHistory = [];

function initMood() {
  const saved = localStorage.getItem('serenity_moods');
  if (saved) { try { moodHistory = JSON.parse(saved); } catch(e) {} }

  const container = document.getElementById('moodEmojis');
  MOODS.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'mood-btn';
    btn.title = m.label;
    btn.innerHTML = m.emoji;
    btn.setAttribute('aria-label', `Mood: ${m.label}`);
    btn.addEventListener('click', () => selectMood(i));
    container.appendChild(btn);
  });

  renderMoodHistory();
}

function selectMood(idx) {
  // Update UI
  document.querySelectorAll('.mood-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === idx);
  });
  const responseEl = document.getElementById('moodResponse');
  responseEl.style.opacity = '0';
  setTimeout(() => {
    responseEl.textContent = MOODS[idx].msg;
    responseEl.style.opacity = '1';
  }, 200);

  // Save to history
  const entry = {
    emoji: MOODS[idx].emoji,
    label: MOODS[idx].label,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
  };
  moodHistory.unshift(entry);
  if (moodHistory.length > 7) moodHistory = moodHistory.slice(0, 7);
  localStorage.setItem('serenity_moods', JSON.stringify(moodHistory));
  renderMoodHistory();
  showToast(`${MOODS[idx].emoji} Mood logged for today!`);
}

function renderMoodHistory() {
  const wrap = document.getElementById('moodHistory');
  wrap.innerHTML = '';
  if (moodHistory.length === 0) {
    wrap.innerHTML = '<span style="font-size:0.85rem;color:var(--text-muted);font-style:italic;">No logs yet — log your first mood!</span>';
    return;
  }
  moodHistory.forEach(m => {
    const chip = document.createElement('div');
    chip.className = 'mood-chip';
    chip.innerHTML = `<span>${m.emoji}</span><span style="font-size:0.8rem;color:var(--text-muted)">${m.date} ${m.time}</span>`;
    wrap.appendChild(chip);
  });
}

/* ---- Gratitude Journal ---- */
const PROMPTS = [
  "What made you smile today?",
  "Name 3 things you're grateful for…",
  "What's one small win from today?",
  "Who supported you recently?",
  "What's one thing you like about yourself?",
  "Describe a peaceful moment this week.",
  "What are you looking forward to tomorrow?",
];

let journalEntries = [];

function initJournal() {
  const saved = localStorage.getItem('serenity_journal');
  if (saved) { try { journalEntries = JSON.parse(saved); } catch(e) {} }

  const textarea = document.getElementById('journalTextarea');
  const wordCountEl = document.getElementById('wordCount');

  textarea.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  });

  document.getElementById('saveJournal').addEventListener('click', saveJournalEntry);

  // Prompt chips
  const promptsWrap = document.getElementById('journalPrompts');
  PROMPTS.forEach(p => {
    const chip = document.createElement('button');
    chip.className = 'prompt-chip';
    chip.textContent = p;
    chip.addEventListener('click', () => {
      textarea.value = p + ' ';
      textarea.focus();
      const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
      wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    });
    promptsWrap.appendChild(chip);
  });

  renderJournalEntries();
}

function saveJournalEntry() {
  const textarea = document.getElementById('journalTextarea');
  const text = textarea.value.trim();
  if (!text) {
    showToast('✏️ Write something first!');
    return;
  }
  const entry = {
    text,
    date: new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  journalEntries.unshift(entry);
  if (journalEntries.length > 20) journalEntries = journalEntries.slice(0, 20);
  localStorage.setItem('serenity_journal', JSON.stringify(journalEntries));
  textarea.value = '';
  document.getElementById('wordCount').textContent = '0 words';
  renderJournalEntries();
  showToast('📓 Entry saved! Every reflection counts.');
}

function deleteJournalEntry(idx) {
  journalEntries.splice(idx, 1);
  localStorage.setItem('serenity_journal', JSON.stringify(journalEntries));
  renderJournalEntries();
}

function renderJournalEntries() {
  const wrap = document.getElementById('journalEntries');
  wrap.innerHTML = '';
  if (journalEntries.length === 0) {
    wrap.innerHTML = '<p class="journal-empty">Your reflections will appear here. Start writing! 🌱</p>';
    return;
  }
  journalEntries.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = 'journal-entry';
    card.innerHTML = `
      <div class="entry-meta">
        <span class="entry-date">📅 ${e.date} at ${e.time}</span>
        <button class="entry-delete" aria-label="Delete entry">🗑</button>
      </div>
      <p class="entry-text">${escapeHtml(e.text)}</p>
    `;
    card.querySelector('.entry-delete').addEventListener('click', () => deleteJournalEntry(i));
    wrap.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

/* ---- Toast ---- */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-inner span').textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}

/* ---- Nav active link ---- */
function initNav() {
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAffirmations();
  initBreathing();
  initMood();
  initJournal();
  initReveal();
  initNav();
});
