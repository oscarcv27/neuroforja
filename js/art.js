/**
 * NEUROFORJA 2.0 — Motor de Arte Procedural, Reliquias SVG y Tarjeta Neuro-Wrapped (art.js)
 * Gestiona las 24 Reliquias Sinápticas animadas en SVG, el Núcleo de la Fragua reactivo,
 * el Radar Hexagonal de dominios y el exportador en Canvas del ADN Cognitivo.
 */

window.NeuroArt = (() => {
  // Catálogo completo de las 24 Reliquias Sinápticas
  const RELICS = [
    {
      id: 'reliquia_01',
      name: 'Diapasón de Litio',
      tier: 'Cobre',
      shape: 'ring',
      color: '#38bdf8',
      cost: { litio: 60, mercurio: 30 },
      perkType: 'mineral_boost',
      mineralTarget: 'litio',
      bonusVal: 0.2,
      effectDesc: '+20 % de Litio Sináptico en todos los juegos de Agilidad y Cálculo.'
    },
    {
      id: 'reliquia_02',
      name: 'Bobina de Tesla Prefrontal',
      tier: 'Cobre',
      shape: 'coil',
      color: '#f59e0b',
      cost: { titanio: 65, litio: 35 },
      perkType: 'extra_time',
      bonusVal: 3,
      effectDesc: '+3 segundos adicionales en el reloj inicial de cualquier minijuego.'
    },
    {
      id: 'reliquia_03',
      name: 'Inyector de Sobrecarga',
      tier: 'Hierro',
      shape: 'star',
      color: '#fb7185',
      cost: { litio: 80, obsidiana: 60 },
      perkType: 'early_fever',
      bonusVal: 1,
      effectDesc: 'El Modo Sobrecarga (Fever ×2) se activa a los 4 aciertos en vez de 5.'
    },
    {
      id: 'reliquia_04',
      name: 'Escudo Térmico de Obsidiana',
      tier: 'Hierro',
      shape: 'shield',
      color: '#a855f7',
      cost: { obsidiana: 90, titanio: 50 },
      perkType: 'first_mistake_shield',
      bonusVal: 1,
      effectDesc: 'Ignora el primer error de cada partida sin perder tu racha de Fever Mode.'
    },
    {
      id: 'reliquia_05',
      name: 'Cristal de Baddeley',
      tier: 'Cobre',
      shape: 'crystal',
      color: '#f43f5e',
      cost: { cobalto: 60, titanio: 30 },
      perkType: 'mineral_boost',
      mineralTarget: 'cobalto',
      bonusVal: 0.2,
      effectDesc: '+20 % de Cobalto Mnemónico en pruebas de Memoria y Visión 3D.'
    },
    {
      id: 'reliquia_06',
      name: 'Giroscopio de Shepard',
      tier: 'Hierro',
      shape: 'gyro',
      color: '#2dd4bf',
      cost: { cobalto: 85, mercurio: 55 },
      perkType: 'pattern_preview',
      bonusVal: 400,
      effectDesc: '+400 ms de exposición visual al memorizar matrices, luces y fantasmas.'
    },
    {
      id: 'reliquia_07',
      name: 'Péndulo de Cuarzo Líquido',
      tier: 'Cobre',
      shape: 'pendulum',
      color: '#10b981',
      cost: { mercurio: 70, litio: 40 },
      perkType: 'mineral_boost',
      mineralTarget: 'mercurio',
      bonusVal: 0.2,
      effectDesc: '+20 % de Mercurio Fase en pruebas de Atención e Inhibición.'
    },
    {
      id: 'reliquia_08',
      name: 'Yunque de Titanio Puro',
      tier: 'Cobre',
      shape: 'anvil',
      color: '#f59e0b',
      cost: { titanio: 75, obsidiana: 35 },
      perkType: 'mineral_boost',
      mineralTarget: 'titanio',
      bonusVal: 0.2,
      effectDesc: '+20 % de Titanio Cortical en pruebas de Lógica y Sistemas.'
    },
    {
      id: 'reliquia_09',
      name: 'Espejo de obsidiana Negra',
      tier: 'Cobre',
      shape: 'prism',
      color: '#c084fc',
      cost: { obsidiana: 75, mercurio: 35 },
      perkType: 'mineral_boost',
      mineralTarget: 'obsidiana',
      bonusVal: 0.2,
      effectDesc: '+20 % de Obsidiana Neural en juegos de Riesgo y Triaje.'
    },
    {
      id: 'reliquia_10',
      name: 'Condensador de Flujo Alfa',
      tier: 'Acero',
      shape: 'core',
      color: '#38bdf8',
      cost: { litio: 110, cobalto: 90 },
      perkType: 'score_mult',
      bonusVal: 0.12,
      effectDesc: '+12 % de puntuación base en todos los minijuegos del catálogo.'
    },
    {
      id: 'reliquia_11',
      name: 'Lente Estereoscópica',
      tier: 'Acero',
      shape: 'eye',
      color: '#34d399',
      cost: { mercurio: 110, cobalto: 80 },
      perkType: 'radar_clarity',
      bonusVal: 1,
      effectDesc: 'Aumenta el contraste visual de objetivos en Rastreo Múltiple e Intruso.'
    },
    {
      id: 'reliquia_12',
      name: 'Válvula de Kelly',
      tier: 'Acero',
      shape: 'hex',
      color: '#f472b6',
      cost: { obsidiana: 120, titanio: 80 },
      perkType: 'risk_insurance',
      bonusVal: 0.35,
      effectDesc: 'En Globo y Bolsa, si ocurre un crash conservas el 35 % de lo acumulado.'
    },
    {
      id: 'reliquia_13',
      name: 'Matriz Hiperbólica',
      tier: 'Acero',
      shape: 'grid',
      color: '#fbbf24',
      cost: { titanio: 120, cobalto: 95 },
      perkType: 'score_mult',
      bonusVal: 0.15,
      effectDesc: '+15 % de puntos en Deducción, Series y Torres de Hanói.'
    },
    {
      id: 'reliquia_14',
      name: 'Acelerador de Sinapsis',
      tier: 'Acero',
      shape: 'bolt',
      color: '#60a5fa',
      cost: { litio: 130, mercurio: 95 },
      perkType: 'survival_bonus',
      bonusVal: 0.4,
      effectDesc: 'En Contrarreloj de Supervivencia, cada acierto suma +0.4 s extra al reloj.'
    },
    {
      id: 'reliquia_15',
      name: 'Termostato Criogénico',
      tier: 'Titanio',
      shape: 'flame',
      color: '#f97316',
      cost: { litio: 140, titanio: 120, obsidiana: 90 },
      perkType: 'temp_retention',
      bonusVal: 150,
      effectDesc: 'Eleva la temperatura mínima de la fragua en +150 °C de forma permanente.'
    },
    {
      id: 'reliquia_16',
      name: 'Brújula del Córtex Anterior',
      tier: 'Titanio',
      shape: 'compass',
      color: '#22d3ee',
      cost: { mercurio: 140, obsidiana: 110 },
      perkType: 'switch_warning',
      bonusVal: 1,
      effectDesc: 'Destello anticipado al cambiar la regla en Sala de Crisis y Task Switch.'
    },
    {
      id: 'reliquia_17',
      name: 'Tesseracts de Hanói',
      tier: 'Titanio',
      shape: 'cube',
      color: '#a78bfa',
      cost: { cobalto: 150, titanio: 120 },
      perkType: 'spatial_mastery',
      bonusVal: 0.2,
      effectDesc: '+20 % de puntuación en Cubos 3D, Rotación Mental y Torres de Hanói.'
    },
    {
      id: 'reliquia_18',
      name: 'Resonador Pentatónico',
      tier: 'Titanio',
      shape: 'wave',
      color: '#4ade80',
      cost: { litio: 150, mercurio: 130 },
      perkType: 'fever_score_boost',
      bonusVal: 0.25,
      effectDesc: '+25 % de puntos extra mientras estás dentro del Modo Sobrecarga (Fever).'
    },
    {
      id: 'reliquia_19',
      name: 'Crisol Alquímico Eterno',
      tier: 'Titanio',
      shape: 'chalice',
      color: '#facc15',
      cost: { obsidiana: 150, cobalto: 130, litio: 100 },
      perkType: 'crucible_luck',
      bonusVal: 1,
      effectDesc: 'Duplica la probabilidad de botín épico y dorado al abrir Crisoles Sellados.'
    },
    {
      id: 'reliquia_20',
      name: 'Orbe de Visión Periférica',
      tier: 'Neutrón',
      shape: 'orbit',
      color: '#38bdf8',
      cost: { mercurio: 180, cobalto: 160, litio: 120 },
      perkType: 'score_mult',
      bonusVal: 0.18,
      effectDesc: '+18 % de eficiencia global en pruebas de Atención y Memoria.'
    },
    {
      id: 'reliquia_21',
      name: 'Monolito de Gödel',
      tier: 'Neutrón',
      shape: 'monolith',
      color: '#f59e0b',
      cost: { titanio: 200, obsidiana: 160 },
      perkType: 'boss_damage',
      bonusVal: 0.3,
      effectDesc: 'Tus aciertos infligen +30 % de daño al Coloso de la Semana.'
    },
    {
      id: 'reliquia_22',
      name: 'Corazón de Estrella de Neutrones',
      tier: 'Neutrón',
      shape: 'pulsar',
      color: '#ec4899',
      cost: { litio: 180, titanio: 180, obsidiana: 180 },
      perkType: 'all_minerals',
      bonusVal: 0.25,
      effectDesc: '+25 % a la extracción de los 5 Minerales Cognitivos en todas las partidas.'
    },
    {
      id: 'reliquia_23',
      name: 'Códice de Von Neumann',
      tier: 'Neutrón',
      shape: 'helix',
      color: '#14b8a6',
      cost: { cobalto: 200, mercurio: 180, titanio: 150 },
      perkType: 'roguelike_life',
      bonusVal: 1,
      effectDesc: 'Comienzas el modo Roguelike «Asalto al Córtex» con +1 Vida extra (4 vidas).'
    },
    {
      id: 'reliquia_24',
      name: 'Corona de la Singularidad',
      tier: 'Neutrón',
      shape: 'crown',
      color: '#fde047',
      cost: { litio: 220, titanio: 220, obsidiana: 220, mercurio: 220, cobalto: 220 },
      perkType: 'singularity',
      bonusVal: 0.3,
      effectDesc: 'Reliquia Suprema: +30 % de puntuación y minerales en toda Neuroforja 2.0.'
    }
  ];

  function getRelics() {
    return RELICS;
  }

  function hasRelic(relicId) {
    const st = window.NeuroCore.getState();
    return st.forgedRelics.includes(relicId);
  }

  function getMineralBonus(mineralId) {
    const st = window.NeuroCore.getState();
    let mult = 1.0;
    for (const rId of st.forgedRelics) {
      const r = RELICS.find((x) => x.id === rId);
      if (!r) continue;
      if (r.perkType === 'mineral_boost' && r.mineralTarget === mineralId) {
        mult += r.bonusVal;
      } else if (r.perkType === 'all_minerals' || r.perkType === 'singularity') {
        mult += r.bonusVal;
      }
    }
    return mult;
  }

  function getExtraTimeSeconds() {
    return hasRelic('reliquia_02') ? 3 : 0;
  }

  function getScoreBonusMultiplier() {
    const st = window.NeuroCore.getState();
    let mult = 1.0;
    for (const rId of st.forgedRelics) {
      const r = RELICS.find((x) => x.id === rId);
      if (!r) continue;
      if (r.perkType === 'score_mult' || r.perkType === 'singularity') {
        mult += r.bonusVal;
      }
    }
    return mult;
  }

  /**
   * Genera un icono SVG animado único para cada una de las 24 Reliquias Sinápticas
   */
  function renderRelicSVG(relic, size = 68) {
    const c = relic.color || '#38bdf8';
    const idx = parseInt(relic.id.replace('reliquia_', ''), 10) || 1;
    const rotDur = 6 + (idx % 5) * 2;

    let inner = '';
    switch (idx % 6) {
      case 0:
        inner = `
          <polygon points="50,12 84,32 84,68 50,88 16,68 16,32" fill="none" stroke="${c}" stroke-width="3.5"/>
          <polygon points="50,24 73,38 73,62 50,76 27,62 27,38" fill="${c}22" stroke="${c}" stroke-width="2" stroke-dasharray="6 4">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="${rotDur}s" repeatCount="indefinite"/>
          </polygon>
          <circle cx="50" cy="50" r="10" fill="${c}"/>
        `;
        break;
      case 1:
        inner = `
          <circle cx="50" cy="50" r="36" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="12 6">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="${rotDur}s" repeatCount="indefinite"/>
          </circle>
          <circle cx="50" cy="50" r="24" fill="${c}22" stroke="${c}" stroke-width="2.5"/>
          <path d="M50 20 L58 44 L82 50 L58 56 L50 80 L42 56 L18 50 L42 44 Z" fill="${c}"/>
        `;
        break;
      case 2:
        inner = `
          <rect x="22" y="22" width="56" height="56" rx="8" fill="none" stroke="${c}" stroke-width="3">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="${rotDur + 4}s" repeatCount="indefinite"/>
          </rect>
          <rect x="28" y="28" width="44" height="44" rx="6" fill="${c}22" stroke="${c}" stroke-width="2" transform="rotate(45 50 50)"/>
          <circle cx="50" cy="50" r="11" fill="${c}"/>
        `;
        break;
      case 3:
        inner = `
          <polygon points="50,10 61,36 89,39 67,57 74,85 50,70 26,85 33,57 11,39 39,36" fill="${c}28" stroke="${c}" stroke-width="3">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="${rotDur + 2}s" repeatCount="indefinite"/>
          </polygon>
          <circle cx="50" cy="50" r="9" fill="#ffffff"/>
        `;
        break;
      case 4:
        inner = `
          <path d="M50 14 L82 28 L82 54 C82 72 68 84 50 90 C32 84 18 72 18 54 L18 28 Z" fill="${c}24" stroke="${c}" stroke-width="3.5"/>
          <circle cx="50" cy="50" r="16" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="8 4">
            <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="${rotDur}s" repeatCount="indefinite"/>
          </circle>
          <circle cx="50" cy="50" r="7" fill="${c}"/>
        `;
        break;
      default:
        inner = `
          <ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(30 50 50)"/>
          <ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(-30 50 50)"/>
          <ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(90 50 50)"/>
          <circle cx="50" cy="50" r="11" fill="${c}">
            <animate attributeName="r" values="9;13;9" dur="2.2s" repeatCount="indefinite"/>
          </circle>
        `;
        break;
    }

    return `
      <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="relic-svg" aria-hidden="true">
        <defs>
          <radialGradient id="rg_${relic.id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${c}" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#rg_${relic.id})"/>
        ${inner}
      </svg>
    `;
  }

  /**
   * Renderiza el Núcleo Central de la Fragua que evoluciona según la temperatura y las reliquias
   */
  function renderForgeCoreSVG(temp = 860, forgedCount = 2) {
    const ratio = Math.min(1, Math.max(0, (temp - 300) / 2700));
    const coreColor =
      temp >= 2400
        ? '#38bdf8' // Plasma azul blanco
        : temp >= 1600
        ? '#fbbf24' // Oro solar
        : temp >= 900
        ? '#f97316' // Naranja incandescente
        : '#ef4444'; // Brasa roja

    const rings = Math.min(5, 1 + Math.floor(forgedCount / 4));
    let ringsSvg = '';
    for (let i = 1; i <= rings; i++) {
      const r = 42 + i * 16;
      const dur = Math.max(4, 18 - ratio * 10 - i * 1.5).toFixed(1);
      const dir = i % 2 === 0 ? '360 140 140' : '-360 140 140';
      ringsSvg += `
        <circle cx="140" cy="140" r="${r}" fill="none" stroke="${coreColor}" stroke-opacity="${0.28 + i * 0.1}" stroke-width="${2.5}" stroke-dasharray="${10 + i * 5} ${8 + i * 3}">
          <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="${dir}" dur="${dur}s" repeatCount="indefinite"/>
        </circle>
      `;
    }

    return `
      <svg viewBox="0 0 280 280" class="forge-core-svg" role="img" aria-label="Núcleo de la Fragua Neural a ${temp} grados Celsius">
        <defs>
          <radialGradient id="forgeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="35%" stop-color="${coreColor}" stop-opacity="0.75"/>
            <stop offset="75%" stop-color="${coreColor}" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="${coreColor}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="140" cy="140" r="125" fill="url(#forgeCoreGlow)"/>
        ${ringsSvg}
        <polygon points="140,86 186,113 186,167 140,194 94,167 94,113" fill="${coreColor}33" stroke="${coreColor}" stroke-width="3">
          <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="12s" repeatCount="indefinite"/>
        </polygon>
        <circle cx="140" cy="140" r="${24 + ratio * 12}" fill="${coreColor}">
          <animate attributeName="r" values="${22 + ratio * 10};${28 + ratio * 14};${22 + ratio * 10}" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="140" y="145" text-anchor="middle" fill="#090d16" font-family="JetBrains Mono, monospace" font-weight="800" font-size="14">${temp}°C</text>
      </svg>
    `;
  }

  /**
   * Renderiza el Radar Hexagonal del ADN Cognitivo en SVG
   */
  function renderHexRadarSVG(domainScores) {
    const domains = window.NeuroCore.DOMAINS;
    const cx = 150;
    const cy = 150;
    const maxR = 98;

    const getPoint = (idx, valRatio) => {
      const angle = (Math.PI * 2 * idx) / 6 - Math.PI / 2;
      const r = maxR * valRatio;
      return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
    };

    // Rejillas concéntricas (33%, 66%, 100%)
    let grids = '';
    [0.33, 0.66, 1.0].forEach((level) => {
      const pts = domains.map((_, i) => getPoint(i, level).join(',')).join(' ');
      grids += `<polygon points="${pts}" fill="none" stroke="rgba(148,163,184,0.25)" stroke-width="1.2"/>`;
    });

    // Ejes y etiquetas
    let axes = '';
    domains.forEach((d, i) => {
      const [ex, ey] = getPoint(i, 1.0);
      const [lx, ly] = getPoint(i, 1.24);
      const val = domainScores[d.id] || 70;
      axes += `
        <line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="rgba(148,163,184,0.22)" stroke-width="1"/>
        <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="#e2e8f0" font-size="10.5" font-weight="600">${d.label.split(' ')[0]} (${val})</text>
      `;
    });

    // Polígono de datos del jugador
    const dataPoints = domains
      .map((d, i) => {
        const val = Math.min(100, Math.max(10, domainScores[d.id] || 70)) / 100;
        return getPoint(i, val).join(',');
      })
      .join(' ');

    return `
      <svg viewBox="0 0 300 300" class="hex-radar-svg" role="img" aria-label="Radar Hexagonal de Dominios Cognitivos">
        ${grids}
        ${axes}
        <polygon points="${dataPoints}" fill="rgba(249, 115, 22, 0.32)" stroke="#f97316" stroke-width="3"/>
        ${domains
          .map((d, i) => {
            const val = Math.min(100, Math.max(10, domainScores[d.id] || 70)) / 100;
            const [px, py] = getPoint(i, val);
            return `<circle cx="${px}" cy="${py}" r="4.5" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>`;
          })
          .join('')}
      </svg>
    `;
  }

  /**
   * Dibuja en un elemento <canvas> la tarjeta compartible «Neuro-Wrapped» de alta estética
   */
  function drawNeuroWrappedCard(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const st = window.NeuroCore.getState();
    const arch = window.NeuroCore.getCurrentArchetype();
    const corr = window.NeuroCore.getBioCorrelations();

    const W = 720;
    const H = 920;
    canvas.width = W;
    canvas.height = H;

    // Fondo degradado industrial oscuro
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#090d16');
    bg.addColorStop(0.5, '#131c2e');
    bg.addColorStop(1, '#1e112a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Borde incandescente
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, W - 36, H - 36);

    // Cabecera
    ctx.fillStyle = '#f97316';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillText('NEUROFORJA 2.0 · CERTIFICADO DE ADN COGNITIVO', 48, 68);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 36px "Unbounded", sans-serif';
    ctx.fillText(`${arch.badge} ${arch.name}`, 48, 122);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Figtree", sans-serif';
    ctx.fillText(`Forjador: ${st.playerName} · Fecha: ${window.NeuroCore.getTodayString()}`, 48, 156);

    // Dibujar Radar Hexagonal en el centro
    const cx = W / 2;
    const cy = 365;
    const maxR = 135;
    const domains = window.NeuroCore.DOMAINS;

    [0.35, 0.7, 1.0].forEach((lvl) => {
      ctx.beginPath();
      domains.forEach((_, i) => {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = cx + Math.cos(a) * maxR * lvl;
        const y = cy + Math.sin(a) * maxR * lvl;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(148,163,184,0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Polígono de puntuaciones
    ctx.beginPath();
    domains.forEach((d, i) => {
      const val = (st.domainScores[d.id] || 72) / 100;
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = cx + Math.cos(a) * maxR * val;
      const y = cy + Math.sin(a) * maxR * val;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Etiquetas del radar
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    domains.forEach((d, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = cx + Math.cos(a) * (maxR + 36);
      const y = cy + Math.sin(a) * (maxR + 28);
      ctx.fillText(`${d.label.split(' ')[0]} ${st.domainScores[d.id]}`, x, y);
    });
    ctx.textAlign = 'left';

    // Métricas inferiores en tarjetas
    const metrics = [
      { label: 'TEMPERATURA FRAGUA', value: `${st.forgeTemp} °C` },
      { label: 'LATENCIA MEDIA (14D)', value: `${corr.avgLatency14d} ms` },
      { label: 'RELIQUIAS FORJADAS', value: `${st.forgedRelics.length} / 24` },
      { label: 'DIVISIÓN DE LIGA', value: ['Cobre', 'Hierro', 'Acero', 'Titanio', 'Neutrón'][st.league.divisionIndex] || 'Acero' }
    ];

    metrics.forEach((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 48 + col * 320;
      const by = 575 + row * 110;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.fillRect(bx, by, 300, 90);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, 300, 90);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillText(m.label, bx + 18, by + 32);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 26px "JetBrains Mono", monospace';
      ctx.fillText(m.value, bx + 18, by + 68);
    });

    // Pie de tarjeta
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 16px "Figtree", sans-serif';
    ctx.fillText(arch.desc.slice(0, 82) + '...', 48, 845);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText('NEUROFORJA 2.0 · ENTRENAMIENTO EJECUTIVO DE ALTA RETENCIÓN', 48, 878);
  }

  return {
    RELICS,
    getRelics,
    hasRelic,
    getMineralBonus,
    getExtraTimeSeconds,
    getScoreBonusMultiplier,
    renderRelicSVG,
    renderForgeCoreSVG,
    renderHexRadarSVG,
    drawNeuroWrappedCard
  };
})();
