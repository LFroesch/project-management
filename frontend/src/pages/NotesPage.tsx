import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, projectAPI, Todo, DevLogEntry } from '../api/client';
import CollapsibleSection from '../components/CollapsibleSection';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
  onProjectRefresh: () => Promise<void>;
}

const NotesPage: React.FC = () => {
  const { selectedProject, onProjectUpdate, onProjectRefresh } = useOutletContext<ContextType>();
  
  // Edit states for different sections
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  
  // Form data
  const [notes, setNotes] = useState('');
  const [goals, setGoals] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [newDevLog, setNewDevLog] = useState('');
  
  // Loading states
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [addingTodo, setAddingTodo] = useState(false);
  const [addingDevLog, setAddingDevLog] = useState(false);
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProject) {
      setNotes(selectedProject.notes || '');
      setGoals(selectedProject.goals || '');
    }
  }, [selectedProject]);

  const handleSaveNotes = async () => {
    if (!selectedProject) return;
    
    setSavingNotes(true);
    setError('');
    
    try {
      await onProjectUpdate(selectedProject.id, { notes });
      setIsEditingNotes(false);
    } catch (err) {
      setError('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveGoals = async () => {
    if (!selectedProject) return;
    
    setSavingGoals(true);
    setError('');
    
    try {
      await onProjectUpdate(selectedProject.id, { goals });
      setIsEditingGoals(false);
    } catch (err) {
      setError('Failed to save goals');
    } finally {
      setSavingGoals(false);
    }
  };

  const handleAddTodo = async () => {
    if (!selectedProject || !newTodo.trim()) return;
    
    setAddingTodo(true);
    setError('');
    
    try {
      await projectAPI.createTodo(selectedProject.id, { text: newTodo.trim() });
      setNewTodo('');
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setAddingTodo(false);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    if (!selectedProject) return;
    
    try {
      await projectAPI.updateTodo(selectedProject.id, todo.id, { completed: !todo.completed });
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (!selectedProject) return;
    
    try {
      await projectAPI.deleteTodo(selectedProject.id, todoId);
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleAddDevLog = async () => {
    if (!selectedProject || !newDevLog.trim()) return;
    
    setAddingDevLog(true);
    setError('');
    
    try {
      await projectAPI.createDevLogEntry(selectedProject.id, { entry: newDevLog.trim() });
      setNewDevLog('');
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to add dev log entry');
    } finally {
      setAddingDevLog(false);
    }
  };

  const handleCancel = (section: string) => {
    if (section === 'notes') {
      setNotes(selectedProject?.notes || '');
      setIsEditingNotes(false);
    } else if (section === 'goals') {
      setGoals(selectedProject?.goals || '');
      setIsEditingGoals(false);
    }
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a project to view notes
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {selectedProject.name} - Notes & Tasks
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Notes Section */}
      <CollapsibleSection title="Notes" defaultOpen={true}>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Project notes and documentation</p>
            <div className="flex space-x-2">
              {isEditingNotes ? (
                <>
                  <button
                    onClick={() => handleCancel('notes')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingNotes}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingNotes}
                  >
                    {savingNotes ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-[70vh] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your project notes here... (Markdown supported)"
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {notes || 'No notes yet...'}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Goals Section */}
      <CollapsibleSection title="Goals & Objectives">
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Project goals and milestones</p>
            <div className="flex space-x-2">
              {isEditingGoals ? (
                <>
                  <button
                    onClick={() => handleCancel('goals')}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    disabled={savingGoals}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGoals}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={savingGoals}
                  >
                    {savingGoals ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingGoals(true)}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          
          {isEditingGoals ? (
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your project goals and objectives..."
            />
          ) : (
            <div className="min-h-48 p-4 bg-gray-50 rounded-md">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {goals || 'No goals defined yet...'}
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Todo List Section */}
      <CollapsibleSection title={`To Do (${selectedProject.todos?.length || 0})`}>
        <div className="mt-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button
              onClick={handleAddTodo}
              disabled={addingTodo || !newTodo.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {addingTodo ? 'Adding...' : 'Add'}
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedProject.todos?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No todos yet. Add one above!
              </div>
            ) : (
              selectedProject.todos?.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.text}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Dev Log Section */}
      <CollapsibleSection title={`Dev Log (${selectedProject.devLog?.length || 0})`}>
        <div className="mt-4">
          <div className="mb-4">
            <textarea
              value={newDevLog}
              onChange={(e) => setNewDevLog(e.target.value)}
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add a development log entry..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddDevLog}
                disabled={addingDevLog || !newDevLog.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {addingDevLog ? 'Adding...' : 'Add Entry'}
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {selectedProject.devLog?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No dev log entries yet. Add one above!
              </div>
            ) : (
              selectedProject.devLog?.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-gray-50 rounded-md border-l-4 border-purple-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-purple-700">
                      {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {entry.entry}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default NotesPage;