/** Design tokens for the light and dark themes. */
export const lightColors = {
  bg: '#F5F6FB',
  bgCard: '#FFFFFF',
  bgInput: '#EEF0F7',
  border: '#E6E8F0',
  borderLight: '#D9DCE8',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#8A94A6',
  tabBg: '#EEF2FF',
  tabActive: '#EEF2FF',
  navBg: '#FFFFFF',
  navBorder: '#E6E8F0',
  icon: '#8A94A6',
  iconActive: '#4F46E5',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  white: '#FFFFFF',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  onPrimary: '#FFFFFF',
  statusBar: 'dark' as const,
};

export const darkColors = {
  bg: '#0F1220',
  bgCard: '#1A1E31',
  bgInput: '#262B42',
  border: '#2A3049',
  borderLight: '#394061',
  text: '#F1F5F9',
  textSecondary: '#A8B1C7',
  textMuted: '#7C86A0',
  tabBg: '#312E81',
  tabActive: '#312E81',
  navBg: '#151929',
  navBorder: '#2A3049',
  icon: '#7C86A0',
  iconActive: '#A5B4FC',
  primary: '#6366F1',
  primaryLight: '#2B2D5B',
  white: '#1A1E31',
  danger: '#F87171',
  dangerLight: '#3B1D24',
  success: '#4ADE80',
  successLight: '#16301F',
  warning: '#FBBF24',
  warningLight: '#3A2E12',
  onPrimary: '#FFFFFF',
  statusBar: 'light' as const,
};

export type Colors = {
  bg: string;
  bgCard: string;
  bgInput: string;
  border: string;
  borderLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tabBg: string;
  tabActive: string;
  navBg: string;
  navBorder: string;
  icon: string;
  iconActive: string;
  primary: string;
  primaryLight: string;
  white: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  onPrimary: string;
  statusBar: 'dark' | 'light';
};
