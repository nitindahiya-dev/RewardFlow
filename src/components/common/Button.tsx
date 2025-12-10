// src/components/common/Button.tsx
import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ size = 'md', theme }) => {
    if (size === 'sm') return `${theme.spacing.sm} ${theme.spacing.md}`;
    if (size === 'lg') return `${theme.spacing.md} ${theme.spacing.xl}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  font-size: ${({ size = 'md', theme }) => {
    if (size === 'sm') return theme.fontSize.sm;
    if (size === 'lg') return theme.fontSize.lg;
    return theme.fontSize.md;
  }};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondaryDark};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: white;
          &:hover {
            background-color: ${theme.colors.dangerDark};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.98);
  }
`;



