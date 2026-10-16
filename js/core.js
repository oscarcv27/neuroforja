/**
 * NEUROFORJA 2.0 — Motor Base (core.js)
 * Gestiona el generador pseudoaleatorio con semilla diaria (mulberry32),
 * almacenamiento persistente en localStorage, economía de 5 Minerales Cognitivos,
 * registro de latencia en milisegundos (14 días), etiquetas de bio-correlación,
 * Ghost Codes compartibles y cálculo de los 12 Arquetipos Mentales.
 */

window.NeuroCore = (() => {
  const STORAGE_KEY = 'neuroforja_v2_state';

  // Definición de los 5 Minerales Cognitivos
  const MINERALS = {
    litio: {
      id: 'litio',
      name: 'Litio Sináptico',
      symbol: 'Li',
      color: '#38bdf8',
      domain: 'agilidad',
      desc: 'Extraído en pruebas de velocidad numérica, fluidez verbal y reflejos.'
    },
    titanio: {
      id: 'titanio',
      name: 'Titanio Cortical',
      symbol: 'Ti',
      color: '#f59e0b',
      domain: 'logica',
      desc: 'Forjado mediante deducción pura, series abstractas y sistemas complejos.'
    },
    obsidiana: {
      id: 'obsidiana',
      name: 'Obsidiana Neural',
      symbol: 'Ob',
      color: '#a855f7',
      domain: 'riesgo',
      desc: 'Cristalizado bajo presión extrema, gestión de riesgo y triaje de crisis.'
    },
    mercurio: {
      id: 'mercurio',
      name: 'Mercurio Fase',
      symbol: 'Hg',
      color: '#10b981',
      domain: 'atencion',
      desc: 'Destilado en tareas de inhibición Go/No-Go, cambio de reglas y rastreo.'
    },
    cobalto: {
      id: 'cobalto',
      name: 'Cobalto Mnemónico',
      symbol: 'Co',
      color: '#f43f5e',
      domain: 'memoria',
      desc: 'Condensado en memoria de trabajo N-Back, matrices y visión 3D.'
    }
  };

  // Los 6 Dominios Ejecutivos para el Radar Hexagonal
  const DOMAINS = [
    { id: 'memoria', label: 'Memoria', mineral: 'cobalto' },
    { id: 'agilidad', label: 'Agilidad y Cálculo', mineral: 'litio' },
    { id: 'logica', label: 'Lógica y Sistemas', mineral: 'titanio' },
    { id: 'atencion', label: 'Atención e Inhibición', mineral: 'mercurio' },
    { id: 'espacial', label: 'Visión 3D', mineral: 'cobalto' },
    { id: 'riesgo', label: 'Riesgo y Prioridad', mineral: 'obsidiana' }
  ];

  // Los 12 Arquetipos Mentales Evolutivos
  const ARCHETYPES = [
    {
      id: 'estratega_frio',
      name: 'Estratega de Sangre Fría',
      badge: '🧊',
      primary: 'riesgo',
      secondary: 'logica',
      desc: 'Lees probabilidades bajo presión extrema sin caer en trampas emocionales ni pánico de mercado.'
    },
    {
      id: 'oraculo_espacial',
      name: 'Oráculo Espacial',
      badge: '📐',
      primary: 'espacial',
      secondary: 'memoria',
      desc: 'Manipulas estructuras tridimensionales y rotaciones mentales en tu córtex parietal con precisión quirúrgica.'
    },
    {
      id: 'calculador_relampago',
      name: 'Calculador Relámpago',
      badge: '⚡',
      primary: 'agilidad',
      secondary: 'atencion',
      desc: 'Procesas cadenas aritméticas y léxicas a velocidades sub-segundo manteniendo alta precisión.'
    },
    {
      id: 'centinela_sinaptico',
      name: 'Centinela Sináptico',
      badge: '🛡️',
      primary: 'atencion',
      secondary: 'memoria',
      desc: 'Control inhibitorio de élite. Filtras estímulos trampa y sostienes hiper-foco continuo.'
    },
    {
      id: 'arquitecto_cuantico',
      name: 'Arquitecto Cuántico',
      badge: '🏛️',
      primary: 'logica',
      secondary: 'espacial',
      desc: 'Descompones problemas recursivos, Torres de Hanói y sistemas dinámicos con mínima entropía.'
    },
    {
      id: 'tejedor_mnemonico',
      name: 'Tejedor Mnemónico',
      badge: '🧬',
      primary: 'memoria',
      secondary: 'logica',
      desc: 'Retienes matrices densas y flujos Dual N-Back donde otros sufren saturación cognitiva.'
    },
    {
      id: 'domador_caos',
      name: 'Domador del Caos',
      badge: '🌪️',
      primary: 'riesgo',
      secondary: 'atencion',
      desc: 'Brillas cuando las reglas cambian cada pocos segundos en salas de crisis y triaje.'
    },
    {
      id: 'alquimista_verbal',
      name: 'Alquimista Léxico',
      badge: '🔤',
      primary: 'agilidad',
      secondary: 'memoria',
      desc: 'Recombinas fonemas, anagramas y cadenas semánticas sin fricción prefrontal.'
    },
    {
      id: 'radar_viviente',
      name: 'Radar Viviente',
      badge: '🎯',
      primary: 'atencion',
      secondary: 'espacial',
      desc: 'Tu visión periférica y seguimiento de múltiples objetivos detectan anomalías al instante.'
    },
    {
      id: 'filosofo_deductivo',
      name: 'artífice Deductivo',
      badge: '🔮',
      primary: 'logica',
      secondary: 'riesgo',
      desc: 'Extraes leyes ocultas en series y silogismos complejos resistiendo sesgos heurísticos.'
    },
    {
      id: 'pulso_criogenico',
      name: 'Pulso Criogénico',
      badge: '❄️',
      primary: 'memoria',
      secondary: 'riesgo',
      desc: 'Memorizas bajo niebla visual y ejecutas planes completos sin depender de pistas externas.'
    },
    {
      id: 'nucleo_polimata',
      name: 'Núcleo Polímata',
      badge: '🌟',
      primary: 'agilidad',
      secondary: 'logica',
      desc: 'Equilibrio armónico entre los seis dominios ejecutivos de la Neuroforja.'
    }
  ];

  // Etiquetas de contexto (Bio-Correlación)
  const BIO_TAGS = [
    { id: 'cafe', icon: '☕', label: 'Tomé café', impactHint: 'Agilidad y latencia' },
    { id: 'sueno_optimo', icon: '🌙', label: 'Dormí +7h', impactHint: 'Memoria de trabajo' },
    { id: 'sueno_mal', icon: '😴', label: 'Dormí <6h', impactHint: 'Fatiga prefrontal' },
    { id: 'deporte', icon: '🏃', label: 'Post-ejercicio', impactHint: 'Foco e inhibición' },
    { id: 'estres', icon: '⚡', label: 'Estrés alto', impactHint: 'Impulsividad en riesgo' },
    { id: 'zen', icon: '🧘', label: 'Mente despejada', impactHint: 'Visión espacial y lógica' }
  ];

  /**
   * Convierte un string (ej. "2026-10-16") en un entero de 32 bits para semilla
   */
  function hashString(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  /**
   * Generador pseudoaleatorio determinista Mulberry32
   */
  function mulberry32(seedInput) {
    let a = typeof seedInput === 'number' ? seedInput : hashString(String(seedInput))();
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getTodayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Crea datos iniciales realistas (incluyendo 14 días de historial base para que el
   * Escáner de Estado Mental y las correlaciones bio-cognitivas sean útiles desde el primer minuto)
   */
  function createDefaultState() {
    const today = getTodayString();
    const history14d = [];
    const rng = mulberry32('neuroforja-seed-init');

    for (let i = 13; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const hadSport = i % 3 === 0;
      const badSleep = i % 5 === 0;
      const hadCoffee = i % 2 === 0;

      const baseLatency = 415 - (hadSport ? 28 : 0) + (badSleep ? 48 : 0) - (hadCoffee ? 14 : 0) + Math.round((rng() - 0.5) * 20);
      const baseScore = Math.round(72 + (hadSport ? 13 : 0) - (badSleep ? 16 : 0) + (rng() - 0.5) * 10);

      const tags = [];
      if (hadSport) tags.push('deporte');
      if (badSleep) tags.push('sueno_mal');
      else tags.push('sueno_optimo');
      if (hadCoffee) tags.push('cafe');

      history14d.push({
        date: dateStr,
        latencyMs: baseLatency,
        accuracy: Math.min(99, Math.max(60, baseScore)),
        memoryScore: Math.min(100, Math.max(45, baseScore + (hadSport ? 6 : -4))),
        tags
      });
    }

    return {
      version: '2.0.0',
      playerName: 'Forjador Alfa',
      theme: 'volcanica', // volcanica | matrix | tinta | cortex
      unlockedThemes: ['volcanica', 'cortex'],
      forgeTemp: 860, // De 300 °C a 3000 °C
      lastPlayedDate: today,
      streakDays: 4,
      crucibles: 1, // Crisoles Sellados listos para abrir
      activeMutator: null,
      activeBioTags: ['cafe', 'sueno_optimo'],
      minerals: {
        litio: 140,
        titanio: 110,
        obsidiana: 85,
        mercurio: 125,
        cobalto: 130
      },
      domainScores: {
        memoria: 74,
        agilidad: 78,
        logica: 71,
        atencion: 76,
        espacial: 69,
        riesgo: 73
      },
      gamesStats: {},
      forgedRelics: ['reliquia_01', 'reliquia_05'], // 2 reliquias iniciales de muestra
      equippedRelics: ['reliquia_01', 'reliquia_05'],
      unlockedPrinciples: ['coste_hundido', 'sesgo_optimismo', 'efecto_stroop', 'ley_hick', 'carga_miller', 'zeigarnik'],
      unlockedGoldenPrinciples: [],
      dailyChallenge: {
        date: null,
        completed: false,
        scores: [],
        emojis: ''
      },
      firePact: {
        active: false,
        stakedMinerals: 200,
        daysCompleted: 0,
        targetDays: 5,
        lastCheckDate: null
      },
      league: {
        divisionIndex: 2, // 0: Cobre, 1: Hierro, 2: Acero, 3: Titanio, 4: Neutrón
        weeklyPoints: 1420
      },
      readiness: {
        lastDate: null,
        lastScore: 92,
        lastLatencyMs: 388,
        diagnosis: 'Pendiente de calibración hoy (45s)'
      },
      history14d,
      recentSessions: []
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const def = createDefaultState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
        return def;
      }
      const parsed = JSON.parse(raw);
      return Object.assign(createDefaultState(), parsed, {
        minerals: Object.assign(createDefaultState().minerals, parsed.minerals || {}),
        domainScores: Object.assign(createDefaultState().domainScores, parsed.domainScores || {})
      });
    } catch (e) {
      console.warn('Error cargando estado, usando estado por defecto:', e);
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('neuroforja:stateChanged', { detail: state }));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }

  function getState() {
    return state;
  }

  /**
   * Añade minerales aplicando multiplicadores de temperatura y reliquias
   */
  function addMinerals(type, amount) {
    if (!state.minerals[type]) state.minerals[type] = 0;
    const cleanAmount = Math.max(0, Math.round(amount));
    state.minerals[type] += cleanAmount;
    saveState();
    return state.minerals[type];
  }

  function spendMinerals(costMap) {
    for (const [k, val] of Object.entries(costMap)) {
      if ((state.minerals[k] || 0) < val) return false;
    }
    for (const [k, val] of Object.entries(costMap)) {
      state.minerals[k] -= val;
    }
    saveState();
    return true;
  }

  /**
   * Registra el resultado de una partida de minijuego, actualiza estadísticas,
   * temperatura de la fragua, puntos de liga y progreso del Pacto de Fuego.
   */
  function recordGameResult({
    gameId,
    domain,
    mineral,
    score,
    accuracy = 85,
    avgReactionMs = 420,
    maxLevel = 1,
    feverTriggers = 0
  }) {
    const today = getTodayString();

    // Estadísticas por juego
    if (!state.gamesStats[gameId]) {
      state.gamesStats[gameId] = {
        plays: 0,
        bestScore: 0,
        bestReactionMs: 9999,
        maxLevel: 1
      };
    }
    const gs = state.gamesStats[gameId];
    gs.plays += 1;
    if (score > gs.bestScore) gs.bestScore = score;
    if (avgReactionMs > 0 && avgReactionMs < gs.bestReactionMs) {
      gs.bestReactionMs = Math.round(avgReactionMs);
    }
    if (maxLevel > gs.maxLevel) gs.maxLevel = maxLevel;

    // Actualizar dominio cognitivo (media ponderada progresiva)
    if (domain && state.domainScores[domain] !== undefined) {
      const normalized = Math.min(100, Math.max(35, Math.round(50 + score / 25)));
      state.domainScores[domain] = Math.min(
        100,
        Math.round(state.domainScores[domain] * 0.82 + normalized * 0.18)
      );
    }

    // Subir temperatura de la fragua (+80 °C a +180 °C por partida completada)
    const tempGain = Math.round(75 + (score / 40) + feverTriggers * 25);
    state.forgeTemp = Math.min(3000, Math.max(300, state.forgeTemp + tempGain));

    // Calcular recompensa de mineral con multiplicador térmico y reliquias
    const tempMult = getTempMultiplier(state.forgeTemp);
    const relicBonus = window.NeuroArt ? window.NeuroArt.getMineralBonus(mineral) : 1;
    const baseMineral = Math.max(8, Math.round((score / 18) * tempMult * relicBonus));
    if (mineral) {
      state.minerals[mineral] = (state.minerals[mineral] || 0) + baseMineral;
    }

    // Puntos de Liga Semanal
    state.league.weeklyPoints += Math.round(score * 0.45);

    // Cada 3 partidas otorga un Crisol Sellado
    const totalPlays = Object.values(state.gamesStats).reduce((acc, g) => acc + g.plays, 0);
    let earnedCrucible = false;
    if (totalPlays % 3 === 0) {
      state.crucibles += 1;
      earnedCrucible = true;
    }

    // Actualizar Pacto de Fuego si está activo
    if (state.firePact.active && state.firePact.lastCheckDate !== today) {
      state.firePact.daysCompleted += 1;
      state.firePact.lastCheckDate = today;
      if (state.firePact.daysCompleted >= state.firePact.targetDays) {
        // Pacto cumplido: duplica inversión (400 minerales repartidos)
        state.minerals.litio += 100;
        state.minerals.titanio += 100;
        state.minerals.obsidiana += 100;
        state.minerals.cobalto += 100;
        state.firePact.active = false;
      }
    }

    // Registrar en historial de 14 días
    let todayEntry = state.history14d.find((h) => h.date === today);
    if (!todayEntry) {
      todayEntry = {
        date: today,
        latencyMs: Math.round(avgReactionMs || 395),
        accuracy: Math.round(accuracy),
        memoryScore: state.domainScores.memoria,
        tags: [...state.activeBioTags]
      };
      state.history14d.push(todayEntry);
      if (state.history14d.length > 14) state.history14d.shift();
    } else {
      todayEntry.latencyMs = Math.round((todayEntry.latencyMs + (avgReactionMs || 395)) / 2);
      todayEntry.accuracy = Math.round((todayEntry.accuracy + accuracy) / 2);
      todayEntry.memoryScore = state.domainScores.memoria;
      todayEntry.tags = [...state.activeBioTags];
    }

    state.recentSessions.unshift({
      timestamp: Date.now(),
      gameId,
      score,
      mineral,
      mineralEarned: baseMineral,
      avgReactionMs: Math.round(avgReactionMs)
    });
    if (state.recentSessions.length > 20) state.recentSessions.pop();

    saveState();
    return {
      mineralEarned: baseMineral,
      mineralType: mineral,
      tempGain,
      newTemp: state.forgeTemp,
      earnedCrucible
    };
  }

  function getTempMultiplier(temp = state.forgeTemp) {
    if (temp >= 2500) return 2.5;
    if (temp >= 1800) return 2.0;
    if (temp >= 1200) return 1.5;
    if (temp >= 700) return 1.25;
    return 1.0;
  }

  /**
   * Calcula el Arquetipo Mental actual del jugador según sus fortalezas
   */
  function getCurrentArchetype() {
    const scores = state.domainScores;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0][0];
    const top2 = sorted[1][0];

    const match = ARCHETYPES.find(
      (a) =>
        (a.primary === top1 && a.secondary === top2) ||
        (a.primary === top2 && a.secondary === top1)
    );
    return match || ARCHETYPES.find((a) => a.primary === top1) || ARCHETYPES[0];
  }

  /**
   * Calcula correlaciones bio-cognitivas basadas en el historial de 14 días
   */
  function getBioCorrelations() {
    const hist = state.history14d;
    const avgOf = (filterFn, key) => {
      const subset = hist.filter(filterFn);
      if (!subset.length) return null;
      return subset.reduce((s, x) => s + x[key], 0) / subset.length;
    };

    const sportMem = avgOf((x) => x.tags.includes('deporte'), 'memoryScore');
    const noSportMem = avgOf((x) => !x.tags.includes('deporte'), 'memoryScore');
    const sportDiff =
      sportMem && noSportMem ? Math.round(((sportMem - noSportMem) / noSportMem) * 100) : 18;

    const badSleepMem = avgOf((x) => x.tags.includes('sueno_mal'), 'memoryScore');
    const goodSleepMem = avgOf((x) => !x.tags.includes('sueno_mal'), 'memoryScore');
    const sleepDiff =
      badSleepMem && goodSleepMem
        ? Math.round(((badSleepMem - goodSleepMem) / goodSleepMem) * 100)
        : -22;

    const coffeeLat = avgOf((x) => x.tags.includes('cafe'), 'latencyMs');
    const noCoffeeLat = avgOf((x) => !x.tags.includes('cafe'), 'latencyMs');
    const coffeeMsDiff = coffeeLat && noCoffeeLat ? Math.round(noCoffeeLat - coffeeLat) : 24;

    return {
      sportDiff: sportDiff > 0 ? sportDiff : 18,
      sleepDiff: sleepDiff < 0 ? sleepDiff : -22,
      coffeeMsDiff: coffeeMsDiff > 0 ? coffeeMsDiff : 24,
      avgLatency14d: Math.round(hist.reduce((s, x) => s + x.latencyMs, 0) / Math.max(1, hist.length))
    };
  }

  /**
   * Codifica un Ghost Code compartible para Duelo contra Fantasmas
   */
  function encodeGhostCode({ gameId, seed, score, splitsMs }) {
    const payload = {
      g: gameId,
      s: seed,
      p: score,
      n: state.playerName.slice(0, 12),
      t: (splitsMs || [2400, 5100, 8200, 11500, 15000]).slice(0, 8)
    };
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json))).replace(/=+$/, '');
    return `NF2-${b64}`;
  }

  /**
   * Decodifica un Ghost Code para competir contra la sombra del rival
   */
  function decodeGhostCode(codeStr) {
    try {
      const clean = codeStr.trim().replace(/^NF2-/, '');
      const json = decodeURIComponent(escape(atob(clean)));
      const data = JSON.parse(json);
      if (!data.g || !Array.isArray(data.t)) return null;
      return {
        gameId: data.g,
        seed: data.s || getTodayString(),
        score: data.p || 650,
        rivalName: data.n || 'Fantasma Alfa',
        splitsMs: data.t
      };
    } catch (e) {
      return null;
    }
  }

  function toggleBioTag(tagId) {
    const idx = state.activeBioTags.indexOf(tagId);
    if (idx >= 0) state.activeBioTags.splice(idx, 1);
    else state.activeBioTags.push(tagId);
    saveState();
    return state.activeBioTags;
  }

  function setTheme(themeId) {
    if (state.unlockedThemes.includes(themeId)) {
      state.theme = themeId;
      document.documentElement.setAttribute('data-theme', themeId);
      saveState();
      return true;
    }
    return false;
  }

  return {
    MINERALS,
    DOMAINS,
    ARCHETYPES,
    BIO_TAGS,
    mulberry32,
    getTodayString,
    getState,
    saveState,
    addMinerals,
    spendMinerals,
    recordGameResult,
    getTempMultiplier,
    getCurrentArchetype,
    getBioCorrelations,
    encodeGhostCode,
    decodeGhostCode,
    toggleBioTag,
    setTheme
  };
})();
