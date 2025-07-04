import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project, projectAPI } from '../api/client';
import CollapsibleSection from '../components/CollapsibleSection';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
  onProjectArchive: (projectId: string, isArchived: boolean) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  onProjectRefresh: () => Promise<void>;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProject, onProjectUpdate, onProjectArchive, onProjectDelete, onProjectRefresh } = useOutletContext<ContextType>();
  
  // Edit states
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  
  // Form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stagingEnvironment, setStagingEnvironment] = useState<'development' | 'staging' | 'production'>('development');
  const [color, setColor] = useState('#3B82F6');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'other' as 'github' | 'demo' | 'docs' | 'other' });
  
  // Loading states
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingMetadata, setSavingMetadata] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setName(selectedProject.name || '');
      setDescription(selectedProject.description || '');
      setStagingEnvironment(selectedProject.stagingEnvironment || 'development');
      setColor(selectedProject.color || '#3B82F6');
      setCategory(selectedProject.category || 'general');
      setTags(selectedProject.tags || []);
    }
  }, [selectedProject]);

  const handleSaveBasic = async () => {
    if (!selectedProject) return;

    setSavingBasic(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, {
        name: name.trim(),
        description: description.trim(),
      });
      setIsEditingBasic(false);
    } catch (err) {
      setError('Failed to save basic settings');
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!selectedProject) return;

    setSavingMetadata(true);
    setError('');

    try {
      await onProjectUpdate(selectedProject.id, {
        stagingEnvironment,
        color,
        category,
        tags
      });
      setIsEditingMetadata(false);
    } catch (err) {
      setError('Failed to save metadata');
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddLink = async () => {
    if (!selectedProject || !newLink.title.trim() || !newLink.url.trim()) return;

    setAddingLink(true);
    setError('');

    try {
      await projectAPI.createLink(selectedProject.id, newLink);
      setNewLink({ title: '', url: '', type: 'other' });
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to add link');
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!selectedProject) return;

    try {
      // We'll need to add this API endpoint
      await projectAPI.deleteLink(selectedProject.id, linkId);
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  const handleArchiveToggle = async () => {
    if (!selectedProject) return;

    setArchiveLoading(true);
    setError('');

    try {
      await onProjectArchive(selectedProject.id, !selectedProject.isArchived);
      // The onProjectArchive function should handle the refresh, but let's add it just in case
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to update project archive status');
    } finally {
      setArchiveLoading(false);
    }
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

  const handleCancel = (section: string) => {
    if (section === 'basic') {
      setName(selectedProject?.name || '');
      setDescription(selectedProject?.description || '');
      setIsEditingBasic(false);
    } else if (section === 'metadata') {
      setStagingEnvironment(selectedProject?.stagingEnvironment || 'development');
      setColor(selectedProject?.color || '#3B82F6');
      setCategory(selectedProject?.category || 'general');
      setTags(selectedProject?.tags || []);
      setIsEditingMetadata(false);
    }
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view settings
      </div>
    );
  }

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Project Information */}
      <CollapsibleSection title="Project Information" defaultOpen={true}>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Info</h3>
            <div className="flex space-x-2">
              {isEditingBasic ? (
                <>
                  <button
                    onClick={() => handleCancel('basic')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingBasic}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBasic}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingBasic}
                  >
                    {savingBasic ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingBasic(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              {isEditingBasic ? (
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
                  <p className="text-gray-700 font-sm">{name}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              {isEditingBasic ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter project description..."
                  required
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700 font-sm">{description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Metadata</h3>
              <div className="flex space-x-2">
                {isEditingMetadata ? (
                  <>
                    <button
                      onClick={() => handleCancel('metadata')}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      disabled={savingMetadata}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMetadata}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={savingMetadata}
                    >
                      {savingMetadata ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingMetadata(true)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staging Environment
              </label>
              {isEditingMetadata ? (
                <select
                  value={stagingEnvironment}
                  onChange={(e) => setStagingEnvironment(e.target.value as 'development' | 'staging' | 'production')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stagingEnvironment === 'production' ? 'bg-red-100 text-red-800' :
                    stagingEnvironment === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {stagingEnvironment.charAt(0).toUpperCase() + stagingEnvironment.slice(1)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {isEditingMetadata ? (
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category..."
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">{category}</p>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Color
              </label>
              {isEditingMetadata ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((presetColor) => (
                      <button
                        key={presetColor}
                        onClick={() => setColor(presetColor)}
                        className={`w-8 h-8 rounded-md border-2 ${
                          color === presetColor ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: presetColor }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-md border border-gray-300"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-gray-700 font-mono">{color}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {isEditingMetadata ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {tags.length === 0 ? (
                      <span className="text-gray-500 italic">No tags</span>
                    ) : (
                      tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Project Links */}
      <CollapsibleSection title={`Project Links (${selectedProject.links?.length || 0})`}>
        <div className="mt-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-3">Add New Link</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Link title..."
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              <select
                value={newLink.type}
                onChange={(e) => setNewLink({...newLink, type: e.target.value as any})}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="other">Other</option>
                <option value="github">GitHub</option>
                <option value="demo">Demo</option>
                <option value="docs">Documentation</option>
              </select>
              <button
                onClick={handleAddLink}
                disabled={addingLink || !newLink.title.trim() || !newLink.url.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {addingLink ? 'Adding...' : 'Add Link'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {selectedProject.links?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No links yet. Add one above!
              </div>
            ) : (
              selectedProject.links?.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {link.type === 'github' ? '💻' : 
                       link.type === 'demo' ? '🌐' : 
                       link.type === 'docs' ? '📚' : '🔗'}
                    </span>
                    <div className="flex-1">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {link.title}
                      </a>
                      <div className="text-gray-500 text-sm">
                        {link.url}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                      {link.type}
                    </span>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Project Status */}
      <CollapsibleSection title="Project Status">
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Current Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Archive Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject.isArchived 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedProject.isArchived ? 'Archived' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sharing Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject.isShared
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProject.isShared ? 'Shared' : 'Private'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deployment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProject.isShared
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Timestamps</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {new Date(selectedProject.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(selectedProject.updatedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Project ID:</span> 
                  <span className="font-mono text-xs ml-2">{selectedProject.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Danger Zone */}
      <CollapsibleSection title="Danger Zone">
        <div className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800">{selectedProject.isArchived ? 'Unarchive Project' : 'Archive Project'}</h4>
              <p className="text-yellow-600 text-sm mb-4">
                {selectedProject.isArchived ? 'Make this project active again' : 'Move this project to archived section'}
              </p>
              <button
                onClick={handleArchiveToggle}
                className={`px-4 py-2 rounded-md font-medium disabled:opacity-50 ${
                  selectedProject.isArchived 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
                disabled={archiveLoading}
              >
                {archiveLoading ? 'Processing...' : selectedProject.isArchived ? 'Make Active' : 'Archive Project'}
              </button>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Delete Project</h4>
              <p className="text-red-600 text-sm mb-4">
                This action cannot be undone. This will permanently delete the project and all of its data.
              </p>
              
              {deleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-red-600 text-sm font-medium">Are you sure you want to delete this project?</p>
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
      </CollapsibleSection>
    </div>
  );
};

export default SettingsPage;