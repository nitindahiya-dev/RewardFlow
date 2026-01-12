// src/components/common/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

export const Header = styled.header`
  background: linear-gradient(
    135deg,
    rgba(26, 18, 38, 0.98) 0%,
    rgba(31, 22, 45, 0.98) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(133, 64, 157, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: ${({ theme }) => theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Logo component is now in Logo.tsx

export const Nav = styled.nav`
  display: none;
  flex: 1;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const StyledNavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text : theme.colors.textLight};
  text-decoration: none;
  font-weight: ${({ $isActive, theme }) => 
    $isActive ? theme.fontWeight.semibold : theme.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: block;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  background: ${({ $isActive }) => 
    $isActive ? 'rgba(133, 64, 157, 0.15)' : 'transparent'};
  border: 1px solid ${({ $isActive }) => 
    $isActive ? 'rgba(133, 64, 157, 0.3)' : 'transparent'};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
    font-size: ${({ theme }) => theme.fontSize.md};
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ $isActive }) => $isActive ? '60%' : '0'};
    height: 2px;
    background: ${({ theme }) => theme.gradients.primary};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
    border-radius: 2px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: ${({ theme }) => theme.gradients.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(133, 64, 157, 0.1);
    border-color: rgba(133, 64, 157, 0.2);
    transform: translateY(-1px);
    
    &::before {
      width: 60%;
    }
    
    &::after {
      opacity: 0.05;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const NavLink = ({ to, children, ...props }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <StyledNavLink to={to} $isActive={isActive} {...props}>
      {children}
    </StyledNavLink>
  );
};

export const ProfileIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    // gap: ${({ theme }) => theme.spacing.lg};
    flex-wrap: nowrap;
  }
`;

export const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: 1px solid transparent;
  width: 32px;
  height: 32px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 36px;
    height: 36px;
    padding: ${({ theme }) => theme.spacing.sm};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(133, 64, 157, 0.1);
    border-color: rgba(133, 64, 157, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      width: 22px;
      height: 22px;
    }
  }
`;

// Mobile menu button removed - using bottom nav instead



