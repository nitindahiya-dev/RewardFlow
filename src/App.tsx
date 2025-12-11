// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { Header, HeaderContent, Logo, Nav, NavLink, ProfileIconContainer, ProfileIcon } from './components/common';
import { Login, Signup, Profile, Tasks, UserDetails } from './pages';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const AppContent = styled.div`
  min-height: calc(100vh - 80px);
`;

function App() {
  // TODO: Get auth state from Redux
  const isAuthenticated = false; // This will come from Redux

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContainer>
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
                      <ProfileIcon to="/user-details" title="View Profile" />
                    </>
                  ) : (
                    <>
                      <Nav>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signup">Sign Up</NavLink>
                      </Nav>
                      <ProfileIcon to="/user-details" title="View Profile" />
                    </>
                  )}
                </ProfileIconContainer>
              </HeaderContent>
            </Header>
            <AppContent>
              <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-details" element={<UserDetails />} />
              </Routes>
            </AppContent>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;



