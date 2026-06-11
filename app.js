// ════════════════════════════════════════════════════
//  APP LOGIC — Duolingo-style naturalization study app
// ════════════════════════════════════════════════════

const STATE_KEY = 'mx_nat_v2';
const MAX_HEARTS = 5;
const XP_CORRECT = 10;
const XP_WRONG = 2;

// ── Load / Save State ──
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    return {
      xp: s.xp || 0,
      streak: s.streak || 0,
      bestStreak: s.bestStreak || 0,
      hearts: s.hearts ?? MAX_HEARTS,
      heartsEmptyAt: s.heartsEmptyAt || null,
      lastDate: s.lastDate || '',
      confidence: s.confidence || {},
      wrongIds: s.wrongIds || [],
      seenIds: s.seenIds || [],
      totalCorrect: s.totalCorrect || 0,
      totalAnswered: s.totalAnswered || 0,
      sessionStreak: s.sessionStreak || 0,
      lessonStars: s.lessonStars || {},
    };
  } catch { return defaultState(); }
}

function defaultState() {
  return { xp:0, streak:0, bestStreak:0, hearts:MAX_HEARTS, heartsEmptyAt:null, lastDate:'',
    confidence:{}, wrongIds:[], seenIds:[], totalCorrect:0, totalAnswered:0, sessionStreak:0, lessonStars:{} };
}

function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

let state = loadState();
checkDailyStreak();

// ── Session ──
let session = {
  mode: 'all', label: 'Todas las preguntas',
  queue: [], idx: 0,
  correct: 0, wrong: 0,
  xpEarned: 0,
  answered: false, confGiven: false,
};

// ════════════════════════════════════════════════════
//  DAILY STREAK
// ════════════════════════════════════════════════════
function checkDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastDate !== yesterday) state.streak = 0; // broke streak
    state.lastDate = today;
    saveState();
  }
}

function bumpDailyStreak() {
  const today = new Date().toDateString();
  if (state.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    state.streak = (state.lastDate === yesterday) ? state.streak + 1 : 1;
    state.lastDate = today;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    saveState();
  }
}

// ════════════════════════════════════════════════════
//  SHUFFLE
// ════════════════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ════════════════════════════════════════════════════
//  BUILD QUEUE
// ════════════════════════════════════════════════════
function buildQueue(mode) {
  let pool;
  switch (mode) {
    case 'all':    pool = [...questions]; break;
    case 'nope':   pool = questions.filter(q => state.confidence[q.id] === 0); break;
    case 'mostly': pool = questions.filter(q => state.confidence[q.id] === 1); break;
    case 'wrong':  pool = questions.filter(q => state.wrongIds.includes(q.id)); break;
    case 'unseen': pool = questions.filter(q => !state.seenIds.includes(q.id)); break;
    case 'exam':   pool = shuffle([...questions]).slice(0, 10); break;
    default:
      if (mode.startsWith('cat:')) pool = questions.filter(q => q.cat === mode.slice(4));
      else pool = [...questions];
  }
  return shuffle(pool);
}

// ════════════════════════════════════════════════════
//  START STUDY
// ════════════════════════════════════════════════════
function startStudy(mode, label, freeMode = false) {
  // Gate: no hearts → show no-hearts screen (unless free mode)
  if (!freeMode && state.hearts <= 0) {
    showNoHearts();
    return;
  }

  session.mode = mode;
  session.label = label || getModeLabel(mode);
  session.freeMode = freeMode;
  session.queue = buildQueue(mode);
  session.idx = 0;
  session.correct = 0;
  session.wrong = 0;
  session.xpEarned = 0;
  session.answered = false;
  session.confGiven = false;

  if (session.queue.length === 0) {
    showEmptyForMode(mode);
    return;
  }

  showScreen('study');
  renderStudyCard();
}

function startFreeMode() {
  startStudy('all', 'Práctica libre 🃏', true);
}

function getModeLabel(mode) {
  const map = { all:'Todas las preguntas', nope:'No lo sabía', mostly:'Casi seguro',
    wrong:'Respondidas mal', unseen:'Sin ver', exam:'Simular examen' };
  if (mode.startsWith('cat:')) return CATS[mode.slice(4)]?.name || mode;
  return map[mode] || mode;
}

function showEmptyForMode(mode) {
  setMascotState('happy');
  setMascotBubble('¡No hay preguntas en este modo todavía! Estudia más tarjetas primero. 🌸');
  showScreen('home');
}

// ════════════════════════════════════════════════════
//  RENDER CARD
// ════════════════════════════════════════════════════
function renderStudyCard() {
  const q = session.queue[session.idx];
  session.answered = false;
  session.confGiven = false;

  // XP bar (session progress)
  const pct = session.idx / session.queue.length * 100;
  document.getElementById('study-xp-bar').style.width = pct + '%';

  // Hearts
  renderHearts();

  // Category
  document.getElementById('q-cat-label').textContent =
    (CATS[q.cat]?.icon || '') + '  ' + (CATS[q.cat]?.name || q.cat);

  // Question
  document.getElementById('q-text').textContent = q.q;

  // Options — shuffle correct into wrong answers
  const opts = shuffle([q.a, ...q.wrong]);
  const letters = ['A','B','C','D'];
  const wrap = document.getElementById('options-wrap');
  wrap.innerHTML = '';
  opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn fade-up';
    btn.style.animationDelay = (i * 0.06) + 's';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.dataset.val = opt;
    btn.onclick = () => selectOption(btn, opt, q);
    wrap.appendChild(btn);
  });

  // Hide feedback + conf row
  document.getElementById('feedback-bar').style.display = 'none';
  document.getElementById('conf-row').classList.remove('show');

  // Mascot thinking
  setStudyMascotState('thinking');
}

function renderHearts() {
  const el = document.getElementById('study-hearts');
  el.innerHTML = '';
  for (let i = 0; i < MAX_HEARTS; i++) {
    const span = document.createElement('span');
    span.textContent = i < state.hearts ? '❤️' : '🖤';
    el.appendChild(span);
  }
}

// ════════════════════════════════════════════════════
//  SELECT ANSWER
// ════════════════════════════════════════════════════
function selectOption(btn, val, q) {
  if (session.answered) return;
  session.answered = true;

  const correct = val === q.a;
  session.lastAnswerCorrect = correct;

  // Mark seen
  if (!state.seenIds.includes(q.id)) state.seenIds.push(q.id);

  // Style all buttons
  document.querySelectorAll('.opt-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.val === q.a) b.classList.add('correct');
    else if (b === btn && !correct) { b.classList.add('wrong'); b.classList.add('dim'); }
    else b.classList.add('dim');
  });

  if (correct) {
    session.correct++;
    state.totalCorrect++;
    state.totalAnswered++;
    const xp = XP_CORRECT + (session.sessionStreak >= 3 ? 5 : 0);
    state.xp += xp;
    session.xpEarned += xp;
    state.sessionStreak = (state.sessionStreak || 0) + 1;
    if (state.sessionStreak > state.bestStreak) state.bestStreak = state.sessionStreak;

    setStudyMascotState('happy');
    showFeedback(true, '¡Correcto!', q.a);
    spawnXPFloat(xp, btn);
    if (session.correct % 3 === 0) miniConfetti();

  } else {
    session.wrong++;
    state.totalAnswered++;
    state.sessionStreak = 0;
    if (!state.wrongIds.includes(q.id)) state.wrongIds.push(q.id);
    if (!session.freeMode) {
      state.hearts = Math.max(0, state.hearts - 1);
      // Track when hearts last dropped for refill timer
      if (!state.heartsEmptyAt && state.hearts === 0) {
        state.heartsEmptyAt = Date.now();
      }
    }
    renderHearts();

    setStudyMascotState('wrong');
    showFeedback(false, '¡Incorrecto!', `La respuesta correcta es: ${q.a}`);

    if (!session.freeMode && state.hearts === 0) {
      saveState();
      setTimeout(() => showNoHearts(), 1400);
      return;
    }
  }

  bumpDailyStreak();
  updateHomeStats();
  saveState();
}

function showFeedback(correct, title, answer) {
  const bar = document.getElementById('feedback-bar');
  bar.className = 'feedback-bar ' + (correct ? 'correct' : 'wrong');
  bar.style.display = 'block';
  document.getElementById('fb-title').textContent = (correct ? '✅ ' : '❌ ') + title;
  document.getElementById('fb-answer').textContent = answer;
  document.getElementById('conf-row').classList.add('show');
}

let countdownInterval = null;

function showNoHearts() {
  saveState();
  showScreen('nohearts');

  // Clone mascot into no-hearts screen
  const src = document.getElementById('mascot-home');
  const target = document.getElementById('mascot-nohearts');
  if (src && target) {
    const clone = src.cloneNode(true);
    clone.id = 'mascot-nohearts';
    clone.removeAttribute('style');
    clone.style.width = '130px';
    clone.style.height = 'auto';
    target.parentNode.replaceChild(clone, target);
    setStudyMascotStateById('mascot-nohearts', 'wrong');
  }

  // Hearts progress row
  const prog = document.getElementById('nh-hearts-progress');
  if (prog) {
    prog.innerHTML = '';
    for (let i = 0; i < MAX_HEARTS; i++) {
      const s = document.createElement('span');
      s.className = 'nh-hp';
      s.textContent = i < state.hearts ? '❤️' : '🖤';
      prog.appendChild(s);
    }
  }

  // Start countdown
  if (countdownInterval) clearInterval(countdownInterval);
  const REFILL_MS = 30 * 60 * 1000;
  const startedAt = state.heartsEmptyAt || Date.now();

  function tick() {
    const now = Date.now();
    // How many hearts have refilled since heartsEmptyAt?
    const heartsSinceEmpty = Math.floor((now - startedAt) / REFILL_MS);
    const heartsNow = Math.min(MAX_HEARTS, state.hearts + heartsSinceEmpty);

    if (heartsNow > state.hearts) {
      state.hearts = heartsNow;
      if (state.hearts >= MAX_HEARTS) state.heartsEmptyAt = null;
      saveState();
      updateHomeStats();
      // Update progress row
      if (prog) {
        [...prog.children].forEach((s, i) => s.textContent = i < state.hearts ? '❤️' : '🖤');
      }
    }

    if (state.hearts >= MAX_HEARTS) {
      clearInterval(countdownInterval);
      document.getElementById('nh-countdown').textContent = '¡Listo! ❤️';
      return;
    }

    // Time to next heart
    const elapsed = (now - startedAt) % REFILL_MS;
    const remaining = REFILL_MS - elapsed;
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    document.getElementById('nh-countdown').textContent =
      `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function setStudyMascotStateById(id, state_) {
  const svg = document.getElementById(id);
  if (!svg) return;
  const happy = svg.querySelector('#mouth-happy');
  const wrong = svg.querySelector('#mouth-wrong');
  const celeb = svg.querySelector('#mouth-celebrate');
  if (!happy) return;
  happy.style.display = 'none';
  wrong.style.display = 'none';
  if (celeb) celeb.style.display = 'none';
  if (state_ === 'wrong') wrong.style.display = '';
  else if (state_ === 'celebrate' && celeb) celeb.style.display = '';
  else happy.style.display = '';
}

// ════════════════════════════════════════════════════
//  CONFIDENCE
// ════════════════════════════════════════════════════

// Called by confidence buttons — sets level then immediately advances
function setConfAndNext(level) {
  if (session.confGiven) return;
  session.confGiven = true;
  const q = session.queue[session.idx];
  state.confidence[q.id] = level;
  saveState();
  updateHomeStats();
  // Briefly highlight chosen button before advancing
  const btns = document.querySelectorAll('.conf-mini');
  btns.forEach(b => b.classList.remove('selected'));
  const idx = [2, 1, 0].indexOf(level); // sure=0, mostly=1, nope=2
  if (btns[idx]) btns[idx].classList.add('selected');
  setTimeout(() => nextCard(), 280);
}

// Called by CONTINUAR — auto-sets confidence based on answer correctness
function autoConfAndNext() {
  if (!session.confGiven) {
    const autoLevel = session.lastAnswerCorrect ? 2 : 0; // correct→Lo sabía, wrong→No sabía
    setConfAndNext(autoLevel);
  } else {
    nextCard();
  }
}

// Legacy — keep for any remaining callers
function setConf(level) { setConfAndNext(level); }

// ════════════════════════════════════════════════════
//  NEXT CARD
// ════════════════════════════════════════════════════
function nextCard() {
  session.idx++;
  if (session.idx >= session.queue.length) { showResult(); return; }
  renderStudyCard();
}

// ════════════════════════════════════════════════════
//  RESULT SCREEN
// ════════════════════════════════════════════════════
function showResult() {
  const total = session.queue.length;
  const pct = total > 0 ? Math.round((session.correct / total) * 100) : 0;

  document.getElementById('res-correct').textContent = session.correct;
  document.getElementById('res-wrong').textContent = session.wrong;
  document.getElementById('res-pct').textContent = pct + '%';
  document.getElementById('res-xp').textContent = session.xpEarned;

  let title, sub;
  if (pct >= 90) { title = '¡Increíble! 🏆'; sub = 'Eres una crack de México. ¡Frida está orgullosa!'; }
  else if (pct >= 70) { title = '¡Muy bien! 🎯'; sub = '¡Buen trabajo! Sigue así y lo lograrás.'; }
  else if (pct >= 50) { title = 'Buen intento 📚'; sub = 'Vas por buen camino. ¡Practica más los temas difíciles!'; }
  else { title = '¡Sigue practicando! 💪'; sub = 'No te rindas. Fridita confía en ti. 🌸'; }

  document.getElementById('res-title').textContent = title;
  document.getElementById('res-sub').textContent = sub;

  setStudyMascotState(pct >= 70 ? 'celebrate' : 'wrong');

  if (pct >= 70) setTimeout(() => fullConfetti(), 300);

  // Save stars if this was a lesson
  if (session.lessonId) {
    const stars = starsFromPct(pct);
    setLessonStars(session.lessonId, stars);
    session.lessonId = null;
  }

  showScreen('result');
  updateHomeStats();
}

function restartStudy() { startStudy(session.mode, session.label); }

function confirmExit() {
  if (session.idx === 0 || confirm('¿Salir? Tu progreso de esta ronda se guardará.')) {
    showScreen('home');
  }
}

// ════════════════════════════════════════════════════
//  HOME STATS
// ════════════════════════════════════════════════════
function updateHomeStats() {
  // Header pills
  document.getElementById('h-streak').textContent = state.streak;
  document.getElementById('h-xp').textContent = state.xp;
  document.getElementById('h-hearts').textContent = state.hearts;

  const conf = state.confidence;
  const sure   = questions.filter(q => conf[q.id] === 2).length;
  const mostly = questions.filter(q => conf[q.id] === 1).length;
  const nope   = questions.filter(q => conf[q.id] === 0).length;
  const wrong  = state.wrongIds.length;
  const unseen = questions.filter(q => !state.seenIds.includes(q.id)).length;

  document.getElementById('mc-all').textContent    = `${questions.length} preguntas en el banco`;
  document.getElementById('mc-nope').textContent   = nope   ? `${nope} tarjetas difíciles`  : 'Ninguna todavía';
  document.getElementById('mc-mostly').textContent = mostly ? `${mostly} casi dominadas`    : 'Ninguna todavía';
  document.getElementById('mc-wrong').textContent  = wrong  ? `${wrong} respondidas mal`    : 'Ninguna todavía';
  document.getElementById('mc-unseen').textContent = unseen ? `${unseen} sin ver`           : '¡Todo visto! 🎉';

  // Category path
  renderCatPath();

  // Mascot
  const total = questions.length;
  const seenPct = Math.round((state.seenIds.length / total) * 100);
  const bubbles = [
    '¡Ándale Karina! 🌸 ¿Lista para estudiar hoy?',
    `Has visto el ${seenPct}% de las preguntas. ¡Sigue así, Karina! 💪`,
    `¡Racha de ${state.streak} días! 🔥 ¡No la rompas!`,
    `¡${state.xp} XP! Vas muy bien, Бубочка ⚡`,
    '¡La clave es la constancia! Estudia un poco cada día. 🌸',
    `Quedan ${unseen} preguntas sin ver. ¡Vamos Karina! 🇲🇽`,
    '¡Tú puedes, Карина! El examen no sabe con quién se metió 😄',
  ];
  document.getElementById('home-bubble').textContent = bubbles[Math.floor(Math.random() * bubbles.length)];
  if (state.seenIds.length === 0) document.getElementById('home-bubble').textContent = '¡Hola Karina! Soy Fridita 🌸 ¡Vamos a conquistar tu examen de naturalización!';
}

function renderCatPath() {
  const path = document.getElementById('cat-path');
  path.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const total = questions.filter(q => q.cat === key).length;
    const seen  = questions.filter(q => q.cat === key && state.seenIds.includes(q.id)).length;
    const sure  = questions.filter(q => q.cat === key && state.confidence[q.id] === 2).length;
    const pct   = total ? Math.round((sure / total) * 100) : 0;

    const item = document.createElement('button');
    item.className = 'cat-item';
    item.innerHTML = `
      <span class="ci-icon">${cat.icon}</span>
      <div class="ci-info">
        <div class="ci-name">${cat.name}</div>
        <div class="ci-sub">${seen}/${total} vistas · ${sure} dominadas</div>
        <div class="mini-bar"><div class="mini-bar-fill" style="width:${pct}%;background:${cat.color}"></div></div>
      </div>
      <div class="cat-progress">
        <div class="cat-pct" style="color:${cat.color}">${pct}%</div>
      </div>`;
    item.onclick = () => startStudy(`cat:${key}`, cat.name);
    path.appendChild(item);
  });
}

// ════════════════════════════════════════════════════
//  STATS SCREEN
// ════════════════════════════════════════════════════
function updateStatsScreen() {
  const level = getLevel(state.xp);
  document.getElementById('s-xp').textContent = state.xp;
  document.getElementById('s-level').textContent = `Nivel ${level.num} — ${level.name}`;
  document.getElementById('s-streak').textContent = state.streak;
  document.getElementById('s-total').textContent = state.seenIds.length;
  const acc = state.totalAnswered > 0 ? Math.round(state.totalCorrect / state.totalAnswered * 100) : 0;
  document.getElementById('s-acc').textContent = acc + '%';
  document.getElementById('s-best').textContent = state.bestStreak;

  const conf = state.confidence;
  const sure   = questions.filter(q => conf[q.id] === 2).length;
  const mostly = questions.filter(q => conf[q.id] === 1).length;
  const nope   = questions.filter(q => conf[q.id] === 0).length;
  document.getElementById('s-sure').textContent   = sure;
  document.getElementById('s-mostly').textContent = mostly;
  document.getElementById('s-nope').textContent   = nope;

  // Confidence chart
  const total = questions.length;
  const unseen = total - sure - mostly - nope;
  const toW = n => Math.max(2, Math.round(n / total * 100));
  document.getElementById('cb-sure').style.width   = toW(sure) + '%';
  document.getElementById('cb-mostly').style.width = toW(mostly) + '%';
  document.getElementById('cb-nope').style.width   = toW(nope) + '%';
  document.getElementById('cb-unseen').style.width = toW(unseen) + '%';
  document.getElementById('cn-sure').textContent   = sure;
  document.getElementById('cn-mostly').textContent = mostly;
  document.getElementById('cn-nope').textContent   = nope;
  document.getElementById('cn-unseen').textContent = unseen;

  // Category list
  const list = document.getElementById('cat-stat-list');
  list.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const qs     = questions.filter(q => q.cat === key);
    const sureN  = qs.filter(q => conf[q.id] === 2).length;
    const pct    = qs.length ? Math.round(sureN / qs.length * 100) : 0;
    const row = document.createElement('div');
    row.className = 'cat-stat-row';
    row.innerHTML = `
      <span class="csr-icon">${cat.icon}</span>
      <div class="csr-info">
        <div class="csr-name">${cat.name}</div>
        <div class="csr-track"><div class="csr-fill" style="width:${pct}%;background:${cat.color}"></div></div>
      </div>
      <div class="csr-pct" style="color:${cat.color}">${pct}%</div>`;
    list.appendChild(row);
  });
}

function getLevel(xp) {
  const levels = [
    { num:1, name:'Principiante',  min:0 },
    { num:2, name:'Curioso',       min:100 },
    { num:3, name:'Estudiante',    min:300 },
    { num:4, name:'Conocedor',     min:600 },
    { num:5, name:'Experto',       min:1000 },
    { num:6, name:'Maestro',       min:1500 },
    { num:7, name:'Embajador',     min:2500 },
    { num:8, name:'Mexicanista',   min:4000 },
  ];
  let lv = levels[0];
  for (const l of levels) { if (xp >= l.min) lv = l; }
  return lv;
}

// ════════════════════════════════════════════════════
//  MASCOT STATES
// ════════════════════════════════════════════════════
function setStudyMascotState(state_) {
  const svg = document.getElementById('mascot-study');
  if (!svg) return;
  const happy   = svg.querySelector('#mouth-happy');
  const wrong   = svg.querySelector('#mouth-wrong');
  const celeb   = svg.querySelector('#mouth-celebrate');
  if (!happy) return;
  happy.style.display = 'none';
  wrong.style.display = 'none';
  celeb.style.display = 'none';
  if (state_ === 'happy')     happy.style.display = '';
  else if (state_ === 'wrong') wrong.style.display = '';
  else if (state_ === 'celebrate') celeb.style.display = '';
  else happy.style.display = '';
}

function setMascotState(state_) {
  setStudyMascotState(state_);
  const svg = document.getElementById('mascot-home');
  if (!svg) return;
  const happy = svg.querySelector('#mouth-happy');
  const wrong = svg.querySelector('#mouth-wrong');
  const celeb = svg.querySelector('#mouth-celebrate');
  if (!happy) return;
  happy.style.display = 'none';
  wrong.style.display = 'none';
  celeb.style.display = 'none';
  if (state_ === 'celebrate') celeb.style.display = '';
  else if (state_ === 'wrong') wrong.style.display = '';
  else happy.style.display = '';
}

function setMascotBubble(text) {
  const el = document.getElementById('home-bubble');
  if (el) el.textContent = text;
}

function wiggleMascot(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'bounceIn 0.4s';
  const quips = ['¡Ándale! 🌸','¡Tú puedes! 💪','¡México lindo! 🇲🇽','¡A estudiar! 📚','¡Viva México! 🦅','¡Órale! ⚡'];
  setMascotBubble(quips[Math.floor(Math.random() * quips.length)]);
}

// ════════════════════════════════════════════════════
//  SCREEN MANAGEMENT
// ════════════════════════════════════════════════════
function showScreen(name) {
  // Stop countdown if leaving nohearts screen
  if (name !== 'nohearts' && countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'stats')  updateStatsScreen();
  if (name === 'home')   updateHomeStats();
  if (name === 'camino') { renderPath(); updatePathTopbar(); }
  // Sync all nav bars
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === name);
  });
}

// ════════════════════════════════════════════════════
//  CONFETTI
// ════════════════════════════════════════════════════
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function spawnParticles(n, x, y) {
  const colors = ['#58CC02','#FFC800','#FF4B4B','#1CB0F6','#CE82FF','#FF9600','#006847','#CE1126'];
  for (let i = 0; i < n; i++) {
    particles.push({
      x: x || Math.random() * canvas.width,
      y: y || -10,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: 3 + Math.random() * 5,
      va: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
      life: 1,
    });
  }
}

function miniConfetti() {
  spawnParticles(20);
  if (!animFrame) animateConfetti();
}

function fullConfetti() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnParticles(30), i * 150);
  }
  if (!animFrame) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0.05);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.angle += p.va;
    p.life -= 0.012;
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.6);
    ctx.restore();
  });
  if (particles.length > 0) {
    animFrame = requestAnimationFrame(animateConfetti);
  } else {
    animFrame = null;
  }
}

// ════════════════════════════════════════════════════
//  XP FLOAT
// ════════════════════════════════════════════════════
function spawnXPFloat(xp, btn) {
  const rect = btn ? btn.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2 };
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = '+' + xp + ' XP';
  el.style.left = (rect.left + rect.width/2) + 'px';
  el.style.top  = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ════════════════════════════════════════════════════
//  RESET
// ════════════════════════════════════════════════════
function resetProgress() {
  if (!confirm('¿Reiniciar todo el progreso? Esta acción no se puede deshacer.')) return;
  state = defaultState();
  state.hearts = MAX_HEARTS;
  saveState();
  updateHomeStats();
  setMascotBubble('Progreso reiniciado. ¡Empecemos de nuevo! 🌸');
}

// ════════════════════════════════════════════════════
//  HEART REFILL (every 30 min real time)
// ════════════════════════════════════════════════════
function refillHearts() {
  if (state.hearts < MAX_HEARTS) {
    state.hearts = Math.min(MAX_HEARTS, state.hearts + 1);
    if (state.hearts >= MAX_HEARTS) state.heartsEmptyAt = null;
    saveState();
    updateHomeStats();
  }
}
setInterval(refillHearts, 30 * 60 * 1000);

// ════════════════════════════════════════════════════
//  PATH TOP BAR
// ════════════════════════════════════════════════════
function updatePathTopbar() {
  const s = document.getElementById('path-streak');
  const x = document.getElementById('path-xp');
  const h = document.getElementById('path-hearts');
  if (s) s.textContent = state.streak;
  if (x) x.textContent = state.xp;
  if (h) h.textContent = state.hearts;
}

// ════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════

// Clone home mascot SVG into study and result screens
function cloneMascot() {
  // Clone the main full-body Frida for study/result screens
  const src = document.getElementById('mascot-home');
  if (!src) return;

  ['mascot-study', 'mascot-result', 'mascot-nohearts'].forEach(id => {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const clone = src.cloneNode(true);
    clone.id = id;
    clone.removeAttribute('style');
    clone.style.width  = id === 'mascot-result' ? '150px' : id === 'mascot-nohearts' ? '130px' : '72px';
    clone.style.height = 'auto';
    clone.style.display = 'block';
    wrap.parentNode.replaceChild(clone, wrap);
  });
}

function wiggleMascot() {
  const wrap = document.querySelector('.mascot-frida-wrap');
  if (wrap) { wrap.style.animation = 'none'; wrap.offsetHeight; wrap.style.animation = 'bounceIn 0.45s'; }
  const quips = ['¡Ándale Karina! 🌸','¡Tú puedes! 💪','¡México lindo! 🇲🇽','¡A estudiar! 📚','¡Viva México! 🦅','¡Órale! ⚡','¡Arriba México! 🌮'];
  setMascotBubble(quips[Math.floor(Math.random() * quips.length)]);
}

// Also wire up result mascot wrap
document.addEventListener('DOMContentLoaded', cloneMascot);
setTimeout(cloneMascot, 100);

updateHomeStats();
console.log('🇲🇽 Naturalización app listo con', questions.length, 'preguntas');
