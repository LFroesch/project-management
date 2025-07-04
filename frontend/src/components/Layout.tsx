import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authAPI, projectAPI, Project } from '../api/client';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, projectsResponse] = await Promise.all([
          authAPI.getMe(),
          projectAPI.getAll()
        ]);
        setUser(userResponse.user);
        setProjects(projectsResponse.projects);
        if (projectsResponse.projects.length > 0) {
          setSelectedProject(projectsResponse.projects[0]);
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'notes', label: 'notes tab', path: '/notes' },
    { id: 'roadmap', label: 'road map', path: '/roadmap' },
    { id: 'stack', label: 'stack', path: '/stack' },
    { id: 'docs', label: 'docs/api plan', path: '/docs' },
    { id: 'etc', label: 'etc', path: '/etc' },
    { id: 'settings', label: 'settings', path: '/settings' }
  ];

  const currentTab = location.pathname.slice(1) || 'notes';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <nav className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Project Manager</h1>
          <div className="flex items-center space-x-4">
            <span>Hello, {user?.firstName}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Projects */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Current</h3>
            <div className="space-y-2">
              {projects.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">No projects yet</p>
                  <button
                    onClick={() => navigate('/create-project')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Create Project
                  </button>
                </div>
              ) : (
                projects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <span className="text-lg mr-2">
                      {index === 0 ? '🔥' : index === 1 ? '🦄' : index === 2 ? '💎' : '⚡'}
                    </span>
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Old Projects */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Old</h3>
            <div className="pl-6">
              <div className="text-sm text-gray-500 italic">
                No archived projects
              </div>
            </div>
          </div>

          {/* Create Project Button */}
          <div className="mt-auto">
            <button
              onClick={() => navigate('/create-project')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          {selectedProject && (
            <div className="bg-white border-b border-gray-200 flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <Outlet context={{ selectedProject }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;