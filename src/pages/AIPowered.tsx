// src/pages/AIPowered.tsx
import styled from 'styled-components';
import { PageContainer, Card, CardHeader, CardTitle, CardBody, AppFooter, AIIcon } from '../components/common';

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
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const AIPowered = () => {
  return (
    <PageWrapper>
      <FeaturePageContainer>
        <FeatureCard>
          <CardHeader>
            <FeatureIcon><AIIcon size={64} /></FeatureIcon>
            <FeatureTitle>AI-Powered Features</FeatureTitle>
            <FeatureDescription>
              Get smart task suggestions, auto-categorization, and intelligent prioritization
              powered by advanced artificial intelligence.
            </FeatureDescription>
          </CardHeader>
          <CardBody>
            <SectionTitle>AI Capabilities</SectionTitle>
            <FeatureList>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Smart Task Suggestions - AI analyzes your patterns and suggests relevant tasks
              </FeatureItem>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Auto-Categorization - Automatically organize tasks into categories
              </FeatureItem>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Intelligent Prioritization - AI helps prioritize tasks based on deadlines and importance
              </FeatureItem>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Natural Language Processing - Create tasks using natural language
              </FeatureItem>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Predictive Analytics - Forecast task completion times and identify bottlenecks
              </FeatureItem>
              <FeatureItem>
                <AIIcon size={20} color="currentColor" />
                Personalized Recommendations - Get tailored suggestions based on your work style
              </FeatureItem>
            </FeatureList>

            <SectionTitle>How It Works</SectionTitle>
            <Text>
              Our AI system uses machine learning algorithms to understand your work patterns, preferences,
              and productivity habits. It analyzes your task history, completion rates, and time management
              to provide intelligent suggestions and automate routine tasks. The more you use RewardFlow,
              the smarter it becomes at helping you stay productive.
            </Text>

            <SectionTitle>Privacy & Security</SectionTitle>
            <Text>
              All AI processing is done with your privacy in mind. Your data is encrypted and never shared
              with third parties. The AI models run locally when possible, and all cloud processing follows
              strict security protocols to protect your information.
            </Text>
          </CardBody>
        </FeatureCard>
      </FeaturePageContainer>
      <AppFooter />
    </PageWrapper>
  );
};

