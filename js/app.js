/**
 * NEUROFORJA 2.0 — Controlador Principal de Interfaz (app.js)
 * Conecta los 6 motores modulares (core, fx, fun, flow, art, principles) y los
 * 20 minijuegos con la interfaz reactiva de la Fragua.
 */

window.NeuroApp = (() => {
  let activeDomainFilter = 'all';
  let crucibleTapStep = 0;
  let currentTabIdx = 0;

  function init() {
    const st = window.NeuroCore.getState();
    document.documentElement.setAttribute('data-theme', st.theme || 'volcanica');

    setupNavigation();
    setupTouchSwipeNavigation();
    setupTopBarActions();
    setupCrucibleModal();
    setupGhostDuelControls();
    registerMobilePWA();
    refreshAllUI();

    window.addEventListener('neuroforja:stateChanged', () => {
      refreshAllUI();
    });
  }

  /**
   * Registra el Service Worker para instalación PWA y uso offline en móviles y tablets
   */
  function registerMobilePWA() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  /**
   * Navega a una nueva vista con transición direccional (View Transitions API + fallback)
   * @param {Function} updateDOM - Callback que actualiza el estado del DOM
   * @param {string} direction - 'forward' o 'backward'
   */
  function navigateWithDirection(updateDOM, direction) {
    if (!document.startViewTransition) {
      updateDOM();
      return;
    }
    try {
      document.startViewTransition({
        update: updateDOM,
        types: [direction]
      });
    } catch (_) {
      updateDOM();
    }
  }

  function activateTabByIndex(newIdx) {
    const buttons = Array.from(document.querySelectorAll('.nav-tab-btn'));
    if (newIdx < 0 || newIdx >= buttons.length || newIdx === currentTabIdx) return;

    const btn = buttons[newIdx];
    const target = btn.getAttribute('data-tab');
    const direction = newIdx > currentTabIdx ? 'forward' : 'backward';
    currentTabIdx = newIdx;

    const updateDOM = () => {
      buttons.forEach((b, idx) => {
        const isCurrent = idx === newIdx;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      });
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== `panel-${target}`;
      });
      if (target === 'adn') {
        renderADNAndBioPanel();
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    navigateWithDirection(updateDOM, direction);
  }

  function setupNavigation() {
    const buttons = Array.from(document.querySelectorAll('.nav-tab-btn'));
    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        activateTabByIndex(idx);
      });
    });
  }

  /**
   * Permite deslizar el dedo horizontalmente (Swipe) en móviles y tablets para cambiar de pestaña
   */
  function setupTouchSwipeNavigation() {
    const mainEl = document.querySelector('.forge-main-container');
    if (!mainEl) return;

    let touchStartX = 0;
    let touchStartY = 0;

    mainEl.addEventListener(
      'touchstart',
      (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    mainEl.addEventListener(
      'touchend',
      (e) => {
        if (document.body.classList.contains('arena-open')) return;
        if (!e.changedTouches || !e.changedTouches[0]) return;

        // Evitar disparo si el usuario deslizó sobre una tabla o filtro desplazable
        if (e.target && e.target.closest('.domain-filters, .league-table-wrapper, .minerals-strip')) {
          return;
        }

        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(dx) > 75 && Math.abs(dx) > Math.abs(dy) * 1.8) {
          if (dx < 0) {
            activateTabByIndex(currentTabIdx + 1);
          } else {
            activateTabByIndex(currentTabIdx - 1);
          }
        }
      },
      { passive: true }
    );
  }

  function setupTopBarActions() {
    const closeArenaBtn = document.getElementById('closeArenaModalBtn');
    if (closeArenaBtn) {
      closeArenaBtn.onclick = () => {
        window.NeuroGames.closeArenaModal();
        refreshAllUI();
      };
    }

    const soundBtn = document.getElementById('toggleSoundBtn');
    if (soundBtn) {
      soundBtn.onclick = () => {
        const muted = window.NeuroFX.toggleMute();
        soundBtn.textContent = muted ? '🔇 Muda' : '🔊 Audio';
      };
    }

    const deviceSelect = document.getElementById('deviceModeSelect');
    if (deviceSelect) {
      deviceSelect.onchange = () => {
        const mode = deviceSelect.value;
        if (mode === 'auto') {
          document.documentElement.removeAttribute('data-device-mode');
        } else {
          document.documentElement.setAttribute('data-device-mode', mode);
        }
      };
    }

    const themeSelect = document.getElementById('themeSelector');
    if (themeSelect) {
      themeSelect.onchange = () => {
        const ok = window.NeuroCore.setTheme(themeSelect.value);
        if (!ok) {
          alert('Desbloquea este tema exclusivo abriendo Crisoles Sellados.');
          themeSelect.value = window.NeuroCore.getState().theme;
        }
      };
    }

    const openCrucibleBtn = document.getElementById('openCrucibleTopBtn');
    if (openCrucibleBtn) {
      openCrucibleBtn.onclick = () => showCrucibleModal();
    }
  }

  /**
   * Sincroniza los elementos <progress class="progress-ring"> para navegadores sin CSS attr()
   */
  function syncProgressRings() {
    document.querySelectorAll('progress.progress-ring').forEach((prog) => {
      prog.style.setProperty('--value', prog.getAttribute('value') || '0');
      if (!prog._hasObserver && !CSS.supports('width: attr(value type(<number>))')) {
        prog._hasObserver = true;
        const observer = new MutationObserver(() => {
          prog.style.setProperty('--value', prog.getAttribute('value'));
        });
        observer.observe(prog, {
          attributes: true,
          attributeFilter: ['value']
        });
      }
    });
  }

  function refreshAllUI() {
    renderHeaderBar();
    renderHomeDashboard();
    renderCatalogAndFusions();
    renderWorkshopRelics();
    renderADNAndBioPanel();
    renderSocialAndLeagues();
    syncProgressRings();
  }

  function renderHeaderBar() {
    const st = window.NeuroCore.getState();
    const thermal = window.NeuroFun.getForgeThermalStatus();

    const tempValEl = document.getElementById('topTempVal');
    const tempPhaseEl = document.getElementById('topTempPhase');
    if (tempValEl) tempValEl.textContent = `${thermal.temp} °C (×${thermal.mult})`;
    if (tempPhaseEl) tempPhaseEl.textContent = thermal.phaseName;

    const mineralsStrip = document.getElementById('topMineralsStrip');
    if (mineralsStrip) {
      mineralsStrip.innerHTML = Object.values(window.NeuroCore.MINERALS)
        .map((m) => {
          const count = st.minerals[m.id] || 0;
          return `
            <div class="mineral-chip" title="${m.name}: ${m.desc}">
              <span class="mineral-sym" style="color:${m.color}">${m.symbol}</span>
              <span class="mineral-val">${count}</span>
            </div>
          `;
        })
        .join('');
    }

    const crucibleCountEl = document.getElementById('topCrucibleCount');
    if (crucibleCountEl) {
      crucibleCountEl.textContent = `🏺 Crisoles (${st.crucibles})`;
    }

    const themeSelect = document.getElementById('themeSelector');
    if (themeSelect) {
      Array.from(themeSelect.options).forEach((opt) => {
        const unlocked = st.unlockedThemes.includes(opt.value);
        opt.disabled = !unlocked;
      });
      themeSelect.value = st.theme;
    }
  }

  function renderHomeDashboard() {
    const st = window.NeuroCore.getState();
    const thermal = window.NeuroFun.getForgeThermalStatus();
    const arch = window.NeuroCore.getCurrentArchetype();

    // Núcleo SVG e indicador de progreso térmico
    const coreWrap = document.getElementById('forgeCoreContainer');
    if (coreWrap) {
      coreWrap.innerHTML = window.NeuroArt.renderForgeCoreSVG(
        thermal.temp,
        st.forgedRelics.length
      );
    }

    const thermalRing = document.getElementById('thermalProgressRing');
    const thermalRingLabel = document.getElementById('thermalProgressContent');
    if (thermalRing) thermalRing.setAttribute('value', String(thermal.percent));
    if (thermalRingLabel) thermalRingLabel.textContent = `${thermal.percent}%`;

    const readinessRing = document.getElementById('readinessProgressRing');
    const readinessRingLabel = document.getElementById('readinessProgressContent');
    if (readinessRing) readinessRing.setAttribute('value', String(st.readiness.lastScore));
    if (readinessRingLabel) readinessRingLabel.textContent = `${st.readiness.lastScore}%`;

    const readinessDiagEl = document.getElementById('readinessDiagnosisText');
    if (readinessDiagEl) readinessDiagEl.textContent = st.readiness.diagnosis;

    const archBadgeEl = document.getElementById('homeArchetypeBadge');
    if (archBadgeEl) archBadgeEl.textContent = `${arch.badge} ${arch.name}`;

    // Botones de disparo rápido del Bucle Hooked
    const scanBtn = document.getElementById('startReadinessBtn');
    if (scanBtn) scanBtn.onclick = () => window.NeuroFlow.startReadinessScanner();

    const warmupBtn = document.getElementById('startWarmupBtn');
    if (warmupBtn) warmupBtn.onclick = () => window.NeuroFlow.startPreExamWarmup();

    const wordleBtn = document.getElementById('startDailyWordleBtn');
    if (wordleBtn) wordleBtn.onclick = () => window.NeuroFlow.startDailyWordleForge();

    // Protocolos Circadianos (flow.js)
    const recId = window.NeuroFlow.getRecommendedProtocolId();
    const circadianGrid = document.getElementById('circadianProtocolsGrid');
    if (circadianGrid) {
      circadianGrid.innerHTML = window.NeuroFlow.CIRCADIAN_PROTOCOLS.map((p) => {
        const isRec = p.id === recId;
        return `
          <div class="protocol-card ${isRec ? 'protocol-recommended' : ''}">
            <div class="protocol-top">
              <span class="protocol-time">${p.badge} ${p.timeSlot}</span>
              ${isRec ? '<span class="rec-pill">RECOMENDADO AHORA</span>' : ''}
            </div>
            <h4>${p.title}</h4>
            <p>${p.desc}</p>
            <div class="protocol-modules">
              ${p.games.map((g) => `<span class="mod-tag">${g}.js</span>`).join(' + ')}
            </div>
            <button type="button" class="btn-primary btn-sm launch-protocol-btn" data-pid="${p.id}">
              ▶️ Iniciar Protocolo
            </button>
          </div>
        `;
      }).join('');

      circadianGrid.querySelectorAll('.launch-protocol-btn').forEach((btn) => {
        btn.onclick = () => {
          const p = window.NeuroFlow.CIRCADIAN_PROTOCOLS.find(
            (x) => x.id === btn.getAttribute('data-pid')
          );
          if (p) {
            window.NeuroFlow.runPlaylistSequence({
              title: p.title,
              games: p.games,
              durationPerGame: p.durationPerGame,
              zenMode: p.zenMode
            });
          }
        };
      });
    }

    // Mutadores Diarios
    const mutatorsGrid = document.getElementById('dailyMutatorsGrid');
    if (mutatorsGrid) {
      mutatorsGrid.innerHTML = window.NeuroFun.getMutators()
        .map((m) => {
          const isActive = st.activeMutator === m.id;
          return `
            <div class="mutator-card ${isActive ? 'mutator-active' : ''}">
              <div class="mutator-head">
                <strong>${m.badge} ${m.name}</strong>
                <span class="mutator-mult">×${m.mineralMult} Mineral</span>
              </div>
              <p>${m.desc}</p>
              <button type="button" class="btn-secondary btn-sm toggle-mutator-btn" data-mid="${m.id}">
                ${isActive ? '✅ Mutador Activo (Desactivar)' : '⚡ Activar Mutador'}
              </button>
            </div>
          `;
        })
        .join('');

      mutatorsGrid.querySelectorAll('.toggle-mutator-btn').forEach((btn) => {
        btn.onclick = () => {
          window.NeuroFun.setActiveMutator(btn.getAttribute('data-mid'));
          refreshAllUI();
        };
      });
    }
  }

  function renderCatalogAndFusions() {
    const st = window.NeuroCore.getState();

    // Filtros de dominio
    document.querySelectorAll('.domain-filter-btn').forEach((btn) => {
      btn.onclick = () => {
        activeDomainFilter = btn.getAttribute('data-domain');
        document
          .querySelectorAll('.domain-filter-btn')
          .forEach((b) => b.classList.toggle('active', b === btn));
        renderCatalogAndFusions();
      };
    });

    // Los 5 Modos Fusión
    const fusionGrid = document.getElementById('fusionModesGrid');
    if (fusionGrid) {
      fusionGrid.innerHTML = window.NeuroGames.getFusionModes()
        .map((f) => {
          const minObj = window.NeuroCore.MINERALS[f.mineral];
          return `
            <div class="fusion-card">
              <div class="fusion-header">
                <span class="fusion-badge">${f.badge} MODO FUSIÓN</span>
                <span class="fusion-modules">${f.modules}</span>
              </div>
              <h4>${f.name}</h4>
              <p>${f.desc}</p>
              <div class="fusion-footer">
                <span style="color:${minObj.color}">Extrae: ${minObj.name}</span>
                <button type="button" class="btn-primary btn-sm play-fusion-btn" data-fid="${f.id}">
                  🔥 Jugar Fusión
                </button>
              </div>
            </div>
          `;
        })
        .join('');

      fusionGrid.querySelectorAll('.play-fusion-btn').forEach((btn) => {
        btn.onclick = () => {
          window.NeuroGames.startGame(btn.getAttribute('data-fid'));
        };
      });
    }

    // Los 20 Minijuegos Cognitivos
    const catalogGrid = document.getElementById('gamesCatalogGrid');
    if (catalogGrid) {
      const games = window.NeuroGames.getCatalog().filter(
        (g) => activeDomainFilter === 'all' || g.domain === activeDomainFilter
      );

      catalogGrid.innerHTML = games
        .map((g) => {
          const gStat = st.gamesStats[g.id] || { plays: 0, bestScore: 0, bestReactionMs: null };
          const minObj = window.NeuroCore.MINERALS[g.mineral];
          return `
            <article class="game-tile-card">
              <div class="game-tile-top">
                <span class="game-tile-icon">${g.icon}</span>
                <span class="game-file-badge">${g.fileTag}</span>
              </div>
              <h4>${g.name}</h4>
              <p>${g.desc}</p>
              <div class="game-tile-meta">
                <span style="color:${minObj.color}">⛏️ ${minObj.symbol} (${minObj.name.split(' ')[0]})</span>
                <span>🏆 Récord: ${gStat.bestScore}</span>
              </div>
              <button type="button" class="btn-primary btn-sm play-game-btn" data-gid="${g.id}">
                ▶️ Entrenar (${g.durationSec}s)
              </button>
            </article>
          `;
        })
        .join('');

      catalogGrid.querySelectorAll('.play-game-btn').forEach((btn) => {
        btn.onclick = () => {
          window.NeuroGames.startGame(btn.getAttribute('data-gid'));
        };
      });
    }

    // Botones de Asalto al Córtex (Roguelike) y Coloso de la Semana
    const rogueBtn = document.getElementById('launchRoguelikeBtn');
    if (rogueBtn) rogueBtn.onclick = () => window.NeuroFlow.startRoguelikeRun();

    const bossBtn = document.getElementById('launchBossFightBtn');
    if (bossBtn) bossBtn.onclick = () => window.NeuroFlow.startWeeklyBossFight();
  }

  function renderWorkshopRelics() {
    const st = window.NeuroCore.getState();
    const grid = document.getElementById('relicsWorkshopGrid');
    const countBadge = document.getElementById('forgedRelicsCounter');

    if (countBadge) {
      countBadge.textContent = `${st.forgedRelics.length} / 24 Reliquias Sinápticas Forjadas`;
    }

    if (!grid) return;
    grid.innerHTML = window.NeuroArt.getRelics()
      .map((r) => {
        const isForged = st.forgedRelics.includes(r.id);
        const costPills = Object.entries(r.cost)
          .map(([mId, val]) => {
            const m = window.NeuroCore.MINERALS[mId];
            const hasEnough = (st.minerals[mId] || 0) >= val;
            return `<span class="cost-pill ${hasEnough ? 'cost-ok' : 'cost-missing'}">${val} ${m.symbol}</span>`;
          })
          .join(' ');

        return `
          <div class="relic-card ${isForged ? 'relic-forged' : 'relic-locked'}">
            <div class="relic-tier-tag">Aleación ${r.tier}</div>
            <div class="relic-svg-holder">
              ${window.NeuroArt.renderRelicSVG(r, 74)}
            </div>
            <h4>${r.name}</h4>
            <p class="relic-desc">${r.effectDesc}</p>
            <div class="relic-costs">${costPills}</div>
            ${
              isForged
                ? `<div class="relic-owned-badge">✅ FORJADA Y ACTIVA</div>`
                : `<button type="button" class="btn-primary btn-sm forge-relic-btn" data-rid="${r.id}">⚒️ Fundir Reliquia</button>`
            }
          </div>
        `;
      })
      .join('');

    grid.querySelectorAll('.forge-relic-btn').forEach((btn) => {
      btn.onclick = () => {
        const rId = btn.getAttribute('data-rid');
        const relic = window.NeuroArt.getRelics().find((x) => x.id === rId);
        if (!relic) return;
        if (window.NeuroCore.spendMinerals(relic.cost)) {
          st.forgedRelics.push(relic.id);
          window.NeuroCore.saveState();
          window.NeuroFX.playAnvilStrike(3);
          window.NeuroFX.spawnSparks(btn, 18);
          refreshAllUI();
        } else {
          window.NeuroFX.triggerMiss(true);
          alert('No tienes suficientes Minerales Cognitivos para fundir esta Reliquia. ¡Entrena en los minijuegos o abre un Crisol!');
        }
      };
    });
  }

  function renderADNAndBioPanel() {
    const st = window.NeuroCore.getState();
    const arch = window.NeuroCore.getCurrentArchetype();
    const corr = window.NeuroCore.getBioCorrelations();

    const radarBox = document.getElementById('hexRadarContainer');
    if (radarBox) {
      radarBox.innerHTML = window.NeuroArt.renderHexRadarSVG(st.domainScores);
    }

    // Actualizar tabla semántica accesible del radar
    const radarTableBody = document.getElementById('radarAccessibleTableBody');
    if (radarTableBody) {
      radarTableBody.innerHTML = window.NeuroCore.DOMAINS.map(
        (d) => `<tr><td>${d.label}</td><td>${st.domainScores[d.id] || 70} / 100</td></tr>`
      ).join('');
    }

    const archTitle = document.getElementById('adnArchetypeTitle');
    const archDesc = document.getElementById('adnArchetypeDesc');
    if (archTitle) archTitle.textContent = `${arch.badge} ${arch.name}`;
    if (archDesc) archDesc.textContent = arch.desc;

    // Micro-Etiquetas de Contexto (Bio-Correlación)
    const bioTagsWrap = document.getElementById('bioTagsContainer');
    if (bioTagsWrap) {
      bioTagsWrap.innerHTML = window.NeuroCore.BIO_TAGS.map((t) => {
        const active = st.activeBioTags.includes(t.id);
        return `
          <button type="button" class="bio-tag-btn ${active ? 'active' : ''}" data-tag="${t.id}">
            <span>${t.icon} ${t.label}</span>
            <small>${t.impactHint}</small>
          </button>
        `;
      }).join('');

      bioTagsWrap.querySelectorAll('.bio-tag-btn').forEach((btn) => {
        btn.onclick = () => {
          window.NeuroCore.toggleBioTag(btn.getAttribute('data-tag'));
          renderADNAndBioPanel();
        };
      });
    }

    // Insights de Bio-Correlación de 14 días
    const bioInsights = document.getElementById('bioCorrelationInsights');
    if (bioInsights) {
      bioInsights.innerHTML = `
        <div class="bio-insight-item">
          <span class="bio-insight-icon">🏃</span>
          <div>
            <strong>Deporte vs Memoria de Trabajo:</strong>
            <p>Tu memoria de trabajo sube un <strong>+${corr.sportDiff} %</strong> los días que entrenas tras hacer ejercicio físico.</p>
          </div>
        </div>
        <div class="bio-insight-item">
          <span class="bio-insight-icon">😴</span>
          <div>
            <strong>Deuda de Sueño (< 6 horas):</strong>
            <p>Tu precisión ejecutiva cae un <strong>${corr.sleepDiff} %</strong> tras dormir menos de 6 horas.</p>
          </div>
        </div>
        <div class="bio-insight-item">
          <span class="bio-insight-icon">☕</span>
          <div>
            <strong>Efecto Ergogénico del Café:</strong>
            <p>Tu latencia en Go/No-Go mejora en <strong>-${corr.coffeeMsDiff} ms</strong> (media 14d: ${corr.avgLatency14d} ms).</p>
          </div>
        </div>
      `;
    }

    // Códice de Principios Cognitivos
    const principlesGrid = document.getElementById('principlesCodexGrid');
    if (principlesGrid) {
      principlesGrid.innerHTML = window.NeuroPrinciples.getAllPrinciples()
        .map((p) => {
          const unlocked = p.golden
            ? st.unlockedGoldenPrinciples.includes(p.id)
            : st.unlockedPrinciples.includes(p.id);
          return `
            <div class="principle-card ${p.golden ? 'principle-golden' : ''} ${unlocked ? '' : 'principle-locked'}">
              <div class="principle-cat">${p.category}</div>
              <h4>${unlocked ? p.title : '🔒 Principio Secreto Bloqueado'}</h4>
              <p>${unlocked ? p.explanation : 'Desbloquea este principio jugando o abriendo Crisoles Sellados.'}</p>
              ${unlocked ? `<div class="principle-tip">💡 ${p.actionTip}</div>` : ''}
            </div>
          `;
        })
        .join('');
    }

    // Dibujar Tarjeta Neuro-Wrapped en Canvas
    const canvas = document.getElementById('neuroWrappedCanvas');
    if (canvas) {
      window.NeuroArt.drawNeuroWrappedCard(canvas);
    }

    const downloadBtn = document.getElementById('downloadWrappedBtn');
    if (downloadBtn && canvas) {
      downloadBtn.onclick = () => {
        window.NeuroArt.drawNeuroWrappedCard(canvas);
        const link = document.createElement('a');
        link.download = `Neuroforja-ADN-${window.NeuroCore.getTodayString()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  }

  function renderSocialAndLeagues() {
    const st = window.NeuroCore.getState();
    const divisions = window.NeuroFun.getDivisions();
    const curDiv = divisions[st.league.divisionIndex] || divisions[2];

    const divHeader = document.getElementById('leagueDivisionHeader');
    if (divHeader) {
      divHeader.innerHTML = `
        <div class="league-banner" style="border-color:${curDiv.color}">
          <span class="league-icon">${curDiv.icon}</span>
          <div>
            <h4>${curDiv.name} · Temporada Semanal</h4>
            <p>Los 5 primeros ascienden el domingo a medianoche · Los 5 últimos descienden</p>
          </div>
          <div class="league-pts-badge">${st.league.weeklyPoints} PTS</div>
        </div>
      `;
    }

    const standingsBody = document.getElementById('leagueTableBody');
    if (standingsBody) {
      const rows = window.NeuroFun.getLeagueStandings();
      standingsBody.innerHTML = rows
        .map(
          (r) => `
          <tr class="${r.isPlayer ? 'player-row' : ''} zone-${r.zone}">
            <td>#${r.rank}</td>
            <td>${r.name}</td>
            <td>${r.temp} °C</td>
            <td><strong>${r.points} pts</strong></td>
            <td>${
              r.zone === 'ascenso'
                ? '🔼 Ascenso'
                : r.zone === 'descenso'
                ? '🔽 Descenso'
                : '➖ Permanece'
            }</td>
          </tr>
        `
        )
        .join('');
    }

    // Pacto de Fuego (Apuesta de 200 minerales)
    const pactBox = document.getElementById('firePactStatusBox');
    if (pactBox) {
      if (st.firePact.active) {
        pactBox.innerHTML = `
          <div class="pact-active-banner">
            <strong>🔥 PACTO DE FUEGO ACTIVO (${st.firePact.daysCompleted} / ${st.firePact.targetDays} Días)</strong>
            <p>Mantén la racha hasta completar los 5 días para recibir <strong>400 Minerales Cognitivos</strong>.</p>
          </div>
        `;
      } else {
        pactBox.innerHTML = `
          <p>Apuesta <strong>200 minerales</strong> (40 de cada tipo) a que completarás 5 sesiones. Si cumples, duplicas a <strong>400 minerales</strong>.</p>
          <button type="button" id="startFirePactBtn" class="btn-primary">🔥 Sellar Pacto de Fuego (200 Minerales)</button>
        `;
        const pBtn = document.getElementById('startFirePactBtn');
        if (pBtn) {
          pBtn.onclick = () => {
            const res = window.NeuroFun.activateFirePact();
            alert(res.msg);
            refreshAllUI();
          };
        }
      }
    }
  }

  /**
   * Modal de Apertura de Crisoles Sellados con 3 Toques Hápticos de Martillo
   */
  function setupCrucibleModal() {
    const closeBtn = document.getElementById('closeCrucibleModalBtn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        const m = document.getElementById('crucibleModal');
        if (m) m.hidden = true;
      };
    }

    const vesselBtn = document.getElementById('crucibleVesselBtn');
    if (vesselBtn) {
      vesselBtn.onclick = () => {
        const st = window.NeuroCore.getState();
        if (st.crucibles <= 0) return;

        crucibleTapStep += 1;
        window.NeuroFX.playAnvilStrike(crucibleTapStep);
        window.NeuroFX.spawnSparks(vesselBtn, 14);
        vesselBtn.setAttribute('data-step', String(crucibleTapStep));

        const statusText = document.getElementById('crucibleTapInstruction');
        if (crucibleTapStep === 1 && statusText) {
          statusText.textContent = '💥 ¡Grieta Ígnea 1/3! Golpea dos veces más...';
        } else if (crucibleTapStep === 2 && statusText) {
          statusText.textContent = '🔥 ¡Escoria al Rojo Vivo 2/3! ¡Último golpe de martillo!';
        } else if (crucibleTapStep >= 3) {
          const reward = window.NeuroFun.openCrucibleReward();
          crucibleTapStep = 0;
          vesselBtn.setAttribute('data-step', '0');
          const resBox = document.getElementById('crucibleRewardResult');
          if (resBox && reward) {
            resBox.hidden = false;
            resBox.innerHTML = `
              <div class="crucible-loot-card">
                <span class="loot-rarity">${reward.rarity}</span>
                <div class="loot-icon">${reward.icon}</div>
                <h4>${reward.title}</h4>
                <p>${reward.desc}</p>
              </div>
            `;
          }
          if (statusText) {
            statusText.textContent =
              st.crucibles > 0
                ? `Tienes ${st.crucibles} Crisol(es) más. Toca para golpear (0/3).`
                : 'No quedan Crisoles Sellados. ¡Juega 3 partidas o completa un Protocolo para ganar otro!';
          }
          refreshAllUI();
        }
      };
    }
  }

  function showCrucibleModal() {
    const st = window.NeuroCore.getState();
    crucibleTapStep = 0;
    const modal = document.getElementById('crucibleModal');
    const resBox = document.getElementById('crucibleRewardResult');
    const statusText = document.getElementById('crucibleTapInstruction');
    const vesselBtn = document.getElementById('crucibleVesselBtn');

    if (resBox) resBox.hidden = true;
    if (vesselBtn) vesselBtn.setAttribute('data-step', '0');
    if (statusText) {
      statusText.textContent =
        st.crucibles > 0
          ? `Crisoles disponibles: ${st.crucibles}. ¡Toca el Crisol 3 veces para romper el sello!`
          : 'No tienes Crisoles Sellados ahora mismo. Completa cualquier Protocolo o 3 minijuegos para obtener uno.';
    }
    if (modal) modal.hidden = false;
  }

  /**
   * Controles de Duelo contra Fantasmas (Ghost Codes)
   */
  function setupGhostDuelControls() {
    const sampleGhostBtn = document.getElementById('loadSampleGhostBtn');
    const ghostInput = document.getElementById('ghostCodeInput');
    const startGhostBtn = document.getElementById('startGhostDuelBtn');

    if (sampleGhostBtn && ghostInput) {
      sampleGhostBtn.onclick = () => {
        const sample = window.NeuroCore.encodeGhostCode({
          gameId: 'calc',
          seed: window.NeuroCore.getTodayString(),
          score: 840,
          splitsMs: [2800, 6100, 9900, 14200, 19500, 25000, 31000]
        });
        ghostInput.value = sample;
      };
    }

    if (startGhostBtn && ghostInput) {
      startGhostBtn.onclick = () => {
        const decoded = window.NeuroCore.decodeGhostCode(ghostInput.value);
        if (!decoded) {
          alert('Código Fantasma inválido. Pulsa «Cargar Sombra Campeona de Muestra» o pega un código NF2-... válido.');
          return;
        }
        window.NeuroGames.startGame(decoded.gameId, {
          seed: decoded.seed,
          ghostData: decoded
        });
      };
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    refreshAllUI,
    showCrucibleModal
  };
})();
