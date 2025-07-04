import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
}

const RoadmapPage: React.FC = () => {
  const { selectedProject, onProjectUpdate } = useOutletContext<ContextType>();
  const [isEditing, setIsEditing] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setRoadmap(selectedProject.roadmap || '');
    }
  }, [selectedProject]);

  const handleSave = async () => {
    if (!selectedProject) return;

    setSaving(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, {
        name: selectedProject.name,
        description: selectedProject.description,
        notes: selectedProject.notes,
        staging: selectedProject.staging,
        roadmap: roadmap
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save roadmap');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setRoadmap(selectedProject?.roadmap || '');
    setIsEditing(false);
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view roadmap
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Roadmap
        </h1>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Development Roadmap</h2>
        
        {isEditing ? (
          <textarea
            value={roadmap}
            onChange={(e) => setRoadmap(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter your development roadmap here..."
          />
        ) : (
          <div className="min-h-96 p-4 bg-gray-50 rounded-md">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {roadmap || 'No roadmap defined yet...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;