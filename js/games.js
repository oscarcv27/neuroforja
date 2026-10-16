/**
 * NEUROFORJA 2.0 — Catálogo de los 20 Minijuegos Cognitivos y 5 Modos Fusión (games.js)
 * Incluye Ajuste Dinámico Intrapartida (Micro-DDA < 800 ms), soporte de Semilla Diaria,
 * Sombra de Duelo Fantasma en vivo, Mutadores Diarios y conexión con fx.js / principles.js.
 */

window.NeuroGames = (() => {
  // Metadatos de los 20 Minijuegos Cognitivos oficiales del Blueprint
  const CATALOG = [
    {
      id: 'calc',
      name: 'Cálculo Relámpago',
      fileTag: 'calc.js',
      icon: '➗',
      domain: 'agilidad',
      mineral: 'litio',
      durationSec: 40,
      desc: 'Aritmética encadenada e incógnitas algebraicas a máxima velocidad.'
    },
    {
      id: 'anagram',
      name: 'Forja de Anagramas',
      fileTag: 'anagram.js',
      icon: '🔤',
      domain: 'agilidad',
      mineral: 'litio',
      durationSec: 45,
      desc: 'Reconstruye la palabra oculta a partir de sus fonemas desordenados.'
    },
    {
      id: 'chain',
      name: 'Cadena Semántica',
      fileTag: 'chain.js',
      icon: '🔗',
      domain: 'agilidad',
      mineral: 'litio',
      durationSec: 40,
      desc: 'Selecciona el eslabón léxico o conceptual que continúa la cadena sináptica.'
    },
    {
      id: 'nogo',
      name: 'Impulso Go / No-Go',
      fileTag: 'nogo.js',
      icon: '🚦',
      domain: 'atencion',
      mineral: 'mercurio',
      durationSec: 35,
      desc: 'Pulsa al instante ante núcleos verdes/cianes y frena en seco ante trampas rojas.'
    },
    {
      id: 'switch',
      name: 'Cambio de Regla',
      fileTag: 'switch.js',
      icon: '🔀',
      domain: 'atencion',
      mineral: 'mercurio',
      durationSec: 45,
      desc: 'Clasifica por Paridad, Magnitud o Color mientras el criterio cambia en vivo.'
    },
    {
      id: 'track',
      name: 'Rastreo Múltiple (MOT)',
      fileTag: 'track.js',
      icon: '🎯',
      domain: 'atencion',
      mineral: 'mercurio',
      durationSec: 45,
      desc: 'Sigue las sondas marcadas mientras orbitan y se mezclan con señuelos.'
    },
    {
      id: 'odd',
      name: 'Intruso Perceptivo',
      fileTag: 'odd.js',
      icon: '👁️',
      domain: 'atencion',
      mineral: 'mercurio',
      durationSec: 40,
      desc: 'Localiza la anomalía geométrica o cromática en matrices de alta densidad.'
    },
    {
      id: 'nback',
      name: 'Dual 2-Back',
      fileTag: 'nback.js',
      icon: '🧬',
      domain: 'memoria',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Compara el estímulo actual con el que apareció exactamente 2 turnos atrás.'
    },
    {
      id: 'matrix',
      name: 'Matriz de Memoria',
      fileTag: 'matrix.js',
      icon: '🟦',
      domain: 'memoria',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Retén las coordenadas encendidas en la rejilla y reprodúcelas sin error.'
    },
    {
      id: 'lights',
      name: 'Secuencia Luminosa',
      fileTag: 'lights.js',
      icon: '💡',
      domain: 'memoria',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Memoriza el orden secuencial de ignición de los reactores y repítelo.'
    },
    {
      id: 'ghost',
      name: 'Rastro Fantasma',
      fileTag: 'ghost.js',
      icon: '👻',
      domain: 'memoria',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Memoriza la posición de los nodos numerados antes de que se oculten.'
    },
    {
      id: 'hanoi',
      name: 'Torres de Hanói',
      fileTag: 'hanoi.js',
      icon: '🗼',
      domain: 'espacial',
      mineral: 'cobalto',
      durationSec: 55,
      desc: 'Transfiere la pila de anillos energéticos a la columna C sin colocar uno mayor sobre otro menor.'
    },
    {
      id: 'cubes',
      name: 'Cubos Isométricos 3D',
      fileTag: 'cubes.js',
      icon: '🧊',
      domain: 'espacial',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Calcula el volumen exacto de bloques 3D contabilizando los soportes ocultos.'
    },
    {
      id: 'rotation',
      name: 'Rotación Mental 3D',
      fileTag: 'rotation.js',
      icon: '🔄',
      domain: 'espacial',
      mineral: 'cobalto',
      durationSec: 45,
      desc: 'Identifica qué pieza rotada coincide con el modelo base descartando espejados.'
    },
    {
      id: 'deduce',
      name: 'Deducción de Matrices',
      fileTag: 'deduce.js',
      icon: '🧩',
      domain: 'logica',
      mineral: 'titanio',
      durationSec: 50,
      desc: 'Resuelve matrices lógicas y silogismos deduciendo la ley de transformación.'
    },
    {
      id: 'series',
      name: 'Series Cuánticas',
      fileTag: 'series.js',
      icon: '📈',
      domain: 'logica',
      mineral: 'titanio',
      durationSec: 45,
      desc: 'Descubre el patrón oculto en secuencias numéricas de orden superior.'
    },
    {
      id: 'systems',
      name: 'Sistemas Complejos',
      fileTag: 'systems.js',
      icon: '⚙️',
      domain: 'logica',
      mineral: 'titanio',
      durationSec: 50,
      desc: 'Estabiliza las 3 variables acopladas del reactor aplicando la válvula óptima.'
    },
    {
      id: 'balloon',
      name: 'Globo de Riesgo (BART)',
      fileTag: 'balloon.js',
      icon: '🎈',
      domain: 'riesgo',
      mineral: 'obsidiana',
      durationSec: 45,
      desc: 'Infla el núcleo de plasma para multiplicar ganancias y asegúralas antes del colapso.'
    },
    {
      id: 'stock',
      name: 'Bolsa Bajo Presión',
      fileTag: 'stock.js',
      icon: '📊',
      domain: 'riesgo',
      mineral: 'obsidiana',
      durationSec: 45,
      desc: 'Evalúa titulares y probabilidades en tiempo real para operar antes del crash.'
    },
    {
      id: 'triage',
      name: 'Triaje de Crisis',
      fileTag: 'triage.js',
      icon: '🚨',
      domain: 'riesgo',
      mineral: 'obsidiana',
      durationSec: 45,
      desc: 'Prioriza la emergencia crítica según el protocolo activo bajo presión extrema.'
    }
  ];

  // Los 5 Modos «Fusión / Evolución» de la Página 3 del Blueprint
  const FUSION_MODES = [
    {
      id: 'fusion_centinela',
      name: 'Protocolo Centinela',
      modules: 'nback.js + nogo.js',
      badge: '🛡️',
      domain: 'memoria',
      mineral: 'mercurio',
      durationSec: 50,
      desc: 'Mientras haces 2-Back, aparecen estímulos trampa rojos que exigen NO pulsar la pantalla. Hiper-foco inmediato.',
      sequence: ['nback', 'nogo']
    },
    {
      id: 'fusion_wallstreet',
      name: 'Fiebre de Wall Street',
      modules: 'balloon.js + stock.js',
      badge: '💹',
      domain: 'riesgo',
      mineral: 'obsidiana',
      durationSec: 50,
      desc: 'Inflas el valor de una acción con noticias falsas o reales en tiempo real antes del crash bursátil.',
      sequence: ['balloon', 'stock']
    },
    {
      id: 'fusion_crisis',
      name: 'Sala de Crisis',
      modules: 'triage.js + switch.js',
      badge: '🚨',
      domain: 'riesgo',
      mineral: 'obsidiana',
      durationSec: 50,
      desc: 'Clasificas emergencias mientras una alarma cambia la regla de prioridad cada 12 segundos. Caos controlado.',
      sequence: ['triage', 'switch']
    },
    {
      id: 'fusion_arquitecto',
      name: 'Arquitecto a Ciegas',
      modules: 'hanoi.js + cubes.js + rotation.js',
      badge: '🏛️',
      domain: 'espacial',
      mineral: 'cobalto',
      durationSec: 55,
      desc: 'Observas el objetivo espacial durante 3 segundos y ejecutas la resolución con niebla visual.',
      sequence: ['cubes', 'rotation', 'hanoi']
    },
    {
      id: 'fusion_supervivencia',
      name: 'Contrarreloj de Supervivencia',
      modules: 'anagram.js + chain.js + calc.js',
      badge: '⏱️',
      domain: 'agilidad',
      mineral: 'litio',
      durationSec: 12,
      isSurvival: true,
      desc: 'Empiezas con solo 12 segundos; cada palabra o cálculo correcto suma +1.8 s al reloj. ¿Cuánto aguantarás?',
      sequence: ['calc', 'anagram', 'chain']
    }
  ];

  // Estado activo de la partida en curso
  let activeSession = null;
  let timerInterval = null;

  function getCatalog() {
    return CATALOG;
  }

  function getFusionModes() {
    return FUSION_MODES;
  }

  function getGameMeta(gameId) {
    return (
      CATALOG.find((g) => g.id === gameId) ||
      FUSION_MODES.find((f) => f.id === gameId) ||
      CATALOG[0]
    );
  }

  /**
   * Inicia una partida individual, modo fusión o etapa dentro de una Playlist/Roguelike/Boss
   */
  function startGame(gameId, options = {}) {
    stopActiveGame();

    const meta = getGameMeta(gameId);
    const seedStr = options.seed || `${window.NeuroCore.getTodayString()}-${gameId}-${Date.now()}`;
    const rng = window.NeuroCore.mulberry32(seedStr);
    const mutator = options.mutator || window.NeuroFun.getActiveMutator();

    const extraRelicTime = window.NeuroArt.getExtraTimeSeconds();
    const isSuddenDeath = mutator && mutator.id === 'muerte_subita';
    const isSurvival = Boolean(meta.isSurvival || options.isSurvival);
    const isZen = Boolean(options.zenMode);

    let initialTime = options.durationOverride || meta.durationSec || 45;
    if (!isSurvival) initialTime += extraRelicTime;

    activeSession = {
      gameId,
      meta,
      rng,
      seedStr,
      mutator,
      isSuddenDeath,
      isSurvival,
      isZen,
      fusionSequence: meta.sequence || options.fusionSequence || null,
      subGameId: meta.sequence ? meta.sequence[0] : gameId,
      score: 0,
      round: 0,
      hits: 0,
      misses: 0,
      level: options.initialLevel || 1,
      maxLevel: options.initialLevel || 1,
      fastStreakUnder800: 0,
      reactionTimesMs: [],
      splitsMs: [],
      sessionStartMs: performance.now(),
      roundStartMs: performance.now(),
      timeLeft: initialTime,
      maxTime: initialTime,
      shieldAvailable:
        window.NeuroArt.hasRelic('reliquia_04') || Boolean(options.roguelikeShield),
      perkTimeBonus: options.perkTimeBonus || 0,
      ghostData: options.ghostData || null,
      onComplete: options.onComplete || null,
      onBossHit: options.onBossHit || null,
      subState: {}
    };

    activeSession.timeLeft += activeSession.perkTimeBonus;
    activeSession.maxTime = Math.max(activeSession.maxTime, activeSession.timeLeft);

    window.NeuroFX.resetCombo();
    if (mutator && mutator.id === 'sobrecarga_epica') {
      // Activa racha inicial para empezar en Fever ×2
      for (let i = 0; i < 5; i++) window.NeuroFX.triggerHit();
    }

    openArenaModal();
    updateArenaHUD();
    renderNextRound();

    if (!isZen && !isSuddenDeath) {
      timerInterval = setInterval(() => {
        if (!activeSession) return;
        activeSession.timeLeft = Math.max(0, +(activeSession.timeLeft - 0.1).toFixed(1));
        updateArenaTimer();
        if (activeSession.timeLeft <= 0) {
          finishGame('Tiempo completado');
        }
      }, 100);
    } else {
      updateArenaTimer();
    }
  }

  function stopActiveGame() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (activeSession && activeSession.subState && activeSession.subState.cleanup) {
      activeSession.subState.cleanup();
    }
    activeSession = null;
  }

  function openArenaModal() {
    const modal = document.getElementById('gameArenaModal');
    if (modal) {
      modal.hidden = false;
      document.body.classList.add('arena-open');
    }
  }

  function closeArenaModal() {
    stopActiveGame();
    window.NeuroFX.resetCombo();
    const modal = document.getElementById('gameArenaModal');
    if (modal) {
      modal.hidden = true;
      document.body.classList.remove('arena-open');
    }
  }

  function updateArenaHUD() {
    if (!activeSession) return;
    const titleEl = document.getElementById('arenaGameTitle');
    const scoreEl = document.getElementById('arenaScoreVal');
    const levelEl = document.getElementById('arenaLevelVal');
    const mutatorEl = document.getElementById('arenaMutatorBadge');

    if (titleEl) {
      titleEl.textContent = `${activeSession.meta.icon || activeSession.meta.badge || '🎮'} ${activeSession.meta.name}`;
    }
    if (scoreEl) scoreEl.textContent = String(activeSession.score);
    if (levelEl) levelEl.textContent = `NV. ${activeSession.level}`;

    if (mutatorEl) {
      if (activeSession.mutator) {
        mutatorEl.hidden = false;
        mutatorEl.textContent = `${activeSession.mutator.badge} ${activeSession.mutator.name}`;
      } else if (activeSession.isSurvival) {
        mutatorEl.hidden = false;
        mutatorEl.textContent = `⏱️ SUPERVIVENCIA (+1.8s / acierto)`;
      } else {
        mutatorEl.hidden = true;
      }
    }
  }

  function updateArenaTimer() {
    if (!activeSession) return;
    const timeText = document.getElementById('arenaTimeVal');
    const timeBar = document.getElementById('arenaTimeFill');
    const ghostBar = document.getElementById('arenaGhostTrack');
    const ghostMarker = document.getElementById('arenaGhostMarker');

    if (activeSession.isZen) {
      if (timeText) timeText.textContent = 'MODO ZEN ∞';
      if (timeBar) timeBar.style.width = '100%';
    } else if (activeSession.isSuddenDeath) {
      if (timeText) timeText.textContent = `RONDA ${activeSession.round + 1}/10 💀`;
      if (timeBar) timeBar.style.width = `${Math.min(100, activeSession.round * 10)}%`;
    } else {
      if (timeText) timeText.textContent = `${activeSession.timeLeft.toFixed(1)}s`;
      const pct = Math.min(100, Math.max(0, (activeSession.timeLeft / activeSession.maxTime) * 100));
      if (timeBar) timeBar.style.width = `${pct}%`;
    }

    // Actualizar posición de la Sombra Fantasma si estamos en Duelo contra Fantasmas
    if (activeSession.ghostData && ghostBar && ghostMarker) {
      ghostBar.hidden = false;
      const elapsed = performance.now() - activeSession.sessionStartMs;
      const splits = activeSession.ghostData.splitsMs;
      const maxSplit = splits[splits.length - 1] || 30000;
      const ghostPct = Math.min(100, Math.round((elapsed / maxSplit) * 100));
      ghostMarker.style.left = `${ghostPct}%`;
      const label = document.getElementById('arenaGhostLabel');
      if (label) {
        label.textContent = `👻 Sombra de ${activeSession.ghostData.rivalName} (${activeSession.ghostData.score} pts)`;
      }
    } else if (ghostBar) {
      ghostBar.hidden = true;
    }
  }

  /**
   * Registra una respuesta del jugador, evalúa Micro-DDA (< 800 ms x3 -> +2 niveles),
   * Fever Mode, tiempo de supervivencia y daño a Jefe Semanal.
   */
  function submitAnswer(isCorrect, originEl = null, customPoints = 100, customBiasReason = null) {
    if (!activeSession) return;

    const now = performance.now();
    const reactionMs = Math.max(110, Math.round(now - activeSession.roundStartMs));
    activeSession.round += 1;

    if (isCorrect) {
      activeSession.hits += 1;
      activeSession.reactionTimesMs.push(reactionMs);
      activeSession.splitsMs.push(Math.round(now - activeSession.sessionStartMs));

      const feverMult = window.NeuroFX.triggerHit(originEl);
      const relicMult = window.NeuroArt.getScoreBonusMultiplier();
      const feverRelicBoost =
        feverMult > 1 && window.NeuroArt.hasRelic('reliquia_18') ? 1.25 : 1.0;

      // Ajuste Dinámico Intrapartida (Micro-DDA): 3 aciertos seguidos en < 800 ms -> +2 niveles
      let ddaJumped = false;
      if (reactionMs < 800) {
        activeSession.fastStreakUnder800 += 1;
        if (activeSession.fastStreakUnder800 >= 3) {
          activeSession.level += 2;
          activeSession.fastStreakUnder800 = 0;
          ddaJumped = true;
          showMicroDDABanner(reactionMs);
        }
      } else {
        activeSession.fastStreakUnder800 = 0;
        if (activeSession.hits % 3 === 0) activeSession.level += 1;
      }

      if (activeSession.level > activeSession.maxLevel) {
        activeSession.maxLevel = activeSession.level;
      }

      const gained = Math.round(
        customPoints *
          (1 + (activeSession.level - 1) * 0.12) *
          feverMult *
          relicMult *
          feverRelicBoost
      );
      activeSession.score += gained;

      // En modo Contrarreloj de Supervivencia cada acierto suma +1.8 s (+0.4s con reliquia 14)
      if (activeSession.isSurvival) {
        const bonusSec = 1.8 + (window.NeuroArt.hasRelic('reliquia_14') ? 0.4 : 0);
        activeSession.timeLeft = Math.min(30, +(activeSession.timeLeft + bonusSec).toFixed(1));
      }

      // Daño al Coloso de la Semana si estamos en Boss Fight
      if (activeSession.onBossHit) {
        activeSession.onBossHit(gained, true);
      }

      updateArenaHUD();

      // Si es Muerte Súbita y alcanza la ronda 12, victoria épica
      if (activeSession.isSuddenDeath && activeSession.round >= 12) {
        finishGame('¡Ronda 12 de Muerte Súbita superada con éxito!');
        return;
      }

      setTimeout(() => renderNextRound(ddaJumped), 180);
    } else {
      activeSession.misses += 1;
      activeSession.fastStreakUnder800 = 0;

      const usedShield = activeSession.shieldAvailable;
      if (usedShield) {
        activeSession.shieldAvailable = false;
        showMicroBanner('🛡️ ESCUDO TÉRMICO ACTIVADO · RACHA PROTEGIDA', 'shield');
      }

      window.NeuroFX.triggerMiss(usedShield);

      // Disparador contextual en vivo de principles.js
      if (
        ['balloon', 'stock', 'triage', 'deduce', 'switch', 'nogo'].includes(
          activeSession.subGameId
        ) ||
        activeSession.misses === 1
      ) {
        window.NeuroPrinciples.showContextualPill(activeSession.subGameId, customBiasReason);
      }

      if (activeSession.onBossHit) {
        activeSession.onBossHit(0, false);
      }

      if (activeSession.isSuddenDeath && !usedShield) {
        finishGame('Muerte Súbita: La racha se ha roto');
        return;
      }

      updateArenaHUD();
      setTimeout(() => renderNextRound(false), 320);
    }
  }

  function showMicroDDABanner(ms) {
    showMicroBanner(`⚡ MICRO-DDA (${ms} ms ×3): ¡SALTO AUTOMÁTICO +2 NIVELES!`, 'dda');
  }

  function showMicroBanner(text, type = 'dda') {
    const el = document.getElementById('arenaMicroBanner');
    if (!el) return;
    el.textContent = text;
    el.className = `arena-micro-banner banner-${type}`;
    el.hidden = false;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.hidden = true;
    }, 2200);
  }

  /**
   * Renderiza la siguiente ronda del minijuego activo (o alterna sub-juegos si es Modo Fusión)
   */
  function renderNextRound() {
    if (!activeSession) return;
    if (activeSession.subState && activeSession.subState.cleanup) {
      activeSession.subState.cleanup();
      activeSession.subState.cleanup = null;
    }

    // Si es un Modo Fusión, alterna entre los módulos que lo componen
    if (activeSession.fusionSequence && activeSession.fusionSequence.length > 0) {
      const seq = activeSession.fusionSequence;
      activeSession.subGameId = seq[activeSession.round % seq.length];
    } else {
      activeSession.subGameId = activeSession.gameId;
    }

    const stage = document.getElementById('gameStageArena');
    if (!stage) return;
    stage.classList.remove('rotated-90', 'fog-vision');
    activeSession.roundStartMs = performance.now();

    const gid = activeSession.subGameId;
    switch (gid) {
      case 'calc':
        renderCalcRound(stage);
        break;
      case 'anagram':
        renderAnagramRound(stage);
        break;
      case 'chain':
        renderChainRound(stage);
        break;
      case 'nogo':
        renderNoGoRound(stage);
        break;
      case 'switch':
        renderSwitchRound(stage);
        break;
      case 'track':
        renderTrackRound(stage);
        break;
      case 'odd':
        renderOddRound(stage);
        break;
      case 'nback':
        renderNBackRound(stage);
        break;
      case 'matrix':
        renderMatrixRound(stage);
        break;
      case 'lights':
        renderLightsRound(stage);
        break;
      case 'ghost':
        renderGhostRound(stage);
        break;
      case 'hanoi':
        renderHanoiRound(stage);
        break;
      case 'cubes':
        renderCubesRound(stage);
        break;
      case 'rotation':
        renderRotationRound(stage);
        break;
      case 'deduce':
        renderDeduceRound(stage);
        break;
      case 'series':
        renderSeriesRound(stage);
        break;
      case 'systems':
        renderSystemsRound(stage);
        break;
      case 'balloon':
        renderBalloonRound(stage);
        break;
      case 'stock':
        renderStockRound(stage);
        break;
      case 'triage':
        renderTriageRound(stage);
        break;
      default:
        renderCalcRound(stage);
        break;
    }
  }

  // ============================================================================
  // IMPLEMENTACIÓN DE LOS 20 MINIJUEGOS COGNITIVOS
  // ============================================================================

  // 1. CALC.JS — Cálculo Relámpago
  function renderCalcRound(stage) {
    const rng = activeSession.rng;
    const lvl = activeSession.level;
    const ops = lvl >= 3 ? ['+', '-', '×', 'incognita'] : ['+', '-', '×'];
    const op = ops[Math.floor(rng() * ops.length)];

    let a, b, answer, promptText;
    if (op === '+') {
      a = Math.floor(12 + rng() * (15 * lvl));
      b = Math.floor(9 + rng() * (14 * lvl));
      answer = a + b;
      promptText = `${a} + ${b}`;
    } else if (op === '-') {
      a = Math.floor(25 + rng() * (18 * lvl));
      b = Math.floor(7 + rng() * Math.min(a - 3, 14 * lvl));
      answer = a - b;
      promptText = `${a} − ${b}`;
    } else if (op === '×') {
      a = Math.floor(4 + rng() * (4 + lvl * 2));
      b = Math.floor(3 + rng() * (5 + lvl));
      answer = a * b;
      promptText = `${a} × ${b}`;
    } else {
      a = Math.floor(8 + rng() * (10 + lvl * 3));
      answer = Math.floor(5 + rng() * (9 + lvl * 2));
      b = a + answer;
      promptText = `${a} + [ ? ] = ${b}`;
    }

    const choices = generateNumericChoices(answer, rng);
    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">calc.js · Velocidad Numérica</div>
        <div class="game-big-stimulus">${promptText}</div>
        <div class="game-options-grid cols-2">
          ${choices
            .map(
              (c) =>
                `<button type="button" class="game-opt-btn" data-val="${c}">${c}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        const val = Number(btn.getAttribute('data-val'));
        submitAnswer(val === answer, btn, 110);
      };
    });
  }

  // 2. ANAGRAM.JS — Forja de Anagramas
  function renderAnagramRound(stage) {
    const words = [
      { w: 'CORTEZA', hint: 'Capa externa del cerebro' },
      { w: 'SINAPSIS', hint: 'Conexión funcional entre neuronas' },
      { w: 'COBALTO', hint: 'Mineral magnético de la memoria' },
      { w: 'TITANIO', hint: 'Metal ligero de alta resistencia' },
      { w: 'IMPULSO', hint: 'Señal eléctrica que viaja por el axón' },
      { w: 'DOPAMINA', hint: 'Neurotransmisor de la motivación' },
      { w: 'MEMORIA', hint: 'Retención activa de información' },
      { w: 'ORBITAL', hint: 'Trayectoria alrededor de un núcleo' },
      { w: 'ALGORITMO', hint: 'Secuencia lógica de instrucciones' },
      { w: 'VECTORES', hint: 'Magnitudes con dirección y sentido' },
      { w: 'ATENCION', hint: 'Filtro ejecutivo de estímulos' },
      { w: 'NEURONA', hint: 'Célula principal del sistema nervioso' },
      { w: 'CRISOL', hint: 'Recipiente de fundición a alta temperatura' },
      { w: 'QUIMICA', hint: 'Ciencia de la transformación de la materia' }
    ];
    const rng = activeSession.rng;
    const target = words[Math.floor(rng() * words.length)];
    const scrambled = scrambleString(target.w, rng);

    const distractors = words
      .filter((x) => x.w !== target.w)
      .sort(() => rng() - 0.5)
      .slice(0, 3)
      .map((x) => x.w);
    const options = [target.w, ...distractors].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">anagram.js · Fluidez Léxica</div>
        <p class="game-subhint">Pista: ${target.hint}</p>
        <div class="game-big-stimulus mono-spaced">${scrambled}</div>
        <div class="game-options-grid cols-2">
          ${options
            .map(
              (opt) =>
                `<button type="button" class="game-opt-btn" data-word="${opt}">${opt}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-word') === target.w, btn, 125);
      };
    });
  }

  // 3. CHAIN.JS — Cadena Semántica
  function renderChainRound(stage) {
    const chains = [
      {
        seq: 'ÁTOMO → MOLÉCULA → CÉLULA → ?',
        rule: 'Escala de complejidad biológica creciente',
        ans: 'TEJIDO',
        opts: ['TEJIDO', 'ELECTRÓN', 'GALAXIA', 'CUARZO']
      },
      {
        seq: 'CAUSA → EFECTO · PREMISA → ?',
        rule: 'Analogía deductiva',
        ans: 'CONCLUSIÓN',
        opts: ['CONCLUSIÓN', 'HIPÓTESIS', 'AXIOMA', 'DUDA']
      },
      {
        seq: 'FOR-JA → JA-ula → LA-ser → ?',
        rule: 'Encadenamiento silábico (empieza por SER)',
        ans: 'SER-piente',
        opts: ['SER-piente', 'LA-tido', 'FOR-ma', 'LU-z']
      },
      {
        seq: 'EFÍMERO ↔ PERENNE · CAOS ↔ ?',
        rule: 'Antónimo conceptual exacto',
        ans: 'ORDEN',
        opts: ['ORDEN', 'ENTROPÍA', 'AZAR', 'RUIDO']
      },
      {
        seq: 'COBRE → HIERRO → ACERO → ?',
        rule: 'Escala de dureza en Ligas de Aleación',
        ans: 'TITANIO',
        opts: ['TITANIO', 'ARCILLA', 'MADERA', 'YESO']
      },
      {
        seq: 'RETINA → VISIÓN · CÓCLEA → ?',
        rule: 'Órgano sensorial a función',
        ans: 'AUDICIÓN',
        opts: ['AUDICIÓN', 'OLFATO', 'EQUILIBRIO', 'TACTO']
      }
    ];
    const rng = activeSession.rng;
    const item = chains[Math.floor(rng() * chains.length)];
    const shuffled = [...item.opts].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">chain.js · Asociación Semántica</div>
        <p class="game-subhint">${item.rule}</p>
        <div class="game-big-stimulus text-md">${item.seq}</div>
        <div class="game-options-grid cols-2">
          ${shuffled
            .map(
              (o) =>
                `<button type="button" class="game-opt-btn" data-val="${o}">${o}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-val') === item.ans, btn, 115);
      };
    });
  }

  // 4. NOGO.JS — Impulso Go / No-Go (Inhibición y Latencia en ms)
  function renderNoGoRound(stage) {
    const rng = activeSession.rng;
    const isNoGo = rng() < 0.28; // 28% de estímulos trampa rojos (No-Go)
    const symbols = isNoGo
      ? ['⛔ NO PULSAR (TRAMPA ROJA)', '🛑 SEÑUELO CRÍTICO · NO TOCAR']
      : ['⚡ PULSAR AHORA (GO)', '🟢 NÚCLEO ESTABLE · PULSAR'];
    const label = symbols[Math.floor(rng() * symbols.length)];

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">nogo.js · Control Inhibitorio y Latencia</div>
        <p class="game-subhint">Pulsa al instante si es VERDE/CIAN. Si es ROJO, NO toques nada durante 1.3 s.</p>
        <button type="button" id="nogoTargetBtn" class="nogo-target ${isNoGo ? 'nogo-danger' : 'nogo-safe'}">
          <span class="nogo-glyph">${isNoGo ? '🛑' : '⚡'}</span>
          <span class="nogo-text">${label}</span>
        </button>
      </div>
    `;

    const btn = document.getElementById('nogoTargetBtn');
    let resolved = false;

    const autoPassTimer = setTimeout(() => {
      if (resolved || !activeSession) return;
      resolved = true;
      if (isNoGo) {
        // Éxito al inhibir la respuesta ante trampa roja
        submitAnswer(true, btn, 135);
      } else {
        // Demasiado lento en estímulo Go
        submitAnswer(false, btn, 0, 'No reaccionaste a tiempo ante un estímulo positivo Go.');
      }
    }, isNoGo ? 1300 : Math.max(950, 1750 - activeSession.level * 90));

    activeSession.subState.cleanup = () => clearTimeout(autoPassTimer);

    if (btn) {
      const handleTap = (e) => {
        if (e && e.cancelable) e.preventDefault();
        if (resolved) return;
        resolved = true;
        clearTimeout(autoPassTimer);
        if (isNoGo) {
          submitAnswer(
            false,
            btn,
            0,
            'Caíste en un estímulo trampa rojo (No-Go) por respuesta motora prepotente.'
          );
        } else {
          submitAnswer(true, btn, 120);
        }
      };
      btn.onpointerdown = handleTap;
      btn.onclick = handleTap;
    }
  }

  // 5. SWITCH.JS — Cambio de Regla (Flexibilidad Cognitiva)
  function renderSwitchRound(stage) {
    const rng = activeSession.rng;
    const rules = [
      { id: 'paridad', title: 'REGLA ACTIVA: ¿PAR O IMPAR?', color: '#38bdf8' },
      { id: 'magnitud', title: 'REGLA ACTIVA: ¿MAYOR O MENOR QUE 50?', color: '#f59e0b' },
      { id: 'multiplo', title: 'REGLA ACTIVA: ¿MÚLTIPLO DE 3?', color: '#10b981' }
    ];
    const rule = rules[Math.floor(rng() * rules.length)];
    let num = Math.floor(11 + rng() * 78);
    if (num === 50) num = 52;

    let leftLabel, rightLabel, correctSide;
    if (rule.id === 'paridad') {
      leftLabel = 'PAR';
      rightLabel = 'IMPAR';
      correctSide = num % 2 === 0 ? 'left' : 'right';
    } else if (rule.id === 'magnitud') {
      leftLabel = 'MENOR (< 50)';
      rightLabel = 'MAYOR (> 50)';
      correctSide = num < 50 ? 'left' : 'right';
    } else {
      leftLabel = 'SÍ (Múltiplo de 3)';
      rightLabel = 'NO';
      correctSide = num % 3 === 0 ? 'left' : 'right';
    }

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">switch.js · Flexibilidad Prefrontal</div>
        <div class="switch-rule-banner" style="border-color:${rule.color}; color:${rule.color}">
          🔀 ${rule.title}
        </div>
        <div class="game-big-stimulus">${num}</div>
        <div class="game-options-grid cols-2">
          <button type="button" class="game-opt-btn" data-side="left">${leftLabel}</button>
          <button type="button" class="game-opt-btn" data-side="right">${rightLabel}</button>
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-side') === correctSide, btn, 125);
      };
    });
  }

  // 6. TRACK.JS — Rastreo Múltiple de Objetivos (MOT)
  function renderTrackRound(stage) {
    const rng = activeSession.rng;
    const totalNodes = 7;
    const targetCount = Math.min(4, 2 + Math.floor(activeSession.level / 3));
    const isAcousticFog =
      activeSession.mutator && activeSession.mutator.id === 'niebla_acustica';

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">track.js · Atención Dividida (${targetCount} Objetivos)</div>
        <p id="trackPhaseHint" class="game-subhint">Memoriza las ${targetCount} sondas NARANJAS antes de que se oculten y se muevan...</p>
        <div id="trackField" class="track-field ${isAcousticFog ? 'acoustic-fog-active' : ''}"></div>
      </div>
    `;

    const field = document.getElementById('trackField');
    const nodes = [];
    for (let i = 0; i < totalNodes; i++) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `track-orb ${i < targetCount ? 'is-target-preview' : ''}`;
      const x = 15 + rng() * 70;
      const y = 18 + rng() * 64;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.textContent = '◉';
      field.appendChild(el);
      nodes.push({
        el,
        isTarget: i < targetCount,
        picked: false,
        x,
        y,
        vx: (rng() - 0.5) * 1.35,
        vy: (rng() - 0.5) * 1.35
      });
    }

    let phase = 'preview'; // preview -> moving -> select
    let picksLeft = targetCount;
    let animId = null;

    const t1 = setTimeout(() => {
      phase = 'moving';
      const hint = document.getElementById('trackPhaseHint');
      if (hint) hint.textContent = 'Siguiendo trayectorias orbitales...';
      nodes.forEach((n) => n.el.classList.remove('is-target-preview'));

      let steps = 0;
      const stepMove = () => {
        steps += 1;
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 10 || n.x > 88) n.vx *= -1;
          if (n.y < 12 || n.y > 86) n.vy *= -1;
          n.el.style.left = `${n.x}%`;
          n.el.style.top = `${n.y}%`;
        });
        if (steps < 75) {
          animId = requestAnimationFrame(stepMove);
        } else {
          phase = 'select';
          if (hint) {
            hint.textContent = `¡Selecciona las ${targetCount} sondas originales!`;
          }
          if (isAcousticFog) {
            const firstTarget = nodes.find((n) => n.isTarget);
            if (firstTarget) {
              const pan = (firstTarget.x - 50) / 50;
              window.NeuroFX.playSpatialRadarPing(pan, 0.8);
            }
          }
        }
      };
      animId = requestAnimationFrame(stepMove);
    }, 1100);

    activeSession.subState.cleanup = () => {
      clearTimeout(t1);
      if (animId) cancelAnimationFrame(animId);
    };

    nodes.forEach((n) => {
      n.el.onclick = () => {
        if (phase !== 'select' || n.picked) return;
        n.picked = true;
        if (n.isTarget) {
          n.el.classList.add('orb-hit');
          picksLeft -= 1;
          if (picksLeft <= 0) {
            submitAnswer(true, n.el, 155);
          }
        } else {
          n.el.classList.add('orb-miss');
          submitAnswer(false, n.el, 0);
        }
      };
    });
  }

  // 7. ODD.JS — Intruso Perceptivo (Odd One Out)
  function renderOddRound(stage) {
    const rng = activeSession.rng;
    const gridSize = activeSession.level >= 4 ? 16 : 12;
    const pairs = [
      ['◈', '◇'],
      ['⬢', '⬡'],
      ['◤', '◥'],
      ['88', '8B'],
      ['M', 'N'],
      ['⏣', '⎔'],
      ['∆', '∇']
    ];
    const pair = pairs[Math.floor(rng() * pairs.length)];
    const oddIdx = Math.floor(rng() * gridSize);
    const isAcousticFog =
      activeSession.mutator && activeSession.mutator.id === 'niebla_acustica';

    if (isAcousticFog) {
      const col = oddIdx % 4;
      const pan = (col - 1.5) / 1.5;
      window.NeuroFX.playSpatialRadarPing(pan, 0.75);
    }

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">odd.js · Discriminación Visual Rápida</div>
        <p class="game-subhint">Toca el único elemento que rompe la simetría de la matriz:</p>
        <div class="odd-grid ${isAcousticFog ? 'acoustic-fog-active' : ''}">
          ${Array.from({ length: gridSize })
            .map(
              (_, i) => `
              <button type="button" class="odd-cell" data-idx="${i}">
                ${i === oddIdx ? pair[1] : pair[0]}
              </button>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.odd-cell').forEach((cell) => {
      cell.onclick = () => {
        const idx = Number(cell.getAttribute('data-idx'));
        submitAnswer(idx === oddIdx, cell, 115);
      };
    });
  }

  // 8. NBACK.JS — Protocolo 2-Back (Memoria de Trabajo Ejecutiva)
  function renderNBackRound(stage) {
    const rng = activeSession.rng;
    if (!activeSession.subState.nbackHistory) {
      // Sembrar 2 pasos previos para que desde el primer turno se pueda evaluar 2-Back
      const letters = ['A', 'K', 'M', 'R', 'T', 'X'];
      activeSession.subState.nbackHistory = [
        { pos: Math.floor(rng() * 9), let: letters[Math.floor(rng() * letters.length)] },
        { pos: Math.floor(rng() * 9), let: letters[Math.floor(rng() * letters.length)] }
      ];
    }

    const hist = activeSession.subState.nbackHistory;
    const twoAgo = hist[hist.length - 2];
    const oneAgo = hist[hist.length - 1];
    const letters = ['A', 'K', 'M', 'R', 'T', 'X'];

    const isMatch = rng() < 0.48;
    const current = isMatch
      ? { pos: twoAgo.pos, let: twoAgo.let }
      : {
          pos: (twoAgo.pos + 1 + Math.floor(rng() * 7)) % 9,
          let: letters.find((l) => l !== twoAgo.let) || 'Z'
        };
    hist.push(current);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">nback.js · Memoria de Trabajo 2-Back</div>
        <div class="nback-history-strip">
          <span>Hace 2 turnos (N-2): <strong>Casilla #${twoAgo.pos + 1} · Letra ${twoAgo.let}</strong></span>
          <span>Hace 1 turno (N-1): <strong>Casilla #${oneAgo.pos + 1} · Letra ${oneAgo.let}</strong></span>
        </div>
        <div class="nback-grid">
          ${Array.from({ length: 9 })
            .map(
              (_, i) => `
              <div class="nback-cell ${i === current.pos ? 'active' : ''}">
                ${i === current.pos ? current.let : ''}
              </div>
            `
            )
            .join('')}
        </div>
        <div class="game-options-grid cols-2">
          <button type="button" class="game-opt-btn btn-accent" data-match="true">⚡ COINCIDE CON N-2</button>
          <button type="button" class="game-opt-btn" data-match="false">❌ DISTINTO DE N-2</button>
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        const userSaidMatch = btn.getAttribute('data-match') === 'true';
        submitAnswer(userSaidMatch === isMatch, btn, 135);
      };
    });
  }

  // 9. MATRIX.JS — Matriz de Memoria Espacial
  function renderMatrixRound(stage) {
    const rng = activeSession.rng;
    const totalCells = 9;
    const litCount = Math.min(5, 3 + Math.floor(activeSession.level / 2));
    const isMirrorMutator =
      activeSession.mutator && activeSession.mutator.id === 'espejo_invertido';
    const previewExtra = window.NeuroArt.hasRelic('reliquia_06') ? 400 : 0;

    const indices = Array.from({ length: totalCells }, (_, i) => i).sort(() => rng() - 0.5);
    const targets = new Set(indices.slice(0, litCount));

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">matrix.js · Memoria Visuoespacial</div>
        <p id="matrixHint" class="game-subhint">Memoriza los ${litCount} nodos encendidos...</p>
        <div id="matrixBoard" class="matrix-board">
          ${Array.from({ length: totalCells })
            .map(
              (_, i) => `
              <button type="button" class="matrix-tile ${targets.has(i) ? 'lit' : ''}" data-idx="${i}"></button>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    let canClick = false;
    let found = 0;

    const timer = setTimeout(() => {
      canClick = true;
      const board = document.getElementById('matrixBoard');
      const hint = document.getElementById('matrixHint');
      if (board) {
        board.querySelectorAll('.matrix-tile').forEach((t) => t.classList.remove('lit'));
        if (isMirrorMutator) {
          board.classList.add('rotated-90');
          if (hint) hint.textContent = '🔄 ¡Tablero rotado 90°! Toca los nodos equivalentes:';
        } else if (hint) {
          hint.textContent = `Reproduce los ${litCount} nodos de memoria:`;
        }
      }
    }, 950 + previewExtra);

    activeSession.subState.cleanup = () => clearTimeout(timer);

    stage.querySelectorAll('.matrix-tile').forEach((tile) => {
      tile.onclick = () => {
        if (!canClick || tile.classList.contains('selected')) return;
        const idx = Number(tile.getAttribute('data-idx'));
        tile.classList.add('selected');
        if (targets.has(idx)) {
          tile.classList.add('correct');
          found += 1;
          if (found >= litCount) {
            submitAnswer(true, tile, 140);
          }
        } else {
          tile.classList.add('wrong');
          submitAnswer(false, tile, 0);
        }
      };
    });
  }

  // 10. LIGHTS.JS — Secuencia Luminosa (Test de Corsi)
  function renderLightsRound(stage) {
    const rng = activeSession.rng;
    const seqLen = Math.min(5, 3 + Math.floor(activeSession.level / 3));
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => rng() - 0.5);
    const sequence = pool.slice(0, seqLen);
    const isMirror = activeSession.mutator && activeSession.mutator.id === 'espejo_invertido';

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">lights.js · Memoria Secuencial de Corsi</div>
        <p id="lightsHint" class="game-subhint">Observa el orden exacto de ignición (1 → ${seqLen})...</p>
        <div id="lightsBoard" class="matrix-board">
          ${Array.from({ length: 9 })
            .map(
              (_, i) =>
                `<button type="button" class="matrix-tile" data-idx="${i}"></button>`
            )
            .join('')}
        </div>
      </div>
    `;

    const tiles = stage.querySelectorAll('.matrix-tile');
    let inputEnabled = false;
    let stepIdx = 0;
    const timeouts = [];

    sequence.forEach((cellIdx, order) => {
      const tOn = setTimeout(() => {
        if (tiles[cellIdx]) {
          tiles[cellIdx].classList.add('lit');
          tiles[cellIdx].textContent = String(order + 1);
        }
      }, order * 480 + 150);

      const tOff = setTimeout(() => {
        if (tiles[cellIdx]) {
          tiles[cellIdx].classList.remove('lit');
          tiles[cellIdx].textContent = '';
        }
      }, order * 480 + 430);

      timeouts.push(tOn, tOff);
    });

    const tReady = setTimeout(() => {
      inputEnabled = true;
      const hint = document.getElementById('lightsHint');
      const board = document.getElementById('lightsBoard');
      if (isMirror && board) board.classList.add('rotated-90');
      if (hint) hint.textContent = '¡Repite la secuencia en el mismo orden!';
    }, sequence.length * 480 + 220);
    timeouts.push(tReady);

    activeSession.subState.cleanup = () => timeouts.forEach((t) => clearTimeout(t));

    tiles.forEach((tile) => {
      tile.onclick = () => {
        if (!inputEnabled) return;
        const idx = Number(tile.getAttribute('data-idx'));
        if (idx === sequence[stepIdx]) {
          tile.classList.add('correct');
          tile.textContent = String(stepIdx + 1);
          stepIdx += 1;
          if (stepIdx >= sequence.length) {
            submitAnswer(true, tile, 145);
          }
        } else {
          tile.classList.add('wrong');
          submitAnswer(false, tile, 0);
        }
      };
    });
  }

  // 11. GHOST.JS — Rastro Fantasma (Memoria Numérica Instantánea)
  function renderGhostRound(stage) {
    const rng = activeSession.rng;
    const count = 4;
    const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => rng() - 0.5).slice(0, count);
    const mapPosToNum = {};
    cells.forEach((pos, idx) => {
      mapPosToNum[pos] = idx + 1;
    });

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">ghost.js · Memoria Fotográfica</div>
        <p id="ghostHint" class="game-subhint">Memoriza dónde están el 1, 2, 3 y 4 antes del velo fantasma...</p>
        <div id="ghostBoard" class="matrix-board">
          ${Array.from({ length: 9 })
            .map((_, i) => {
              const num = mapPosToNum[i];
              return `<button type="button" class="matrix-tile ${num ? 'lit' : ''}" data-idx="${i}">${num || ''}</button>`;
            })
            .join('')}
        </div>
      </div>
    `;

    let masked = false;
    let nextExpected = 1;

    const maskTimer = setTimeout(() => {
      masked = true;
      const hint = document.getElementById('ghostHint');
      if (hint) hint.textContent = 'Toca en orden ascendente: 1 → 2 → 3 → 4';
      stage.querySelectorAll('.matrix-tile').forEach((t) => {
        t.textContent = '';
        t.classList.remove('lit');
      });
    }, 1050);

    activeSession.subState.cleanup = () => clearTimeout(maskTimer);

    stage.querySelectorAll('.matrix-tile').forEach((tile) => {
      tile.onclick = () => {
        if (!masked) return;
        const idx = Number(tile.getAttribute('data-idx'));
        const num = mapPosToNum[idx];
        if (num === nextExpected) {
          tile.classList.add('correct');
          tile.textContent = String(num);
          nextExpected += 1;
          if (nextExpected > count) {
            submitAnswer(true, tile, 150);
          }
        } else {
          tile.classList.add('wrong');
          submitAnswer(false, tile, 0);
        }
      };
    });
  }

  // 12. HANOI.JS — Torres de Hanói Interactivas
  function renderHanoiRound(stage) {
    // Puzle interactivo de 3 discos desde un estado intermedio o inicial hacia la Torre C
    const towers = [[3, 2, 1], [], []];
    let selectedTower = null;
    let moves = 0;

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">hanoi.js · Planificación Ejecutiva Recursiva</div>
        <p class="game-subhint">Pasa los 3 discos a la <strong>TORRE C</strong> (mínimo 7 movimientos). Toca torre origen y torre destino.</p>
        <div id="hanoiContainer" class="hanoi-board"></div>
        <div class="hanoi-footer">Movimientos: <strong id="hanoiMovesCount">0</strong> / Óptimo: 7</div>
      </div>
    `;

    const container = document.getElementById('hanoiContainer');

    function drawTowers() {
      container.innerHTML = ['TORRE A', 'TORRE B', 'TORRE C (META)']
        .map((label, tIdx) => {
          const disks = towers[tIdx];
          return `
            <button type="button" class="hanoi-peg ${selectedTower === tIdx ? 'peg-selected' : ''}" data-peg="${tIdx}">
              <div class="hanoi-disks-stack">
                ${disks
                  .map(
                    (d) =>
                      `<div class="hanoi-disk disk-size-${d}">${d}</div>`
                  )
                  .join('')}
              </div>
              <span class="hanoi-peg-label">${label}</span>
            </button>
          `;
        })
        .join('');

      container.querySelectorAll('.hanoi-peg').forEach((pegBtn) => {
        pegBtn.onclick = () => {
          const pIdx = Number(pegBtn.getAttribute('data-peg'));
          if (selectedTower === null) {
            if (towers[pIdx].length > 0) {
              selectedTower = pIdx;
              drawTowers();
            }
          } else if (selectedTower === pIdx) {
            selectedTower = null;
            drawTowers();
          } else {
            const fromStack = towers[selectedTower];
            const toStack = towers[pIdx];
            const movingDisk = fromStack[fromStack.length - 1];
            const topTarget = toStack[toStack.length - 1];

            if (!topTarget || movingDisk < topTarget) {
              fromStack.pop();
              toStack.push(movingDisk);
              moves += 1;
              selectedTower = null;
              const mc = document.getElementById('hanoiMovesCount');
              if (mc) mc.textContent = String(moves);
              drawTowers();

              if (towers[2].length === 3) {
                submitAnswer(true, pegBtn, moves <= 7 ? 240 : 170);
              }
            } else {
              // Movimiento inválido
              selectedTower = null;
              drawTowers();
            }
          }
        };
      });
    }

    drawTowers();
  }

  // 13. CUBES.JS — Conteo de Cubos Isométricos 3D
  function renderCubesRound(stage) {
    const rng = activeSession.rng;
    // Generamos una matriz 3x3 de alturas de columnas (incluyendo los bloques de base ocultos)
    const heights = [
      Math.floor(1 + rng() * 3),
      Math.floor(1 + rng() * 3),
      Math.floor(0 + rng() * 2),
      Math.floor(1 + rng() * 3),
      Math.floor(2 + rng() * 3),
      Math.floor(1 + rng() * 2)
    ];
    const totalCubes = heights.reduce((a, b) => a + b, 0);
    const choices = generateNumericChoices(totalCubes, rng, 1);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">cubes.js · Visión Espacial y Bloques 3D</div>
        <p class="game-subhint">Suma el total de cubos de las 6 columnas (cada número indica la altura de esa pila):</p>
        <div class="cubes-iso-grid">
          ${heights
            .map(
              (h, idx) => `
              <div class="cube-pillar">
                <div class="cube-stack-visual">
                  ${Array.from({ length: h })
                    .map(() => `<span class="iso-cube-block">🧊</span>`)
                    .join('')}
                </div>
                <span class="cube-col-tag">Col ${idx + 1}: ${h} niv.</span>
              </div>
            `
            )
            .join('')}
        </div>
        <div class="game-options-grid cols-2">
          ${choices
            .map(
              (c) =>
                `<button type="button" class="game-opt-btn" data-val="${c}">${c} Cubos</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(Number(btn.getAttribute('data-val')) === totalCubes, btn, 135);
      };
    });
  }

  // 14. ROTATION.JS — Rotación Mental 3D (Shepard-Metzler)
  function renderRotationRound(stage) {
    const rng = activeSession.rng;
    const angles = [90, 180, 270];
    const correctAngle = angles[Math.floor(rng() * angles.length)];
    const options = [
      { id: 'correct', rot: correctAngle, flip: false, label: `Rotada ${correctAngle}°` },
      { id: 'mirror1', rot: 90, flip: true, label: 'Quiral Espejada A' },
      { id: 'mirror2', rot: 180, flip: true, label: 'Quiral Espejada B' },
      { id: 'mirror3', rot: 270, flip: true, label: 'Quiral Espejada C' }
    ].sort(() => rng() - 0.5);

    const shapeSVG = (rot, flip) => `
      <svg viewBox="0 0 80 80" width="68" height="68" aria-hidden="true">
        <g transform="translate(40,40) rotate(${rot}) scale(${flip ? -1 : 1}, 1) translate(-40,-40)">
          <rect x="20" y="14" width="14" height="52" rx="3" fill="#38bdf8"/>
          <rect x="34" y="14" width="26" height="14" rx="3" fill="#f97316"/>
          <rect x="34" y="52" width="16" height="14" rx="3" fill="#fbbf24"/>
        </g>
      </svg>
    `;

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">rotation.js · Rotación Mental Parietal</div>
        <p class="game-subhint">¿Cuál de las 4 piezas es una <strong>rotación pura</strong> del modelo (NO espejada)?</p>
        <div class="rotation-model-box">
          <span>MODELO BASE</span>
          ${shapeSVG(0, false)}
        </div>
        <div class="game-options-grid cols-2">
          ${options
            .map(
              (o) => `
              <button type="button" class="game-opt-btn rotation-opt" data-id="${o.id}">
                ${shapeSVG(o.rot, o.flip)}
              </button>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.rotation-opt').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-id') === 'correct', btn, 140);
      };
    });
  }

  // 15. DEDUCE.JS — Deducción de Matrices y Silogismos
  function renderDeduceRound(stage) {
    const puzzles = [
      {
        q: 'Fila 1: [ ▲ · ▲▲ · ▲▲▲ ]  |  Fila 2: [ ● · ●● · ? ]',
        hint: 'Progresión aritmética de elementos por columna',
        ans: '●●●',
        opts: ['●●●', '▲▲▲', '●▲●', '■■']
      },
      {
        q: 'Todos los Catalizadores son Conductores. Ningún Aislante es Conductor. Por tanto:',
        hint: 'Silogismo categórico formal',
        ans: 'Ningún Catalizador es Aislante',
        opts: [
          'Ningún Catalizador es Aislante',
          'Algunos Aislantes son Catalizadores',
          'Todo Conductor es Catalizador',
          'No se puede deducir'
        ]
      },
      {
        q: 'Si [ Litio > Cobalto ] y [ Cobalto > Mercurio ], ¿cuál tiene menor energía?',
        hint: 'Transitividad lineal',
        ans: 'Mercurio',
        opts: ['Mercurio', 'Cobalto', 'Litio', 'Son iguales']
      },
      {
        q: 'Matriz XOR: [ 1 ⊕ 0 = 1 ] · [ 1 ⊕ 1 = 0 ] · [ 0 ⊕ 1 = ? ]',
        hint: 'Puerta lógica OR Exclusiva (1 si los bits son distintos)',
        ans: '1',
        opts: ['1', '0', '2', '11']
      },
      {
        q: 'Patrón rotacional: [ ↑ · → · ↓ · ? ]',
        hint: 'Giro horario de 90° por paso',
        ans: '←',
        opts: ['←', '↑', '↗', '↙']
      }
    ];
    const rng = activeSession.rng;
    const item = puzzles[Math.floor(rng() * puzzles.length)];
    const shuffled = [...item.opts].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">deduce.js · Razonamiento Deductivo</div>
        <p class="game-subhint">${item.hint}</p>
        <div class="game-big-stimulus text-md">${item.q}</div>
        <div class="game-options-grid cols-2">
          ${shuffled
            .map(
              (o) =>
                `<button type="button" class="game-opt-btn" data-val="${o}">${o}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-val') === item.ans, btn, 140);
      };
    });
  }

  // 16. SERIES.JS — Series Cuánticas Numéricas
  function renderSeriesRound(stage) {
    const rng = activeSession.rng;
    const type = Math.floor(rng() * 4);
    let seq = [];
    let ans = 0;
    let hint = '';

    if (type === 0) {
      // Progresión de diferencias crecientes (+2, +4, +6, +8)
      const start = Math.floor(3 + rng() * 10);
      seq = [start, start + 2, start + 6, start + 12];
      ans = start + 20;
      hint = 'Diferencias pares crecientes (+2, +4, +6, +8)';
    } else if (type === 1) {
      // Geométrica ×2 + 1
      const s = Math.floor(2 + rng() * 4);
      const n1 = s * 2 + 1;
      const n2 = n1 * 2 + 1;
      const n3 = n2 * 2 + 1;
      seq = [s, n1, n2, n3];
      ans = n3 * 2 + 1;
      hint = 'Regla recursiva: (×2) + 1';
    } else if (type === 2) {
      // Fibonacci desplazado
      const a = Math.floor(2 + rng() * 5);
      const b = Math.floor(3 + rng() * 6);
      seq = [a, b, a + b, a + 2 * b];
      ans = 2 * a + 3 * b;
      hint = 'Suma de los dos términos anteriores';
    } else {
      // Cuadrados perfectos desplazados
      const offset = Math.floor(1 + rng() * 5);
      seq = [1 + offset, 4 + offset, 9 + offset, 16 + offset];
      ans = 25 + offset;
      hint = 'Serie de cuadrados perfectos + constante';
    }

    const choices = generateNumericChoices(ans, rng);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">series.js · Inducción Matemática</div>
        <p class="game-subhint">Halla el siguiente eslabón de la secuencia:</p>
        <div class="game-big-stimulus">${seq.join('  →  ')}  →  ?</div>
        <div class="game-options-grid cols-2">
          ${choices
            .map(
              (c) =>
                `<button type="button" class="game-opt-btn" data-val="${c}">${c}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(Number(btn.getAttribute('data-val')) === ans, btn, 135, hint);
      };
    });
  }

  // 17. SYSTEMS.JS — Regulación de Sistemas Complejos
  function renderSystemsRound(stage) {
    const scenarios = [
      {
        status: 'PRESIÓN: 92% (CRÍTICA) · FLUJO: 48% (OK) · TEMPERATURA: 88% (ALTA)',
        ans: 'Abrir Válvula de Purga Criogénica (-35% Presión, -30% Temp)',
        opts: [
          'Abrir Válvula de Purga Criogénica (-35% Presión, -30% Temp)',
          'Inyectar Plasma (+25% Presión, +30% Temp)',
          'Cerrar Turbina Central (+40% Presión, -20% Flujo)',
          'Activar Postquemador (+50% Temp)'
        ]
      },
      {
        status: 'TENSIÓN SINÁPTICA: 22% (BAJA) · OXÍGENO: 80% (OK) · RESERVA: 30% (BAJA)',
        ans: 'Activar Condensador Auxiliar (+45% Tensión, +35% Reserva)',
        opts: [
          'Activar Condensador Auxiliar (+45% Tensión, +35% Reserva)',
          'Drenar Reserva (-30% Reserva, +10% Oxígeno)',
          'Desconectar Bobinas (-20% Tensión)',
          'Purgar Oxígeno (-50% Oxígeno)'
        ]
      },
      {
        status: 'ESTABILIDAD: 35% (PELIGRO) · RUIDO: 85% (EXCESO) · FOCO: 40%',
        ans: 'Filtro Amortiguador Armónico (+40% Estabilidad, -55% Ruido)',
        opts: [
          'Filtro Amortiguador Armónico (+40% Estabilidad, -55% Ruido)',
          'Amplificar Ganancia Bruta (+30% Ruido, -20% Estabilidad)',
          'Cortocircuitar Sensores (-30% Foco)',
          'Sobrecargar Oscilador (+45% Ruido)'
        ]
      }
    ];
    const rng = activeSession.rng;
    const item = scenarios[Math.floor(rng() * scenarios.length)];
    const shuffled = [...item.opts].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">systems.js · Control de Variables Acopladas</div>
        <div class="systems-telemetry-box">${item.status}</div>
        <p class="game-subhint">Elige la intervención que equilibra las variables en rango seguro (50 % - 75 %):</p>
        <div class="game-options-grid cols-1">
          ${shuffled
            .map(
              (o) =>
                `<button type="button" class="game-opt-btn" data-val="${o}">${o}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-val') === item.ans, btn, 150);
      };
    });
  }

  // 18. BALLOON.JS — Globo de Plasma (Tolerancia al Riesgo BART)
  function renderBalloonRound(stage) {
    const rng = activeSession.rng;
    const maxPumps = Math.floor(4 + rng() * 6); // Explota entre el pulso 4 y 9
    let pumps = 0;
    let bankedPot = 0;

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">balloon.js · Gestión de Riesgo e Incertidumbre</div>
        <p class="game-subhint">Cada pulso suma Obsidiana, pero aumenta la probabilidad de explosión. ¡Asegura a tiempo!</p>
        <div class="balloon-stage">
          <div id="plasmaOrb" class="plasma-orb">
            <span id="plasmaPotText">0 pts</span>
          </div>
        </div>
        <div class="game-options-grid cols-2">
          <button type="button" id="pumpBalloonBtn" class="game-opt-btn btn-accent">🔥 INFLAR NÚCLEO (+45 pts)</button>
          <button type="button" id="bankBalloonBtn" class="game-opt-btn" disabled>🏦 ASEGURAR GANANCIA</button>
        </div>
      </div>
    `;

    const orb = document.getElementById('plasmaOrb');
    const potText = document.getElementById('plasmaPotText');
    const pumpBtn = document.getElementById('pumpBalloonBtn');
    const bankBtn = document.getElementById('bankBalloonBtn');

    if (pumpBtn) {
      pumpBtn.onclick = () => {
        pumps += 1;
        if (pumps >= maxPumps) {
          // ¡Explosión por arriesgar demasiado!
          if (orb) orb.classList.add('orb-exploded');
          const hasInsurance = window.NeuroArt.hasRelic('reliquia_12');
          if (hasInsurance && bankedPot > 0) {
            submitAnswer(true, pumpBtn, Math.round(bankedPot * 0.35));
          } else {
            submitAnswer(
              false,
              pumpBtn,
              0,
              `Explotó en el pulso #${pumps}. Sufriste la Falacia del Coste Hundido al no asegurar tus ${bankedPot} pts.`
            );
          }
        } else {
          bankedPot += 45 + pumps * 10;
          if (potText) potText.textContent = `+${bankedPot} pts (${pumps} pulsos)`;
          if (orb) orb.style.transform = `scale(${1 + pumps * 0.12})`;
          if (bankBtn) bankBtn.disabled = false;
        }
      };
    }

    if (bankBtn) {
      bankBtn.onclick = () => {
        if (pumps > 0) {
          submitAnswer(true, bankBtn, bankedPot);
        }
      };
    }
  }

  // 19. STOCK.JS — Fiebre de Wall Street (Probabilidades bajo Presión)
  function renderStockRound(stage) {
    const tickers = [
      {
        ticker: 'NRGF · NeuroForge Corp',
        news: 'TITULAR VERIFICADO: Auditoría confirma reservas récord de Litio (+78 % prob. alcista).',
        trend: 'ALCISTA (+18 %)',
        ans: 'COMPRAR / MANTENER POSICIÓN',
        opts: [
          'COMPRAR / MANTENER POSICIÓN',
          'VENDER EN PÁNICO (-40 %)',
          'APALANCAR 50× EN CORTO'
        ]
      },
      {
        ticker: 'BBLX · BubbleTech AI',
        news: 'ALERTA DE BURBUJA: P/E en 420× y rumor sin fuente en redes; divergencia bajista crítica.',
        trend: 'SOBRECOMPRA EXTREMA (Riesgo de Crash 84 %)',
        ans: 'TOMAR BENEFICIOS Y SALIR ANTES DEL CRASH',
        opts: [
          'TOMAR BENEFICIOS Y SALIR ANTES DEL CRASH',
          'COMPRAR MÁS POR FOMO (Miedo a perdérselo)',
          'IGNORAR EL RIESGO DE LIQUIDEZ'
        ]
      },
      {
        ticker: 'OBSD · Obsidian Dynamics',
        news: 'DATO MACRO: Volatilidad implícita se triplica a 10 seg del cierre; soporte roto.',
        trend: 'RUPTURA DE SOPORTE (-12 %)',
        ans: 'EJECUTAR STOP-LOSS DISCIPLINADO',
        opts: [
          'EJECUTAR STOP-LOSS DISCIPLINADO',
          'DOBLAR APUESTA PERDEDORA (Coste Hundido)',
          'MANTENER SIN COBERTURA'
        ]
      }
    ];
    const rng = activeSession.rng;
    const item = tickers[Math.floor(rng() * tickers.length)];
    const shuffled = [...item.opts].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">stock.js · Lectura Fría de Probabilidades</div>
        <div class="stock-ticker-box">
          <div class="stock-header"><strong>${item.ticker}</strong> <span>${item.trend}</span></div>
          <p class="stock-news">${item.news}</p>
        </div>
        <div class="game-options-grid cols-1">
          ${shuffled
            .map(
              (o) =>
                `<button type="button" class="game-opt-btn" data-val="${o}">${o}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(
          btn.getAttribute('data-val') === item.ans,
          btn,
          145,
          'En mercados volátiles, el FOMO y la aversión a asumir una pérdida pequeña provocan el colapso de la cartera.'
        );
      };
    });
  }

  // 20. TRIAGE.JS — Sala de Crisis y Priorización Ejecutiva
  function renderTriageRound(stage) {
    const cases = [
      {
        rule: 'PROTOCOLO ROJO: Priorizar SIEMPRE hipoxia o fallo estructural vital sobre ruido cosmético',
        ans: 'Paciente A: Saturación O₂ al 78 % (Silencioso, Crítico)',
        opts: [
          'Paciente A: Saturación O₂ al 78 % (Silencioso, Crítico)',
          'Paciente B: Esguince leve gritando muy fuerte (Urgencia aparente)',
          'Paciente C: Solicitud administrativa urgente de planta',
          'Paciente D: Contusión superficial estable'
        ]
      },
      {
        rule: 'PROTOCOLO ORBITAL: Priorizar la tarea con menor Tiempo hasta Impacto (TTI) y alta severidad',
        ans: 'Fuga en Reactor Principal (Severidad 9/10 · TTI: 15 s)',
        opts: [
          'Fuga en Reactor Principal (Severidad 9/10 · TTI: 15 s)',
          'Fallo en Cafetera de Cubierta (TTI: 5 s · Severidad 1/10)',
          'Mantenimiento trimestral de antena (TTI: 48 h)',
          'Aviso de actualización de interfaz (Severidad 2/10)'
        ]
      }
    ];
    const rng = activeSession.rng;
    const item = cases[Math.floor(rng() * cases.length)];
    const shuffled = [...item.opts].sort(() => rng() - 0.5);

    stage.innerHTML = `
      <div class="game-card-Layout">
        <div class="game-tag-pill">triage.js · Priorización Bajo Presión</div>
        <div class="switch-rule-banner" style="border-color:#f43f5e; color:#fda4af">🚨 ${item.rule}</div>
        <div class="game-options-grid cols-1">
          ${shuffled
            .map(
              (o) =>
                `<button type="button" class="game-opt-btn" data-val="${o}">${o}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.game-opt-btn').forEach((btn) => {
      btn.onclick = () => {
        submitAnswer(btn.getAttribute('data-val') === item.ans, btn, 145);
      };
    });
  }

  // ============================================================================
  // CIERRE DE PARTIDA Y RESUMEN DE EXTRACCIÓN MINERAL
  // ============================================================================

  function finishGame(reason = 'Sesión completada') {
    if (!activeSession) return;
    const sess = activeSession;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (sess.subState && sess.subState.cleanup) {
      sess.subState.cleanup();
    }

    const totalAttempts = Math.max(1, sess.hits + sess.misses);
    const accuracy = Math.round((sess.hits / totalAttempts) * 100);
    const avgReactionMs =
      sess.reactionTimesMs.length > 0
        ? Math.round(
            sess.reactionTimesMs.reduce((a, b) => a + b, 0) / sess.reactionTimesMs.length
          )
        : 410;

    const comboState = window.NeuroFX.getComboState();
    const rewardInfo = window.NeuroCore.recordGameResult({
      gameId: sess.gameId,
      domain: sess.meta.domain,
      mineral: sess.meta.mineral,
      score: sess.score,
      accuracy,
      avgReactionMs,
      maxLevel: sess.maxLevel,
      feverTriggers: comboState.feverTriggersInSession
    });

    const ghostCode = window.NeuroCore.encodeGhostCode({
      gameId: sess.gameId,
      seed: sess.seedStr,
      score: sess.score,
      splitsMs: sess.splitsMs
    });

    // Si hay un callback de flujo (Playlist Circadiana, Readiness Scanner, Roguelike, etc.), delegar
    if (typeof sess.onComplete === 'function') {
      const cb = sess.onComplete;
      activeSession = null;
      cb({
        gameId: sess.gameId,
        score: sess.score,
        accuracy,
        avgReactionMs,
        maxLevel: sess.maxLevel,
        hits: sess.hits,
        misses: sess.misses,
        rewardInfo,
        ghostCode
      });
      return;
    }

    // Mostrar pantalla de victoria y botín dentro de la Arena
    const stage = document.getElementById('gameStageArena');
    const minObj = window.NeuroCore.MINERALS[sess.meta.mineral] || window.NeuroCore.MINERALS.litio;
    if (stage) {
      stage.innerHTML = `
        <div class="game-summary-card">
          <div class="summary-badge">${reason}</div>
          <h3 class="summary-title">${sess.meta.icon || '🔥'} ${sess.meta.name}</h3>
          <div class="summary-kpis">
            <div class="summary-kpi">
              <span>PUNTUACIÓN</span>
              <strong>${sess.score}</strong>
            </div>
            <div class="summary-kpi">
              <span>LATENCIA MEDIA</span>
              <strong>${avgReactionMs} ms</strong>
            </div>
            <div class="summary-kpi">
              <span>PRECISIÓN</span>
              <strong>${accuracy} %</strong>
            </div>
            <div class="summary-kpi">
              <span>MINERAL EXTRAÍDO</span>
              <strong style="color:${minObj.color}">+${rewardInfo.mineralEarned} ${minObj.symbol}</strong>
            </div>
          </div>
          <div class="summary-ghost-box">
            <label for="ghostCodeOutput">👻 Código Fantasma (Duelo Asíncrono):</label>
            <div class="ghost-code-row">
              <input id="ghostCodeOutput" type="text" readonly value="${ghostCode}" />
              <button type="button" id="copyGhostCodeBtn" class="btn-secondary">Copiar Sombra</button>
            </div>
          </div>
          <div class="summary-actions">
            <button type="button" id="replayGameBtn" class="btn-primary">🔥 Otra Partida</button>
            <button type="button" id="exitArenaSummaryBtn" class="btn-secondary">Volver a la Fragua</button>
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copyGhostCodeBtn');
      if (copyBtn) {
        copyBtn.onclick = () => {
          navigator.clipboard?.writeText(ghostCode);
          copyBtn.textContent = '¡Copiado!';
        };
      }
      const replayBtn = document.getElementById('replayGameBtn');
      if (replayBtn) {
        replayBtn.onclick = () => startGame(sess.gameId);
      }
      const exitBtn = document.getElementById('exitArenaSummaryBtn');
      if (exitBtn) {
        exitBtn.onclick = () => closeArenaModal();
      }
    }
    activeSession = null;
  }

  // Utilidades internas
  function generateNumericChoices(correct, rng, step = 2) {
    const set = new Set([correct]);
    while (set.size < 4) {
      const delta = (Math.floor(rng() * 5) + 1) * (rng() < 0.5 ? -1 : 1) * step;
      const cand = correct + delta;
      if (cand !== correct && cand >= 0) set.add(cand);
    }
    return Array.from(set).sort(() => rng() - 0.5);
  }

  function scrambleString(word, rng) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const res = arr.join('');
    return res === word ? arr.reverse().join('') : res;
  }

  return {
    CATALOG,
    FUSION_MODES,
    getCatalog,
    getFusionModes,
    getGameMeta,
    startGame,
    stopActiveGame,
    closeArenaModal
  };
})();
