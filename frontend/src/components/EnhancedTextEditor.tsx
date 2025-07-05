import React, { useState } from 'react';

interface EnhancedTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Write your note here..." 
}) => {
  const [isPreview, setIsPreview] = useState(false);

  // Enhanced markdown to HTML converter with proper link handling
  const renderMarkdown = (text: string): string => {
    if (!text) return '<p class="text-gray-500 italic">Nothing to preview yet...</p>';
    
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

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.querySelector('.enhanced-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.slice(0, start) + before + textToInsert + after + value.slice(end);
    onChange(newText);
    
    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        // If text was selected, select the newly formatted text
        textarea.setSelectionRange(start + before.length, start + before.length + textToInsert.length);
      } else {
        // If no text was selected, place cursor between the markdown syntax
        const newPos = start + before.length + placeholder.length;
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    action();
  };

  const formatButtons = [
    { 
      icon: '**B**', 
      label: 'Bold', 
      action: () => insertMarkdown('**', '**', 'bold text'),
      className: 'font-bold'
    },
    { 
      icon: '*I*', 
      label: 'Italic', 
      action: () => insertMarkdown('*', '*', 'italic text'),
      className: 'italic'
    },
    { 
      icon: '</>', 
      label: 'Code', 
      action: () => insertMarkdown('`', '`', 'code'),
      className: 'font-mono text-xs'
    },
    { 
      icon: '""', 
      label: 'Quote', 
      action: () => insertMarkdown('> ', '', 'quote'),
      className: ''
    },
    { 
      icon: '•', 
      label: 'List', 
      action: () => insertMarkdown('- ', '', 'list item'),
      className: ''
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center gap-1">
          {formatButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleButtonClick(e, btn.action)}
              className={`px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 ${btn.className}`}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
          
          <div className="mx-2 w-px h-4 bg-gray-300"></div>
          
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => insertMarkdown('# ', '', 'Header'))}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 font-bold"
            title="Header"
          >
            H1
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => insertMarkdown('## ', '', 'Header'))}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 font-bold"
            title="Header 2"
          >
            H2
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsPreview(!isPreview);
          }}
          className={`px-3 py-1 text-xs rounded border ${
            isPreview 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
          title={isPreview ? 'Edit' : 'Preview'}
        >
          {isPreview ? '✏️ Edit' : '👁️ Preview'}
        </button>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            className="enhanced-textarea w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] p-4 resize-none border-0 focus:outline-none bg-transparent font-mono text-sm leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace"
            }}
          />
        )}
      </div>

      {/* Help */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-600">
        <details>
          <summary className="cursor-pointer hover:text-gray-800">Markdown shortcuts</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">**bold**</kbd></span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">*italic*</kbd></span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">`code`</kbd></span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs"># header</kbd></span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">- list</kbd></span>
            <span><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">&gt; quote</kbd></span>
          </div>
        </details>
      </div>
    </div>
  );
};

export default EnhancedTextEditor;