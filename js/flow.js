/**
 * NEUROFORJA 2.0 — Orquestador de Flujo, Protocolos Circadianos, Readiness Scanner,
 * Reto Diario Wordle, Incursión Roguelike (7 Pisos) y Coloso Semanal (flow.js)
 */

window.NeuroFlow = (() => {
  // Las 4 Playlists Circadianas de la Página 4 del Blueprint
  const CIRCADIAN_PROTOCOLS = [
    {
      id: 'expresso_neural',
      timeSlot: '08:00 · EXPRESSO NEURAL',
      title: 'Ignición Matutina (2 min)',
      games: ['calc', 'nogo', 'odd'],
      durationPerGame: 35,
      zenMode: false,
      badge: '☕',
      desc: 'Dispara la dopamina y la velocidad de reacción al despertar sin saturar la memoria.'
    },
    {
      id: 'pico_profundo',
      timeSlot: '11:00 · PICO PROFUNDO',
      title: 'Inmersión Analítica',
      games: ['nback', 'deduce', 'systems'],
      durationPerGame: 40,
      zenMode: false,
      badge: '🧠',
      desc: 'Aprovecha tu pico biológico de alerta para memoria de trabajo 2-Back y deducción compleja.'
    },
    {
      id: 'anti_somnolencia',
      timeSlot: '15:30 · ANTI-SOMNOLENCIA',
      title: 'Choque de Alerta Post-Comida',
      games: ['switch', 'track', 'triage'],
      durationPerGame: 35,
      zenMode: false,
      badge: '⚡',
      desc: 'Reactiva la red de atención ejecutiva cuando aparece la somnolencia de la tarde.'
    },
    {
      id: 'zen_espacial',
      timeSlot: '21:30 · ZEN ESPACIAL',
      title: 'Descompresión Parietal (Sin Reloj)',
      games: ['hanoi', 'lights', 'cubes'],
      durationPerGame: 45,
      zenMode: true,
      badge: '🌙',
      desc: 'Entrenamiento visuoespacial sin cronómetro agresivo para relajar la mente antes de dormir.'
    }
  ];

  // Potenciadores (Perks) para el modo Roguelike «Asalto al Córtex»
  const ROGUELIKE_PERKS = [
    {
      id: 'perk_chrono',
      icon: '⏳',
      name: 'Dilatación Temporal',
      desc: '+5 segundos adicionales en todos los pisos restantes, aunque el umbral de victoria sube un 10 %.',
      timeBonus: 5,
      scoreMult: 1.0,
      shield: false
    },
    {
      id: 'perk_shield',
      icon: '🛡️',
      name: 'Blindaje Sináptico',
      desc: 'Recarga el Escudo Térmico y restaura +1 Vida en tu incursión actual.',
      timeBonus: 0,
      scoreMult: 1.05,
      shield: true,
      healLife: 1
    },
    {
      id: 'perk_overclock',
      icon: '🔥',
      name: 'Sobrecarga de Cobalto',
      desc: '+30 % a todos los puntos obtenidos en el siguiente piso, pero con -3 segundos de reloj.',
      timeBonus: -3,
      scoreMult: 1.3,
      shield: false
    },
    {
      id: 'perk_precision',
      icon: '🎯',
      name: 'Lente Hiper-Foco',
      desc: '+20 % de puntuación constante y +35 Minerales de bonificación inmediata.',
      timeBonus: 2,
      scoreMult: 1.2,
      shield: false,
      instantMineral: 35
    }
  ];

  /**
   * Detecta qué protocolo circadiano corresponde a la hora actual del usuario
   */
  function getRecommendedProtocolId() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'expresso_neural';
    if (hour >= 10 && hour < 14) return 'pico_profundo';
    if (hour >= 14 && hour < 19) return 'anti_somnolencia';
    return 'zen_espacial';
  }

  /**
   * Ejecuta una secuencia encadenada de juegos (Playlists Circadianas, Calentamiento 120s, Reto Diario)
   */
  function runPlaylistSequence({
    title,
    games,
    durationPerGame = 35,
    zenMode = false,
    seedPrefix = null,
    onPlaylistFinished = null
  }) {
    const results = [];
    let currentIdx = 0;

    function launchStep() {
      if (currentIdx >= games.length) {
        showPlaylistSummary(title, results, onPlaylistFinished);
        return;
      }
      const gameId = games[currentIdx];
      const seed = seedPrefix ? `${seedPrefix}-step-${currentIdx}-${gameId}` : undefined;

      window.NeuroGames.startGame(gameId, {
        durationOverride: durationPerGame,
        zenMode,
        seed,
        onComplete: (stepResult) => {
          results.push(stepResult);
          currentIdx += 1;
          if (currentIdx < games.length) {
            showIntermissionScreen(
              title,
              currentIdx,
              games.length,
              games[currentIdx],
              stepResult,
              launchStep
            );
          } else {
            showPlaylistSummary(title, results, onPlaylistFinished);
          }
        }
      });
    }

    launchStep();
  }

  function showIntermissionScreen(title, stepIdx, totalSteps, nextGameId, prevResult, onNext) {
    const stage = document.getElementById('gameStageArena');
    const nextMeta = window.NeuroGames.getGameMeta(nextGameId);
    if (!stage) {
      onNext();
      return;
    }

    stage.innerHTML = `
      <div class="game-summary-card">
        <div class="summary-badge">${title} · Etapa ${stepIdx} de ${totalSteps} superada</div>
        <h3 class="summary-title">¡+${prevResult.score} pts (${prevResult.avgReactionMs} ms)!</h3>
        <p class="game-subhint">Siguiente módulo en cola: <strong>${nextMeta.icon} ${nextMeta.name}</strong></p>
        <div class="summary-actions">
          <button type="button" id="nextPlaylistStepBtn" class="btn-primary">⚡ Lanzar Etapa ${stepIdx + 1}/${totalSteps}</button>
        </div>
      </div>
    `;

    const btn = document.getElementById('nextPlaylistStepBtn');
    if (btn) btn.onclick = () => onNext();
  }

  function showPlaylistSummary(title, results, customCallback) {
    if (typeof customCallback === 'function') {
      customCallback(results);
      return;
    }

    const totalScore = results.reduce((s, r) => s + r.score, 0);
    const avgMs = Math.round(
      results.reduce((s, r) => s + r.avgReactionMs, 0) / Math.max(1, results.length)
    );
    const totalMinerals = results.reduce((s, r) => s + (r.rewardInfo?.mineralEarned || 15), 0);

    // Otorgar un Crisol Sellado por completar un protocolo entero
    const st = window.NeuroCore.getState();
    st.crucibles += 1;
    window.NeuroCore.saveState();

    const stage = document.getElementById('gameStageArena');
    if (!stage) return;

    stage.innerHTML = `
      <div class="game-summary-card">
        <div class="summary-badge">PROTOCOLO COMPLETADO · +1 CRISOL SELLADO</div>
        <h3 class="summary-title">🏆 ${title}</h3>
        <div class="summary-kpis">
          <div class="summary-kpi">
            <span>PUNTOS TOTALES</span>
            <strong>${totalScore}</strong>
          </div>
          <div class="summary-kpi">
            <span>VELOCIDAD MEDIA</span>
            <strong>${avgMs} ms</strong>
          </div>
          <div class="summary-kpi">
            <span>MINERALES</span>
            <strong>+${totalMinerals}</strong>
          </div>
          <div class="summary-kpi">
            <span>RECOMPENSA</span>
            <strong>🏺 +1 Crisol</strong>
          </div>
        </div>
        <div class="summary-actions">
          <button type="button" id="closePlaylistBtn" class="btn-primary">Volver a la Fragua</button>
        </div>
      </div>
    `;

    const btn = document.getElementById('closePlaylistBtn');
    if (btn) {
      btn.onclick = () => {
        window.NeuroGames.closeArenaModal();
        window.NeuroApp?.refreshAllUI();
      };
    }
  }

  /**
   * 1. ESCÁNER DE ESTADO MENTAL (Readiness Score en 45 segundos: 20s nogo + 25s matrix)
   */
  function startReadinessScanner() {
    runPlaylistSequence({
      title: 'Escáner de Estado Mental (45s)',
      games: ['nogo', 'matrix'],
      durationPerGame: 22,
      onPlaylistFinished: (results) => {
        const nogoRes = results[0] || { avgReactionMs: 390, accuracy: 90, score: 400 };
        const matrixRes = results[1] || { avgReactionMs: 420, accuracy: 88, score: 450 };

        const corr = window.NeuroCore.getBioCorrelations();
        const baselineMs = corr.avgLatency14d || 405;
        const todayMs = Math.round(nogoRes.avgReactionMs * 0.65 + matrixRes.avgReactionMs * 0.35);
        const deltaMs = todayMs - baselineMs;

        const rawReadiness = Math.round(
          92 - Math.max(-6, deltaMs * 0.18) + (matrixRes.accuracy - 85) * 0.3
        );
        const readinessScore = Math.min(99, Math.max(58, rawReadiness));

        let diagnosis = '';
        if (readinessScore >= 90) {
          diagnosis = `Agudeza al ${readinessScore} % (${todayMs} ms): Óptimo para tareas analíticas y toma de decisiones.`;
        } else if (readinessScore >= 78) {
          diagnosis = `Agudeza al ${readinessScore} % (${todayMs} ms): Tono prefrontal estable. Recomendado Expresso Neural.`;
        } else {
          diagnosis = `Fatiga detectada (+${Math.max(15, deltaMs)} ms vs media 14d): Descansa 10 minutos o hidrátate.`;
        }

        const st = window.NeuroCore.getState();
        st.readiness = {
          lastDate: window.NeuroCore.getTodayString(),
          lastScore: readinessScore,
          lastLatencyMs: todayMs,
          diagnosis
        };
        window.NeuroCore.saveState();

        const stage = document.getElementById('gameStageArena');
        if (stage) {
          stage.innerHTML = `
            <div class="game-summary-card">
              <div class="summary-badge">DIAGNÓSTICO BIOMÉTRICO EN 45 SEGUNDOS</div>
              <h3 class="summary-title">🩺 Readiness Score: ${readinessScore} %</h3>
              <p class="readiness-diag-box">${diagnosis}</p>
              <div class="summary-kpis">
                <div class="summary-kpi">
                  <span>LATENCIA HOY</span>
                  <strong>${todayMs} ms</strong>
                </div>
                <div class="summary-kpi">
                  <span>MEDIA 14 DÍAS</span>
                  <strong>${baselineMs} ms</strong>
                </div>
                <div class="summary-kpi">
                  <span>DIFERENCIAL</span>
                  <strong>${deltaMs <= 0 ? `${deltaMs} ms (Más rápido)` : `+${deltaMs} ms`}</strong>
                </div>
                <div class="summary-kpi">
                  <span>PRECISIÓN MATRIZ</span>
                  <strong>${matrixRes.accuracy} %</strong>
                </div>
              </div>
              <div class="summary-actions">
                <button type="button" id="closeReadinessBtn" class="btn-primary">Aplicar Protocolo Diario</button>
              </div>
            </div>
          `;
          const closeBtn = document.getElementById('closeReadinessBtn');
          if (closeBtn) {
            closeBtn.onclick = () => {
              window.NeuroGames.closeArenaModal();
              window.NeuroApp?.refreshAllUI();
            };
          }
        }
      }
    });
  }

  /**
   * 2. CALENTAMIENTO PRE-EXAMEN / REUNIÓN (120 segundos exactos: anagram + chain + calc)
   */
  function startPreExamWarmup() {
    runPlaylistSequence({
      title: 'Calentamiento Pre-Examen / Reunión (120s)',
      games: ['anagram', 'chain', 'calc'],
      durationPerGame: 40
    });
  }

  /**
   * 3. LA FORJA DEL DÍA (Estilo Wordle con semilla determinista por fecha actual)
   */
  function startDailyWordleForge() {
    const today = window.NeuroCore.getTodayString();
    runPlaylistSequence({
      title: `La Forja del Día (${today})`,
      games: ['deduce', 'calc', 'anagram'],
      durationPerGame: 35,
      seedPrefix: `WORDLE-FORGE-${today}`,
      onPlaylistFinished: (results) => {
        const blocks = results
          .map((r) => {
            if (r.score >= 550) return '🟧🟧🟧🔥';
            if (r.score >= 320) return '🟨🟨🟨⚡';
            return '🟦🟦⬜🛠️';
          })
          .join('\n');

        const total = results.reduce((a, b) => a + b.score, 0);
        const shareText = `🔥 NEUROFORJA 2.0 · Forja del Día (${today})\n🧠 Deducción: ${blocks.split('\n')[0]}\n➗ Cálculo:   ${blocks.split('\n')[1]}\n🔤 Anagrama:  ${blocks.split('\n')[2]}\n🏆 Total: ${total} pts · Temp: ${window.NeuroCore.getState().forgeTemp}°C`;

        const st = window.NeuroCore.getState();
        st.dailyChallenge = {
          date: today,
          completed: true,
          scores: results.map((r) => r.score),
          emojis: shareText
        };
        st.crucibles += 1;
        window.NeuroCore.saveState();

        const stage = document.getElementById('gameStageArena');
        if (stage) {
          stage.innerHTML = `
            <div class="game-summary-card">
              <div class="summary-badge">SEMILLA DIARIA DETERMINISTA · ${today}</div>
              <h3 class="summary-title">📅 ¡Forja del Día Completada!</h3>
              <pre class="wordle-share-preview">${shareText}</pre>
              <div class="summary-actions">
                <button type="button" id="copyWordleBtn" class="btn-primary">📋 Copiar Resumen para WhatsApp</button>
                <button type="button" id="closeWordleBtn" class="btn-secondary">Cerrar</button>
              </div>
            </div>
          `;
          const copyBtn = document.getElementById('copyWordleBtn');
          if (copyBtn) {
            copyBtn.onclick = () => {
              navigator.clipboard?.writeText(shareText);
              copyBtn.textContent = '✅ ¡Copiado al Portapapeles!';
            };
          }
          const closeBtn = document.getElementById('closeWordleBtn');
          if (closeBtn) {
            closeBtn.onclick = () => {
              window.NeuroGames.closeArenaModal();
              window.NeuroApp?.refreshAllUI();
            };
          }
        }
      }
    });
  }

  /**
   * 4. INCURSIÓN ROGUELIKE: «ASALTO AL CÓRTEX» (7 Pisos seguidos con 3 Vidas y Perks)
   */
  function startRoguelikeRun() {
    const floorGames = ['calc', 'matrix', 'switch', 'deduce', 'nogo', 'balloon', 'nback'];
    const hasBonusLife = window.NeuroArt.hasRelic('reliquia_23');
    const runState = {
      floor: 1,
      maxFloors: 7,
      lives: hasBonusLife ? 4 : 3,
      totalScore: 0,
      timeBonus: 0,
      scoreMult: 1.0,
      hasShield: false
    };

    function playCurrentFloor() {
      const gameId = floorGames[(runState.floor - 1) % floorGames.length];
      const targetScore = 240 + runState.floor * 45;

      window.NeuroGames.startGame(gameId, {
        durationOverride: Math.max(20, 34 + runState.timeBonus),
        initialLevel: runState.floor,
        roguelikeShield: runState.hasShield,
        onComplete: (res) => {
          const effectiveScore = Math.round(res.score * runState.scoreMult);
          runState.totalScore += effectiveScore;
          const passed = effectiveScore >= targetScore || res.hits >= 3;

          if (!passed) {
            runState.lives -= 1;
          }

          if (runState.lives <= 0) {
            renderRoguelikeEnd(false, runState);
          } else if (runState.floor >= runState.maxFloors) {
            renderRoguelikeEnd(true, runState);
          } else {
            renderPerkSelection(runState, effectiveScore, passed, () => {
              runState.floor += 1;
              playCurrentFloor();
            });
          }
        }
      });
    }

    playCurrentFloor();
  }

  function renderPerkSelection(runState, lastScore, passed, onChosen) {
    const stage = document.getElementById('gameStageArena');
    if (!stage) return;

    const perks = [...ROGUELIKE_PERKS].sort(() => Math.random() - 0.5).slice(0, 3);
    stage.innerHTML = `
      <div class="game-summary-card">
        <div class="summary-badge">ASALTO AL CÓRTEX · PISO ${runState.floor}/7 ${passed ? 'SUPERADO' : 'DAÑO RECIBIDO (-1 ❤️)'}</div>
        <h3 class="summary-title">Vidas: ${'❤️'.repeat(runState.lives)} · Total: ${runState.totalScore} pts</h3>
        <p class="game-subhint">Elige un <strong>Potenciador Sináptico (Perk)</strong> antes de subir al Piso ${runState.floor + 1}:</p>
        <div class="perk-cards-grid">
          ${perks
            .map(
              (p) => `
              <button type="button" class="perk-choice-card" data-perk="${p.id}">
                <span class="perk-icon">${p.icon}</span>
                <strong>${p.name}</strong>
                <small>${p.desc}</small>
              </button>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.perk-choice-card').forEach((card) => {
      card.onclick = () => {
        const pId = card.getAttribute('data-perk');
        const p = ROGUELIKE_PERKS.find((x) => x.id === pId);
        if (p) {
          runState.timeBonus += p.timeBonus || 0;
          runState.scoreMult *= p.scoreMult || 1;
          if (p.shield) runState.hasShield = true;
          if (p.healLife) runState.lives = Math.min(5, runState.lives + p.healLife);
          if (p.instantMineral) {
            window.NeuroCore.addMinerals('litio', p.instantMineral);
          }
        }
        onChosen();
      };
    });
  }

  function renderRoguelikeEnd(victory, runState) {
    const st = window.NeuroCore.getState();
    if (victory) {
      st.crucibles += 2;
      window.NeuroCore.addMinerals('obsidiana', 120);
      window.NeuroCore.addMinerals('titanio', 120);
    }

    const stage = document.getElementById('gameStageArena');
    if (!stage) return;

    stage.innerHTML = `
      <div class="game-summary-card">
        <div class="summary-badge">${victory ? '🏆 ¡CÓRTEX CONQUISTADO (7/7 PISOS)!' : '💀 INCURSIÓN TERMINADA'}</div>
        <h3 class="summary-title">Piso alcanzado: ${runState.floor}/7 · ${runState.totalScore} pts</h3>
        <p class="game-subhint">${
          victory
            ? 'Has obtenido +2 Crisoles Sellados, +120 Obsidiana y +120 Titanio.'
            : 'Tus minerales extraídos en cada piso se han conservado en la Fragua.'
        }</p>
        <div class="summary-actions">
          <button type="button" id="retryRoguelikeBtn" class="btn-primary">⚔️ Nueva Incursión</button>
          <button type="button" id="closeRoguelikeBtn" class="btn-secondary">Salir al Taller</button>
        </div>
      </div>
    `;

    const rBtn = document.getElementById('retryRoguelikeBtn');
    if (rBtn) rBtn.onclick = () => startRoguelikeRun();
    const cBtn = document.getElementById('closeRoguelikeBtn');
    if (cBtn) {
      cBtn.onclick = () => {
        window.NeuroGames.closeArenaModal();
        window.NeuroApp?.refreshAllUI();
      };
    }
  }

  /**
   * 5. EVENTO DE «JEFE SEMANAL» (EL COLOSO DE LA SEMANA: systems -> triage -> deduce)
   */
  function startWeeklyBossFight() {
    let bossMaxHp = 2200;
    let bossHp = bossMaxHp;
    const bossDamageMult = window.NeuroArt.hasRelic('reliquia_21') ? 1.3 : 1.0;

    const bossHud = document.getElementById('arenaBossHud');
    const bossFill = document.getElementById('arenaBossHpFill');
    const bossText = document.getElementById('arenaBossHpText');

    if (bossHud) bossHud.hidden = false;
    const updateBossBar = () => {
      const pct = Math.max(0, Math.round((bossHp / bossMaxHp) * 100));
      if (bossFill) bossFill.style.width = `${pct}%`;
      if (bossText) bossText.textContent = `👾 COLOSO COGNITIVO: ${Math.max(0, bossHp)} / ${bossMaxHp} HP`;
    };
    updateBossBar();

    window.NeuroGames.startGame('systems', {
      durationOverride: 95,
      fusionSequence: ['systems', 'triage', 'deduce'],
      onBossHit: (points, isHit) => {
        if (isHit) {
          const dmg = Math.round((points + 140) * bossDamageMult);
          bossHp = Math.max(0, bossHp - dmg);
          updateBossBar();
          if (bossHp <= 0) {
            window.NeuroGames.stopActiveGame();
            if (bossHud) bossHud.hidden = true;
            renderBossVictory();
          }
        }
      },
      onComplete: () => {
        if (bossHud) bossHud.hidden = true;
        renderBossVictory(bossHp <= 0);
      }
    });
  }

  function renderBossVictory(defeated = true) {
    const st = window.NeuroCore.getState();
    if (defeated) {
      st.crucibles += 2;
      window.NeuroCore.addMinerals('titanio', 150);
      window.NeuroCore.addMinerals('obsidiana', 150);
    }

    const stage = document.getElementById('gameStageArena');
    if (!stage) return;

    stage.innerHTML = `
      <div class="game-summary-card">
        <div class="summary-badge">${defeated ? '🔥 ¡COLOSO SEMANAL DERROTADO!' : '⏱️ TIEMPO AGOTADO ANTE EL COLOSO'}</div>
        <h3 class="summary-title">${defeated ? '👾 Núcleo del Coloso Fundido' : 'El Coloso resistió el asalto'}</h3>
        <p class="game-subhint">${
          defeated
            ? 'Recompensa Suprema: +2 Crisoles Sellados, +150 Titanio y +150 Obsidiana.'
            : 'Forja el Monolito de Gödel en el Taller para infligir +30 % de daño al Coloso.'
        }</p>
        <div class="summary-actions">
          <button type="button" id="closeBossBtn" class="btn-primary">Volver a la Fragua</button>
        </div>
      </div>
    `;
    const btn = document.getElementById('closeBossBtn');
    if (btn) {
      btn.onclick = () => {
        window.NeuroGames.closeArenaModal();
        window.NeuroApp?.refreshAllUI();
      };
    }
  }

  return {
    CIRCADIAN_PROTOCOLS,
    ROGUELIKE_PERKS,
    getRecommendedProtocolId,
    runPlaylistSequence,
    startReadinessScanner,
    startPreExamWarmup,
    startDailyWordleForge,
    startRoguelikeRun,
    startWeeklyBossFight
  };
})();
