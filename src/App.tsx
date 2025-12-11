// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { Header, HeaderContent, Logo, Nav, NavLink, ProfileIconContainer, ProfileIcon, ProtectedRoute } from './components/common';
import { Landing, Login, Signup, Profile, Tasks, UserDetails } from './pages';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './store/hooks';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const AppContent = styled.div`
  min-height: calc(100vh - 80px);
`;

const AppHeader = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Header>
      <HeaderContent>
        <Logo to="/">TaskManager</Logo>
        <ProfileIconContainer>
          {isAuthenticated ? (
            <>
              <Nav>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/user-details">User Details</NavLink>
              </Nav>
              <ProfileIcon to="/profile" title="View Profile" />
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
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContainer>
            <AppHeader />
            <AppContent>
              <AppRoutes />
            </AppContent>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;



