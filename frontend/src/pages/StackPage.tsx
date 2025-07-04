import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const StackPage: React.FC = () => {
  const { selectedProject } = useOutletContext<ContextType>();

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view tech stack
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedProject.name} - Tech Stack
      </h1>
      
      <div className="space-y-6">
        {/* Current Stack */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Current Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Frontend:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• React Router</li>
                <li>• React Query</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Backend:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Node.js</li>
                <li>• Express.js</li>
                <li>• MongoDB</li>
                <li>• Mongoose</li>
                <li>• JWT Authentication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Development Tools:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Vite</li>
                <li>• ESLint</li>
                <li>• Prettier</li>
                <li>• TypeScript Compiler</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Deployment:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Docker (planned)</li>
                <li>• Vercel/Netlify (frontend)</li>
                <li>• Railway/Render (backend)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Planned Additions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Planned Additions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Performance & Scaling:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Redis (caching, rate limiting)</li>
                <li>• Email service (SendGrid/Mailgun)</li>
                <li>• File upload (AWS S3/Cloudinary)</li>
                <li>• Search (Elasticsearch/Algolia)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Mobile & Desktop:</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• React Native (mobile)</li>
                <li>• Electron (desktop)</li>
                <li>• PWA capabilities</li>
                <li>• Offline sync</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Framework Compatibility */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Framework Compatibility Matrix</h2>
          <div className="text-gray-600">
            <p className="mb-4">This section will help suggest compatible frameworks and highlight potential conflicts:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium text-green-800">✓ Compatible</h4>
                <p className="text-sm text-green-600">React + TypeScript + Tailwind</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <h4 className="font-medium text-yellow-800">⚠ Needs Configuration</h4>
                <p className="text-sm text-yellow-600">MongoDB + Redis</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-medium text-red-800">✗ Conflicts</h4>
                <p className="text-sm text-red-600">None detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackPage;