/**
 * NEUROFORJA 2.0 — Motor Sensorial y Fever Mode (fx.js)
 * Sintetizador WebAudio API en escala pentatónica progresiva, paneo estéreo
 * para el mutador «Niebla Acústica», vibración háptica, chispas de fragua y
 * estado visual de Modo «Sobrecarga» (Fever Mode: ×2, ×3, ×5).
 */

window.NeuroFX = (() => {
  let audioCtx = null;
  let muted = false;
  let comboCount = 0;
  let feverMultiplier = 1;
  let feverTriggersInSession = 0;

  // Frecuencias en escala pentatónica mayor/menor eléctrica (Do4 -> Mi6)
  const PENTATONIC_FREQS = [
    261.63, 293.66, 329.63, 392.00, 440.00,
    523.25, 587.33, 659.25, 783.99, 880.00,
    1046.50, 1174.66, 1318.51, 1567.98, 1760.00
  ];

  function ensureAudio() {
    if (muted) return null;
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  /**
   * Actualiza las variables CSS reactivas del borde incandescente en Fever Mode
   */
  function updateFeverVisuals() {
    const root = document.documentElement;
    // Con reliquia de sobrecarga temprana puede activarse a los 4 aciertos
    const earlyFever = window.NeuroArt && window.NeuroArt.hasRelic('reliquia_03');
    const threshold2x = earlyFever ? 4 : 5;
    const threshold3x = earlyFever ? 7 : 8;
    const threshold5x = earlyFever ? 10 : 12;

    let newMult = 1;
    let feverLevel = 0;

    if (comboCount >= threshold5x) {
      newMult = 5;
      feverLevel = 3;
    } else if (comboCount >= threshold3x) {
      newMult = 3;
      feverLevel = 2;
    } else if (comboCount >= threshold2x) {
      newMult = 2;
      feverLevel = 1;
    }

    if (newMult > 1 && feverMultiplier === 1) {
      feverTriggersInSession += 1;
      playFeverActivationSound();
    }

    feverMultiplier = newMult;
    root.style.setProperty('--fever-level', String(feverLevel));
    root.style.setProperty('--fever-combo', String(comboCount));
    document.body.classList.toggle('fever-active', feverLevel > 0);
    document.body.setAttribute('data-fever-mult', `x${feverMultiplier}`);

    const badge = document.getElementById('feverHudBadge');
    if (badge) {
      if (feverLevel > 0) {
        badge.hidden = false;
        badge.textContent = `🔥 SOBRECARGA ×${feverMultiplier} (${comboCount})`;
        badge.className = `fever-badge fever-lvl-${feverLevel}`;
      } else if (comboCount > 1) {
        badge.hidden = false;
        badge.textContent = `⚡ RACHA ${comboCount}`;
        badge.className = 'fever-badge fever-lvl-0';
      } else {
        badge.hidden = true;
      }
    }
  }

  /**
   * Registra un acierto: sube el combo, dispara nota pentatónica, vibración y chispas
   */
  function triggerHit(originEl = null) {
    comboCount += 1;
    updateFeverVisuals();

    const ctx = ensureAudio();
    if (ctx) {
      const noteIdx = Math.min(PENTATONIC_FREQS.length - 1, comboCount - 1);
      const freq = PENTATONIC_FREQS[noteIdx];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = feverMultiplier >= 3 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.14);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);

      // En Fever Mode añade armónico de quinta superior
      if (feverMultiplier >= 2) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, now);
        gain2.gain.setValueAtTime(0.09, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 0.27);
      }
    }

    // Vibración háptica creciente según multiplicador
    if (feverMultiplier === 5) vibrate([25, 20, 45]);
    else if (feverMultiplier === 3) vibrate([20, 15, 25]);
    else if (feverMultiplier === 2) vibrate(22);
    else vibrate(10);

    spawnSparks(originEl, feverMultiplier >= 2 ? 12 : 6);
    return feverMultiplier;
  }

  /**
   * Registra un fallo: rompe la racha (a menos que haya Escudo Térmico), sonido grave
   */
  function triggerMiss(shielded = false) {
    if (!shielded) {
      comboCount = 0;
      updateFeverVisuals();
    }

    const ctx = ensureAudio();
    if (ctx) {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(shielded ? 310 : 155, now);
      osc.frequency.exponentialRampToValueAtTime(shielded ? 240 : 82, now + 0.28);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.31);
    }

    vibrate(shielded ? [15, 30, 15] : [60, 40, 80]);
    const arena = document.getElementById('gameStageArena');
    if (arena) {
      arena.classList.remove('fx-shake');
      void arena.offsetWidth;
      arena.classList.add('fx-shake');
    }
  }

  /**
   * Sonido de activación de Sobrecarga (Fever Mode)
   */
  function playFeverActivationSound() {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);
      gain.gain.setValueAtTime(0.12, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.26);
    });
  }

  /**
   * Sonido de martillo de fragua para abrir Crisoles Sellados (3 toques)
   */
  function playAnvilStrike(step = 1) {
    const ctx = ensureAudio();
    vibrate(step === 3 ? [40, 30, 90] : 35);
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = step === 1 ? 420 : step === 2 ? 560 : 840;
    const osc = ctx.createOscillator();
    const oscMetal = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    oscMetal.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.35);

    oscMetal.frequency.setValueAtTime(baseFreq * 2.41, now);
    oscMetal.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.18);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    oscMetal.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    oscMetal.start(now);
    osc.stop(now + 0.39);
    oscMetal.stop(now + 0.19);
  }

  /**
   * Radar acústico con paneo estéreo (-1 izquierda a +1 derecha) para el mutador «Niebla Acústica»
   */
  function playSpatialRadarPing(pan = 0, proximity = 0.5) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    const freq = 340 + Math.max(0, Math.min(1, proximity)) * 680;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      osc.connect(panner);
      panner.connect(gain);
    } else {
      osc.connect(gain);
    }
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  /**
   * Genera chispas incandescentes en la posición del elemento o centro de la arena
   */
  function spawnSparks(targetEl, count = 8) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (targetEl && targetEl.getBoundingClientRect) {
      const rect = targetEl.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const container = document.body;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = 'forge-spark';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 28 + Math.random() * 55;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);
      container.appendChild(spark);
      setTimeout(() => spark.remove(), 550);
    }
  }

  function resetCombo() {
    comboCount = 0;
    feverMultiplier = 1;
    feverTriggersInSession = 0;
    updateFeverVisuals();
  }

  function getComboState() {
    return {
      comboCount,
      feverMultiplier,
      feverTriggersInSession
    };
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  function isMuted() {
    return muted;
  }

  return {
    triggerHit,
    triggerMiss,
    playAnvilStrike,
    playSpatialRadarPing,
    playFeverActivationSound,
    spawnSparks,
    resetCombo,
    getComboState,
    toggleMute,
    isMuted
  };
})();
