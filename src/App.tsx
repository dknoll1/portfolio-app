import React, { useState } from 'react';
import './App.css';
import ProjectsPage from './components/ProjectsPage';
import ResumePage from './components/ResumePage';
import ProjectsAdmin from './components/admin/ProjectsAdmin';
import AdminLogin from './components/admin/AdminLogin';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';

const AppContent: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<'projects' | 'resume'>('projects');
  const { currentUser, loading, signOut } = useFirebase();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold flex items-center">
            <h1>Daniel du Pré's Portfolio</h1>
          </a>
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage('projects')}
              className={`mr-4 ${currentPage === 'projects' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setCurrentPage('resume')}
              className={`mr-6 ${currentPage === 'resume' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Resume
            </button>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{currentUser.email}</span>
                <button 
                  onClick={() => setIsAdmin(!isAdmin)}
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
                onClick={() => setIsAdmin(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </nav>
      
      {isAdmin ? (
        currentUser ? <ProjectsAdmin /> : <AdminLogin onLoginSuccess={() => {}} />
      ) : (
        currentPage === 'projects' ? <ProjectsPage /> : <ResumePage />
      )}
    </div>
  );
};

function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}

export default App;
