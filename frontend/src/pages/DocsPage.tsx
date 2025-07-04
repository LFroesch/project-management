import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const DocsPage: React.FC = () => {
  const { selectedProject } = useOutletContext<ContextType>();

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view documentation
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedProject.name} - Documentation
      </h1>
      
      <div className="space-y-6">
        {/* API Documentation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Authentication Endpoints</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <div className="mb-2"><span className="text-green-600">POST</span> /api/auth/register</div>
                <div className="mb-2"><span className="text-blue-600">POST</span> /api/auth/login</div>
                <div className="mb-2"><span className="text-purple-600">POST</span> /api/auth/logout</div>
                <div><span className="text-yellow-600">GET</span> /api/auth/me</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Project Endpoints</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <div className="mb-2"><span className="text-green-600">POST</span> /api/projects</div>
                <div className="mb-2"><span className="text-yellow-600">GET</span> /api/projects</div>
                <div className="mb-2"><span className="text-yellow-600">GET</span> /api/projects/:id</div>
                <div className="mb-2"><span className="text-blue-600">PUT</span> /api/projects/:id</div>
                <div><span className="text-red-600">DELETE</span> /api/projects/:id</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Models */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Data Models</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">User Model</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <div>email: string (required, unique)</div>
                <div>password: string (required, hashed)</div>
                <div>firstName: string (required)</div>
                <div>lastName: string (required)</div>
                <div>createdAt: Date</div>
                <div>updatedAt: Date</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Project Model</h3>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                <div>name: string (required)</div>
                <div>description: string (required)</div>
                <div>notes: string</div>
                <div>staging: string</div>
                <div>roadmap: string</div>
                <div>userId: ObjectId (required)</div>
                <div>createdAt: Date</div>
                <div>updatedAt: Date</div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Guidelines */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Development Guidelines</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Code Style</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Use TypeScript for type safety</li>
                <li>• Follow ESLint configuration</li>
                <li>• Use Prettier for formatting</li>
                <li>• Write descriptive commit messages</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Testing Strategy</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Unit tests for utilities and components</li>
                <li>• Integration tests for API endpoints</li>
                <li>• E2E tests for critical user flows</li>
                <li>• Manual testing checklist</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Deployment Process</h3>
              <ol className="text-gray-600 space-y-1">
                <li>1. Run tests locally</li>
                <li>2. Create feature branch</li>
                <li>3. Submit pull request</li>
                <li>4. Code review</li>
                <li>5. Deploy to staging</li>
                <li>6. Deploy to production</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Future Plans */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Future Documentation Plans</h2>
          
          <div className="text-gray-600">
            <h3 className="font-medium text-gray-800 mb-2">Planned Additions:</h3>
            <ul className="space-y-1">
              <li>• API rate limiting documentation</li>
              <li>• Email verification flow</li>
              <li>• Password reset process</li>
              <li>• File upload guidelines</li>
              <li>• Mobile app API extensions</li>
              <li>• Desktop app integration</li>
              <li>• Third-party service integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;