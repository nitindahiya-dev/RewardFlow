// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, PageContainer } from '../components/common';

const LandingContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(100vh - 80px);
`;

const HeroSection = styled.section`
  max-width: 800px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1000px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export const Landing = () => {
  return (
    <LandingContainer>
      <HeroSection>
        <HeroTitle>TaskManager</HeroTitle>
        <HeroSubtitle>
          Organize your tasks, collaborate with your team, and achieve your goals.
          Built with modern technology including Web3, AI, and real-time collaboration.
        </HeroSubtitle>
        <CTAButtons>
          <Button as={StyledLink} to="/signup" size="lg">
            Get Started
          </Button>
          <Button as={StyledLink} to="/login" variant="outline" size="lg">
            Sign In
          </Button>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Task Management</FeatureTitle>
          <FeatureDescription>
            Create, organize, and track your tasks with ease. Set priorities, due dates, and collaborate with your team.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔗</FeatureIcon>
          <FeatureTitle>Web3 Integration</FeatureTitle>
          <FeatureDescription>
            Connect your crypto wallet, earn token rewards, and mint NFT badges for your achievements.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI-Powered</FeatureTitle>
          <FeatureDescription>
            Get smart task suggestions, auto-categorization, and intelligent prioritization powered by AI.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👥</FeatureIcon>
          <FeatureTitle>Real-Time Collaboration</FeatureTitle>
          <FeatureDescription>
            Work together in real-time with live updates, comments, and collaborative editing.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>💰</FeatureIcon>
          <FeatureTitle>Crypto Rewards</FeatureTitle>
          <FeatureDescription>
            Earn tokens and crypto rewards for completing tasks. Stake tokens and grow your earnings.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Analytics & Insights</FeatureTitle>
          <FeatureDescription>
            Track your productivity, view detailed analytics, and get insights into your work patterns.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </LandingContainer>
  );
};

