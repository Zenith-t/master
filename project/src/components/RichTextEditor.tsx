import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your blog content...",
  className = ""
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('blog-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertText(prefix);
  };

  const formatButtons = [
    { 
      icon: Type, 
      label: 'H1', 
      action: () => insertHeading(1),
      title: 'Heading 1'
    },
    { 
      icon: Type, 
      label: 'H2', 
      action: () => insertHeading(2),
      title: 'Heading 2'
    },
    { 
      icon: Type, 
      label: 'H3', 
      action: () => insertHeading(3),
      title: 'Heading 3'
    },
    { 
      icon: Bold, 
      action: () => insertText('**', '**'),
      title: 'Bold'
    },
    { 
      icon: Italic, 
      action: () => insertText('*', '*'),
      title: 'Italic'
    },
    { 
      icon: List, 
      action: () => insertText('- '),
      title: 'Bullet List'
    },
    { 
      icon: ListOrdered, 
      action: () => insertText('1. '),
      title: 'Numbered List'
    }
  ];

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Handle headings
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mb-2 text-gray-900">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mb-3 text-gray-900">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 text-gray-900">{line.replace('# ', '')}</h1>;
        }
        
        // Handle lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">• {line.replace('- ', '')}</li>;
        }
        if (line.match(/^\d+\. /)) {
          const number = line.match(/^(\d+)\. /)?.[1];
          return <li key={index} className="ml-4 mb-1">{number}. {line.replace(/^\d+\. /, '')}</li>;
        }
        
        // Handle bold and italic
        let formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        return (
          <p 
            key={index} 
            className="mb-4 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      });
  };

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-2 items-center">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              title={button.title}
            >
              {button.label ? (
                <span className="font-semibold">{button.label}</span>
              ) : (
                <button.icon className="w-4 h-4" />
              )}
            </button>
          ))}
          
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-96">
        {showPreview ? (
          <div className="p-4 prose prose-lg max-w-none">
            {formatContent(value)}
          </div>
        ) : (
          <textarea
            id="blog-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
            style={{ minHeight: '400px' }}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 text-xs text-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><strong># Heading 1</strong></div>
          <div><strong>## Heading 2</strong></div>
          <div><strong>**Bold Text**</strong></div>
          <div><strong>*Italic Text*</strong></div>
          <div><strong>- Bullet Point</strong></div>
          <div><strong>1. Numbered List</strong></div>
          <div>Use Preview to see formatted output</div>
        </div>
      </div>
    </div>
  );
}