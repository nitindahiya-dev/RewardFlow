// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Container, PageContainer, ConnectWallet, MFAVerification } from '../components/common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, verifyMFA, resetMFAState } from '../store/slices/authSlice';
import { useToast } from '../components/common/Toast';

const LoginContainer = styled(PageContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.fontWeight.semibold};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, mfaRequired, mfaUserId, mfaError } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/tasks';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser(formData));
    
    if (loginUser.fulfilled.match(result)) {
      // Check if MFA is required
      if (result.payload.mfaRequired) {
        // MFA verification screen will be shown
        return;
      }
      
      // Normal login success
      showToast('Login successful! Welcome back.', 'success');
      navigate(from, { replace: true });
    }
  };

  const handleMFAVerify = async (code: string) => {
    if (!mfaUserId) return;
    
    const result = await dispatch(verifyMFA({ userId: mfaUserId, code }));
    
    if (verifyMFA.fulfilled.match(result)) {
      showToast('MFA verification successful! Welcome back.', 'success');
      navigate(from, { replace: true });
    }
  };

  const handleMFACancel = () => {
    dispatch(resetMFAState());
  };

  // Show MFA verification screen if MFA is required
  if (mfaRequired && mfaUserId) {
    return (
      <LoginContainer>
        <MFAVerification
          userId={mfaUserId}
          onVerify={handleMFAVerify}
          onCancel={handleMFACancel}
          isLoading={isLoading}
          error={mfaError}
          title="Two-Factor Authentication"
          instructions="Enter the 6-digit code from your authenticator app"
        />
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </FormGroup>
            {error && (
              <FormGroup>
                <span style={{ color: '#E74C3C', fontSize: '0.875rem' }}>
                  {error}
                </span>
              </FormGroup>
            )}
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Divider>
              <span>or</span>
            </Divider>
            <ConnectWallet
              variant="outline"
              fullWidth
              onSuccess={() => {
                navigate(from, { replace: true });
              }}
            />
            <LinkText>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </LinkText>
          </Form>
        </CardBody>
      </LoginCard>
    </LoginContainer>
  );
};



