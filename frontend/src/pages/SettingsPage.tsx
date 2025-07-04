import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const SettingsPage: React.FC = () => {
  const context = useOutletContext<ContextType>();
  const selectedProject = context?.selectedProject || null;

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view settings
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedProject.name} - Settings
      </h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800">Project Description:</h3>
            <p className="text-gray-600 mt-2">{selectedProject.description}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Project ID:</h3>
            <p className="text-gray-600 mt-1 font-mono text-sm">{selectedProject.id}</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;