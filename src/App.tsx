import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DemoRequestPage from './pages/DemoRequestPage';
import Onboarding from './pages/Onboarding';
import BusinessVault from './pages/BusinessVault';
import Agents from './pages/Agents';
import Profile from './pages/Profile';
import Chatbots from './pages/Chatbots';
import PublicChatbot from './pages/PublicChatbot';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/business" element={<ProtectedRoute><BusinessVault /></ProtectedRoute>} />
          <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
          <Route path="/chatbots" element={<ProtectedRoute><Chatbots /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/demo-request" element={<DemoRequestPage />} />
          {/* Public chatbot routes */}
          <Route path="/chat/:chatbotId" element={<PublicChatbot />} />
          <Route path="/embed/:chatbotId" element={<PublicChatbot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;