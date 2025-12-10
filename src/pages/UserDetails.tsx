// src/pages/UserDetails.tsx
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardBody, PageContainer } from '../components/common';

const UserDetailsContainer = styled(PageContainer)`
  max-width: 1000px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const LargeAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const UserName = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text};
`;

const UserEmail = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const UserBio = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  max-width: 600px;
  line-height: 1.6;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InfoCard = styled(Card)`
  height: 100%;
`;

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight || theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

export const UserDetails = () => {
  // TODO: Get user data from Redux
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer passionate about building great applications. Love working with React, Redux, and modern web technologies.',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinDate: 'January 15, 2024',
    lastActive: '2 hours ago',
    role: 'Developer',
    company: 'Tech Corp',
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 6,
    accountStatus: 'Active',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <UserDetailsContainer>
      <HeaderSection>
        <LargeAvatar>{getInitials(userData.name)}</LargeAvatar>
        <UserName>{userData.name}</UserName>
        <UserEmail>{userData.email}</UserEmail>
        {userData.bio && <UserBio>{userData.bio}</UserBio>}
      </HeaderSection>

      <CardsGrid>
        <InfoCard>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardBody>
            <InfoSection>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{userData.name}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Email Address</InfoLabel>
              <InfoValue>{userData.email}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Phone Number</InfoLabel>
              <InfoValue>{userData.phone}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{userData.location}</InfoValue>
            </InfoSection>
            {userData.website && (
              <InfoSection>
                <InfoLabel>Website</InfoLabel>
                <InfoValue>
                  <a
                    href={userData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4A90E2',
                      textDecoration: 'none',
                    }}
                  >
                    {userData.website}
                  </a>
                </InfoValue>
              </InfoSection>
            )}
          </CardBody>
        </InfoCard>

        <InfoCard>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardBody>
            <InfoSection>
              <InfoLabel>Role</InfoLabel>
              <InfoValue>{userData.role}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Company</InfoLabel>
              <InfoValue>{userData.company}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Account Status</InfoLabel>
              <InfoValue>
                <span
                  style={{
                    color: '#50C878',
                    fontWeight: 600,
                  }}
                >
                  {userData.accountStatus}
                </span>
              </InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{userData.joinDate}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Last Active</InfoLabel>
              <InfoValue>{userData.lastActive}</InfoValue>
            </InfoSection>
          </CardBody>
        </InfoCard>
      </CardsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardBody>
          <StatsGrid>
            <StatItem>
              <StatValue>{userData.totalTasks}</StatValue>
              <StatLabel>Total Tasks</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.completedTasks}</StatValue>
              <StatLabel>Completed</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{userData.pendingTasks}</StatValue>
              <StatLabel>Pending</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {userData.totalTasks > 0
                  ? Math.round((userData.completedTasks / userData.totalTasks) * 100)
                  : 0}
                %
              </StatValue>
              <StatLabel>Completion Rate</StatLabel>
            </StatItem>
          </StatsGrid>
        </CardBody>
      </Card>

      <Divider />

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardBody>
          <InfoSection>
            <InfoLabel>Bio</InfoLabel>
            <InfoValue style={{ lineHeight: '1.8', marginTop: '8px' }}>{userData.bio}</InfoValue>
          </InfoSection>
        </CardBody>
      </Card>
    </UserDetailsContainer>
  );
};

