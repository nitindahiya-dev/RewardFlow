// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { Header, HeaderContent, Logo, Nav, NavLink, ProfileIconContainer, ProfileIcon, ProtectedRoute, Button } from './components/common';
import {
  Landing,
  Login,
  Signup,
  Profile,
  Tasks,
  UserDetails,
  Web3Integration,
  AIPowered,
  Collaboration,
  Analytics,
  Documentation,
  APIReference,
  Support,
  Blog,
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  NotFound,
} from './pages';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { logout } from './store/slices/authSlice';
import { useToast, ToastProvider } from './components/common/Toast';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.gradients.background};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const AppContent = styled.div`
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
`;

const LogoutButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const AppHeader = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <Header>
      <HeaderContent>
        <Logo to="/">Reward Flow</Logo>
        <ProfileIconContainer>
          {isAuthenticated ? (
            <>
              <Nav>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/user-details">User Details</NavLink>
              </Nav>
              <ProfileIcon to="/profile" title="View Profile" />
              <LogoutButton variant="outline" onClick={handleLogout}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <Nav>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </Nav>
          )}
        </ProfileIconContainer>
      </HeaderContent>
    </Header>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-details"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      {/* Feature Pages */}
      <Route path="/web3-integration" element={<Web3Integration />} />
      <Route path="/ai-powered" element={<AIPowered />} />
      <Route path="/collaboration" element={<Collaboration />} />
      <Route path="/analytics" element={<Analytics />} />
      {/* Resource Pages */}
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/api-reference" element={<APIReference />} />
      <Route path="/support" element={<Support />} />
      <Route path="/blog" element={<Blog />} />
      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      {/* 404 Page - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Router>
            <AppContainer>
              <AppHeader />
              <AppContent>
                <AppRoutes />
              </AppContent>
            </AppContainer>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;



