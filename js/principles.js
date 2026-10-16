/**
 * NEUROFORJA 2.0 — Motor de Principios Cognitivos y Disparadores en Vivo (principles.js)
 * Conecta los fallos y decisiones extremas en partida con micro-píldoras interactivas
 * sobre sesgos cognitivos reales, neurociencia ejecutiva y Principios Secretos Dorados.
 */

window.NeuroPrinciples = (() => {
  const PRINCIPLES = [
    {
      id: 'coste_hundido',
      title: 'Falacia del Coste Hundido',
      category: 'Riesgo y Decisión',
      golden: false,
      triggerGames: ['balloon', 'stock'],
      shortHook: 'Seguiste arriesgando porque ya habías invertido demasiados pulsos en esta ronda.',
      explanation:
        'Tu amígdala y estriado ventral sobrevaloran lo ya acumulado y te impiden retirarte a tiempo. En economía y trading, cada decisión debe evaluarse solo por la probabilidad futura, nunca por lo ya invertido.',
      actionTip: 'Fija un umbral de salida (Stop-Profit) ANTES de empezar a inflar o comprar.'
    },
    {
      id: 'sesgo_optimismo',
      title: 'Sesgo de Optimismo e Ilusión de Control',
      category: 'Riesgo y Decisión',
      golden: false,
      triggerGames: ['balloon', 'stock'],
      shortHook: 'Subestimaste la probabilidad de colapso tras encadenar varios impulsos seguros.',
      explanation:
        'Tras una racha positiva sin accidentes, el cerebro reduce la señal de alarma en la corteza cingulada anterior, creyendo que «un toque más» tiene menos riesgo real del que marca la estadística.',
      actionTip: 'Recuerda que el riesgo marginal aumenta exponencialmente en cada paso.'
    },
    {
      id: 'efecto_urgencia',
      title: 'Trampa de Mera Urgencia',
      category: 'Priorización y Triaje',
      golden: false,
      triggerGames: ['triage', 'systems'],
      shortHook: 'Atendiste una alerta llamativa pero de baja gravedad antes que una crítica silenciosa.',
      explanation:
        'El córtex prefrontal tiende a priorizar tareas con estímulos ruidosos o parpadeantes sobre las tareas de mayor impacto sistémico (Matriz de Eisenhower).',
      actionTip: 'Filtra primero por impacto vital/estructural y después por tiempo restante.'
    },
    {
      id: 'coste_cambio',
      title: 'Inercia de Regla (Task-Switching Cost)',
      category: 'Flexibilidad Cognitiva',
      golden: false,
      triggerGames: ['switch', 'triage'],
      shortHook: 'Aplicaste la regla anterior justo después de que cambiara el criterio de clasificación.',
      explanation:
        'Reconfigurar el set mental en los ganglios basales y corteza prefrontal dorsolateral consume entre 180 y 400 ms extra. El error ocurre por perseveración motora.',
      actionTip: 'Haz una micro-pausa de 0.3 s al escuchar o ver el cambio de regla para limpiar el buffer.'
    },
    {
      id: 'efecto_stroop',
      title: 'Interferencia Prepotente (Efecto Stroop / No-Go)',
      category: 'Inhibición Ejecutiva',
      golden: false,
      triggerGames: ['nogo', 'odd'],
      shortHook: 'El impulso motor disparó el clic antes de que el giro frontal inferior pudiera frenarlo.',
      explanation:
        'Cuando el 80 % de los estímulos exigen pulsar, el sistema motor automatiza el gesto. Frenar ante un estímulo trampa requiere activar la vía hiperdirecta subtalámica en menos de 250 ms.',
      actionTip: 'Mantén una ligera tensión consciente y busca el rasgo inhibitorio (color rojo) antes de la forma.'
    },
    {
      id: 'carga_miller',
      title: 'Saturación del Buffer de Trabajo (Límite de Cowan/Miller)',
      category: 'Memoria de Trabajo',
      golden: false,
      triggerGames: ['nback', 'matrix', 'lights', 'ghost'],
      shortHook: 'Intentaste retener elementos aislados en lugar de agruparlos en un bloque (Chunking).',
      explanation:
        'La memoria de trabajo activa sostiene unos 4 ± 1 bloques de información simultáneos. Si memorizas casillas sueltas, el buffer se desborda.',
      actionTip: 'Agrupa las casillas iluminadas formando figuras geométricas (L, triángulo, diagonal).'
    },
    {
      id: 'sesgo_confirmacion',
      title: 'Anclaje y Sesgo de Confirmación Inductivo',
      category: 'Lógica y Deducción',
      golden: false,
      triggerGames: ['deduce', 'series'],
      shortHook: 'Elegiste la opción que encajaba con tu primera hipótesis ignorando la segunda variable.',
      explanation:
        'Al resolver matrices o series numéricas, el cerebro busca confirmar la primera pauta que detecta (ej. suma simple) y pasa por alto alternancias o reglas dobles.',
      actionTip: 'Comprueba siempre si la regla se cumple entre el 1.º y 2.º término Y entre el 2.º y 3.º.'
    },
    {
      id: 'ley_hick',
      title: 'Ley de Hick-Hyman y Parálisis por Análisis',
      category: 'Velocidad de Procesamiento',
      golden: false,
      triggerGames: ['calc', 'anagram', 'chain'],
      shortHook: 'El tiempo de reacción creció logarítmicamente al evaluar todas las opciones a la vez.',
      explanation:
        'Cuantas más alternativas evalúas en paralelo, más tarda el córtex motor en superar el umbral de decisión. El descarte rápido por paridad o última cifra reduce la latencia a la mitad.',
      actionTip: 'En cálculo rápido, mira primero el último dígito del resultado para descartar 2 opciones al instante.'
    },
    {
      id: 'rotacion_shepard',
      title: 'Fricción Parietal de Shepard-Metzler',
      category: 'Visión Espacial 3D',
      golden: false,
      triggerGames: ['rotation', 'cubes', 'hanoi'],
      shortHook: 'Confundiste una figura quiral (espejada) con una rotación válida en el plano.',
      explanation:
        'El tiempo para rotar mentalmente un objeto es directamente proporcional al ángulo de giro. Las piezas quirales (enantiómeros) son el señuelo clásico del surco intraparietal.',
      actionTip: 'Elige un «brazo ancla» asimétrico y sigue su sentido horario/antihorario.'
    },
    {
      id: 'ceguera_inatencional',
      title: 'Parpadeo Atencional y Túnel Foveal',
      category: 'Atención Dividida',
      golden: false,
      triggerGames: ['track', 'ghost'],
      shortHook: 'Perseguiste un único nodo con la mirada directa y perdiste los demás en la periferia.',
      explanation:
        'En seguimiento de múltiples objetos (MOT), fijar la fóvea en una sola esfera desactiva el rastreo paralelo de las demás.',
      actionTip: 'Fija la vista en el baricentro imaginario del grupo y usa tu visión periférica como un polígono elástico.'
    },
    // 4 Principios Secretos Dorados (Desbloqueables en Crisoles Sellados)
    {
      id: 'gold_estado_flow',
      title: '★ PRINCIPIO DORADO: Resonancia Locus Coeruleus-Noradrenalina',
      category: 'Secreto Dorado · Neuroquímica',
      golden: true,
      triggerGames: ['nback', 'calc', 'systems'],
      shortHook: 'El punto exacto entre aburrimiento y ansiedad dispara la plasticidad sináptica.',
      explanation:
        'Cuando aciertas al límite de tu velocidad (< 800 ms), el locus coeruleus libera pulsos fásicos de noradrenalina que multiplican la relación señal-ruido en tu corteza prefrontal.',
      actionTip: 'Jugar un 10 % por encima de tu zona cómoda genera el triple de adaptación cognitiva.'
    },
    {
      id: 'gold_antifragilidad',
      title: '★ PRINCIPIO DORADO: Asimetría Convexa (Criterio de Kelly)',
      category: 'Secreto Dorado · Estrategia Cuantitativa',
      golden: true,
      triggerGames: ['stock', 'balloon'],
      shortHook: 'Cómo maximizar el crecimiento geométrico sin riesgo de ruina total.',
      explanation:
        'Los profesionales del riesgo nunca apuestan el 100 % de su racha en un evento incierto: dimensionan la exposición según la ventaja matemática dividida por la varianza.',
      actionTip: 'Asegura ganancias parciales cuando la volatilidad supere el beneficio marginal esperado.'
    },
    {
      id: 'gold_memoria_palacio',
      title: '★ PRINCIPIO DORADO: Codificación Dual Visuo-Fonológica',
      category: 'Secreto Dorado · Supermemoria',
      golden: true,
      triggerGames: ['matrix', 'lights', 'nback'],
      shortHook: 'Combinar bucle fonológico y agenda visuoespacial duplica la retención.',
      explanation:
        'Según el modelo de Baddeley, el bucle fonológico (repetir voz interna) y la agenda visuoespacial no compiten entre sí. Usar ambos canales en paralelo evita interferencias.',
      actionTip: 'En Dual N-Back, visualiza la posición como imagen quieta y canta la letra con ritmo musical.'
    },
    {
      id: 'gold_recalibracion_vagal',
      title: '★ PRINCIPIO DORADO: Freno Vagal en Sala de Crisis',
      category: 'Secreto Dorado · Bio-Regulación',
      golden: true,
      triggerGames: ['triage', 'switch', 'nogo'],
      shortHook: 'Una exhalación prolongada restaura el control prefrontal en 2 segundos.',
      explanation:
        'Bajo presión de cronómetro, el tono simpático secuestra la flexibilidad cognitiva. Exhalar más lento de lo que inhalas activa el nervio vago y reduce errores impulsivos un 30 %.',
      actionTip: 'Cuando suene la alarma de cambio de regla, suelta el aire antes de tocar la pantalla.'
    }
  ];

  function getAllPrinciples() {
    return PRINCIPLES;
  }

  /**
   * Busca un principio contextual relevante para el juego donde el usuario acaba de fallar o arriesgar
   */
  function getContextualPrinciple(gameId) {
    const matches = PRINCIPLES.filter((p) => !p.golden && p.triggerGames.includes(gameId));
    if (matches.length > 0) {
      return matches[Math.floor(Math.random() * matches.length)];
    }
    return PRINCIPLES[0];
  }

  /**
   * Muestra una micro-píldora interactiva en tiempo real (o al terminar ronda con fallo crítico)
   */
  function showContextualPill(gameId, customReason = null) {
    const principle = getContextualPrinciple(gameId);
    const state = window.NeuroCore.getState();
    if (!state.unlockedPrinciples.includes(principle.id)) {
      state.unlockedPrinciples.push(principle.id);
      window.NeuroCore.saveState();
    }

    const container = document.getElementById('livePrincipleToast');
    if (!container) return principle;

    container.innerHTML = `
      <div class="principle-pill-inner">
        <div class="principle-pill-header">
          <span class="principle-pill-badge">🧠 SESGO DETECTADO EN VIVO</span>
          <button type="button" class="principle-pill-close" id="closePrincipleToastBtn" aria-label="Cerrar aviso">✕</button>
        </div>
        <h4 class="principle-pill-title">${principle.title}</h4>
        <p class="principle-pill-hook">${customReason || principle.shortHook}</p>
        <p class="principle-pill-tip"><strong>Protocolo Corrector:</strong> ${principle.actionTip}</p>
      </div>
    `;
    container.hidden = false;
    container.classList.add('visible');

    const closeBtn = document.getElementById('closePrincipleToastBtn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        container.classList.remove('visible');
        setTimeout(() => {
          container.hidden = true;
        }, 250);
      };
    }

    clearTimeout(container._hideTimer);
    container._hideTimer = setTimeout(() => {
      container.classList.remove('visible');
      setTimeout(() => {
        container.hidden = true;
      }, 250);
    }, 8500);

    return principle;
  }

  /**
   * Desbloquea un Principio Secreto Dorado (para el 5 % del Crisol Sellado)
   */
  function unlockRandomGoldenPrinciple() {
    const state = window.NeuroCore.getState();
    const locked = PRINCIPLES.filter(
      (p) => p.golden && !state.unlockedGoldenPrinciples.includes(p.id)
    );
    const chosen = locked.length > 0 ? locked[0] : PRINCIPLES.find((p) => p.golden);
    if (chosen && !state.unlockedGoldenPrinciples.includes(chosen.id)) {
      state.unlockedGoldenPrinciples.push(chosen.id);
      window.NeuroCore.saveState();
    }
    return chosen;
  }

  return {
    getAllPrinciples,
    getContextualPrinciple,
    showContextualPill,
    unlockRandomGoldenPrinciple
  };
})();
