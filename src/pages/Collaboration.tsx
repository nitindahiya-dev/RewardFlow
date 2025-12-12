// src/pages/Collaboration.tsx
import styled from 'styled-components';
import { PageContainer, Card, CardHeader, CardTitle, CardBody, AppFooter, UsersIcon } from '../components/common';

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

export const Collaboration = () => {
  return (
    <PageWrapper>
      <FeaturePageContainer>
        <FeatureCard>
        <CardHeader>
          <FeatureIcon><UsersIcon size={64} /></FeatureIcon>
          <FeatureTitle>Real-Time Collaboration</FeatureTitle>
          <FeatureDescription>
            Work together in real-time with live updates, comments, and collaborative editing.
            Keep your team in sync and boost productivity.
          </FeatureDescription>
        </CardHeader>
        <CardBody>
          <SectionTitle>Collaboration Features</SectionTitle>
          <FeatureList>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Real-Time Updates - See changes instantly as team members work
            </FeatureItem>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Live Comments - Discuss tasks with threaded comments
            </FeatureItem>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Collaborative Editing - Multiple users can edit tasks simultaneously
            </FeatureItem>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Presence Indicators - See who's viewing or editing tasks
            </FeatureItem>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Activity Feed - Track all team activity in one place
            </FeatureItem>
            <FeatureItem>
              <UsersIcon size={20} color="currentColor" />
              Notifications - Get notified about mentions, assignments, and updates
            </FeatureItem>
          </FeatureList>

          <SectionTitle>Team Management</SectionTitle>
          <Text>
            Invite team members, assign tasks, and collaborate seamlessly. Set up teams, manage permissions,
            and track progress across projects. Our real-time collaboration features ensure everyone stays
            on the same page, no matter where they are.
          </Text>

          <SectionTitle>How It Works</SectionTitle>
          <Text>
            When you assign a task to a team member, they receive instant notifications. All changes are
            synchronized in real-time using WebSocket technology, so everyone sees updates immediately.
            You can leave comments, mention team members, and collaborate on tasks just like you would
            in person, but from anywhere in the world.
          </Text>
        </CardBody>
      </FeatureCard>
      </FeaturePageContainer>
      <AppFooter />
    </PageWrapper>
  );
};

