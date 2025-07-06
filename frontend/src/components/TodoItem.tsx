import React, { useState } from 'react';
import { Todo, projectAPI } from '../api/client';

interface TodoItemProps {
  todo: Todo;
  projectId: string;
  onUpdate: () => void;
  onArchiveToDevLog: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, projectId, onUpdate, onArchiveToDevLog }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setLoading(true);
    try {
      await projectAPI.updateTodo(projectId, todo.id, {
        text: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await projectAPI.updateTodo(projectId, todo.id, { completed: !todo.completed });
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await projectAPI.deleteTodo(projectId, todo.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleArchive = () => {
    onArchiveToDevLog(todo);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'badge-error';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '⚪';
    }
  };

  return (
    <div className={`card bg-base-100 shadow-md mb-4 ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="card-body p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Todo title..."
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Todo description..."
              rows={3}
            />
            <div className="flex items-center gap-2">
              <label className="label-text">Priority:</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
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
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                className="checkbox checkbox-primary mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-base-content/60' : ''}`}>
                    {todo.text}
                  </h3>
                  <div className={`badge badge-sm ${getPriorityColor(todo.priority || 'medium')}`}>
                    {getPriorityIcon(todo.priority || 'medium')} {todo.priority || 'medium'}
                  </div>
                </div>
                {todo.description && (
                  <p className={`text-sm text-base-content/70 mb-2 ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                  </p>
                )}
                <div className="text-xs text-base-content/50">
                  Created: {new Date(todo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-3">
              {todo.completed && (
                <button
                  onClick={handleArchive}
                  className="btn btn-sm btn-info"
                  title="Archive to Dev Log"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                  </svg>
                  Archive
                </button>
              )}
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

interface NewTodoFormProps {
  projectId: string;
  onAdd: () => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({ projectId, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await projectAPI.createTodo(projectId, {
        text: title.trim(),
        description: description.trim(),
        priority
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      onAdd();
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md mb-4">
      <div className="card-body p-4">
        <h3 className="font-medium mb-3" style={{ fontSize: '20px' }}>Create New:</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            style={{ fontSize: '18px' }}
            placeholder="Todo title..."
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            style={{ fontSize: '18px' }}
            placeholder="Todo description (optional)..."
            rows={3}
            />  
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '16px' }} className="label-text">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="select select-bordered select-sm"
              style={{ fontSize: '16px' }}
            >
              <option value="low">🌱 Low</option>
              <option value="medium">⚡ Medium</option>
              <option value="high">🔥 High</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Adding...' : 'Add Todo'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { TodoItem, NewTodoForm };