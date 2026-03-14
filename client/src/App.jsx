import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import Home from './pages/Public/Home';
import HowItWorks from './pages/Public/HowItWorks';
import AuthPage from './pages/Public/AuthPage';

// Authenticated Pages
import Dashboard from './pages/Authenticated/Dashboard';
import FindFriends from './pages/Authenticated/FindFriends';
import MyGroups from './pages/Authenticated/MyGroups';
import Notifications from './pages/Authenticated/Notifications';
import Profile from './pages/Authenticated/Profile';
import Onboarding from './pages/Authenticated/Onboarding';

const socket = io('http://localhost:5001');

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300">
            <Navbar isConnected={isConnected} />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/find-friends" element={<FindFriends />} />
                <Route path="/my-groups" element={<MyGroups />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
