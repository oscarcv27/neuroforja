/**
 * NEUROFORJA 2.0 — Motor de Retención, Crisoles, Mutadores y Ligas (fun.js)
 * Gestiona el Termómetro de la Fragua (300 °C - 3.000 °C), la apertura interactiva
 * en 3 toques de los Crisoles Sellados, los Mutadores Diarios, Pactos de Fuego y Ligas.
 */

window.NeuroFun = (() => {
  const DIVISIONS = [
    { id: 'cobre', name: 'División Cobre', icon: '🥉', minPts: 0, color: '#d97706' },
    { id: 'hierro', name: 'División Hierro', icon: '⚙️', minPts: 800, color: '#94a3b8' },
    { id: 'acero', name: 'División Acero', icon: '⚔️', minPts: 1400, color: '#38bdf8' },
    { id: 'titanio', name: 'División Titanio', icon: '🛡️', minPts: 2200, color: '#f59e0b' },
    { id: 'neutron', name: 'División Neutrón', icon: '🌌', minPts: 3200, color: '#a855f7' }
  ];

  const MUTATORS = [
    {
      id: 'espejo_invertido',
      name: 'Mutador «Espejo Invertido»',
      badge: '🔄',
      targetGames: ['lights', 'matrix', 'ghost'],
      desc: 'En Luces, Matriz y Fantasma, el tablero rota 90° tras mostrar el patrón inicial, obligando a rotar mentalmente tu memoria espacial (+50 % minerales).',
      mineralMult: 1.5
    },
    {
      id: 'muerte_subita',
      name: 'Mutador «Muerte Súbita»',
      badge: '💀',
      targetGames: ['deduce', 'series', 'calc', 'nback'],
      desc: 'Sin límite de tiempo por ronda, pero un único fallo termina la partida. Recompensa TRIPLE de mineral si superas la ronda 10.',
      mineralMult: 3.0
    },
    {
      id: 'niebla_acustica',
      name: 'Mutador «Niebla Acústica»',
      badge: '🌫️',
      targetGames: ['track', 'odd', 'ghost'],
      desc: 'Las pistas visuales se atenúan bajo niebla densa y el radar de fx.js guía tu atención mediante paneo estéreo (+75 % minerales).',
      mineralMult: 1.75
    },
    {
      id: 'sobrecarga_epica',
      name: 'Mutador Épico «Hiper-Fusión»',
      badge: '⚡',
      targetGames: ['all'],
      desc: 'Empiezas directamente en Fever Mode ×2 y cada acierto vale doble mineral cognitivo.',
      mineralMult: 2.0
    }
  ];

  function getDivisions() {
    return DIVISIONS;
  }

  function getMutators() {
    return MUTATORS;
  }

  /**
   * Obtiene el mutador recomendado del día según el día de la semana (o el elegido manualmente)
   */
  function getActiveMutator() {
    const st = window.NeuroCore.getState();
    if (st.activeMutator) {
      return MUTATORS.find((m) => m.id === st.activeMutator) || null;
    }
    return null;
  }

  function setActiveMutator(mutatorId) {
    const st = window.NeuroCore.getState();
    st.activeMutator = st.activeMutator === mutatorId ? null : mutatorId;
    window.NeuroCore.saveState();
    return getActiveMutator();
  }

  /**
   * Estado térmico detallado del Termómetro de la Fragua (300 °C a 3.000 °C)
   */
  function getForgeThermalStatus() {
    const st = window.NeuroCore.getState();
    const minTemp = window.NeuroArt && window.NeuroArt.hasRelic('reliquia_15') ? 450 : 300;
    const temp = Math.max(minTemp, Math.min(3000, st.forgeTemp));
    const percent = Math.round(((temp - 300) / 2700) * 100);
    const mult = window.NeuroCore.getTempMultiplier(temp);

    let phaseName = 'Brasa Latente';
    if (temp >= 2500) phaseName = 'Fusión de Estrella de Neutrones (×2.5)';
    else if (temp >= 1800) phaseName = 'Plasma Blanco Solar (×2.0)';
    else if (temp >= 1200) phaseName = 'Incandescencia Áurea (×1.5)';
    else if (temp >= 700) phaseName = 'Fragua Roja Activa (×1.25)';

    return {
      temp,
      percent,
      mult,
      phaseName
    };
  }

  /**
   * Resuelve el botín al abrir un Crisol Sellado tras los 3 toques hápticos
   * 70% Minerales Cognitivos | 25% Mutador Épico | 5% Principio Dorado o Tema Visual
   */
  function openCrucibleReward() {
    const st = window.NeuroCore.getState();
    if (st.crucibles <= 0) return null;
    st.crucibles -= 1;

    const lucky = window.NeuroArt && window.NeuroArt.hasRelic('reliquia_19');
    const roll = Math.random() * 100;
    const goldenThreshold = lucky ? 14 : 6;
    const epicThreshold = lucky ? 45 : 30;

    let reward = null;

    if (roll < goldenThreshold) {
      // 5% (o 14% con suerte): Tema visual exclusivo o Principio Secreto Dorado
      const allThemes = ['volcanica', 'matrix', 'tinta', 'cortex'];
      const lockedThemes = allThemes.filter((t) => !st.unlockedThemes.includes(t));

      if (lockedThemes.length > 0 && Math.random() < 0.5) {
        const newTheme = lockedThemes[0];
        st.unlockedThemes.push(newTheme);
        const themeNames = {
          matrix: 'Estética Matrix Verde',
          tinta: 'Tinta Electrónica (E-Ink Alto Contraste)',
          cortex: 'Córtex Cian Bioluminiscente',
          volcanica: 'Forja Volcánica'
        };
        reward = {
          rarity: 'DORADO LEGENDARIO (5%)',
          icon: '🎨',
          title: `Tema Exclusivo: ${themeNames[newTheme] || newTheme}`,
          desc: 'Se ha desbloqueado en el selector superior de la interfaz.'
        };
      } else {
        const goldP = window.NeuroPrinciples.unlockRandomGoldenPrinciple();
        reward = {
          rarity: 'PRINCIPIO DORADO SECRETO (5%)',
          icon: '🌟',
          title: goldP ? goldP.title : 'Principio Dorado Desbloqueado',
          desc: goldP
            ? goldP.explanation
            : 'Has descubierto un secreto neuroquímico en tu Códice.'
        };
      }
    } else if (roll < epicThreshold) {
      // 25%: Mutador Épico activado + lote de Obsidiana y Titanio
      st.activeMutator = 'sobrecarga_epica';
      st.minerals.obsidiana += 55;
      st.minerals.titanio += 55;
      reward = {
        rarity: 'MUTADOR ÉPICO (25%)',
        icon: '⚡',
        title: 'Mutador «Hiper-Fusión» + 110 Minerales',
        desc: 'Activado para tu siguiente sesión: empiezas en Fever ×2 con doble extracción mineral (+55 Obsidiana, +55 Titanio).'
      };
    } else {
      // 70%: Lote generoso de Minerales Cognitivos
      const keys = Object.keys(window.NeuroCore.MINERALS);
      const m1 = keys[Math.floor(Math.random() * keys.length)];
      const m2 = keys[( keys.indexOf(m1) + 2 ) % keys.length];
      const amt1 = 65 + Math.floor(Math.random() * 45);
      const amt2 = 45 + Math.floor(Math.random() * 35);
      st.minerals[m1] += amt1;
      st.minerals[m2] += amt2;
      reward = {
        rarity: 'ESCORIA LUMINOSA PURA (70%)',
        icon: '💎',
        title: `+${amt1} ${window.NeuroCore.MINERALS[m1].name} y +${amt2} ${window.NeuroCore.MINERALS[m2].name}`,
        desc: 'Materias primas listas para fundir nuevas Reliquias Sinápticas en el Taller.'
      };
    }

    window.NeuroCore.saveState();
    return reward;
  }

  /**
   * Inicia un Pacto de Fuego apostando 200 minerales en total (40 de cada uno)
   */
  function activateFirePact() {
    const st = window.NeuroCore.getState();
    if (st.firePact.active) return { ok: false, msg: 'Ya tienes un Pacto de Fuego activo.' };

    const cost = { litio: 40, titanio: 40, obsidiana: 40, mercurio: 40, cobalto: 40 };
    if (!window.NeuroCore.spendMinerals(cost)) {
      return {
        ok: false,
        msg: 'Necesitas al menos 40 unidades de cada uno de los 5 minerales (200 en total) para sellar el Pacto de Fuego.'
      };
    }

    st.firePact = {
      active: true,
      stakedMinerals: 200,
      daysCompleted: 1,
      targetDays: 5,
      lastCheckDate: window.NeuroCore.getTodayString()
    };
    window.NeuroCore.saveState();
    return {
      ok: true,
      msg: '🔥 ¡Pacto de Fuego sellado! Completa 5 sesiones para duplicar tu inversión a 400 minerales.'
    };
  }

  /**
   * Genera la clasificación de la Liga de Aleación Semanal (15 competidores + el usuario)
   */
  function getLeagueStandings() {
    const st = window.NeuroCore.getState();
    const todaySeed = window.NeuroCore.getTodayString().slice(0, 8);
    const rng = window.NeuroCore.mulberry32('league-' + todaySeed + st.league.divisionIndex);

    const botNames = [
      'Valeria_NBack',
      'KortexPrime',
      'Dr_Synapse',
      'HanoiMaster',
      'Iris_Quantum',
      'Lucas_99ms',
      'AetherMind',
      'Sombra_Cobalto',
      'Elena_Vektor',
      'TitanForge_X',
      'Nero_Crisol',
      'Sofia_Parietal',
      'Marco_Kelly',
      'Zeta_Centinela'
    ];

    const base = 750 + st.league.divisionIndex * 320;
    const entries = botNames.map((name, i) => ({
      name,
      isPlayer: false,
      points: Math.round(base + rng() * 1150 + (14 - i) * 35),
      temp: Math.round(600 + rng() * 2100)
    }));

    entries.push({
      name: `${st.playerName} (Tú)`,
      isPlayer: true,
      points: st.league.weeklyPoints,
      temp: st.forgeTemp
    });

    entries.sort((a, b) => b.points - a.points);
    return entries.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      zone: idx < 5 ? 'ascenso' : idx >= entries.length - 5 ? 'descenso' : 'permanencia'
    }));
  }

  return {
    DIVISIONS,
    MUTATORS,
    getDivisions,
    getMutators,
    getActiveMutator,
    setActiveMutator,
    getForgeThermalStatus,
    openCrucibleReward,
    activateFirePact,
    getLeagueStandings
  };
})();
