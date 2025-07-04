import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, projectAPI, Project } from '../api/client';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('notes');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'notes', label: 'notes tab' },
    { id: 'roadmap', label: 'road map' },
    { id: 'stack', label: 'stack' },
    { id: 'docs', label: 'docs/api plan' },
    { id: 'etc', label: 'etc' },
    { id: 'settings', label: 'settings' }
  ];

  const renderTabContent = () => {
    if (!selectedProject) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a project to view details
        </div>
      );
    }

    switch (activeTab) {
      case 'notes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Notes</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Project Notes</h3>
              <div className="whitespace-pre-wrap text-gray-700">
                {selectedProject.notes || 'No notes yet...'}
              </div>
            </div>
          </div>
        );
      
      case 'roadmap':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Roadmap</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Development Roadmap</h3>
              <div className="whitespace-pre-wrap text-gray-700">
                {selectedProject.roadmap || 'No roadmap defined yet...'}
              </div>
            </div>
          </div>
        );
      
      case 'stack':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Tech Stack</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Technology Stack</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Frontend:</h4>
                  <p className="text-gray-600">React, TypeScript, Tailwind CSS</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Backend:</h4>
                  <p className="text-gray-600">Node.js, Express, MongoDB</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Tools:</h4>
                  <p className="text-gray-600">Vite, JWT Authentication</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'docs':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Documentation</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">API Documentation & Plans</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">API Endpoints:</h4>
                  <ul className="text-gray-600 ml-4">
                    <li>• POST /api/auth/login</li>
                    <li>• POST /api/auth/register</li>
                    <li>• GET /api/projects</li>
                    <li>• POST /api/projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Documentation Status:</h4>
                  <p className="text-gray-600">In Progress...</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'etc':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Miscellaneous</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Staging Environment:</h4>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Created:</h4>
                  <p className="text-gray-600">{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name} - Settings</h2>
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-3">Project Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Project Info:</h4>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Project Color:</h4>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-600">Red</span>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <nav className="bg-white shadow-sm p-4 flex-shrink-0">
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
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0">
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
                    className={`flex items-center cursor-pointer p-2 rounded ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
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
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 pl-6 cursor-pointer hover:text-gray-800">
                old project A
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
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 overflow-auto bg-gray-50">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;