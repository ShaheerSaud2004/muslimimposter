export type Theme = 'soft' | 'paper' | 'dark' | 'ramadan';

export type ThemeColors = {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentLight: string;
  border: string;
  shadow: string;
  imposter: string;
  doubleAgent: string;
  patternOpacity: number;
};

export const themes: Record<Theme, ThemeColors> = {
  soft: {
    background: '#FEFEFE',
    cardBackground: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    accent: '#2563EB',
    accentLight: '#EFF6FF',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.08)',
    imposter: '#DC2626',
    doubleAgent: '#059669',
    patternOpacity: 0.06,
  },
  paper: {
    background: '#FAF8F4',
    cardBackground: '#FFFEF9',
    text: '#2C2416',
    textSecondary: '#6B5E4A',
    accent: '#8B6914',
    accentLight: '#F5F0E6',
    border: '#E8DDC8',
    shadow: 'rgba(44, 36, 22, 0.12)',
    imposter: '#C45A3D',
    doubleAgent: '#6B8E23',
    patternOpacity: 0.05,
  },
  dark: {
    background: '#2C2820',
    cardBackground: '#3A352A',
    text: '#F5E6D3',
    textSecondary: '#B8A082',
    accent: '#D4A574',
    accentLight: '#4A4234',
    border: '#4A4234',
    shadow: 'rgba(0, 0, 0, 0.4)',
    imposter: '#E67E5C',
    doubleAgent: '#8DB97F',
    patternOpacity: 0.08,
  },
  ramadan: {
    background: '#1a1f3a',
    cardBackground: '#252b47',
    text: '#F5E6D3',
    textSecondary: '#9ca3b8',
    accent: '#E8B86D',
    accentLight: '#3d3526',
    border: '#3d4a5c',
    shadow: 'rgba(0, 0, 0, 0.45)',
    imposter: '#E67E5C',
    doubleAgent: '#8DB97F',
    patternOpacity: 0.06,
  },
};

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const cardStyle = {
  borderRadius: 24,
  padding: spacing.lg,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 8,
};