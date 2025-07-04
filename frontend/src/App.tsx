import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import CreateProject from './pages/CreateProject';
import NotesPage from './pages/NotesPage';
import RoadmapPage from './pages/RoadmapPage';
import StackPage from './pages/StackPage';
import DocsPage from './pages/DocsPage';
import EtcPage from './pages/EtcPage';
import SettingsPage from './pages/SettingsPage';


const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/notes" />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="stack" element={<StackPage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="etc" element={<EtcPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;