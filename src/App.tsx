import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import ProjectsPage from './components/ProjectsPage';
import ResumePage from './components/ResumePage';
import ChatPage from './components/ChatPage';
import ProjectsAdmin from './components/admin/ProjectsAdmin';
import AdminLogin from './components/admin/AdminLogin';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { IRCProvider } from './contexts/IRCContext';

const Navigation: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser, loading, signOut } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on an admin page
  const isAdminPage = location.pathname === '/admin';

  // Handle admin toggle
  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      navigate('/');
    } else {
      setIsAdmin(true);
      navigate('/admin');
    }
  };

  return (
    <nav className="bg-white shadow px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <h1>Daniel du Pré</h1>
        </Link>
        <div className="flex items-center">
          <Link 
            to="/projects"
            className={`mr-4 ${location.pathname === '/projects' || location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
          >
            Projects
          </Link>
          <Link 
            to="/resume"
            className={`mr-4 ${location.pathname === '/resume' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
          >
            Resume
          </Link>
          <Link 
            to="/chat"
            className={`mr-6 ${location.pathname === '/chat' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
          >
            Chat
          </Link>
        </div>
        <div className="flex items-center">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser.email}</span>
              <button 
                onClick={handleAdminToggle}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                {isAdmin ? 'View Portfolio' : 'Admin Panel'}
              </button>
              <button 
                onClick={signOut}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, loading } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for redirect path in session storage or URL on component mount
  useEffect(() => {
    // Check for session storage redirect
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      // Clear the redirect from session storage
      sessionStorage.removeItem('redirect');
      // Navigate to the stored path
      navigate(redirectPath);
      return;
    }

    // Check for URL query parameter redirect (from 404.html)
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) {
      // Navigate to the path from the query parameter
      navigate(redirectParam);
      // Clean up the URL by removing the query parameter
      window.history.replaceState(null, '', redirectParam);
    }
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <Navigation />
      
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route 
          path="/admin" 
          element={currentUser ? <ProjectsAdmin /> : <AdminLogin onLoginSuccess={() => {}} />} 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <FirebaseProvider>
      <IRCProvider>
        <AppContent />
      </IRCProvider>
    </FirebaseProvider>
  );
}

export default App;
