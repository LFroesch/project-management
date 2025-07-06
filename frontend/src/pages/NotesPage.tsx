import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, projectAPI, Todo, DevLogEntry } from '../api/client';
import {TodoItem, NewTodoForm} from '../components/TodoItem';
import { DevLogItem, NewDevLogForm } from '../components/DevLogItem';
import EnhancedTextEditor from '../components/EnhancedTextEditor';

interface ContextType {
  selectedProject: Project | null;
  onProjectUpdate: (projectId: string, updatedData: any) => Promise<any>;
  onProjectRefresh: () => Promise<void>;
}

const NotesPage: React.FC = () => {
  const { selectedProject, onProjectUpdate, onProjectRefresh } = useOutletContext<ContextType>();
  
  // Edit states
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  // Form data
  const [notes, setNotes] = useState('');
  
  // Loading states
  const [savingNotes, setSavingNotes] = useState(false);
  
  const [error, setError] = useState('');

  // Enhanced markdown to HTML converter
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p class="text-base-content/60 italic">No notes yet...</p>';
    
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
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // 2. Code blocks (must come before inline code and links)
    processedText = processedText
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-base-200 rounded p-3 my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-base-200 px-2 py-1 rounded text-sm">$1</code>');
    
    // 3. Markdown-style links [text](url) - process before auto-linking
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (match, text, url) => {
      const fullUrl = ensureProtocol(url);
      return `<a href="${fullUrl}" class="link link-primary" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
    
    // 4. Auto-detect plain URLs
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s<]*)?/gi,
      (match) => {
        return `<a href="${ensureProtocol(match)}" class="link link-primary" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 5. Auto-detect URLs starting with http/https
    processedText = processedText.replace(
      /(?<!<[^>]*|`[^`]*|\[[^\]]*\]\()https?:\/\/[^\s<]+/gi,
      (match) => {
        return `<a href="${match}" class="link link-primary" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    // 6. Bold and Italic
    processedText = processedText
      .replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em class="italic">$1</em>');
    
    // 7. Blockquotes
    processedText = processedText
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 my-2 italic">$1</blockquote>');
    
    // 8. Lists
    processedText = processedText
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc list-inside">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal list-inside">$1</li>');
    
    // 9. Line breaks - preserve single breaks, avoid double spacing with block elements
    processedText = processedText.replace(/\n(?![<\/])/gim, '<br>');
    
    return processedText;
  };

  useEffect(() => {
    if (selectedProject) {
      setNotes(selectedProject.notes || '');
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

  const handleArchiveTodoToDevLog = async (todo: Todo) => {
    if (!selectedProject) return;

    try {
      // Create dev log entry from todo
      await projectAPI.createDevLogEntry(selectedProject.id, {
        title: `${todo.text}`,
        description: todo.description || ` `,
        entry: `${todo.text}` // Keep backward compatibility
      });
      
      // Delete the todo
      await projectAPI.deleteTodo(selectedProject.id, todo.id);
      
      // Refresh project data
      await onProjectRefresh();
    } catch (err) {
      setError('Failed to archive todo to dev log');
    }
  };

  const handleCancel = () => {
    setNotes(selectedProject?.notes || '');
    setIsEditingNotes(false);
    setError('');
  };

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">Select a project</h2>
          <p className="text-base-content/60">Choose a project from the sidebar to view notes and tasks</p>
        </div>
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
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Notes Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          📝 Notes
        </div>
        <div className="collapse-content">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base-content/60"> </p>
            <div className="flex space-x-2">
              {isEditingNotes ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost btn-sm"
                    disabled={savingNotes}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="btn btn-primary btn-sm"
                    disabled={savingNotes}
                  >
                    {savingNotes ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="btn btn-outline btn-sm"
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
            <div className="min-h-64 p-4 bg-base-200 rounded-lg border border-base-300">
              {notes ? (
                <div 
                  className="prose prose-sm max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(notes) 
                  }}
                />
              ) : (
                <div className="text-base-content/60 italic">
                  No notes yet. Click Edit to add your project notes with full Markdown support.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Todo List Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          ✅ To Do ({selectedProject.todos?.length || 0})
        </div>
        <div className="collapse-content">
          <NewTodoForm 
            projectId={selectedProject.id} 
            onAdd={onProjectRefresh}
          />
          
          <div className="space-y-2">
            {selectedProject.todos?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-base-content/60">No todos yet. Add one above!</p>
              </div>
            ) : (
              selectedProject.todos?.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  projectId={selectedProject.id}
                  onUpdate={onProjectRefresh}
                  onArchiveToDevLog={handleArchiveTodoToDevLog}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dev Log Section */}
      <div className="collapse collapse-arrow bg-base-100 shadow-md">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          📚 Dev Log ({selectedProject.devLog?.length || 0})
        </div>
        <div className="collapse-content">
          <NewDevLogForm 
            projectId={selectedProject.id} 
            onAdd={onProjectRefresh}
          />
          
          <div className="space-y-2">
            {selectedProject.devLog?.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📖</div>
                <p className="text-base-content/60">No dev log entries yet. Add one above!</p>
              </div>
            ) : (
              selectedProject.devLog?.map((entry) => (
                <DevLogItem
                  key={entry.id}
                  entry={entry}
                  projectId={selectedProject.id}
                  onUpdate={onProjectRefresh}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;