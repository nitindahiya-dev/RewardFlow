// src/components/common/Icons.tsx
import React from 'react';
import styled from 'styled-components';

interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const IconWrapper = styled.svg<{ size?: number | string }>`
  width: ${({ size }) => (typeof size === 'number' ? `${size}px` : size || '24px')};
  height: ${({ size }) => (typeof size === 'number' ? `${size}px` : size || '24px')};
  display: inline-block;
  vertical-align: middle;
`;

// Task Management Icon (Clipboard)
export const TaskIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="16" y="8" width="32" height="48" rx="4" fill={color} opacity="0.1" />
    <rect x="16" y="8" width="32" height="48" rx="4" stroke={color} strokeWidth="2.5" />
    <path d="M24 8V4C24 2.89543 24.8954 2 26 2H38C39.1046 2 40 2.89543 40 4V8" stroke={color} strokeWidth="2.5" />
    <line x1="24" y1="20" x2="40" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="28" x2="40" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="36" x2="32" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </IconWrapper>
);

// Web3 Integration Icon (Link/Chain)
export const LinkIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M32 20C32 20 28 16 24 16C20 16 16 20 16 24C16 28 20 32 24 32C24 32 28 36 32 36"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 44C32 44 36 48 40 48C44 48 48 44 48 40C48 36 44 32 40 32C40 32 36 28 32 28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="24" r="6" fill={color} opacity="0.2" />
    <circle cx="40" cy="40" r="6" fill={color} opacity="0.2" />
    <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="2.5" />
    <circle cx="40" cy="40" r="6" stroke={color} strokeWidth="2.5" />
  </IconWrapper>
);

// AI-Powered Icon (Robot/Brain)
export const AIIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="16" y="20" width="32" height="36" rx="4" fill={color} opacity="0.1" />
    <rect x="16" y="20" width="32" height="36" rx="4" stroke={color} strokeWidth="2.5" />
    <circle cx="26" cy="32" r="3" fill={color} />
    <circle cx="38" cy="32" r="3" fill={color} />
    <path d="M24 42C24 44.2091 25.7909 46 28 46H36C38.2091 46 40 44.2091 40 42" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M32 8C32 8 28 12 28 16C28 20 30 22 32 22C34 22 36 20 36 16C36 12 32 8 32 8Z"
      fill={color}
      opacity="0.2"
    />
    <path
      d="M32 8C32 8 28 12 28 16C28 20 30 22 32 22C34 22 36 20 36 16C36 12 32 8 32 8Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M20 24L16 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 24L48 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </IconWrapper>
);

// Collaboration Icon (Users/Team)
export const UsersIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="20" cy="18" r="8" fill={color} opacity="0.1" />
    <circle cx="20" cy="18" r="8" stroke={color} strokeWidth="2.5" />
    <circle cx="44" cy="18" r="8" fill={color} opacity="0.1" />
    <circle cx="44" cy="18" r="8" stroke={color} strokeWidth="2.5" />
    <path
      d="M12 48C12 42 15 38 20 38C25 38 28 42 28 48"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M36 48C36 42 39 38 44 38C49 38 52 42 52 48"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="14" r="6" fill={color} opacity="0.1" />
    <circle cx="32" cy="14" r="6" stroke={color} strokeWidth="2.5" />
    <path
      d="M20 50C20 46 24 42 32 42C40 42 44 46 44 50"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </IconWrapper>
);

// Crypto Rewards Icon (Coin)
export const CoinIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="32" cy="32" r="20" fill={color} opacity="0.1" />
    <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="2.5" />
    <path
      d="M32 12C32 12 24 16 24 24C24 32 32 36 32 36C32 36 40 32 40 24C40 16 32 12 32 12Z"
      fill={color}
      opacity="0.2"
    />
    <path
      d="M32 12C32 12 24 16 24 24C24 32 32 36 32 36C32 36 40 32 40 24C40 16 32 12 32 12Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M32 28C32 28 28 30 28 32C28 34 32 36 32 36C32 36 36 34 36 32C36 30 32 28 32 28Z"
      fill={color}
      opacity="0.3"
    />
    <path
      d="M32 28C32 28 28 30 28 32C28 34 32 36 32 36C32 36 36 34 36 32C36 30 32 28 32 28Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M32 28C32 28 28 30 28 32C28 34 32 36 32 36C32 36 36 34 36 32C36 30 32 28 32 28Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Analytics Icon (Chart/Graph)
export const ChartIcon: React.FC<IconProps> = ({ size = 64, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="8" y="8" width="48" height="48" rx="4" fill={color} opacity="0.05" />
    <rect x="8" y="8" width="48" height="48" rx="4" stroke={color} strokeWidth="2.5" />
    <line x1="16" y1="48" x2="16" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="48" x2="28" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="48" x2="40" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="48" x2="52" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M16 40L28 32L40 24L52 16"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="40" r="3" fill={color} />
    <circle cx="28" cy="32" r="3" fill={color} />
    <circle cx="40" cy="24" r="3" fill={color} />
    <circle cx="52" cy="16" r="3" fill={color} />
  </IconWrapper>
);

// GitHub/Lightning Icon
export const LightningIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Chat/Message Icon
export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Documentation/Book Icon
export const BookIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Email Icon
export const EmailIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 6L12 13L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </IconWrapper>
);

// Bug Icon
export const BugIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8V16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 16L4 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 16L20 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 8L4 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 8L20 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="16" r="2" stroke={color} strokeWidth="2" />
  </IconWrapper>
);

