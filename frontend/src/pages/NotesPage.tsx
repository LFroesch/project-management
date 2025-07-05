import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, projectAPI, Todo, DevLogEntry } from '../api/client';
import CollapsibleSection from '../components/CollapsibleSection';
import EnhancedTextEditor from '../components/EnhancedTextEditor';

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
  
  // Edit states for todos and dev logs
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editingDevLog, setEditingDevLog] = useState<string | null>(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [editDevLogText, setEditDevLogText] = useState('');
  
  // Loading states
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [addingTodo, setAddingTodo] = useState(false);
  const [addingDevLog, setAddingDevLog] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState(false);
  const [updatingDevLog, setUpdatingDevLog] = useState(false);
  
  const [error, setError] = useState('');

  // Enhanced markdown to HTML converter
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p class="text-gray-500 italic">No notes yet...</p>';
    
    let processedText = text;
    
    // Helper function to ensure URL has protocol
    const ensureProtocol = (url: string): string => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return 'https://' + url;
    };
    
    // Process in order to avoid conflicts
    
    // 1. Headers
    processedText = processedText
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-800">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2 text-gray-800">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800">$1</h1>');
    
    // 2. Code blocks (must come before inline code and links)
    processedText = processedText
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 rounded p-3 my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>');
    
    // 3. Markdown-style links [text](url) - process before auto-linking
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (match, text, url) => {
      const fullUrl = ensureProtocol(url);
      return `<a href="${fullUrl}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
    
    // 4. Auto-detect plain URLs (avoid URLs already in markdown links or code blocks)
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s<]*)?/gi,
      (match) => {
        return `<a href="${ensureProtocol(match)}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 5. Auto-detect URLs starting with http/https
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()https?:\/\/[^\s<]+/gi,
      (match) => {
        return `<a href="${match}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 6. Bold and Italic
    processedText = processedText
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic">$1</em>');
    
    // 7. Blockquotes
    processedText = processedText
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-300 pl-4 my-2 text-gray-700 italic">$1</blockquote>');
    
    // 8. Lists
    processedText = processedText
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal list-inside">$1</li>');
    
    // 9. Line breaks
    processedText = processedText.replace(/\n/gim, '<br>');
    
    return processedText;
  };

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

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTodoText(todo.text);
  };

  const handleSaveTodoEdit = async () => {
    if (!selectedProject || !editingTodo || !editTodoText.trim()) return;
    
    setUpdatingTodo(true);
    setError('');
    
    try {
      await projectAPI.updateTodo(selectedProject.id, editingTodo, { text: editTodoText.trim() });
      setEditingTodo(null);
      setEditTodoText('');
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setUpdatingTodo(false);
    }
  };

  const handleCancelTodoEdit = () => {
    setEditingTodo(null);
    setEditTodoText('');
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

  const handleEditDevLog = (entry: DevLogEntry) => {
    setEditingDevLog(entry.id);
    setEditDevLogText(entry.entry);
  };

  const handleSaveDevLogEdit = async () => {
    if (!selectedProject || !editingDevLog || !editDevLogText.trim()) return;
    
    setUpdatingDevLog(true);
    setError('');
    
    try {
      await projectAPI.updateDevLogEntry(selectedProject.id, editingDevLog, { entry: editDevLogText.trim() });
      setEditingDevLog(null);
      setEditDevLogText('');
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to update dev log entry');
    } finally {
      setUpdatingDevLog(false);
    }
  };

  const handleCancelDevLogEdit = () => {
    setEditingDevLog(null);
    setEditDevLogText('');
  };

  const handleDeleteDevLog = async (entryId: string) => {
    if (!selectedProject) return;
    
    try {
      await projectAPI.deleteDevLogEntry(selectedProject.id, entryId);
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to delete dev log entry');
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

      {/* Notes Section - NOW WITH ENHANCED EDITOR */}
      <CollapsibleSection title="Notes" defaultOpen={true}>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">(Markdown supported)</p>
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
            <EnhancedTextEditor
              value={notes}
              onChange={setNotes}
              placeholder="Enter your project notes here... (Markdown supported)"
            />
          ) : (
            <div className="min-h-64 p-4 bg-gray-50 rounded-md border border-gray-200">
              {notes ? (
                <div 
                  className="prose prose-sm max-w-none leading-relaxed"
                  style={{ lineHeight: '1.2' }}
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(notes) 
                  }}
                />
              ) : (
                <div className="text-gray-500 italic">
                  No notes yet. Click Edit to add your project notes with full Markdown support.
                </div>
              )}
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
                  
                  {editingTodo === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editTodoText}
                        onChange={(e) => setEditTodoText(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveTodoEdit()}
                      />
                      <button
                        onClick={handleSaveTodoEdit}
                        disabled={updatingTodo || !editTodoText.trim()}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        {updatingTodo ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelTodoEdit}
                        className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.text}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditDevLog(entry)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDevLog(entry.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {editingDevLog === entry.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editDevLogText}
                        onChange={(e) => setEditDevLogText(e.target.value)}
                        className="w-full h-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelDevLogEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveDevLogEdit}
                          disabled={updatingDevLog || !editDevLogText.trim()}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updatingDevLog ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {entry.entry}
                    </div>
                  )}
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