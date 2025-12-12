// src/pages/Support.tsx
import styled from 'styled-components';
import { PageContainer, Card, CardHeader, CardTitle, CardBody, Button, AppFooter, BookIcon, ChatIcon, EmailIcon, BugIcon } from '../components/common';
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
`;

const SupportPageContainer = styled(PageContainer)`
  max-width: 1000px;
  flex: 1;
`;

const SupportCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SupportTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const SupportDescription = styled.p`
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

const SupportOption = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const OptionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const OptionDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Support = () => {
  return (
    <PageWrapper>
      <SupportPageContainer>
        <SupportCard>
        <CardHeader>
          <SupportTitle>Support</SupportTitle>
          <SupportDescription>
            We're here to help! Get the support you need to make the most of RewardFlow.
          </SupportDescription>
        </CardHeader>
        <CardBody>
          <SectionTitle>Get Help</SectionTitle>
          
          <SupportOption>
            <OptionTitle>
              <BookIcon size={24} />
              Documentation
            </OptionTitle>
            <OptionDescription>
              Browse our comprehensive documentation for guides, tutorials, and FAQs.
            </OptionDescription>
            <ButtonGroup>
              <Button as={Link} to="/documentation">View Documentation</Button>
            </ButtonGroup>
          </SupportOption>

          <SupportOption>
            <OptionTitle>
              <ChatIcon size={24} />
              Community Forum
            </OptionTitle>
            <OptionDescription>
              Join our community forum to ask questions, share tips, and connect with other users.
            </OptionDescription>
            <ButtonGroup>
              <Button as="a" href="#" variant="outline">Visit Forum</Button>
            </ButtonGroup>
          </SupportOption>

          <SupportOption>
            <OptionTitle>
              <EmailIcon size={24} />
              Email Support
            </OptionTitle>
            <OptionDescription>
              Contact our support team directly via email. We typically respond within 24 hours.
            </OptionDescription>
            <ButtonGroup>
              <Button as="a" href="mailto:support@rewardflow.com" variant="outline">Email Us</Button>
            </ButtonGroup>
          </SupportOption>

          <SupportOption>
            <OptionTitle>
              <BugIcon size={24} />
              Report a Bug
            </OptionTitle>
            <OptionDescription>
              Found a bug? Let us know so we can fix it. Include as much detail as possible.
            </OptionDescription>
            <ButtonGroup>
              <Button as="a" href="#" variant="outline">Report Bug</Button>
            </ButtonGroup>
          </SupportOption>

          <SectionTitle>Common Questions</SectionTitle>
          <Text>
            <strong>How do I reset my password?</strong><br />
            You can reset your password from the login page by clicking "Forgot Password".
          </Text>
          <Text>
            <strong>How do I connect my crypto wallet?</strong><br />
            Go to your profile settings and click "Connect Wallet". Make sure you have a compatible wallet installed.
          </Text>
          <Text>
            <strong>Can I use RewardFlow offline?</strong><br />
            Currently, RewardFlow requires an internet connection. Offline support is coming soon!
          </Text>

          <SectionTitle>Still Need Help?</SectionTitle>
          <Text>
            If you can't find what you're looking for, don't hesitate to reach out. We're here to help
            you succeed with RewardFlow!
          </Text>
        </CardBody>
      </SupportCard>
      </SupportPageContainer>
      <AppFooter />
    </PageWrapper>
  );
};

