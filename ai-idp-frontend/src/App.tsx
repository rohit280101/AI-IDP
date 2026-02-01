import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>📄</span>
          <span style={styles.logoText}>AI-IDP</span>
        </div>
        <div style={styles.navLinks}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive('/') ? styles.navLinkActive : {}),
            }}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/documents"
                style={{
                  ...styles.navLink,
                  ...(isActive('/documents') ? styles.navLinkActive : {}),
                }}
              >
                Documents
              </Link>
              <Link
                to="/dashboard"
                style={{
                  ...styles.navLink,
                  ...(isActive('/dashboard') ? styles.navLinkActive : {}),
                }}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
        {isAuthenticated && (
          <div style={styles.userMenu}>
            <span style={styles.userGreeting}>{user?.username}</span>
            <button onClick={logout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Always show login and home routes
  // For other routes, check authentication
  const isLoginPage = location.pathname === '/login';

  return (
    <div style={styles.app}>
      <Navigation />
      <main style={styles.main}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Home} />
          <ProtectedRoute path="/documents" component={Documents} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
      {!isLoginPage && (
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            AI-IDP Platform &copy; {new Date().getFullYear()} | Intelligent Document Processing
          </p>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    marginLeft: '40px',
  },
  navLink: {
    padding: '8px 20px',
    textDecoration: 'none',
    color: '#666',
    fontWeight: '500',
    borderRadius: '6px',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userGreeting: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  main: {
    flex: 1,
    paddingTop: '20px',
    paddingBottom: '40px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    marginTop: 'auto',
  },
  footerText: {
    textAlign: 'center',
    margin: 0,
    fontSize: '14px',
  },
};

export default App;