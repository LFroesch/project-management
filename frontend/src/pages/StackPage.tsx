import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

export const StackPage: React.FC = () => {
  const context = useOutletContext<ContextType>();
  const selectedProject = context?.selectedProject || null;

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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
        <div className="text-gray-500 italic">
          No tech stack information available yet...
        </div>
      </div>
    </div>
  );
};

export default StackPage;