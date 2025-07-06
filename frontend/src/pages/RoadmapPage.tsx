import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">Select a project</h2>
          <p className="text-base-content/60">Choose a project from the sidebar to view roadmap</p>
        </div>
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
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Development Roadmap Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          🗺️ Development Roadmap {roadmap && '(Has Content)'}
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60">Project timeline from inception to deployment</p>
            <div className="flex space-x-2">
              {isEditingRoadmap ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRoadmap}
                    className="btn btn-primary btn-sm"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingRoadmap(true)}
                  className="btn btn-outline btn-sm"
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
              className="textarea textarea-bordered w-full h-64 resize-none"
              placeholder="Enter your development roadmap here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300 ">
              {roadmap ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {roadmap}
                </div>
              ) : (
                <div className="text-base-content/60 italic">
                  No roadmap defined yet. Click Edit to add your development timeline.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Current Tech Stack Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          🔧 Current Technology Stack
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-lg">Frontend</h4>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-info/10 rounded-lg border border-info/20">
                  <span className="text-2xl mr-3">⚛️</span>
                  <div>
                    <div className="font-medium">React 18</div>
                    <div className="text-sm text-base-content/60">UI Library</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-info/10 rounded-lg border border-info/20">
                  <span className="text-2xl mr-3">🔷</span>
                  <div>
                    <div className="font-medium">TypeScript</div>
                    <div className="text-sm text-base-content/60">Type Safety</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <span className="text-2xl mr-3">🎨</span>
                  <div>
                    <div className="font-medium">DaisyUI + Tailwind</div>
                    <div className="text-sm text-base-content/60">Styling</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="text-2xl mr-3">🚀</span>
                  <div>
                    <div className="font-medium">Vite</div>
                    <div className="text-sm text-base-content/60">Build Tool</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-lg">Backend</h4>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-success/10 rounded-lg border border-success/20">
                  <span className="text-2xl mr-3">🟢</span>
                  <div>
                    <div className="font-medium">Node.js</div>
                    <div className="text-sm text-base-content/60">Runtime</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-primary/10 rounded-lg border border-neutral/20">
                  <span className="text-2xl mr-3">🚂</span>
                  <div>
                    <div className="font-medium">Express.js</div>
                    <div className="text-sm text-base-content/60">Web Framework</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-success/10 rounded-lg border border-success/20">
                  <span className="text-2xl mr-3">🍃</span>
                  <div>
                    <div className="font-medium">MongoDB</div>
                    <div className="text-sm text-base-content/60">Database</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <span className="text-2xl mr-3">🔐</span>
                  <div>
                    <div className="font-medium">JWT</div>
                    <div className="text-sm text-base-content/60">Authentication</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Phases Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          📋 Development Phases
        </div>
        <div className="collapse-content">
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-success-content font-bold text-sm">
                ✓
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-success">Phase 1: Foundation</h4>
                <p className="text-success/80 text-sm">Basic authentication, project CRUD, initial UI</p>
              </div>
              <span className="badge badge-success">Completed</span>
            </div>

            <div className="flex items-center p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center text-info-content font-bold text-sm">
                2
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-info">Phase 2: Enhanced Features</h4>
                <p className="text-info/80 text-sm">Todo management, dev logs, enhanced documentation</p>
              </div>
              <span className="badge badge-info">In Progress</span>
            </div>

            <div className="flex items-center p-4 bg-base-200 border border-base-300 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-base-300 rounded-full flex items-center justify-center text-base-content font-bold text-sm">
                3
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold">Phase 3: Advanced Features</h4>
                <p className="text-base-content/60 text-sm">File uploads, real-time collaboration, mobile app</p>
              </div>
              <span className="badge badge-ghost">Planned</span>
            </div>

            <div className="flex items-center p-4 bg-base-200 border border-base-300 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-base-300 rounded-full flex items-center justify-center text-base-content font-bold text-sm">
                4
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold">Phase 4: Deployment & Scaling</h4>
                <p className="text-base-content/60 text-sm">Production deployment, monitoring, performance optimization</p>
              </div>
              <span className="badge badge-ghost">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Planned Additions Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          🚀 Planned Tech Stack Additions
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Performance & Scaling</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-error rounded-full mr-3"></div>
                  <span>Redis (caching, sessions)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-info rounded-full mr-3"></div>
                  <span>AWS S3 (file storage)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <span>Elasticsearch (search)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                  <span>SendGrid (email service)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Mobile & Desktop</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-info rounded-full mr-3"></div>
                  <span>React Native (mobile app)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-neutral rounded-full mr-3"></div>
                  <span>Electron (desktop app)</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
                  <span>PWA capabilities</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  <span>Offline sync</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;