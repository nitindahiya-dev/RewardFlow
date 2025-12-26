import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 40px;
    height: 40px;
  }
`;

const LogoIconSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: linear-gradient(135deg, #4D2B8C 0%, #85409D 50%, #EEA727 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

interface LogoProps {
  to?: string;
}

export const Logo = ({ to = '/' }: LogoProps) => {
  return (
    <LogoContainer to={to}>
      <LogoIcon>
        <LogoIconSvg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4D2B8C" />
              <stop offset="50%" stopColor="#85409D" />
              <stop offset="100%" stopColor="#EEA727" />
            </linearGradient>
          </defs>
          
          {/* Simple R letter shape */}
          <path
            d="M 10 8 L 10 32 M 10 8 L 20 8 Q 25 8, 25 13 Q 25 18, 20 18 L 10 18 M 20 18 L 25 32"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Small flowing arrow */}
          <path
            d="M 28 20 L 32 16 L 32 20 L 32 24 Z"
            fill="#FFEF5F"
          />
        </LogoIconSvg>
      </LogoIcon>
      <LogoText>Reward Flow</LogoText>
    </LogoContainer>
  );
};

