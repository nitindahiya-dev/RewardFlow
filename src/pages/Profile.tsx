// src/pages/Profile.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, PageContainer, MFAVerification } from '../components/common';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUserProfile, updateUserProfile } from '../store/slices/userSlice';
import { useToast } from '../components/common/Toast';
import { API_ENDPOINTS } from '../config/api';

const ProfileContainer = styled(PageContainer)`
  max-width: 600px;
`;

const ProfileCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text};
`;

const UserEmail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const QRCodeImage = styled.img`
  max-width: 200px;
  margin: ${({ theme }) => theme.spacing.md} auto;
  display: block;
`;

const SecretKey = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary || '#f5f5f5'};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: monospace;
  text-align: center;
  word-break: break-all;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const StatusBadge = styled.span<{ enabled: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  background: ${({ enabled, theme }) => enabled ? '#10B981' : '#EF4444'};
  color: white;
`;

export const Profile = () => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  
  const { user, token } = useAppSelector((state) => state.auth);
  const { profile, isLoading, error } = useAppSelector((state) => state.user);
  const { showToast } = useToast();
  
  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSetupMode, setMfaSetupMode] = useState(false);
  const [mfaQRCode, setMfaQRCode] = useState<string | null>(null);
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [mfaVerifying, setMfaVerifying] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);

  // Fetch user profile when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
      fetchMFAStatus();
    }
  }, [dispatch, user?.id]);

  // Initialize form data from Redux store when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
      });
    } else if (user) {
      // Fallback to auth user data if profile doesn't exist
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: '',
      });
    }
  }, [profile, user]);

  const fetchMFAStatus = async () => {
    // This would typically come from user profile API
    // For now, we'll check it when setting up
  };

  const handleMFASetup = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.MFA_SETUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup MFA');
      }

      const data = await response.json();
      setMfaQRCode(data.qrCode);
      setMfaSecret(data.secret);
      setMfaSetupMode(true);
      setMfaError(null);
    } catch (error: any) {
      setMfaError(error.message);
      showToast(error.message, 'error');
    }
  };

  const handleMFAVerify = async (code: string) => {
    if (!user?.id || !mfaSecret) return;
    
    setMfaVerifying(true);
    setMfaError(null);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.MFA_VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          code,
          secret: mfaSecret,
          action: 'setup',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'MFA verification failed');
      }

      setMfaEnabled(true);
      setMfaSetupMode(false);
      setMfaQRCode(null);
      setMfaSecret(null);
      showToast('MFA enabled successfully!', 'success');
    } catch (error: any) {
      setMfaError(error.message);
      showToast(error.message, 'error');
    } finally {
      setMfaVerifying(false);
    }
  };

  const handleMFADisable = async () => {
    if (!user?.id) return;
    
    // For disabling, we need to verify the code first
    // This would typically show a verification modal
    const code = prompt('Enter your 6-digit code to disable MFA:');
    if (!code) return;

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.MFA_DISABLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disable MFA');
      }

      setMfaEnabled(false);
      showToast('MFA disabled successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await dispatch(updateUserProfile({
        userId: user.id,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
      })).unwrap();
      
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      showToast(error || 'Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data from Redux store
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: '',
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display values (use formData if editing, otherwise use profile/user)
  const displayName = isEditing ? formData.name : (profile?.name || user?.name || '');
  const displayEmail = isEditing ? formData.email : (profile?.email || user?.email || '');

  if (isLoading && !profile) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading profile...
            </div>
          </CardBody>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardBody>
          {error && (
            <div style={{ 
              padding: '1rem', 
              marginBottom: '1rem', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: '4px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}
          <ProfileHeader>
            <Avatar>{getInitials(displayName || 'User')}</Avatar>
            <UserInfo>
              <UserName>{displayName || 'User'}</UserName>
              <UserEmail>{displayEmail || 'No email'}</UserEmail>
            </UserInfo>
          </ProfileHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <Input
                type="text"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself"
              />
            </FormGroup>
            {isEditing ? (
              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </ButtonGroup>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Form>
        </CardBody>
      </ProfileCard>

      {/* MFA Settings Card */}
      <ProfileCard>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ marginBottom: '1rem' }}>
            <StatusBadge enabled={mfaEnabled}>
              {mfaEnabled ? 'Enabled' : 'Disabled'}
            </StatusBadge>
          </div>

          {mfaSetupMode && mfaQRCode && mfaSecret ? (
            <div>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <QRCodeImage src={mfaQRCode} alt="MFA QR Code" />
              <p style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                Or enter this code manually:
              </p>
              <SecretKey>{mfaSecret}</SecretKey>
              
              <MFAVerification
                userId={user?.id || ''}
                onVerify={handleMFAVerify}
                onCancel={() => {
                  setMfaSetupMode(false);
                  setMfaQRCode(null);
                  setMfaSecret(null);
                }}
                isLoading={mfaVerifying}
                error={mfaError}
                title="Verify Setup"
                instructions="Enter the 6-digit code from your authenticator app to complete setup"
              />
            </div>
          ) : (
            <div>
              {mfaEnabled ? (
                <Button variant="outline" onClick={handleMFADisable}>
                  Disable MFA
                </Button>
              ) : (
                <Button onClick={handleMFASetup}>
                  Enable MFA
                </Button>
              )}
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                {mfaEnabled 
                  ? 'Your account is protected with two-factor authentication.'
                  : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
              </p>
            </div>
          )}
        </CardBody>
      </ProfileCard>
    </ProfileContainer>
  );
};



