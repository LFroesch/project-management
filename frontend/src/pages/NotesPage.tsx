import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
}

const NotesPage: React.FC = () => {
  const context = useOutletContext<ContextType>();
  const selectedProject = context?.selectedProject || null;

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view notes
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedProject.name} - Notes
      </h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Project Notes</h2>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {selectedProject.notes || 'No notes yet...'}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;