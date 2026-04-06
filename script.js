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
  myModalityIds: ['corrida', 'crossfit', 'capoeira'],
  selectedModalityId: null,
  selectedDuration: 60,
  selectedIntensity: 'normal',
  selectedMuscle: 'full',
  selectedWeight: 'usual',
  history: [
    { day: 0, modal: 'crossfit',  intensity: 'heavy', duration: 60, muscle: 'full',  color: '#e8ff47' },
    { day: 1, modal: 'corrida',   intensity: 'normal', duration: 45, muscle: null,   color: '#3affb8' },
    { day: 2, modal: 'capoeira',  intensity: 'heavy', duration: 90, muscle: null,    color: '#c47aff' },
    { day: 3, modal: 'academia',  intensity: 'heavy', duration: 60, muscle: 'lower', color: '#e8ff47' },
    { day: 4, modal: null, color: null },
    { day: 5, modal: null, color: null },
    { day: 6, modal: null, color: null },
  ]
};

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
  const strip = document.getElementById('weekStrip');
  if (!strip) return;
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = 4; // friday = index 4

  strip.innerHTML = state.history.map((d, i) => {
    const mod = d.modal ? MODALITIES.find(m => m.id === d.modal) : null;
    const isToday = i === today;
    const hasLoad = !!mod;
    const isHighLoad = d.intensity === 'heavy';

    return `
      <div class="day-block ${isToday ? 'today' : ''} ${isHighLoad ? 'loaded' : ''}">
        <div class="day-name">${days[i]}</div>
        <div class="day-dot-wrap">
          ${mod ? `<div class="day-dot" style="background:${mod.color}; width:8px; height:8px;"></div>` : '<div style="width:8px;height:8px;"></div>'}
          ${mod ? `<div style="font-size:0.55rem;color:var(--text-dim);margin-top:2px">${mod.emoji}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderMyMods() {
  const el = document.getElementById('myModBlocks');
  if (!el) return;

  const loadMap = { corrida: 65, crossfit: 85, capoeira: 70 };

  el.innerHTML = state.myModalityIds.map(id => {
    const mod = MODALITIES.find(m => m.id === id);
    if (!mod) return '';
    const load = loadMap[id] || 40;
    return `
      <div class="mod-block selected" style="--mod-color:${mod.color}" onclick="goTo('screen-analysis')">
        <span class="mod-emoji">${mod.emoji}</span>
        <div class="mod-name">${mod.name}</div>
        <div class="mod-load-bar">
          <div class="mod-load-fill" style="width:${load}%;background:${mod.color}"></div>
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
  document.getElementById('btnSave').classList.add('hidden');

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
    document.getElementById('btnSave').classList.remove('hidden');
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
  showToast('Treino registrado ✓');
  setTimeout(() => goTo('screen-home'), 700);
}

// ===========================
// FEELING BUTTONS
// ===========================

document.querySelectorAll('.feeling-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.feeling-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

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
// ANIMATE LOAD BAR
// ===========================

function animateLoadBar() {
  const bar = document.getElementById('loadBar');
  if (!bar) return;
  bar.style.width = '0%';
  setTimeout(() => { bar.style.width = '72%'; }, 300);
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
  records: {
    // pre-populated sample data
    back_squat:   { value: 102.06, unit: 'kg', date: '2026-03-15', isNew: true },
    deadlift:     { value: 134.72, unit: 'kg', date: '2026-02-20', isNew: false },
    bench_press:  { value: 38.56,  unit: 'kg', date: '2026-01-10', isNew: false },
    snatch:       { value: 47.00,  unit: 'kg', date: '2026-03-28', isNew: true },
    clean_jerk:   { value: 65.00,  unit: 'kg', date: '2026-02-14', isNew: false },
    muscle_up:    { value: 8,      unit: 'reps', date: '2026-03-01', isNew: false },
    pull_up:      { value: 15,     unit: 'reps', date: '2026-03-20', isNew: true },
    run_5k:       { value: 24.5,   unit: 'min', date: '2026-03-10', isNew: false },
    run_10k:      { value: 51.2,   unit: 'min', date: '2026-02-28', isNew: false },
    parafuso:     { value: 3,      unit: 'nível', date: '2026-01-15', isNew: false },
    mortal:       { value: 2,      unit: 'nível', date: '2026-02-05', isNew: false },
  },
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
// INIT — add PR renders
// ===========================

window.addEventListener('DOMContentLoaded', () => {
  renderWeekStrip();
  renderMyMods();
  renderAllModalities();
  renderCheckinMods();
  renderPRTabs();
  renderPRList();

  // Animate load bar when home becomes visible
  const observer = new MutationObserver(() => {
    if (document.getElementById('screen-home').classList.contains('active')) {
      animateLoadBar();
    }
  });
  observer.observe(document.getElementById('screen-home'), { attributes: true, attributeFilter: ['class'] });

  const prObserver = new MutationObserver(() => {
    if (document.getElementById('screen-pr').classList.contains('active')) {
      renderPRTabs();
      renderPRList();
    }
  });
  prObserver.observe(document.getElementById('screen-pr'), { attributes: true, attributeFilter: ['class'] });
});
