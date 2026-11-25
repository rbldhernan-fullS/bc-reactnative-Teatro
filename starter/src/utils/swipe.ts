// ===== SEMANA 10 · INICIO =====
/**
 * Constantes compartidas por las dos variantes de `SwipeableCard`.
 *
 * El gesto es el mismo en nativo y en web: arrastrar a la **derecha** descarta
 * la obra y arrastrar a la **izquierda** la guarda. Tener el umbral y el
 * resorte en un solo sitio evita que las dos plataformas se separen.
 */
export const SWIPE_THRESHOLD = 110;

/** Distancia a la que ya se ve la etiqueta del panel (45 % del umbral). */
export const SWIPE_LABEL_REVEAL = SWIPE_THRESHOLD * 0.45;

export const SWIPE_SNAP_SPRING = {
  damping: 18,
  stiffness: 190,
  mass: 0.8,
} as const;

/** Inclinación máxima de la tarjeta al arrastrar, en grados. */
export const SWIPE_MAX_ROTATION = 6;
// ===== SEMANA 10 · FIN =====
