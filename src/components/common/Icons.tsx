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

// Celebration Icons

// Confetti Icon
export const ConfettiIcon: React.FC<IconProps> = ({ size = 24, color = '#FFD700', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="6" cy="8" r="2" fill="#FF6B6B" />
    <circle cx="18" cy="6" r="1.5" fill="#4ECDC4" />
    <circle cx="12" cy="4" r="1.5" fill="#FFE66D" />
    <circle cx="20" cy="12" r="1.5" fill="#FF6B6B" />
    <circle cx="4" cy="14" r="1.5" fill="#95E1D3" />
    <path
      d="M8 12L10 14L12 10L14 16L16 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 18L8 20L10 16L12 22L14 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Trophy Icon
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = '#FFD700', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 9C6 7.34315 7.34315 6 9 6H15C16.6569 6 18 7.34315 18 9V10C18 12.7614 15.7614 15 13 15H11C8.23858 15 6 12.7614 6 10V9Z"
      fill={color}
      opacity="0.2"
    />
    <path
      d="M6 9C6 7.34315 7.34315 6 9 6H15C16.6569 6 18 7.34315 18 9V10C18 12.7614 15.7614 15 13 15H11C8.23858 15 6 12.7614 6 10V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15V19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 19H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 19V21C10 21.5523 10.4477 22 11 22H13C13.5523 22 14 21.5523 14 21V19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Star Icon (for achievements)
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = '#FFD700', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
      opacity="0.3"
    />
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Party Popper Icon
export const PartyIcon: React.FC<IconProps> = ({ size = 24, color = '#FF6B6B', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="8" y="4" width="8" height="12" rx="1" fill={color} opacity="0.2" />
    <rect x="8" y="4" width="8" height="12" rx="1" stroke={color} strokeWidth="2" />
    <path
      d="M10 8H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 4V2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 16V20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="4" cy="8" r="1.5" fill="#FFE66D" />
    <circle cx="20" cy="10" r="1.5" fill="#4ECDC4" />
    <circle cx="6" cy="18" r="1.5" fill="#FF6B6B" />
    <circle cx="18" cy="20" r="1.5" fill="#95E1D3" />
    <path
      d="M5 12L7 14L9 10L11 16L13 8"
      stroke="#FFD700"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Bottom Nav Icons - Custom Attractive SVGs

// Tasks Icon (Clipboard with list)
export const BottomNavTasksIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// My Tasks Icon (Checkmark in circle)
export const BottomNavMyTasksIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M8 12L11 15L16 9"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Profile Icon (User silhouette)
export const BottomNavProfileIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      opacity="0.1"
    />
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Details/Settings Icon (Gear)
export const BottomNavDetailsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="2"
    />
  </IconWrapper>
);

// Home Icon (House)
export const BottomNavHomeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconWrapper>
);

// Login Icon (Key)
export const BottomNavLoginIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="8"
      cy="15"
      r="4"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M15 11L19 7M19 7L22 10M19 7L16 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="8"
      cy="15"
      r="4"
      stroke={color}
      strokeWidth="2"
    />
  </IconWrapper>
);

// Sign Up Icon (User with plus)
export const BottomNavSignUpIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
      fill={color}
      opacity="0.1"
    />
    <path
      d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={color}
      opacity="0.1"
    />
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 4V8M18 6H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </IconWrapper>
);

// GitHub Icon
export const GitHubIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      fill={color}
    />
  </IconWrapper>
);

