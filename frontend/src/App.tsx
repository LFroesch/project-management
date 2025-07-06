import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import CreateProject from './pages/CreateProject';
import NotesPage from './pages/NotesPage';
import RoadmapPage from './pages/RoadmapPage';
import DocsPage from './pages/DocsPage';
import SettingsPage from './pages/SettingsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    // Apply saved theme on app load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/notes" />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;