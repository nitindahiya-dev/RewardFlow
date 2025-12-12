// src/pages/Web3Integration.tsx
import styled from 'styled-components';
import { PageContainer, Card, CardHeader, CardBody, AppFooter, LinkIcon } from '../components/common';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
`;

const FeaturePageContainer = styled(PageContainer)`
  max-width: 1000px;
  flex: 1;
`;

const FeatureCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  
  svg {
    width: 4rem;
    height: 4rem;
  }
`;

const FeatureTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Web3Integration = () => {
  return (
    <PageWrapper>
      <FeaturePageContainer>
        <FeatureCard>
          <CardHeader>
            <FeatureIcon><LinkIcon size={64} /></FeatureIcon>
            <FeatureTitle>Web3 Integration</FeatureTitle>
            <FeatureDescription>
              Connect your crypto wallet, earn token rewards, and mint NFT badges for your achievements.
              Experience the future of task management with blockchain technology.
            </FeatureDescription>
          </CardHeader>
          <CardBody>
            <SectionTitle>Key Features</SectionTitle>
            <FeatureList>
              <FeatureItem>Crypto Wallet Connection - Connect MetaMask, WalletConnect, and other popular wallets</FeatureItem>
              <FeatureItem>Token Rewards - Earn cryptocurrency for completing tasks</FeatureItem>
              <FeatureItem>NFT Badges - Collect unique NFT badges for milestones and achievements</FeatureItem>
              <FeatureItem>Smart Contracts - Secure, transparent task management on the blockchain</FeatureItem>
              <FeatureItem>DeFi Integration - Stake tokens and earn interest on your rewards</FeatureItem>
              <FeatureItem>Multi-Chain Support - Works with Ethereum, Polygon, and other networks</FeatureItem>
            </FeatureList>

            <SectionTitle>How It Works</SectionTitle>
            <Text>
              Our Web3 integration allows you to connect your cryptocurrency wallet directly to RewardFlow.
              Once connected, you can earn tokens for completing tasks, mint NFT badges for achievements,
              and participate in our token economy. All transactions are secured by smart contracts on the blockchain.
            </Text>

            <SectionTitle>Getting Started</SectionTitle>
            <Text>
              To get started with Web3 features, simply connect your wallet from your profile settings.
              Make sure you have a compatible wallet installed (like MetaMask) and some cryptocurrency
              for gas fees. Once connected, you'll be able to earn rewards and collect NFTs as you complete tasks.
            </Text>
          </CardBody>
        </FeatureCard>
      </FeaturePageContainer>
      <AppFooter />
    </PageWrapper>
  );
};

