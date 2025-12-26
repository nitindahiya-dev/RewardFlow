import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { Header, HeaderContent, Logo, Nav, NavLink, ProfileIconContainer, ProfileIcon, ProtectedRoute, Button, BottomNav, BottomNavTasksIcon, BottomNavMyTasksIcon, BottomNavProfileIcon, BottomNavDetailsIcon, BottomNavHomeIcon, BottomNavLoginIcon, BottomNavSignUpIcon, InstallPrompt } from './components/common';
import {
  Landing,
  Login,
  Signup,
  Profile,
  Tasks,
  PublicTasks,
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
import { fetchUserProfile } from './store/slices/userSlice';
import { useToast, ToastProvider } from './components/common/Toast';
import { realtimeService } from './services/realtimeService';
import { useEffect } from 'react';
import * as React from 'react';

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
      radial-gradient(circle at 20% 50%, rgba(133, 64, 157, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(238, 167, 39, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const AppContent = styled.div`
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
  padding-bottom: 80px; /* Space for bottom nav on mobile */

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-bottom: 0;
  }
`;

const LogoutButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(133, 64, 157, 0.3);
  }
`;

const AppHeader = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user?.id && !profile) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [isAuthenticated, user?.id, profile, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    showToast('Logged out successfully', 'info');
    navigate('/');
  };

  const avatarUrl = profile?.avatarUrl;
  const userName = profile?.name || user?.name;

  return (
    <Header>
      <HeaderContent>
        <Logo to="/" />
        <ProfileIconContainer>
          {isAuthenticated ? (
            <>
              <Nav>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/my-tasks">My Tasks</NavLink>
                <NavLink to="/user-details">User Details</NavLink>
              </Nav>
              <ProfileIcon to="/profile" title="View Profile" avatarUrl={avatarUrl} userName={userName} />
              <LogoutButton variant="outline" onClick={handleLogout}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <Nav>
              <NavLink to="/tasks">Tasks</NavLink>
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
      <Route path="/tasks" element={<PublicTasks />} />
      <Route
        path="/my-tasks"
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

// Initialize WebSocket connection when app starts
const AppInitializer = () => {
  useEffect(() => {
    // Connect to WebSocket server
    realtimeService.connect();

    // Cleanup on unmount
    return () => {
      realtimeService.disconnect();
    };
  }, []);

  return null;
};

const AppWithBottomNav = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Bottom navigation links
  const bottomNavLinks = isAuthenticated
    ? [
        { to: '/tasks', label: 'Tasks', icon: <BottomNavTasksIcon size={24} /> },
        { to: '/my-tasks', label: 'My Tasks', icon: <BottomNavMyTasksIcon size={24} /> },
        { to: '/profile', label: 'Profile', icon: <BottomNavProfileIcon size={24} /> },
        { to: '/user-details', label: 'Details', icon: <BottomNavDetailsIcon size={24} /> },
      ]
    : [
        { to: '/', label: 'Home', icon: <BottomNavHomeIcon size={24} /> },
        { to: '/tasks', label: 'Tasks', icon: <BottomNavTasksIcon size={24} /> },
        { to: '/login', label: 'Login', icon: <BottomNavLoginIcon size={24} /> },
        { to: '/signup', label: 'Sign Up', icon: <BottomNavSignUpIcon size={24} /> },
      ];

  return (
    <>
      <AppHeader />
      <AppContent>
        <AppRoutes />
      </AppContent>
      <BottomNav links={bottomNavLinks} />
      <InstallPrompt />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <AppInitializer />
          <Router>
            <AppContainer>
              <AppWithBottomNav />
            </AppContainer>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;



