// src/components/common/ProfileIcon.tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ProfileIconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.08);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }
`;

const ProfileIconSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

interface ProfileIconProps {
  to: string;
  title?: string;
}

export const ProfileIcon = ({ to, title = 'View Profile' }: ProfileIconProps) => {
  return (
    <ProfileIconLink to={to} title={title}>
      <ProfileIconSvg />
    </ProfileIconLink>
  );
};

