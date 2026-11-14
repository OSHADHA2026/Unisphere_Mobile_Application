import { Platform, type ViewStyle } from 'react-native';

/** 4-pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const layout = {
  /** Horizontal padding used by every screen. */
  screenPadding: 20,
  /** Height of the bottom tab bar, excluding the safe-area inset. */
  tabBarHeight: 64,
  fabSize: 56,
  headerHeight: 60,
  /** Minimum touch target (Apple HIG / Material). */
  minTouch: 44,
} as const;

/** Soft elevation that works on iOS, Android and web. */
export const elevation = (level: 1 | 2 | 3 = 1, isDark = false): ViewStyle => {
  if (isDark) return level === 3 ? Platform.select({ android: { elevation: 6 }, default: {} }) ?? {} : {};
  const o = { 1: 0.05, 2: 0.08, 3: 0.14 }[level];
  const r = { 1: 6, 2: 12, 3: 18 }[level];
  return (
    Platform.select<ViewStyle>({
      ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: level * 2 }, shadowOpacity: o, shadowRadius: r },
      android: { elevation: level * 2 },
      default: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: level * 2 }, shadowOpacity: o, shadowRadius: r },
    }) ?? {}
  );
};
