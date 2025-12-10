// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, Container, PageContainer } from '../components/common';

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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle login with Redux
    console.log('Login:', formData);
    // Navigate to tasks page after login
    navigate('/tasks');
  };

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
                required
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
                required
              />
            </FormGroup>
            <Button type="submit" fullWidth>
              Login
            </Button>
            <LinkText>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </LinkText>
          </Form>
        </CardBody>
      </LoginCard>
    </LoginContainer>
  );
};



