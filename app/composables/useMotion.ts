export interface MotionConfig {
  initial?: Record<string, any>
  animate?: Record<string, any>
  transition?: Record<string, any>
  whileInView?: Record<string, any>
}

export function useMotion() {
  /**
   * Membuat konfigurasi animasi dasar
   */
  const createMotionConfig = (
    initial: Record<string, any> = { opacity: 0, y: 10 },
    animate: Record<string, any> = { opacity: 1, y: 0 },
    transition: Record<string, any> = { duration: 0.5 },
  ): MotionConfig => {
    return {
      initial,
      animate,
      transition,
    }
  }

  /**
   * Membuat konfigurasi animasi dengan staggered delay
   */
  const createStaggeredMotion = (
    index: number = 0,
    baseDelay: number = 0.1,
    initial: Record<string, any> = { opacity: 0, y: 10 },
    animate: Record<string, any> = { opacity: 1, y: 0 },
    additionalTransition: Record<string, any> = { duration: 0.5 },
  ): MotionConfig => {
    return {
      initial,
      animate,
      transition: {
        delay: baseDelay * index,
        ...additionalTransition,
      },
    }
  }

  /**
   * Konfigurasi animasi untuk card dengan in-view trigger
   */
  const createInViewMotion = (
    index: number = 0,
    baseDelay: number = 0.1,
    initial: Record<string, any> = { opacity: 0, y: 20 },
    whileInView: Record<string, any> = { opacity: 1, y: 0 },
    additionalTransition: Record<string, any> = { duration: 0.6, ease: 'easeOut' },
  ): MotionConfig => {
    return {
      initial,
      whileInView,
      transition: {
        delay: baseDelay * index,
        ...additionalTransition,
      },
    }
  }

  /**
   * Preset animasi untuk card guru dengan in-view
   */
  const guruCardMotion = (index: number = 0): MotionConfig => {
    return createInViewMotion(
      index,
      0.1,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      { duration: 0.6, ease: 'easeOut' },
    )
  }

  /**
   * Preset animasi fade in
   */
  const fadeInMotion = (delay: number = 0): MotionConfig => {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, delay },
    }
  }

  /**
   * Preset animasi slide up
   */
  const slideUpMotion = (delay: number = 0, distance: number = 30): MotionConfig => {
    return {
      initial: { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    }
  }

  return {
    createMotionConfig,
    createStaggeredMotion,
    createInViewMotion,
    guruCardMotion,
    fadeInMotion,
    slideUpMotion,
  }
}
