// ════════════════════════════════════════════════════
//  LEARNING PATH DATA — 9 chapters, 30 lessons
// ════════════════════════════════════════════════════

const PATH_CHAPTERS = [
  {
    id: 'ch1', unit: 'UNIDAD 1',
    title: 'La Tierra Mexicana',
    desc: 'Estados, capitales y símbolos patrios',
    icon: '🗺️', color: '#1CB0F6', dark: '#0088CC',
    lessons: [
      { id: 'l01', title: 'Estados del Norte', icon: '🏙️', cat: 'EC', start: 0,  count: 14 },
      { id: 'l02', title: 'Estados del Sur',   icon: '🌴', cat: 'EC', start: 14, count: 14 },
      { id: 'l03', title: 'Más Estados',        icon: '🗺️', cat: 'EC', start: 28, count: 14 },
      { id: 'l04', title: 'Símbolos Patrios',   icon: '🦅', cat: 'GS', start: 0,  count: 13 },
      { id: 'l05', title: 'México en el Mundo', icon: '🌎', cat: 'GS', start: 13, count: 13 },
    ]
  },
  {
    id: 'ch2', unit: 'UNIDAD 2',
    title: 'Raíces Prehispánicas',
    desc: 'Mayas, Aztecas y culturas antiguas',
    icon: '🏛️', color: '#CE82FF', dark: '#9050CC',
    lessons: [
      { id: 'l06', title: 'La Cultura Madre',     icon: '🗿', cat: 'PH', start: 0,  count: 12 },
      { id: 'l07', title: 'Mayas y Teotihuacán',  icon: '🌞', cat: 'PH', start: 12, count: 12 },
      { id: 'l08', title: 'Aztecas y Mexicas',    icon: '🐍', cat: 'PH', start: 24, count: 12 },
      { id: 'l09', title: 'Otros Pueblos',        icon: '🌿', cat: 'PH', start: 36, count: 12 },
    ]
  },
  {
    id: 'ch3', unit: 'UNIDAD 3',
    title: 'La Nueva España',
    desc: 'Conquista y período colonial',
    icon: '⚔️', color: '#FF9600', dark: '#CC6600',
    lessons: [
      { id: 'l10', title: 'La Conquista',   icon: '⚔️', cat: 'CC', start: 0,  count: 15 },
      { id: 'l11', title: 'La Colonia',     icon: '🏰', cat: 'CC', start: 15, count: 15 },
    ]
  },
  {
    id: 'ch4', unit: 'UNIDAD 4',
    title: '¡Viva México!',
    desc: 'La lucha por la Independencia',
    icon: '🔔', color: '#FFC800', dark: '#CC9900',
    lessons: [
      { id: 'l12', title: 'El Grito de Dolores',    icon: '🔔', cat: 'IN', start: 0,  count: 12 },
      { id: 'l13', title: 'Los Héroes',             icon: '🗡️', cat: 'IN', start: 12, count: 12 },
      { id: 'l14', title: 'Constitución y Reforma', icon: '📜', cat: 'IN', start: 24, count: 12 },
      { id: 'l15', title: 'Juárez y Maximiliano',   icon: '🏛️', cat: 'IN', start: 36, count: 12 },
    ]
  },
  {
    id: 'ch5', unit: 'UNIDAD 5',
    title: 'La Revolución',
    desc: 'Del Porfiriato a la Constitución de 1917',
    icon: '🎯', color: '#FF4B4B', dark: '#CC2222',
    lessons: [
      { id: 'l16', title: 'El Porfiriato',          icon: '🎩', cat: 'RE', start: 0,  count: 10 },
      { id: 'l17', title: 'Madero y el Inicio',     icon: '🗳️', cat: 'RE', start: 10, count: 10 },
      { id: 'l18', title: 'Villa y Zapata',         icon: '🐴', cat: 'RE', start: 20, count: 10 },
      { id: 'l19', title: 'México Posrevolucionario',icon: '🏗️', cat: 'RE', start: 30, count: 12 },
    ]
  },
  {
    id: 'ch6', unit: 'UNIDAD 6',
    title: 'México Hoy',
    desc: 'Gobierno, civismo y geografía actual',
    icon: '🏛️', color: '#2EC4B6', dark: '#1A8A80',
    lessons: [
      { id: 'l20', title: 'La Constitución',    icon: '📜', cat: 'CG', start: 0,  count: 12 },
      { id: 'l21', title: 'Gobierno y Política',icon: '🗳️', cat: 'CG', start: 12, count: 12 },
      { id: 'l22', title: 'Instituciones',      icon: '🏦', cat: 'CG', start: 24, count: 11 },
      { id: 'l23', title: 'Geografía Nacional', icon: '🌋', cat: 'GT', start: 0,  count: 15 },
      { id: 'l24', title: 'Turismo y Ciudades', icon: '🏖️', cat: 'GT', start: 15, count: 15 },
    ]
  },
  {
    id: 'ch7', unit: 'UNIDAD 7',
    title: 'Ciencia y Deporte',
    desc: 'Logros mexicanos, educación y atletismo',
    icon: '🔬', color: '#58CC02', dark: '#389000',
    lessons: [
      { id: 'l25', title: 'Educación y Ciencia', icon: '🎓', cat: 'CE', start: 0,  count: 15 },
      { id: 'l26', title: 'Deportes y Logros',   icon: '🥇', cat: 'CE', start: 15, count: 15 },
    ]
  },
  {
    id: 'ch8', unit: 'UNIDAD 8',
    title: 'Arte y Literatura',
    desc: 'Pintores, escritores, cine y teatro',
    icon: '🎬', color: '#FF6B9D', dark: '#CC3060',
    lessons: [
      { id: 'l27', title: 'Pintores y Escritores', icon: '🎨', cat: 'LA', start: 0,  count: 15 },
      { id: 'l28', title: 'Cine y Teatro',         icon: '🎭', cat: 'LA', start: 15, count: 14 },
    ]
  },
  {
    id: 'ch9', unit: 'UNIDAD 9',
    title: 'Tradiciones Mexicanas',
    desc: 'Música, fiestas y gastronomía',
    icon: '🎶', color: '#F4B942', dark: '#C08010',
    lessons: [
      { id: 'l29', title: 'Música y Bailes',        icon: '💃', cat: 'MF', start: 0,  count: 20 },
      { id: 'l30', title: 'Fiestas y Tradiciones',  icon: '🎉', cat: 'MF', start: 20, count: 20 },
      { id: 'l31', title: 'Gastronomía',            icon: '🌮', cat: 'MF', start: 40, count: 20 },
    ]
  },
];

// Zigzag offsets (px from centre of 300px track = 150px)
// Pronounced wave: centre → right → far-right → right → centre → left → far-left → left
const ZIG = [0, 55, 80, 55, 0, -55, -80, -55];

// ── Get questions for a lesson ──
function getLessonQuestions(lesson) {
  const pool = questions.filter(q => q.cat === lesson.cat);
  return pool.slice(lesson.start, lesson.start + lesson.count);
}

// ── Stars for a lesson (stored in state.lessonStars) ──
function getLessonStars(lessonId) {
  return (state.lessonStars || {})[lessonId] || 0;
}

function setLessonStars(lessonId, stars) {
  if (!state.lessonStars) state.lessonStars = {};
  state.lessonStars[lessonId] = Math.max(getLessonStars(lessonId), stars);
  saveState();
}

// Stars from accuracy
function starsFromPct(pct) {
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}

// ── Is a lesson unlocked? ──
// First lesson of chapter 1 always unlocked.
// Otherwise: the previous lesson must have ≥ 1 star.
function isLessonUnlocked(lessonId) {
  const allLessons = PATH_CHAPTERS.flatMap(ch => ch.lessons);
  const idx = allLessons.findIndex(l => l.id === lessonId);
  if (idx === 0) return true;
  const prev = allLessons[idx - 1];
  return getLessonStars(prev.id) >= 1;
}

// ── Chapter completion % ──
function chapterProgress(chapter) {
  const total = chapter.lessons.length;
  const done  = chapter.lessons.filter(l => getLessonStars(l.id) >= 1).length;
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}

// ════════════════════════════════════════════════════
//  RENDER PATH
// ════════════════════════════════════════════════════
const TRACK_W = 300;   // px — must match .ch-track width in CSS
const MID     = TRACK_W / 2;  // 150px

function renderPath() {
  const container = document.getElementById('path-chapters');
  if (!container) return;
  container.innerHTML = '';

  PATH_CHAPTERS.forEach(ch => {
    const { done, total } = chapterProgress(ch);

    // ── Chapter banner ──
    const banner = document.createElement('div');
    banner.className = 'ch-banner';
    banner.style.setProperty('--ch', ch.color);
    banner.style.setProperty('--ch-dk', ch.dark);
    banner.innerHTML = `
      <span class="ch-b-icon">${ch.icon}</span>
      <div class="ch-b-text">
        <div class="ch-b-unit">${ch.unit}</div>
        <div class="ch-b-title">${ch.title}</div>
        <div class="ch-b-desc">${ch.desc}</div>
      </div>
      <div class="ch-b-prog">
        <div class="ch-b-frac">${done}/${total}</div>
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <circle cx="18" cy="18" r="15" fill="none" stroke="#fff" stroke-width="3"
            stroke-dasharray="${total ? Math.round(done/total*94) : 0} 94"
            stroke-linecap="round" transform="rotate(-90 18 18)"/>
        </svg>
      </div>`;
    container.appendChild(banner);

    // ── Node track ──
    const track = document.createElement('div');
    track.className = 'ch-track';
    track.style.setProperty('--ch', ch.color);
    track.style.setProperty('--ch-dk', ch.dark);

    const offsets = ch.lessons.map((_, i) => ZIG[i % ZIG.length]);

    ch.lessons.forEach((lesson, i) => {
      const stars    = getLessonStars(lesson.id);
      const unlocked = isLessonUnlocked(lesson.id);
      const isCurrent = unlocked && stars === 0;
      const offset   = offsets[i];

      // Label goes on the opposite side from the node offset
      const labelSide = offset >= 0 ? 'left' : 'right';

      let stateClass = 'locked';
      if (stars > 0)     stateClass = 'done';
      else if (unlocked) stateClass = 'available';

      const starsHtml = [1,2,3].map(n =>
        `<span class="ns ${n <= stars ? 'lit' : ''}">${n <= stars ? '★' : '☆'}</span>`
      ).join('');

      const nodeIcon = stars > 0 ? '✓' : (unlocked ? lesson.icon : '🔒');

      // ── Node slot ──
      const slot = document.createElement('div');
      slot.className = 'node-slot';
      slot.style.setProperty('--off', offset + 'px');
      slot.innerHTML = `
        ${isCurrent ? `<div class="jugar-bubble" style="--ch:${ch.color};color:${ch.color}">¡JUGAR!</div>` : ''}
        <div class="node-with-label">
          <button class="pnode ${stateClass}"
            onclick="${unlocked ? `startLesson('${lesson.id}')` : ''}"
            ${!unlocked ? 'disabled' : ''}>
            <span class="pnode-icon">${nodeIcon}</span>
          </button>
          <div class="node-side-label ${labelSide}">${lesson.title}</div>
        </div>
        <div class="pnode-stars">${starsHtml}</div>`;
      track.appendChild(slot);

      // ── SVG curved connector to next node ──
      if (i < ch.lessons.length - 1) {
        const x1 = MID + offset;
        const x2 = MID + offsets[i + 1];
        const connDone = getLessonStars(lesson.id) >= 1;
        const color    = connDone ? ch.color : '#CBD5E1';
        const dash     = connDone ? '' : '10 7';
        const opacity  = connDone ? '0.55' : '0.5';

        // Cubic bezier: starts going down from x1, curves to arrive at x2
        const conn = document.createElement('div');
        conn.className = 'node-connector';
        conn.innerHTML = `
          <svg viewBox="0 0 ${TRACK_W} 44" preserveAspectRatio="none">
            <path d="M${x1},2 C${x1},28 ${x2},16 ${x2},42"
              stroke="${color}" stroke-width="5" fill="none"
              stroke-linecap="round" stroke-linejoin="round"
              stroke-dasharray="${dash}" opacity="${opacity}"/>
          </svg>`;
        track.appendChild(conn);
      }
    });

    container.appendChild(track);

    // ── Chapter chest / trophy ──
    const allDone = done === total && total > 0;
    const trophy = document.createElement('div');
    trophy.className = `ch-trophy ${allDone ? 'earned' : ''}`;
    trophy.innerHTML = `
      <span class="trophy-icon">${allDone ? '🏆' : '🎁'}</span>
      <span class="trophy-label">${allDone ? '¡Unidad completada!' : 'Completa para desbloquear'}</span>`;
    container.appendChild(trophy);
  });
}

// ── Start a lesson ──
function startLesson(lessonId) {
  const allLessons = PATH_CHAPTERS.flatMap(ch => ch.lessons);
  const lesson = allLessons.find(l => l.id === lessonId);
  if (!lesson) return;

  // Gate: no hearts
  if (state.hearts <= 0) { showNoHearts(); return; }

  const qs = getLessonQuestions(lesson);
  if (!qs.length) { alert('Sin preguntas para esta lección.'); return; }

  // Build session
  session.mode      = `lesson:${lessonId}`;
  session.label     = lesson.title;
  session.lessonId  = lessonId;
  session.freeMode  = false;
  session.queue     = shuffle([...qs]);
  session.idx       = 0;
  session.correct   = 0;
  session.wrong     = 0;
  session.xpEarned  = 0;
  session.answered  = false;
  session.confGiven = false;

  showScreen('study');
  renderStudyCard();
}

function showLockedMsg() {
  // Brief shake on the locked node — just a friendly tooltip handled by title attr
}
