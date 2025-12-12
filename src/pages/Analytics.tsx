// src/pages/Analytics.tsx
import styled from 'styled-components';
import { PageContainer, Card, CardHeader, CardTitle, CardBody, AppFooter, ChartIcon } from '../components/common';

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

export const Analytics = () => {
  return (
    <PageWrapper>
      <FeaturePageContainer>
        <FeatureCard>
          <CardHeader>
            <FeatureIcon><ChartIcon size={64} /></FeatureIcon>
            <FeatureTitle>Analytics & Insights</FeatureTitle>
            <FeatureDescription>
              Track your productivity, view detailed analytics, and get insights into your work patterns.
              Make data-driven decisions to improve your workflow.
            </FeatureDescription>
          </CardHeader>
          <CardBody>
            <SectionTitle>Analytics Features</SectionTitle>
            <FeatureList>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Task Completion Rates - Track how many tasks you complete over time
              </FeatureItem>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Time Tracking - See how long tasks take and identify time sinks
              </FeatureItem>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Productivity Trends - Visualize your productivity patterns
              </FeatureItem>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Team Performance - Monitor team metrics and collaboration stats
              </FeatureItem>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Custom Reports - Generate detailed reports on your work
              </FeatureItem>
              <FeatureItem>
                <ChartIcon size={20} color="currentColor" />
                Goal Tracking - Set and track productivity goals
              </FeatureItem>
            </FeatureList>

            <SectionTitle>Insights & Recommendations</SectionTitle>
            <Text>
              Our analytics engine analyzes your work patterns and provides actionable insights.
              Discover your most productive times, identify bottlenecks, and get recommendations
              on how to improve your workflow. All insights are presented in easy-to-understand
              visualizations and reports.
            </Text>

            <SectionTitle>Data Privacy</SectionTitle>
            <Text>
              Your analytics data is private and secure. We use aggregated, anonymized data for
              improving our service, but your personal productivity metrics are only visible to you
              and your team members (if you're on a team plan). You can export your data at any time.
            </Text>
          </CardBody>
        </FeatureCard>
      </FeaturePageContainer>
      <AppFooter />
    </PageWrapper>
  );
};

