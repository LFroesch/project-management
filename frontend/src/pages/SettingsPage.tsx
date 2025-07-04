import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../api/client';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
  onProjectDelete: (projectId: string) => Promise<void>;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProject, onProjectUpdate, onProjectDelete } = useOutletContext<ContextType>();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setName(selectedProject.name || '');
      setDescription(selectedProject.description || '');
    }
  }, [selectedProject]);

  const handleSave = async () => {
    if (!selectedProject) return;

    setSaving(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, {
        name: name.trim(),
        description: description.trim(),
        notes: selectedProject.notes,
        staging: selectedProject.staging,
        roadmap: selectedProject.roadmap
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save project settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(selectedProject?.name || '');
    setDescription(selectedProject?.description || '');
    setIsEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    try {
      await onProjectDelete(selectedProject.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view settings
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Settings
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
        <h2 className="text-lg font-semibold mb-4">Project Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Project Name:</h3>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name..."
                required
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{name}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Project Description:</h3>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter project description..."
                required
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{description}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Project ID:</h3>
            <p className="text-gray-600 mt-1 font-mono text-sm">{selectedProject.id}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Created:</h3>
            <p className="text-gray-600 mt-1">{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800">Last Updated:</h3>
            <p className="text-gray-600 mt-1">{new Date(selectedProject.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4">Danger Zone</h3>
            {deleteConfirm ? (
              <div className="space-y-3">
                <p className="text-red-600 text-sm">Are you sure you want to delete this project? This action cannot be undone.</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Yes, Delete Project
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;