import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const RoadmapPage: React.FC = () => {
  const { selectedProject } = useOutletContext<ContextType>();

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">Select a project</h2>
          <p className="text-base-content/60">Choose a project from the sidebar to view tech stack and progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Tech Stack & Progress
        </h1>
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

      {/* Project Statistics */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          📊 Project Statistics
        </div>
        <div className="collapse-content">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-title">Documentation Templates</div>
              <div className="stat-value text-primary">{selectedProject.docs?.length || 0}</div>
              <div className="stat-desc">Planning templates created</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-title">Active Tasks</div>
              <div className="stat-value text-secondary">
                {selectedProject.todos?.filter(todo => !todo.completed).length || 0}
              </div>
              <div className="stat-desc">
                {selectedProject.todos?.filter(todo => todo.completed).length || 0} completed
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="stat-title">Dev Log Entries</div>
              <div className="stat-value text-accent">{selectedProject.devLog?.length || 0}</div>
              <div className="stat-desc">Development progress logged</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="stat-title">Project Links</div>
              <div className="stat-value text-info">{selectedProject.links?.length || 0}</div>
              <div className="stat-desc">External resources linked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;