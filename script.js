/* ===========================
   PULSO — App Logic
   =========================== */

// ===========================
// DATA
// ===========================

const MODALITIES = [
  // Força
  { id: 'academia',   name: 'Academia',   emoji: '🏋️', cat: 'forca',    color: '#e8ff47', hasWeight: true,  cardio: false, impact: 'lower' },
  { id: 'crossfit',   name: 'Crossfit',   emoji: '🔥', cat: 'forca',    color: '#e8ff47', hasWeight: true,  cardio: true,  impact: 'full'  },
  { id: 'calistenia', name: 'Calistenia', emoji: '🤸', cat: 'forca',    color: '#e8ff47', hasWeight: false, cardio: false, impact: 'upper' },

  // Cardio
  { id: 'corrida',   name: 'Corrida',   emoji: '🏃', cat: 'cardio', color: '#3affb8', hasWeight: false, cardio: true, impact: 'lower' },
  { id: 'bike',      name: 'Bike',      emoji: '🚴', cat: 'cardio', color: '#3affb8', hasWeight: false, cardio: true, impact: 'lower' },
  { id: 'natacao',   name: 'Natação',   emoji: '🏊', cat: 'cardio', color: '#3affb8', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'remo',      name: 'Remo',      emoji: '🚣', cat: 'cardio', color: '#3affb8', hasWeight: false, cardio: true, impact: 'full'  },

  // Esportes coletivos
  { id: 'futebol',   name: 'Futebol',   emoji: '⚽', cat: 'coletivo', color: '#ff9f47', hasWeight: false, cardio: true, impact: 'lower' },
  { id: 'volei',     name: 'Vôlei',     emoji: '🏐', cat: 'coletivo', color: '#ff9f47', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'basquete',  name: 'Basquete',  emoji: '🏀', cat: 'coletivo', color: '#ff9f47', hasWeight: false, cardio: true, impact: 'lower' },
  { id: 'handebol',  name: 'Handebol',  emoji: '🤾', cat: 'coletivo', color: '#ff9f47', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'beachtennis', name: 'Beach Tennis', emoji: '🏖️', cat: 'coletivo', color: '#ff9f47', hasWeight: false, cardio: true, impact: 'full' },

  // Lutas / artes marciais
  { id: 'capoeira',  name: 'Capoeira',  emoji: '🥋', cat: 'lutas', color: '#c47aff', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'jiujitsu',  name: 'Jiu-jitsu', emoji: '🥊', cat: 'lutas', color: '#c47aff', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'muaythai',  name: 'Muay Thai', emoji: '👊', cat: 'lutas', color: '#c47aff', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'boxe',      name: 'Boxe',      emoji: '🥊', cat: 'lutas', color: '#c47aff', hasWeight: false, cardio: true, impact: 'upper' },

  // Raquete
  { id: 'tenis',   name: 'Tênis',  emoji: '🎾', cat: 'raquete', color: '#ff5c3a', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'padel',   name: 'Padel',  emoji: '🏓', cat: 'raquete', color: '#ff5c3a', hasWeight: false, cardio: true, impact: 'full'  },
  { id: 'squash',  name: 'Squash', emoji: '🎱', cat: 'raquete', color: '#ff5c3a', hasWeight: false, cardio: true, impact: 'full'  },

  // Outros
  { id: 'yoga',      name: 'Yoga',      emoji: '🧘', cat: 'outros', color: '#47c4ff', hasWeight: false, cardio: false, impact: 'full'  },
  { id: 'pilates',   name: 'Pilates',   emoji: '🌀', cat: 'outros', color: '#47c4ff', hasWeight: false, cardio: false, impact: 'core'  },
  { id: 'danca',     name: 'Dança',     emoji: '💃', cat: 'outros', color: '#47c4ff', hasWeight: false, cardio: true,  impact: 'full'  },
  { id: 'escalada',  name: 'Escalada',  emoji: '🧗', cat: 'outros', color: '#47c4ff', hasWeight: false, cardio: false, impact: 'upper' },
];

const CATEGORIES = [
  { id: 'forca',    label: 'Força',             emoji: '🏋️' },
  { id: 'cardio',   label: 'Cardio',            emoji: '🏃' },
  { id: 'coletivo', label: 'Esportes Coletivos', emoji: '⚽' },
  { id: 'lutas',    label: 'Lutas & Artes Marciais', emoji: '🥋' },
  { id: 'raquete',  label: 'Raquete',           emoji: '🎾' },
  { id: 'outros',   label: 'Outros',            emoji: '🧘' },
];

// State
let state = {
  myModalityIds: [],
  selectedModalityId: null,
  selectedDuration: 60,
  selectedIntensity: 'normal',
  selectedMuscle: 'full',
  selectedWeight: 'usual',
  weekOffset: 0,      // 0 = current week, -1 = last week, etc.
  selectedDayIndex: null,
  workouts: {},       // keyed by 'YYYY-MM-DD'
};

// ===========================
// DATE HELPERS
// ===========================

function getWeekDates(offset) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + (offset * 7));
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

function dateKey(date) {
  return date.toISOString().split('T')[0];
}

function todayKey() {
  return dateKey(new Date());
}

// ===========================
// NAVIGATION
// ===========================

let currentScreen = 'screen-splash';
let prevScreen = null;

function goTo(screenId) {
  const current = document.getElementById(currentScreen);
  const next = document.getElementById(screenId);
  if (!next || screenId === currentScreen) return;

  current.classList.remove('active');
  current.classList.add('exit');
  setTimeout(() => current.classList.remove('exit'), 400);

  next.classList.add('active');
  prevScreen = currentScreen;
  currentScreen = screenId;

  if (screenId === 'screen-checkin') resetCheckin();
  updateNavButtons(screenId);
}

function goBack() {
  if (prevScreen) goTo(prevScreen);
  else goTo('screen-home');
}

function updateNavButtons(screenId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
}

// ===========================
// RENDER — HOME
// ===========================

function renderWeekStrip() {
  const container = document.getElementById('weekContainer');
  if (!container) return;

  const weekDates = getWeekDates(state.weekOffset);
  const todayStr = todayKey();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Week header: range label + nav arrows
  const first = weekDates[0];
  const last  = weekDates[6];
  const fmtOpts = { day: '2-digit', month: 'short' };
  const rangeLabel = state.weekOffset === 0
    ? 'Esta semana'
    : state.weekOffset === -1
      ? 'Semana passada'
      : `${first.toLocaleDateString('pt-BR', fmtOpts)} – ${last.toLocaleDateString('pt-BR', fmtOpts)}`;

  const strip = weekDates.map((date, i) => {
    const key = dateKey(date);
    const workout = state.workouts[key];
    const mod = workout ? MODALITIES.find(m => m.id === workout.modal) : null;
    const isToday = key === todayStr;
    const isSelected = state.selectedDayIndex === i && state.weekOffset === 0;
    const isHighLoad = workout && workout.intensity === 'heavy';
    const dayNum = String(date.getDate()).padStart(2, '0');

    return `
      <div class="day-block ${isToday ? 'today' : ''} ${isHighLoad ? 'loaded' : ''} ${isSelected ? 'selected-day' : ''}"
           onclick="selectDay(${i})">
        <div class="day-name">${dayNames[date.getDay()]}</div>
        <div class="day-num">${dayNum}</div>
        <div class="day-dot-wrap">
          ${mod
            ? `<div class="day-dot" style="background:${mod.color};width:8px;height:8px;"></div>
               <div style="font-size:0.6rem;color:var(--text-muted);margin-top:2px">${mod.emoji}</div>`
            : `<div style="width:8px;height:8px;opacity:0"></div>`}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="week-nav-row">
      <button class="week-nav-btn" onclick="shiftWeek(-1)">←</button>
      <span class="week-range-label">${rangeLabel}</span>
      <button class="week-nav-btn ${state.weekOffset >= 0 ? 'disabled' : ''}"
              onclick="shiftWeek(1)" ${state.weekOffset >= 0 ? 'disabled' : ''}>→</button>
    </div>
    <div class="week-strip">${strip}</div>
  `;

  // Day detail panel
  renderDayDetail();
}

function shiftWeek(dir) {
  if (dir === 1 && state.weekOffset >= 0) return;
  state.weekOffset += dir;
  state.selectedDayIndex = null;
  renderWeekStrip();
}

function selectDay(i) {
  state.selectedDayIndex = (state.selectedDayIndex === i) ? null : i;
  renderWeekStrip();
}

function renderDayDetail() {
  const el = document.getElementById('dayDetail');
  if (!el) return;

  if (state.selectedDayIndex === null) {
    el.innerHTML = '';
    return;
  }

  const weekDates = getWeekDates(state.weekOffset);
  const date = weekDates[state.selectedDayIndex];
  const key = dateKey(date);
  const workout = state.workouts[key];

  const label = date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  if (!workout) {
    el.innerHTML = `
      <div class="day-detail-card empty">
        <div class="dd-date">${label}</div>
        <div class="dd-empty">Nenhum treino registrado neste dia.</div>
        <button class="dd-add-btn" onclick="goTo('screen-checkin')">+ Registrar treino</button>
      </div>
    `;
    return;
  }

  const mod = MODALITIES.find(m => m.id === workout.modal);
  const intensityLabel = { light:'Leve', normal:'Normal', heavy:'Pesado', pr:'PR 🏆' };
  const muscleLabel    = { lower:'Membros Inferiores', upper:'Membros Superiores', full:'Full Body', core:'Core' };

  el.innerHTML = `
    <div class="day-detail-card" style="--dd-color:${mod ? mod.color : 'var(--accent)'}">
      <div class="dd-date">${label}</div>
      <div class="dd-mod-row">
        <span class="dd-emoji">${mod ? mod.emoji : '❓'}</span>
        <div>
          <div class="dd-mod-name">${mod ? mod.name : workout.modal}</div>
          <div class="dd-meta">${workout.duration} min · ${intensityLabel[workout.intensity] || workout.intensity}${workout.muscle ? ' · ' + (muscleLabel[workout.muscle] || workout.muscle) : ''}</div>
        </div>
      </div>
      ${workout.note ? `<div class="dd-note">${workout.note}</div>` : ''}
    </div>
  `;
}

function renderMyMods() {
  const el = document.getElementById('myModBlocks');
  if (!el) return;

  if (state.myModalityIds.length === 0) {
    el.innerHTML = `
      <div class="empty-mods-hint" onclick="goTo('screen-modalities')">
        <span class="empty-mods-icon">＋</span>
        <span>Adicione suas modalidades</span>
      </div>
    `;
    return;
  }

  el.innerHTML = state.myModalityIds.map(id => {
    const mod = MODALITIES.find(m => m.id === id);
    if (!mod) return '';
    return `
      <div class="mod-block selected" style="--mod-color:${mod.color}" onclick="goTo('screen-analysis')">
        <span class="mod-emoji">${mod.emoji}</span>
        <div class="mod-name">${mod.name}</div>
        <div class="mod-load-bar">
          <div class="mod-load-fill" style="width:0%;background:${mod.color}"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ===========================
// RENDER — MODALITIES SCREEN
// ===========================

function renderAllModalities() {
  const el = document.getElementById('allModCategories');
  if (!el) return;

  el.innerHTML = CATEGORIES.map(cat => {
    const mods = MODALITIES.filter(m => m.cat === cat.id);
    return `
      <div class="cat-section">
        <div class="cat-title">${cat.emoji} ${cat.label}</div>
        <div class="cat-grid">
          ${mods.map(mod => `
            <div class="cat-mod-block ${state.myModalityIds.includes(mod.id) ? 'selected' : ''}"
                 style="--mod-color:${mod.color}"
                 data-id="${mod.id}"
                 onclick="toggleModality('${mod.id}', this)">
              <div class="mod-emoji">${mod.emoji}</div>
              <div class="mod-name">${mod.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleModality(id, el) {
  const idx = state.myModalityIds.indexOf(id);
  if (idx === -1) {
    state.myModalityIds.push(id);
    el.classList.add('selected');
  } else {
    state.myModalityIds.splice(idx, 1);
    el.classList.remove('selected');
  }
}

function saveModalities() {
  renderMyMods();
  showToast('Modalidades salvas ✓');
  setTimeout(() => goTo('screen-home'), 600);
}

// ===========================
// RENDER — CHECK-IN
// ===========================

function resetCheckin() {
  state.selectedModalityId = null;
  state.selectedDuration = 60;
  state.selectedIntensity = 'normal';
  state.selectedMuscle = 'full';
  state.selectedWeight = 'usual';

  document.getElementById('step1').classList.remove('hidden');
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('stepForce').classList.add('hidden');
  document.getElementById('step4').classList.add('hidden');
  document.getElementById('saveBar').classList.add('hidden');

  renderCheckinMods();
}

function renderCheckinMods() {
  const el = document.getElementById('checkinModGrid');
  if (!el) return;

  const mods = state.myModalityIds.map(id => MODALITIES.find(m => m.id === id)).filter(Boolean);
  // Also show all if only a few selected
  const allMods = MODALITIES;

  el.innerHTML = allMods.map(mod => `
    <div class="mod-block" style="--mod-color:${mod.color}" data-id="${mod.id}" onclick="selectMod('${mod.id}', this)">
      <span class="mod-emoji">${mod.emoji}</span>
      <div class="mod-name">${mod.name}</div>
    </div>
  `).join('');
}

function selectMod(id, el) {
  document.querySelectorAll('#checkinModGrid .mod-block').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedModalityId = id;

  // Show next steps with stagger
  setTimeout(() => {
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('step3').classList.remove('hidden');

    const mod = MODALITIES.find(m => m.id === id);
    if (mod && mod.hasWeight) {
      document.getElementById('stepForce').classList.remove('hidden');
    } else {
      document.getElementById('stepForce').classList.add('hidden');
    }

    document.getElementById('step4').classList.remove('hidden');
    document.getElementById('saveBar').classList.remove('hidden');
  }, 150);
}

function selectDur(el) {
  document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.selectedDuration = parseInt(el.dataset.val);
}

function selectInt(el) {
  document.querySelectorAll('.int-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.selectedIntensity = el.dataset.val;
}

function selectMuscle(el) {
  document.querySelectorAll('.muscle-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.selectedMuscle = el.dataset.val;
}

function selectWeight(el) {
  document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.selectedWeight = el.dataset.val;
}

function saveCheckin() {
  if (!state.selectedModalityId) {
    showToast('Selecione uma modalidade');
    return;
  }
  const key = todayKey();
  const note = document.querySelector('.note-input') ? document.querySelector('.note-input').value : '';
  state.workouts[key] = {
    modal:     state.selectedModalityId,
    duration:  state.selectedDuration,
    intensity: state.selectedIntensity,
    muscle:    state.selectedMuscle,
    weight:    state.selectedWeight,
    note:      note,
  };
  showToast('Treino registrado ✓');
  setTimeout(() => { goTo('screen-home'); }, 700);
}

// ===========================
// FEELING + HOME DYNAMIC RENDER
// ===========================

function setFeeling(btn, feel) {
  document.querySelectorAll('.feeling-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.todayFeeling = feel;
  // update context message based on feeling + load
  renderStatusContext();
}

// ===========================
// LOAD CALCULATION
// ===========================

// Intensity weights
const INTENSITY_SCORE = { light: 1, normal: 2, heavy: 3, pr: 3.5 };
// Duration brackets
function durationScore(min) {
  if (min <= 30) return 0.6;
  if (min <= 45) return 0.8;
  if (min <= 60) return 1.0;
  if (min <= 90) return 1.3;
  return 1.6;
}
// Impact multiplier
const IMPACT_SCORE = { lower: 1.2, upper: 0.9, full: 1.1, core: 0.8 };

function calcWeekLoad() {
  // Look at last 7 days
  const scores = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const w = state.workouts[key];
    if (!w) { scores.push(0); continue; }
    const intScore  = INTENSITY_SCORE[w.intensity] || 2;
    const durScore  = durationScore(w.duration || 60);
    const impScore  = IMPACT_SCORE[w.muscle] || 1.0;
    scores.push(intScore * durScore * impScore);
  }
  // Max possible per day ~= 3.5 * 1.6 * 1.2 = 6.72; week max ~= 47
  const total = scores.reduce((a, b) => a + b, 0);
  const pct   = Math.min(100, Math.round((total / 28) * 100)); // 28 = moderate full week
  return { pct, scores, total };
}

function loadZone(pct) {
  if (pct < 35) return 'rest';
  if (pct < 65) return 'ok';
  if (pct < 85) return 'attention';
  return 'risk';
}

function zoneLabel(zone) {
  return { rest: 'Descansada', ok: 'OK', attention: 'Atenção', risk: 'Risco' }[zone];
}
function zoneColor(zone) {
  return { rest: 'var(--accent3)', ok: 'var(--accent3)', attention: 'var(--yellow)', risk: 'var(--red)' }[zone];
}

// ===========================
// OVERLOAD PATTERN DETECTION
// ===========================

function detectAlert(scores) {
  // Count consecutive heavy days
  const recentDays = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    recentDays.push(state.workouts[dateKey(d)]);
  }

  const heavyConsec = recentDays.filter(w => w && (w.intensity === 'heavy' || w.intensity === 'pr')).length;
  const lowerDays   = recentDays.filter(w => w && (w.muscle === 'lower' || w.muscle === 'full' ||
                        (w.modal && ['corrida','bike','futebol','basquete','capoeira','jiujitsu','muaythai','volei','handebol','beachtennis','tenis','padel'].includes(w.modal)))).length;

  if (heavyConsec >= 3) {
    return {
      title: `${heavyConsec} treinos pesados consecutivos`,
      text: `Você acumulou treinos de alta intensidade nos últimos ${heavyConsec} dias sem descanso suficiente. Isso aumenta o risco de fadiga e lesão.`
    };
  }
  if (lowerDays >= 3) {
    return {
      title: 'Membros inferiores sobrecarregados',
      text: `Pernas e glúteos foram exigidos em ${lowerDays} dos últimos 4 dias. Considere um treino de membros superiores ou descanso ativo.`
    };
  }
  return null;
}

// ===========================
// CONTEXT MESSAGE
// ===========================

function todayContext() {
  const todayW   = state.workouts[todayKey()];
  const { pct }  = calcWeekLoad();
  const zone     = loadZone(pct);
  const feel     = state.todayFeeling;

  // No workouts at all this week
  const hasAny = Object.keys(state.workouts).length > 0;
  if (!hasAny) {
    return { label: 'Bem-vinda de volta', msg: 'Registre seu primeiro treino para começar a acompanhar sua performance.' };
  }

  // Today already has a workout
  if (todayW) {
    const mod = MODALITIES.find(m => m.id === todayW.modal);
    return {
      label: 'Treino registrado hoje',
      msg: `${mod ? mod.emoji + ' ' + mod.name : 'Treino'} — ${todayW.duration} min. ${zone === 'risk' ? 'Sua carga está alta, priorize a recuperação.' : 'Boa sessão!'}`
    };
  }

  // Has feeling input
  if (feel === 'tired' && zone === 'risk') {
    return { label: 'Sinal de alerta', msg: 'Você está cansada e a carga da semana está alta. Hoje pode ser um bom dia de descanso ativo.' };
  }
  if (feel === 'tired') {
    return { label: 'Como você está hoje', msg: 'Cansaço pode ser sinal que o corpo pede recuperação. Avalie a intensidade antes de treinar.' };
  }
  if (feel === 'great' && zone === 'rest') {
    return { label: 'Pronta para treinar', msg: 'Sua carga está baixa e você está disposta — bom momento para um treino mais intenso.' };
  }

  // Zone-based default
  const zoneMsg = {
    rest:      'Sua semana está tranquila. Como pretende treinar hoje?',
    ok:        'Carga equilibrada. Boa semana até agora.',
    attention: 'Carga acumulando. Avalie a intensidade do treino de hoje.',
    risk:      'Carga elevada esta semana. Considere descanso ou treino leve hoje.',
  };
  return { label: 'Como você está hoje', msg: zoneMsg[zone] };
}

// ===========================
// RENDER HOME STATUS
// ===========================

function renderStatusContext() {
  const ctx = todayContext();
  const el  = document.getElementById('statusContext');
  if (el) {
    el.innerHTML = `<div class="sc-label">${ctx.label}</div><p class="sc-msg">${ctx.msg}</p>`;
  }
}

function renderLoadBar() {
  const hasAny = Object.keys(state.workouts).length > 0;
  const bar  = document.getElementById('loadBar');
  const pill = document.getElementById('loadStatePill');

  // No workouts yet — keep bar empty and pill neutral
  if (!hasAny) {
    if (bar)  { bar.style.width = '0%'; }
    if (pill) {
      pill.textContent = 'Sem dados ainda';
      pill.style.background  = 'var(--surface2)';
      pill.style.color       = 'var(--text-dim)';
      pill.style.borderColor = 'var(--border)';
    }
    // Reset all zone labels to dim
    ['rest','attention','risk'].forEach(z => {
      const el = document.getElementById('lz-' + z);
      if (el) el.classList.remove('active-lz');
    });
    return;
  }

  const { pct } = calcWeekLoad();
  const zone    = loadZone(pct);

  // Animate bar
  if (bar) {
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = pct + '%';
      bar.style.background = pct < 35
        ? 'linear-gradient(90deg, var(--accent3), var(--accent3))'
        : pct < 65
          ? 'linear-gradient(90deg, var(--accent3), var(--yellow))'
          : pct < 85
            ? 'linear-gradient(90deg, var(--accent3), var(--yellow) 60%, var(--red))'
            : 'linear-gradient(90deg, var(--accent3), var(--yellow) 40%, var(--red) 75%)';
    }, 300);
  }

  // Zone labels — highlight active
  ['rest','attention','risk'].forEach(z => {
    const el = document.getElementById('lz-' + z);
    if (el) el.classList.remove('active-lz');
  });
  const activeId = zone === 'ok' ? 'lz-rest' : 'lz-' + zone;
  const activeEl = document.getElementById(activeId);
  if (activeEl) activeEl.classList.add('active-lz');

  // Pill showing state + pct
  if (pill) {
    pill.textContent = zoneLabel(zone) + ' · ' + pct + '%';
    pill.style.background  = zoneColor(zone) + '22';
    pill.style.color       = zoneColor(zone);
    pill.style.borderColor = zoneColor(zone) + '55';
  }
}

function renderAlertCard() {
  const card = document.getElementById('alertCard');
  if (!card) return;

  // Never show alert if no workouts have been recorded at all
  const hasAny = Object.keys(state.workouts).length > 0;
  if (!hasAny) {
    card.classList.add('hidden');
    return;
  }

  const { scores } = calcWeekLoad();
  const alert = detectAlert(scores);

  if (alert) {
    card.classList.remove('hidden');
    document.getElementById('alertTitle').textContent = alert.title;
    document.getElementById('alertText').textContent  = alert.text;
  } else {
    card.classList.add('hidden');
  }
}

function renderHome() {
  // top date
  const dateEl = document.getElementById('topDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  }
  // restore today's feeling if saved
  if (state.todayFeeling) {
    document.querySelectorAll('.feeling-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.feel === state.todayFeeling);
    });
  }
  renderStatusContext();
  renderLoadBar();
  renderAlertCard();
  renderWeekStrip();
  renderMyMods();
}

// ===========================
// TOAST
// ===========================

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ===========================
// PR DATA — MOVEMENTS BY CATEGORY
// ===========================

const PR_CATEGORIES = [
  {
    id: 'levantamento',
    label: 'Levantamento de Peso',
    emoji: '🏋️',
    color: '#e8ff47',
    unit: 'kg',
    subgroups: [
      {
        label: 'Olímpicos',
        moves: [
          { id: 'snatch',          name: 'Snatch',           emoji: '🔼' },
          { id: 'clean_jerk',      name: 'Clean & Jerk',     emoji: '🔼' },
          { id: 'clean',           name: 'Clean',            emoji: '⬆️' },
          { id: 'hang_clean',      name: 'Hang Clean',       emoji: '⬆️' },
          { id: 'power_clean',     name: 'Power Clean',      emoji: '⬆️' },
          { id: 'hang_power_clean',name: 'Hang Power Clean', emoji: '⬆️' },
          { id: 'hang_power_snatch',name:'Hang Power Snatch',emoji: '🔼' },
          { id: 'squat_clean',     name: 'Squat Clean',      emoji: '⬆️' },
          { id: 'push_jerk',       name: 'Push Jerk',        emoji: '🔼' },
        ]
      },
      {
        label: 'Força',
        moves: [
          { id: 'back_squat',    name: 'Back Squat',      emoji: '🦵' },
          { id: 'front_squat',   name: 'Front Squat',     emoji: '🦵' },
          { id: 'overhead_squat',name: 'Overhead Squat',  emoji: '🦵' },
          { id: 'deadlift',      name: 'Deadlift',        emoji: '💪' },
          { id: 'bench_press',   name: 'Bench Press',     emoji: '💪' },
          { id: 'shoulder_press',name: 'Shoulder Press',  emoji: '💪' },
          { id: 'push_press',    name: 'Push Press',      emoji: '💪' },
          { id: 'strict_press',  name: 'Strict Press',    emoji: '💪' },
          { id: 'barbell_row',   name: 'Barbell Row',     emoji: '🔄' },
        ]
      }
    ]
  },
  {
    id: 'ginastica',
    label: 'Ginástica',
    emoji: '🤸',
    color: '#c47aff',
    unit: 'reps',
    subgroups: [
      {
        label: 'Estático / Isométrico',
        moves: [
          { id: 'planche',       name: 'Planche',          emoji: '🧍' },
          { id: 'front_lever',   name: 'Front Lever',      emoji: '🧍' },
          { id: 'back_lever',    name: 'Back Lever',       emoji: '🧍' },
          { id: 'l_sit',         name: 'L-Sit',            emoji: '🧍' },
          { id: 'human_flag',    name: 'Human Flag',       emoji: '🚩' },
          { id: 'handstand',     name: 'Handstand (tempo)',emoji: '🙃' },
        ]
      },
      {
        label: 'Dinâmico',
        moves: [
          { id: 'muscle_up',    name: 'Muscle Up',         emoji: '🔁' },
          { id: 'pull_up',      name: 'Pull Up',           emoji: '🆙' },
          { id: 'chest_to_bar', name: 'Chest-to-Bar',      emoji: '🆙' },
          { id: 'bar_mu',       name: 'Bar Muscle Up',     emoji: '🔁' },
          { id: 'toes_to_bar',  name: 'Toes to Bar',       emoji: '🦶' },
          { id: 'hspu',         name: 'HSPU',              emoji: '🙃' },
          { id: 'pistol',       name: 'Pistol Squat',      emoji: '🦵' },
          { id: 'ring_dip',     name: 'Ring Dip',          emoji: '💍' },
        ]
      }
    ]
  },
  {
    id: 'endurance',
    label: 'Endurance',
    emoji: '🏃',
    color: '#3affb8',
    unit: 'min',
    subgroups: [
      {
        label: 'Corrida',
        moves: [
          { id: 'run_1k',   name: '1 km',      emoji: '🏃' },
          { id: 'run_5k',   name: '5 km',      emoji: '🏃' },
          { id: 'run_10k',  name: '10 km',     emoji: '🏃' },
          { id: 'run_21k',  name: 'Meia Maratona', emoji: '🏃' },
          { id: 'run_42k',  name: 'Maratona',  emoji: '🏃' },
        ]
      },
      {
        label: 'Outros',
        moves: [
          { id: 'row_500m',  name: 'Remo 500m',   emoji: '🚣' },
          { id: 'row_2k',    name: 'Remo 2 km',   emoji: '🚣' },
          { id: 'bike_1k',   name: 'Bike 1 km',   emoji: '🚴' },
          { id: 'swim_100m', name: 'Nado 100m',   emoji: '🏊' },
          { id: 'swim_1k',   name: 'Nado 1 km',   emoji: '🏊' },
          { id: 'jump_rope', name: 'Corda (duplo)', emoji: '🪢' },
        ]
      }
    ]
  },
  {
    id: 'capoeira',
    label: 'Capoeira',
    emoji: '🥋',
    color: '#ff9f47',
    unit: 'nível',
    subgroups: [
      {
        label: 'Acrobacias',
        moves: [
          { id: 'au',          name: 'Aú',              emoji: '🌀' },
          { id: 'macaco',      name: 'Macaco',          emoji: '🌀' },
          { id: 'mortal',      name: 'Mortal',          emoji: '🌀' },
          { id: 'parafuso',    name: 'Parafuso',        emoji: '🌀' },
          { id: 'paralelo',    name: 'Aú Paralelo',     emoji: '🌀' },
          { id: 'volta_mundo', name: 'Volta ao Mundo',  emoji: '🌀' },
        ]
      },
      {
        label: 'Golpes',
        moves: [
          { id: 'ginga_tempo',    name: 'Ginga (tempo contínuo)', emoji: '⏱️' },
          { id: 'bencao',         name: 'Bênção',                 emoji: '🦶' },
          { id: 'armada',         name: 'Armada',                 emoji: '🦵' },
          { id: 'meia_lua',       name: 'Meia-lua de frente',     emoji: '🦵' },
          { id: 'meia_lua_compasso', name: 'Meia-lua de compasso',emoji: '🦵' },
          { id: 'queixada',       name: 'Queixada',               emoji: '🦵' },
        ]
      }
    ]
  },
  {
    id: 'esportes',
    label: 'Esportes',
    emoji: '⚽',
    color: '#ff5c3a',
    unit: 'marca',
    subgroups: [
      {
        label: 'Tênis & Raquete',
        moves: [
          { id: 'saque_kmh',   name: 'Velocidade de Saque (km/h)', emoji: '🎾' },
          { id: 'rally_bolas', name: 'Rally mais longo (bolas)',    emoji: '🎾' },
        ]
      },
      {
        label: 'Outros',
        moves: [
          { id: 'natacao_pace',  name: 'Melhor pace nado (min/100m)', emoji: '🏊' },
          { id: 'ciclismo_kmh',  name: 'Velocidade max bike (km/h)',   emoji: '🚴' },
          { id: 'salto_altura',  name: 'Salto em altura (cm)',         emoji: '🏀' },
          { id: 'sprint_100m',   name: 'Sprint 100m',                  emoji: '⚡' },
        ]
      }
    ]
  }
];

// PR State
let prState = {
  activeCat: 'levantamento',
  records: {},
  modalCat: 'levantamento',
  modalMove: null,
  modalUnit: 'kg',
};

// ===========================
// PR RENDER
// ===========================

function renderPRTabs() {
  const el = document.getElementById('prTabs');
  if (!el) return;
  el.innerHTML = PR_CATEGORIES.map(cat => `
    <button class="pr-tab ${prState.activeCat === cat.id ? 'active' : ''}"
            onclick="setPRCat('${cat.id}')">
      ${cat.emoji} ${cat.label}
    </button>
  `).join('');
}

function setPRCat(catId) {
  prState.activeCat = catId;
  renderPRTabs();
  renderPRList();
}

function renderPRList() {
  const el = document.getElementById('prListWrap');
  if (!el) return;

  const cat = PR_CATEGORIES.find(c => c.id === prState.activeCat);
  if (!cat) return;

  // Collect all move IDs that have a record
  const allMoveIds = cat.subgroups.flatMap(sg => sg.moves.map(m => m.id));
  const hasAnyRecord = allMoveIds.some(id => prState.records[id]);

  if (!hasAnyRecord) {
    el.innerHTML = `
      <div class="pr-empty">
        <span class="pr-empty-icon">🏆</span>
        Nenhum recorde registrado ainda.<br>
        Toque em <strong>+ Novo PR</strong> para começar.
      </div>
    `;
    return;
  }

  let html = '';
  cat.subgroups.forEach(sg => {
    const movesWithRecords = sg.moves.filter(m => prState.records[m.id]);
    if (movesWithRecords.length === 0) return;

    html += `<div class="pr-subgroup-title">${sg.label}</div>`;
    movesWithRecords.forEach(move => {
      const rec = prState.records[move.id];
      const dateStr = rec.date ? new Date(rec.date + 'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'2-digit' }) : '';
      html += `
        <div class="pr-item" style="--pr-color:${cat.color}">
          <div class="pr-item-icon">${move.emoji}</div>
          <div class="pr-item-body">
            <div class="pr-item-name">
              ${move.name}
              ${rec.isNew ? '<span class="pr-new-badge">NOVO</span>' : ''}
            </div>
            <div class="pr-item-meta">${dateStr}</div>
          </div>
          <div class="pr-item-value">
            <div class="pr-item-number">${rec.value}</div>
            <span class="pr-item-unit">${rec.unit}</span>
          </div>
        </div>
      `;
    });
  });

  el.innerHTML = html;
}

// ===========================
// ADD PR MODAL
// ===========================

function openAddPR() {
  document.getElementById('addPRModal').classList.remove('hidden');
  prState.modalCat = prState.activeCat;
  prState.modalMove = null;
  renderModalCats();
  renderModalMoves();
  updateModalUnit();
  // set today as default date
  document.getElementById('prDateInput').value = new Date().toISOString().split('T')[0];
}

function closeAddPR() {
  document.getElementById('addPRModal').classList.add('hidden');
}

function renderModalCats() {
  const el = document.getElementById('modalCatRow');
  if (!el) return;
  el.innerHTML = PR_CATEGORIES.map(cat => `
    <button class="modal-cat-btn ${prState.modalCat === cat.id ? 'active' : ''}"
            onclick="setModalCat('${cat.id}')">
      ${cat.emoji} ${cat.label}
    </button>
  `).join('');
}

function setModalCat(catId) {
  prState.modalCat = catId;
  prState.modalMove = null;
  renderModalCats();
  renderModalMoves();
  updateModalUnit();
}

function renderModalMoves() {
  const el = document.getElementById('modalMoveList');
  if (!el) return;
  const cat = PR_CATEGORIES.find(c => c.id === prState.modalCat);
  if (!cat) return;

  let html = '';
  cat.subgroups.forEach(sg => {
    html += `<div style="font-size:0.6rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 0 0.3rem">${sg.label}</div>`;
    sg.moves.forEach(m => {
      html += `
        <button class="modal-move-btn ${prState.modalMove === m.id ? 'active' : ''}"
                onclick="setModalMove('${m.id}')">
          ${m.emoji} ${m.name}
        </button>
      `;
    });
  });
  el.innerHTML = html;
}

function setModalMove(moveId) {
  prState.modalMove = moveId;
  renderModalMoves();
}

function updateModalUnit() {
  const cat = PR_CATEGORIES.find(c => c.id === prState.modalCat);
  const defaultUnit = cat ? cat.unit : 'kg';
  prState.modalUnit = defaultUnit;

  const el = document.getElementById('unitToggle');
  const label = document.getElementById('modalValueLabel');

  // Offer unit choices based on category
  let units = [];
  if (prState.modalCat === 'levantamento') units = ['kg', 'lb'];
  else if (prState.modalCat === 'ginastica') units = ['reps', 'seg'];
  else if (prState.modalCat === 'endurance') units = ['min', 'seg'];
  else if (prState.modalCat === 'capoeira') units = ['seg', 'nível', 'reps'];
  else units = ['marca', 'km/h', 'cm', 'min'];

  prState.modalUnit = units[0];
  label.textContent = `Valor (${prState.modalUnit})`;

  el.innerHTML = units.map(u => `
    <button class="unit-btn ${u === prState.modalUnit ? 'active' : ''}"
            onclick="setUnit('${u}', this)">${u}</button>
  `).join('');
}

function setUnit(unit, el) {
  prState.modalUnit = unit;
  document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('modalValueLabel').textContent = `Valor (${unit})`;
}

function savePR() {
  const moveId = prState.modalMove;
  const value = parseFloat(document.getElementById('prValueInput').value);
  const date = document.getElementById('prDateInput').value;

  if (!moveId) { showToast('Selecione um movimento'); return; }
  if (isNaN(value) || value <= 0) { showToast('Informe um valor válido'); return; }

  const existing = prState.records[moveId];
  const isNew = !existing || value > existing.value;

  prState.records[moveId] = {
    value,
    unit: prState.modalUnit,
    date,
    isNew,
  };

  closeAddPR();
  document.getElementById('prValueInput').value = '';
  document.getElementById('prNoteInput').value = '';

  // Switch to the saved cat
  prState.activeCat = prState.modalCat;
  renderPRTabs();
  renderPRList();

  showToast(isNew ? '🏆 Novo PR registrado!' : 'Recorde atualizado ✓');
}


// ===========================
// RENDER — ANALYSIS SCREEN
// ===========================

function getRecentWorkouts(days) {
  // Returns array of {date, workout, mod} for last N days, most recent first
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const w = state.workouts[key];
    if (w) {
      const mod = MODALITIES.find(m => m.id === w.modal);
      result.push({ key, date: d, workout: w, mod });
    }
  }
  return result;
}

function calcBodyRegions(recent) {
  // Score each region based on recent workouts
  const regions = { lower: 0, upper: 0, cardio: 0, core: 0 };

  const lowerMods = ['corrida','bike','futebol','basquete','capoeira','jiujitsu','muaythai','volei','handebol','beachtennis','tenis','padel','squash','danca'];
  const cardioMods = ['corrida','bike','natacao','remo','futebol','basquete','handebol','capoeira','jiujitsu','muaythai','beachtennis','tenis','padel','squash','danca','crossfit'];
  const upperMods = ['calistenia','escalada','boxe','muaythai'];

  recent.forEach(({ workout: w }) => {
    const intMult = { light: 0.5, normal: 1, heavy: 1.5, pr: 1.8 }[w.intensity] || 1;

    // Muscle group from force exercises
    if (w.muscle === 'lower' || w.muscle === 'full') regions.lower += intMult;
    if (w.muscle === 'upper' || w.muscle === 'full') regions.upper += intMult;
    if (w.muscle === 'core')  regions.core  += intMult;

    // Modal-based inference
    if (lowerMods.includes(w.modal))  regions.lower  += intMult * 0.8;
    if (cardioMods.includes(w.modal)) regions.cardio += intMult * 0.9;
    if (upperMods.includes(w.modal))  regions.upper  += intMult * 0.6;
  });

  return regions;
}

function regionStatus(score, max) {
  const pct = score / max;
  if (pct < 0.3)  return { cls: 'green', label: 'Descansado' };
  if (pct < 0.65) return { cls: 'yellow', label: 'Moderado' };
  return { cls: 'red', label: 'Alta carga' };
}

function buildRecommendations(recent, regions) {
  const recs = [];
  const maxRegion = Math.max(...Object.values(regions));

  if (regions.lower >= 2.5) {
    recs.push('🦵 Evite corrida, agachamento e esportes de impacto nas próximas 24–48h');
  }
  if (regions.cardio >= 3) {
    recs.push('🫀 Volume cardiovascular elevado — priorize intensidade leve se treinar hoje');
  }
  if (regions.upper >= 2.5) {
    recs.push('💪 Membros superiores sobrecarregados — evite empurrar e puxar pesado');
  }
  if (maxRegion >= 3.5) {
    recs.push('🛌 Considere descanso ativo hoje: caminhada leve ou alongamento');
    recs.push('💧 Hidratação redobrada — fundamental para recuperação muscular');
  } else if (maxRegion < 1 && recent.length === 0) {
    recs.push('⚡ Semana tranquila — bom momento para um treino de maior intensidade');
  } else {
    recs.push('✅ Carga equilibrada — mantenha o ritmo e respeite o descanso');
  }

  return recs;
}

function renderAnalysis() {
  const el = document.getElementById('analysisBody');
  if (!el) return;

  const hasAny = Object.keys(state.workouts).length > 0;

  // ---- EMPTY STATE ----
  if (!hasAny) {
    el.innerHTML = `
      <div class="analysis-card">
        <div class="ac-title">Nenhum dado ainda</div>
        <p class="ac-text" style="margin-top:0.4rem">
          Registre seus treinos para começar a ver análise de carga,
          mapa de estimulação por região e recomendações personalizadas.
        </p>
      </div>
    `;
    return;
  }

  // ---- DATA ----
  const recent3 = getRecentWorkouts(3);   // last 3 days with workouts
  const recent7 = getRecentWorkouts(7);
  const { pct }  = calcWeekLoad();
  const zone     = loadZone(pct);
  const regions  = calcBodyRegions(recent3.length ? recent3 : recent7);
  const maxR     = Math.max(...Object.values(regions), 0.1);
  const recs     = buildRecommendations(recent3, regions);

  // ---- ESTADO ATUAL ----
  const zoneMap = {
    rest:      { cls: 'green',  icon: '✓',  msg: 'Carga baixa — corpo recuperado' },
    ok:        { cls: 'green',  icon: '✓',  msg: 'Carga equilibrada — boa semana' },
    attention: { cls: 'yellow', icon: '⚡', msg: 'Carga acumulando — atenção à intensidade' },
    risk:      { cls: 'red',    icon: '⚠',  msg: 'Carga elevada — risco de fadiga' },
  };
  const zi = zoneMap[zone];

  // Last 3 days summary text
  const summaryParts = recent3.map(({ workout: w, mod }) =>
    `${mod ? mod.emoji + ' ' + mod.name : w.modal} (${w.intensity === 'heavy' ? 'pesado' : w.intensity === 'light' ? 'leve' : w.intensity === 'pr' ? 'PR' : 'normal'})`
  );
  const summaryText = summaryParts.length
    ? `Últimos ${summaryParts.length} dia${summaryParts.length > 1 ? 's' : ''} com treino: ${summaryParts.join(' → ')}.`
    : 'Nenhum treino nos últimos 3 dias.';

  // ---- BODY MAP ----
  const lowerSt  = regionStatus(regions.lower,  maxR);
  const upperSt  = regionStatus(regions.upper,  maxR);
  const cardioSt = regionStatus(regions.cardio, maxR);
  const coreSt   = regionStatus(regions.core,   maxR);

  // ---- RENDER ----
  el.innerHTML = `
    <div class="analysis-card">
      <div class="ac-title">Estado atual</div>
      <div class="ac-status ${zi.cls}">${zi.icon} ${zi.msg}</div>
      <p class="ac-text">${summaryText}</p>
    </div>

    <div class="analysis-card">
      <div class="ac-title">Mapa de estimulação</div>
      <div class="body-map-row">
        <div class="body-region ${lowerSt.cls}">
          <span>🦵</span> Inferiores<br><small>${lowerSt.label}</small>
        </div>
        <div class="body-region ${cardioSt.cls}">
          <span>🫀</span> Cardio<br><small>${cardioSt.label}</small>
        </div>
        <div class="body-region ${upperSt.cls}">
          <span>💪</span> Superiores<br><small>${upperSt.label}</small>
        </div>
        <div class="body-region ${coreSt.cls}">
          <span>⚡</span> Core<br><small>${coreSt.label}</small>
        </div>
      </div>
    </div>

    ${recent3.length >= 2 ? `
    <div class="analysis-card">
      <div class="ac-title">O que isso significa</div>
      <p class="ac-text">
        ${regions.lower >= 2.5
          ? `Seus membros inferiores receberam estímulo alto nos últimos dias. O intervalo de recuperação entre sessões de alto impacto deve ser de pelo menos 48h para evitar lesão.`
          : regions.cardio >= 3
          ? `Volume cardiovascular elevado. Seu sistema aeróbico está sendo muito solicitado — considere reduzir o ritmo ou fazer um dia de recuperação ativa.`
          : `Sua carga está distribuída de forma relativamente equilibrada entre os grupos musculares.`
        }
      </p>
    </div>` : ''}

    <div class="analysis-card highlight">
      <div class="ac-title">Recomendações</div>
      <ul class="rec-list">
        ${recs.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `;
}

// ===========================
// INIT — add PR renders
// ===========================

window.addEventListener('DOMContentLoaded', () => {
  // Initialize today feeling state
  state.todayFeeling = null;

  renderHome();
  renderAllModalities();
  renderCheckinMods();
  renderPRTabs();
  renderPRList();

  // Re-render home every time it becomes active (e.g. returning from checkin)
  const homeObserver = new MutationObserver(() => {
    if (document.getElementById('screen-home').classList.contains('active')) {
      renderHome();
    }
  });
  homeObserver.observe(document.getElementById('screen-home'), { attributes: true, attributeFilter: ['class'] });

  const analysisObserver = new MutationObserver(() => {
    if (document.getElementById('screen-analysis').classList.contains('active')) {
      renderAnalysis();
    }
  });
  analysisObserver.observe(document.getElementById('screen-analysis'), { attributes: true, attributeFilter: ['class'] });

  const prObserver = new MutationObserver(() => {
    if (document.getElementById('screen-pr').classList.contains('active')) {
      renderPRTabs();
      renderPRList();
    }
  });
  prObserver.observe(document.getElementById('screen-pr'), { attributes: true, attributeFilter: ['class'] });
});
