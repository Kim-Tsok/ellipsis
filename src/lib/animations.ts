// Standardized Framer Motion curves for Ellipsis
// Provides a fluid, Apple-style "decelerate" and physics-based feel.

export const ANIMATION_CURVES = {
  // Apple's signature "decelerate" curve for page/route transitions
  decelerate: [0.32, 0.72, 0, 1] as const,
  // Fast ease-out for micro-interactions (buttons, hovers)
  micro: 'easeOut',
};

export const SPRING_CONFIGS = {
  // Snappy spring for panel and modal open/close
  panel: { type: 'spring', stiffness: 300, damping: 30 } as const,
  // Slower, bouncier spring for spatial/graph node movement
  spatial: { type: 'spring', stiffness: 120, damping: 20 } as const,
  // Quick, subtle bounce for toasts and notifications
  toast: { type: 'spring', stiffness: 400, damping: 25 } as const,
};

export const TRANSITIONS = {
  microInteraction: { duration: 0.15, ease: ANIMATION_CURVES.micro },
  pageTransition: { duration: 0.35, ease: ANIMATION_CURVES.decelerate },
  panelSpring: SPRING_CONFIGS.panel,
  spatialSpring: SPRING_CONFIGS.spatial,
  toastSpring: SPRING_CONFIGS.toast,
};
