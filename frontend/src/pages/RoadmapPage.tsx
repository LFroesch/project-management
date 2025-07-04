import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';
import CollapsibleSection from '../components/CollapsibleSection';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
}

const RoadmapPage: React.FC = () => {
  const { selectedProject, onProjectUpdate } = useOutletContext<ContextType>();
  const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setRoadmap(selectedProject.roadmap || '');
    }
  }, [selectedProject]);

  const handleSaveRoadmap = async () => {
    if (!selectedProject) return;

    setSaving(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, { roadmap });
      setIsEditingRoadmap(false);
    } catch (err) {
      setError('Failed to save roadmap');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setRoadmap(selectedProject?.roadmap || '');
    setIsEditingRoadmap(false);
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view roadmap
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Roadmap & Stack
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Development Roadmap Section */}
      <CollapsibleSection title="Development Roadmap" defaultOpen={true}>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Project timeline from inception to deployment</p>
            <div className="flex space-x-2">
              {isEditingRoadmap ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRoadmap}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingRoadmap(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          
          {isEditingRoadmap ? (
            <textarea
              value={roadmap}
              onChange={(e) => setRoadmap(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your development roadmap here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {roadmap || 'No roadmap defined yet...'}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Current Tech Stack Section */}
      <CollapsibleSection title="Current Technology Stack" defaultOpen={true}>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Frontend</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-blue-50 rounded">
                  <span className="text-2xl mr-3">⚛️</span>
                  <div>
                    <div className="font-medium">React 18</div>
                    <div className="text-sm text-gray-600">UI Library</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded">
                  <span className="text-2xl mr-3">🔷</span>
                  <div>
                    <div className="font-medium">TypeScript</div>
                    <div className="text-sm text-gray-600">Type Safety</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-cyan-50 rounded">
                  <span className="text-2xl mr-3">🎨</span>
                  <div>
                    <div className="font-medium">Tailwind CSS</div>
                    <div className="text-sm text-gray-600">Styling</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-purple-50 rounded">
                  <span className="text-2xl mr-3">🚀</span>
                  <div>
                    <div className="font-medium">Vite</div>
                    <div className="text-sm text-gray-600">Build Tool</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Backend</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <span className="text-2xl mr-3">🟢</span>
                  <div>
                    <div className="font-medium">Node.js</div>
                    <div className="text-sm text-gray-600">Runtime</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="text-2xl mr-3">🚂</span>
                  <div>
                    <div className="font-medium">Express.js</div>
                    <div className="text-sm text-gray-600">Web Framework</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <span className="text-2xl mr-3">🍃</span>
                  <div>
                    <div className="font-medium">MongoDB</div>
                    <div className="text-sm text-gray-600">Database</div>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-orange-50 rounded">
                  <span className="text-2xl mr-3">🔐</span>
                  <div>
                    <div className="font-medium">JWT</div>
                    <div className="text-sm text-gray-600">Authentication</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Development Phases Section */}
      <CollapsibleSection title="Development Phases">
        <div className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-green-800">Phase 1: Foundation</h4>
                <p className="text-green-600 text-sm">Basic authentication, project CRUD, initial UI</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>

            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-blue-800">Phase 2: Enhanced Features</h4>
                <p className="text-blue-600 text-sm">Todo management, dev logs, enhanced documentation</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">In Progress</span>
            </div>

            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-gray-800">Phase 3: Advanced Features</h4>
                <p className="text-gray-600 text-sm">File uploads, real-time collaboration, mobile app</p>
              </div>
              <span className="text-gray-600 text-sm font-medium">Planned</span>
            </div>

            <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-gray-800">Phase 4: Deployment & Scaling</h4>
                <p className="text-gray-600 text-sm">Production deployment, monitoring, performance optimization</p>
              </div>
              <span className="text-gray-600 text-sm font-medium">Future</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Planned Additions Section */}
      <CollapsibleSection title="Planned Tech Stack Additions">
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Performance & Scaling</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Redis (caching, sessions)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  AWS S3 (file storage)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Elasticsearch (search)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  SendGrid (email service)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Mobile & Desktop</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  React Native (mobile app)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                  Electron (desktop app)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  PWA capabilities
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Offline sync
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default RoadmapPage;