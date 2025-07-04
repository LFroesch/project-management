import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const EtcPage: React.FC = () => {
  const context = useOutletContext<ContextType>();
  const selectedProject = context?.selectedProject || null;

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view additional info
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedProject.name} - Miscellaneous
      </h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800">Staging Environment:</h3>
            <div className="whitespace-pre-wrap text-gray-700 mt-2">
              {selectedProject.staging || 'No staging information...'}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Created:</h3>
            <p className="text-gray-600 mt-1">{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtcPage;