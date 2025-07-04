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

  const loadProjects = async () => {
    try {
      const projectsResponse = await projectAPI.getAll();
      console.log('Projects loaded:', projectsResponse.projects);
      setProjects(projectsResponse.projects);
      
      // If we have a selected project, update it with fresh data
      if (selectedProject) {
        const updatedProject = projectsResponse.projects.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
      } else if (projectsResponse.projects.length > 0) {
        // Default to first non-archived project
        const activeProjects = projectsResponse.projects.filter(p => !p.isArchived);
        if (activeProjects.length > 0) {
          setSelectedProject(activeProjects[0]);
        } else {
          setSelectedProject(projectsResponse.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userResponse, projectsResponse] = await Promise.all([
          authAPI.getMe(),
          projectAPI.getAll()
        ]);
        setUser(userResponse.user);
        setProjects(projectsResponse.projects);
        console.log('Initial projects:', projectsResponse.projects);
        if (projectsResponse.projects.length > 0) {
          // Default to first non-archived project
          const activeProjects = projectsResponse.projects.filter(p => !p.isArchived);
          if (activeProjects.length > 0) {
            setSelectedProject(activeProjects[0]);
          } else {
            setSelectedProject(projectsResponse.projects[0]);
          }
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

  const handleProjectUpdate = async (projectId: string, updatedData: any) => {
    try {
      console.log('Updating project:', projectId, updatedData);
      
      if (!projectId || projectId === 'undefined') {
        throw new Error('Invalid project ID');
      }

      const response = await projectAPI.update(projectId, updatedData);
      console.log('Update response:', response);
      // Refresh the projects list to get the updated data
      await loadProjects();
      return response;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const handleProjectArchive = async (projectId: string, isArchived: boolean) => {
    try {
      await projectAPI.archive(projectId, isArchived);
      // Refresh projects list
      await loadProjects();
      // Keep the same project selected after archiving/unarchiving
      // The loadProjects function will update the selectedProject with fresh data
    } catch (error) {
      console.error('Failed to archive project:', error);
      throw error;
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      await projectAPI.delete(projectId);
      // Refresh projects list
      await loadProjects();
      // If we deleted the selected project, clear selection
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
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

  // Separate projects by archive status
  const currentProjects = projects.filter(p => !p.isArchived);
  const archivedProjects = projects.filter(p => p.isArchived);
  const sharedProjects = projects.filter(p => p.isShared);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      
      {/* Fixed Header */}
      <nav className="bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Project Manager</h1>
          </div>
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
              {currentProjects.length === 0 ? (
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
                currentProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      console.log('Selecting project:', project);
                      setSelectedProject(project);
                    }}
                    className={`flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Archived Projects */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Old</h3>
            <div className="space-y-2">
              {archivedProjects.length === 0 ? (
                <div className="text-sm text-gray-500 italic pl-2">
                  No archived projects
                </div>
              ) : (
                archivedProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      console.log('Selecting archived project:', project);
                      setSelectedProject(project);
                    }}
                    className={`flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-600">{project.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Archived Projects */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Shared</h3>
            <div className="space-y-2">
              {sharedProjects.length === 0 ? (
                <div className="text-sm text-gray-500 italic pl-2">
                  No shared projects
                </div>
              ) : (
                sharedProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      console.log('Selecting shared project:', project);
                      setSelectedProject(project);
                    }}
                    className={`flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-600">{project.name}</span>
                  </div>
                ))
              )}
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
            <Outlet context={{ 
              selectedProject, 
              onProjectUpdate: handleProjectUpdate,
              onProjectArchive: handleProjectArchive,
              onProjectDelete: handleProjectDelete 
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;