// src/theme/theme.ts
export const theme = {
  colors: {
    primary: '#4A90E2',
    primaryDark: '#357ABD',
    primaryLight: '#6BA3E8',
    secondary: '#50C878',
    secondaryDark: '#3FA066',
    danger: '#E74C3C',
    dangerDark: '#C0392B',
    warning: '#F39C12',
    success: '#27AE60',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceLight: '#252525',
    text: '#E5E5E5',
    textLight: '#B0B0B0',
    textSecondary: '#808080',
    border: '#2A2A2A',
    borderLight: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export type Theme = typeof theme;


