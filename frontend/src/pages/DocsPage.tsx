import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';
import CollapsibleSection from '../components/CollapsibleSection';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
}

const DocsPage: React.FC = () => {
  const { selectedProject, onProjectUpdate } = useOutletContext<ContextType>();
  
  // Edit states
  const [isEditingApiDocs, setIsEditingApiDocs] = useState(false);
  const [isEditingTechnicalDocs, setIsEditingTechnicalDocs] = useState(false);
  const [isEditingUserDocs, setIsEditingUserDocs] = useState(false);
  const [isEditingCodeDocs, setIsEditingCodeDocs] = useState(false);
  
  // Form data
  const [apiDocs, setApiDocs] = useState('');
  const [technicalDocs, setTechnicalDocs] = useState('');
  const [userDocs, setUserDocs] = useState('');
  const [codeDocs, setCodeDocs] = useState('');
  
  // Loading states
  const [savingApi, setSavingApi] = useState(false);
  const [savingTechnical, setSavingTechnical] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [savingCode, setSavingCode] = useState(false);
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setApiDocs(selectedProject.apiDocs || '');
      setTechnicalDocs(selectedProject.technicalDocs || '');
      setUserDocs(selectedProject.userDocs || '');
      setCodeDocs(selectedProject.codeDocs || '');
    }
  }, [selectedProject]);

  const handleSave = async (section: string) => {
    if (!selectedProject) return;

    const updates: any = {};
    let setSaving: (loading: boolean) => void;
    let setEditing: (editing: boolean) => void;

    switch (section) {
      case 'api':
        updates.apiDocs = apiDocs;
        setSaving = setSavingApi;
        setEditing = setIsEditingApiDocs;
        break;
      case 'technical':
        updates.technicalDocs = technicalDocs;
        setSaving = setSavingTechnical;
        setEditing = setIsEditingTechnicalDocs;
        break;
      case 'user':
        updates.userDocs = userDocs;
        setSaving = setSavingUser;
        setEditing = setIsEditingUserDocs;
        break;
      case 'code':
        updates.codeDocs = codeDocs;
        setSaving = setSavingCode;
        setEditing = setIsEditingCodeDocs;
        break;
      default:
        return;
    }

    setSaving(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, updates);
      setEditing(false);
    } catch (err) {
      setError(`Failed to save ${section} documentation`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (section: string) => {
    switch (section) {
      case 'api':
        setApiDocs(selectedProject?.apiDocs || '');
        setIsEditingApiDocs(false);
        break;
      case 'technical':
        setTechnicalDocs(selectedProject?.technicalDocs || '');
        setIsEditingTechnicalDocs(false);
        break;
      case 'user':
        setUserDocs(selectedProject?.userDocs || '');
        setIsEditingUserDocs(false);
        break;
      case 'code':
        setCodeDocs(selectedProject?.codeDocs || '');
        setIsEditingCodeDocs(false);
        break;
    }
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view documentation
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Documentation
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* API Documentation Section */}
      <CollapsibleSection title="API Documentation" defaultOpen={true}>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">API endpoints, request/response examples, and authentication</p>
            <div className="flex space-x-2">
              {isEditingApiDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('api')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingApi}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('api')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingApi}
                  >
                    {savingApi ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingApiDocs(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditingApiDocs ? (
            <textarea
              value={apiDocs}
              onChange={(e) => setApiDocs(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              placeholder="Document your API endpoints here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              {apiDocs ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-mono text-sm">
                  {apiDocs}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No API documentation yet. Click Edit to add documentation for your endpoints.
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Technical Documentation Section */}
      <CollapsibleSection title="Technical Documentation">
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Architecture, setup guides, and technical specifications</p>
            <div className="flex space-x-2">
              {isEditingTechnicalDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('technical')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingTechnical}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('technical')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingTechnical}
                  >
                    {savingTechnical ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingTechnicalDocs(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditingTechnicalDocs ? (
            <textarea
              value={technicalDocs}
              onChange={(e) => setTechnicalDocs(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Document your technical architecture and setup instructions here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              {technicalDocs ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {technicalDocs}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No technical documentation yet. Click Edit to add architecture and setup guides.
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* User Documentation Section */}
      <CollapsibleSection title="User Documentation">
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">User guides, how-to instructions, and feature explanations</p>
            <div className="flex space-x-2">
              {isEditingUserDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('user')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingUser}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('user')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingUser}
                  >
                    {savingUser ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingUserDocs(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditingUserDocs ? (
            <textarea
              value={userDocs}
              onChange={(e) => setUserDocs(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Document user guides and how-to instructions here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              {userDocs ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {userDocs}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No user documentation yet. Click Edit to add user guides and instructions.
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Code Documentation Section */}
      <CollapsibleSection title="Code Documentation">
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Code standards, conventions, and development guidelines</p>
            <div className="flex space-x-2">
              {isEditingCodeDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('code')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingCode}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('code')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingCode}
                  >
                    {savingCode ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingCodeDocs(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditingCodeDocs ? (
            <textarea
              value={codeDocs}
              onChange={(e) => setCodeDocs(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Document your code standards and development guidelines here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              {codeDocs ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {codeDocs}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No code documentation yet. Click Edit to add coding standards and guidelines.
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Documentation Templates Section */}
      <CollapsibleSection title="Documentation Templates">
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">API Endpoint Template</h4>
              <pre className="text-xs text-blue-700 overflow-x-auto">
{`## POST /api/endpoint
Description: Brief description

Request:
{
  "field": "value"
}

Response:
{
  "message": "Success",
  "data": {}
}`}
              </pre>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Setup Guide Template</h4>
              <pre className="text-xs text-green-700 overflow-x-auto">
{`## Installation
1. Clone repository
2. Install dependencies
3. Configure environment
4. Run application

## Requirements
- Node.js 18+
- MongoDB 6+
- npm/yarn`}
              </pre>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">User Guide Template</h4>
              <pre className="text-xs text-purple-700 overflow-x-auto">
{`## How to [Task]
1. Navigate to [page]
2. Click [button]
3. Fill in [form]
4. Submit

## Tips
- Remember to...
- You can also...`}
              </pre>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Code Standards Template</h4>
              <pre className="text-xs text-orange-700 overflow-x-auto">
{`## Naming Conventions
- Variables: camelCase
- Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_CASE

## File Structure
- Components: /components
- Pages: /pages
- Utils: /utils`}
              </pre>
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default DocsPage;