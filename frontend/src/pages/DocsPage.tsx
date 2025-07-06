import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Select a project</h2>
          <p className="text-base-content/60">Choose a project from the sidebar to view documentation</p>
        </div>
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
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* API Documentation Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          🔌 API Documentation {apiDocs && '(Has Content)'}
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60">API endpoints, request/response examples, and authentication</p>
            <div className="flex space-x-2">
              {isEditingApiDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('api')}
                    className="btn btn-ghost btn-sm"
                    disabled={savingApi}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('api')}
                    className="btn btn-primary btn-sm"
                    disabled={savingApi}
                  >
                    {savingApi ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingApiDocs(true)}
                  className="btn btn-outline btn-sm"
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
              className="textarea textarea-bordered w-full h-64 resize-none font-mono"
              placeholder="Document your API endpoints here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300 ">
              {apiDocs ? (
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {apiDocs}
                </div>
              ) : (
                <div className="text-base-content/60 italic">
                  No API documentation yet. Click Edit to add documentation for your endpoints.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Technical Documentation Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          🔧 Technical Documentation {technicalDocs && '(Has Content)'}
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60">Architecture, setup guides, and technical specifications</p>
            <div className="flex space-x-2">
              {isEditingTechnicalDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('technical')}
                    className="btn btn-ghost btn-sm"
                    disabled={savingTechnical}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('technical')}
                    className="btn btn-primary btn-sm"
                    disabled={savingTechnical}
                  >
                    {savingTechnical ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingTechnicalDocs(true)}
                  className="btn btn-outline btn-sm"
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
              className="textarea textarea-bordered w-full h-64 resize-none"
              placeholder="Document your technical architecture and setup instructions here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300 ">
              {technicalDocs ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {technicalDocs}
                </div>
              ) : (
                <div className="text-base-content/60 italic">
                  No technical documentation yet. Click Edit to add architecture and setup guides.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Documentation Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          👥 User Documentation {userDocs && '(Has Content)'}
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60">User guides, how-to instructions, and feature explanations</p>
            <div className="flex space-x-2">
              {isEditingUserDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('user')}
                    className="btn btn-ghost btn-sm"
                    disabled={savingUser}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('user')}
                    className="btn btn-primary btn-sm"
                    disabled={savingUser}
                  >
                    {savingUser ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingUserDocs(true)}
                  className="btn btn-outline btn-sm"
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
              className="textarea textarea-bordered w-full h-64 resize-none"
              placeholder="Document user guides and how-to instructions here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300 ">
              {userDocs ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {userDocs}
                </div>
              ) : (
                <div className="text-base-content/60 italic">
                  No user documentation yet. Click Edit to add user guides and instructions.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Code Documentation Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          💻 Code Documentation {codeDocs && '(Has Content)'}
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60">Code standards, conventions, and development guidelines</p>
            <div className="flex space-x-2">
              {isEditingCodeDocs ? (
                <>
                  <button
                    onClick={() => handleCancel('code')}
                    className="btn btn-ghost btn-sm"
                    disabled={savingCode}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave('code')}
                    className="btn btn-primary btn-sm"
                    disabled={savingCode}
                  >
                    {savingCode ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingCodeDocs(true)}
                  className="btn btn-outline btn-sm"
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
              className="textarea textarea-bordered w-full h-64 resize-none"
              placeholder="Document your code standards and development guidelines here..."
            />
          ) : (
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300 ">
              {codeDocs ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {codeDocs}
                </div>
              ) : (
                <div className="text-base-content/60 italic">
                  No code documentation yet. Click Edit to add coding standards and guidelines.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documentation Templates Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          📋 Documentation Templates
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-info/10 rounded-lg border border-info/20">
              <h4 className="font-semibold text-info mb-2">API Endpoint Template</h4>
              <pre className="text-xs text-info/80 overflow-x-auto">
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

            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <h4 className="font-semibold text-success mb-2">Setup Guide Template</h4>
              <pre className="text-xs text-success/80 overflow-x-auto">
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

            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <h4 className="font-semibold text-secondary mb-2">User Guide Template</h4>
              <pre className="text-xs text-secondary/80 overflow-x-auto">
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

            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h4 className="font-semibold text-warning mb-2">Code Standards Template</h4>
              <pre className="text-xs text-warning/80 overflow-x-auto">
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
      </div>
    </div>
  );
};

export default DocsPage;