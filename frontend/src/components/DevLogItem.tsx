import React, { useState } from 'react';
import { DevLogEntry, projectAPI } from '../api/client';

interface DevLogItemProps {
  entry: DevLogEntry;
  projectId: string;
  onUpdate: () => void;
}

const DevLogItem: React.FC<DevLogItemProps> = ({ entry, projectId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title || entry.entry);
  const [editDescription, setEditDescription] = useState(entry.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setLoading(true);
    try {
      await projectAPI.updateDevLogEntry(projectId, entry.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        entry: editTitle.trim() // Keep backward compatibility
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update dev log entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await projectAPI.deleteDevLogEntry(projectId, entry.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete dev log entry:', error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md mb-4">
      <div className="card-body p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Dev log title..."
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Dev log description..."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-ghost btn-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary btn-sm"
                disabled={loading || !editTitle.trim()}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                  <span className="text-xs">📝</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-base-content">
                    {entry.title || entry.entry}
                  </h3>
                </div>
                {entry.description && (
                  <p className="text-sm text-base-content/70 mb-2">
                    {entry.description}
                  </p>
                )}
                <div className="text-xs text-base-content/50">
                  {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-ghost"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-error btn-outline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface NewDevLogFormProps {
  projectId: string;
  onAdd: () => void;
}

const NewDevLogForm: React.FC<NewDevLogFormProps> = ({ projectId, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await projectAPI.createDevLogEntry(projectId, {
        title: title.trim(),
        description: description.trim(),
        entry: title.trim() // Keep backward compatibility
      });
      setTitle('');
      setDescription('');
      onAdd();
    } catch (error) {
      console.error('Failed to create dev log entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md mb-4">
      <div className="card-body p-4">
        <h3 className="font-medium mb-3" style={{ fontSize: '18px' }}>Create New:</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '16px' }}
            className="input input-bordered w-full"
            placeholder="Dev log title..."
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontSize: '16px' }}
            className="textarea textarea-bordered w-full"
            placeholder="Dev log description..."
            rows={4}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Adding...' : 'Add Dev Log Entry'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { DevLogItem, NewDevLogForm };