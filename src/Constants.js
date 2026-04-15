/**
 * ANIMATION_CONFIG - настройки для GSAP анимаций
 */
export const ANIMATION_CONFIG = {
  DURATION: 0.6,              // основная длительность
  EASE: "power2.out",         // easing функция
  HALF_DURATION: 0.3,         // для более быстрых анимаций
};

/**
 * SWIPER_CONFIG - настройки для Swiper карусели
 */
export const SWIPER_CONFIG = {
  SPEED: ANIMATION_CONFIG.DURATION * 1000, // конвертируем в миллисекунды
  THRESHOLD: 20,              // минимальное расстояние для свайпа
  RESISTANCE_RATIO: 0.85,     // сопротивление при свайпе
};

/**
 * LOADING_SCREEN_DURATION - как долго показывать loading screen
 */
export const LOADING_SCREEN_DURATION = 1500;

/**
 * DEFAULT_ACCORDION_STATE - начальное состояние аккордеонов
 */
export const DEFAULT_ACCORDION_STATE = {
  purchase: null,
  product: 0,
  virobi: null,
};

/**
 * HOVER_ANIMATION_LIMITS - ограничения для hover анимации
 */
export const HOVER_ANIMATION_LIMITS = {
  MIN_IMAGES: 3,       // если 3+ картинки - min интервал
  MAX_IMAGES: 15,      // если 15+ картинок - max интервал
  MIN_INTERVAL: 200,   // миллисекунды - самая быстрая смена
  MAX_INTERVAL: 1500,  // миллисекунды - самая медленная смена
};