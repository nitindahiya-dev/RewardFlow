// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  Button,
  PageContainer,
  Footer,
  FooterContent,
  FooterGrid,
  FooterColumn,
  FooterTitle,
  FooterLink,
  FooterText,
  FooterLogo,
  SocialLinks,
  SocialLink,
  FooterBottom,
  Copyright,
  FooterLinks,
  FooterBottomLink,
  TaskIcon,
  LinkIcon,
  AIIcon,
  UsersIcon,
  CoinIcon,
  ChartIcon,
  LightningIcon,
  ChatIcon,
} from '../components/common';
import { useAppSelector } from '../store/hooks';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
`;

const LandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroSectionWrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    animation: ${float} 15s ease-in-out infinite reverse;
    pointer-events: none;
  }
`;

const LandingContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  position: relative;
  overflow: hidden;
  padding-top: ${({ theme }) => theme.spacing.xxl};
  padding-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const HeroSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;
  background: ${({ theme }) => theme.gradients.primary};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientAnimation} 3s ease infinite;
  filter: drop-shadow(0 0 30px rgba(99, 102, 241, 0.5));

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 6rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.wide}) {
    font-size: 7rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.75rem;
    max-width: 900px;
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  position: relative;
  z-index: 1;
`;

const FeatureCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.gradients.primary};
    opacity: 0.1;
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      left: 100%;
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  
  svg {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing.xxl} auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.gradients.primary};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientAnimation} 3s ease infinite;
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
`;

const StepCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
`;

// Stats Section
const StatsSection = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing.xxl} auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing.xxl} auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TestimonialCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 5rem;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.3;
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TestimonialText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const AuthorRole = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const Landing = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <LandingWrapper>
      {/* Full Screen Hero Section */}
      <HeroSectionWrapper>
        <HeroSection>
          <HeroTitle>Reward Flow</HeroTitle>
          <HeroSubtitle>
            Organize your tasks, collaborate with your team, and achieve your goals.
            Built with cutting-edge technology including Web3, AI, and real-time collaboration.
          </HeroSubtitle>
          <CTAButtons>
            <Button as={StyledLink} to={isAuthenticated ? "/tasks" : "/signup"} size="lg">
              Get Started
            </Button>
            {!isAuthenticated && (
              <Button as={StyledLink} to="/login" variant="outline" size="lg">
                Sign In
              </Button>
            )}
          </CTAButtons>
        </HeroSection>
      </HeroSectionWrapper>

      {/* Rest of the content */}
      <LandingContainer>
        <FeaturesSection>
          <FeatureCard>
            <FeatureIcon><TaskIcon size={56} /></FeatureIcon>
            <FeatureTitle>Task Management</FeatureTitle>
            <FeatureDescription>
              Create, organize, and track your tasks with ease. Set priorities, due dates, and collaborate with your team.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><LinkIcon size={56} /></FeatureIcon>
            <FeatureTitle>Web3 Integration</FeatureTitle>
            <FeatureDescription>
              Connect your crypto wallet, earn token rewards, and mint NFT badges for your achievements.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><AIIcon size={56} /></FeatureIcon>
            <FeatureTitle>AI-Powered</FeatureTitle>
            <FeatureDescription>
              Get smart task suggestions, auto-categorization, and intelligent prioritization powered by AI.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><UsersIcon size={56} /></FeatureIcon>
            <FeatureTitle>Real-Time Collaboration</FeatureTitle>
            <FeatureDescription>
              Work together in real-time with live updates, comments, and collaborative editing.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><CoinIcon size={56} /></FeatureIcon>
            <FeatureTitle>Crypto Rewards</FeatureTitle>
            <FeatureDescription>
              Earn tokens and crypto rewards for completing tasks. Stake tokens and grow your earnings.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><ChartIcon size={56} /></FeatureIcon>
            <FeatureTitle>Analytics & Insights</FeatureTitle>
            <FeatureDescription>
              Track your productivity, view detailed analytics, and get insights into your work patterns.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesSection>

        {/* How It Works Section */}
        <HowItWorksSection>
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Get started in three simple steps and transform your productivity
          </SectionSubtitle>
          <StepsContainer>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Sign Up & Connect</StepTitle>
              <StepDescription>
                Create your account in seconds. Connect your crypto wallet to unlock Web3 features and start earning rewards.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Create & Organize</StepTitle>
              <StepDescription>
                Add your tasks, set priorities, and let AI help you organize. Collaborate with your team in real-time.
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Complete & Earn</StepTitle>
              <StepDescription>
                Finish your tasks and earn crypto rewards. Collect NFT badges and watch your productivity grow.
              </StepDescription>
            </StepCard>
          </StepsContainer>
        </HowItWorksSection>

        {/* Stats Section */}
        <StatsSection>
          <SectionTitle>Trusted by Thousands</SectionTitle>
          <SectionSubtitle>
            Join a growing community of productive individuals and teams
          </SectionSubtitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>10K+</StatNumber>
              <StatLabel>Active Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>500K+</StatNumber>
              <StatLabel>Tasks Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>NFTs Minted</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        {/* Testimonials Section */}
        <TestimonialsSection>
          <SectionTitle>What Our Users Say</SectionTitle>
          <SectionSubtitle>
            Don't just take our word for it - hear from our community
          </SectionSubtitle>
          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialText>
                RewardFlow has completely transformed how I manage my tasks. The AI suggestions are incredibly helpful, and earning crypto rewards makes productivity fun!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>SM</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Sarah Martinez</AuthorName>
                  <AuthorRole>Product Manager</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
            <TestimonialCard>
              <TestimonialText>
                The Web3 integration is game-changing. My team loves earning NFT badges for milestones, and the real-time collaboration features keep us all in sync.
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>JD</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>James Davis</AuthorName>
                  <AuthorRole>Tech Lead</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
            <TestimonialCard>
              <TestimonialText>
                Best task management tool I've used. The interface is beautiful, the features are powerful, and the crypto rewards are a nice bonus. Highly recommend!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>EW</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Emily Wilson</AuthorName>
                  <AuthorRole>Freelancer</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
        </TestimonialsSection>
      </LandingContainer>

      {/* Footer */}
      <Footer>
        <FooterContent>
          <FooterGrid>
            <FooterColumn>
              <FooterLogo to="/">RewardFlow</FooterLogo>
              <FooterText>
                The modern task management platform with Web3 integration, AI-powered features, and real-time collaboration.
              </FooterText>
              <SocialLinks>
                <SocialLink href="#" aria-label="Twitter">𝕏</SocialLink>
                <SocialLink href="#" aria-label="GitHub"><LightningIcon size={20} /></SocialLink>
                <SocialLink href="#" aria-label="Discord"><ChatIcon size={20} /></SocialLink>
                <SocialLink href="#" aria-label="LinkedIn">in</SocialLink>
              </SocialLinks>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Product</FooterTitle>
              <FooterLink to="/tasks">Tasks</FooterLink>
              <FooterLink to="/profile">Profile</FooterLink>
              <FooterLink to="/user-details">User Details</FooterLink>
              <FooterLink to="/signup">Sign Up</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Features</FooterTitle>
              <FooterLink to="/web3-integration">Web3 Integration</FooterLink>
              <FooterLink to="/ai-powered">AI-Powered</FooterLink>
              <FooterLink to="/collaboration">Collaboration</FooterLink>
              <FooterLink to="/analytics">Analytics</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>Resources</FooterTitle>
              <FooterLink to="/documentation">Documentation</FooterLink>
              <FooterLink to="/api-reference">API Reference</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </FooterColumn>
          </FooterGrid>
          <FooterBottom>
            <Copyright>
              © {new Date().getFullYear()} RewardFlow. All rights reserved.
            </Copyright>
            <FooterLinks>
              <FooterBottomLink to="/privacy-policy">Privacy Policy</FooterBottomLink>
              <FooterBottomLink to="/terms-of-service">Terms of Service</FooterBottomLink>
              <FooterBottomLink to="/cookie-policy">Cookie Policy</FooterBottomLink>
            </FooterLinks>
          </FooterBottom>
        </FooterContent>
      </Footer>
    </LandingWrapper>
  );
};

