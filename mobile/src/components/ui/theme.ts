import { Platform } from 'react-native';

/**
 * Shared design tokens for the CityCare mobile app.
 * Mirrors the visual language already used across the Hospital / Pharmacy /
 * Patient portals: slate palette, white cards, 12–16px radii and soft shadows.
 */

export const palette = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  white: '#FFFFFF',

  // Semantic accents (text / icon + soft background pairs)
  blue: '#2563EB',
  blueSoft: '#DBEAFE',
  blueTint: '#F0F5FF',

  green: '#10B981',
  greenSoft: '#ECFDF5',
  greenDeep: '#047857',

  amber: '#D97706',
  amberSoft: '#FEF3C7',
  amberDeep: '#92400E',

  red: '#EF4444',
  redSoft: '#FEE2E2',
  redDeep: '#B91C1C',

  slate: '#64748B',
  slateSoft: '#F1F5F9',

  purple: '#9333EA',
  purpleSoft: '#F3E8FF',

  violet: '#8B5CF6',
  violetSoft: '#F5F3FF',
  violetDeep: '#4C1D95',
} as const;

export type StatusTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'purple'
  | 'violet';

export const toneStyles: Record<StatusTone, { fg: string; bg: string }> = {
  success: { fg: palette.greenDeep, bg: palette.greenSoft },
  warning: { fg: palette.amberDeep, bg: palette.amberSoft },
  danger: { fg: palette.redDeep, bg: palette.redSoft },
  info: { fg: palette.blue, bg: palette.blueSoft },
  neutral: { fg: palette.slate, bg: palette.slateSoft },
  purple: { fg: palette.purple, bg: palette.purpleSoft },
  violet: { fg: palette.violet, bg: palette.violetSoft },
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  android: { elevation: 2 },
  default: {},
});

/** Touch target that always meets the 44pt minimum. */
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
