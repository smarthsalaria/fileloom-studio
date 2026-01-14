'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2, PlusSquare, RefreshCw, MousePointer2, 
  Type, Eraser, Search, Image as ImageIcon,
  Undo2, Redo2 
} from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';
import { usePdfActions } from '@/modules/editor/hooks/usePdfActions';

export const EditorSidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { 
    selectedPages, undo, redo, historyIndex, history, 
    isTextSelectMode, toggleTextSelectMode
   } = useEditorStore();
  const { addBlankPage, rotateSelectedPages, deleteSelectedPages } = usePdfActions();
  const [searchQuery, setSearchQuery] = useState('');

  // Define tools
  const allTools = [
    {
      id: 'blank-page',
      label: 'Insert Blank Page',
      icon: <PlusSquare className="w-4 h-4 mr-2 text-green-600 dark:text-green-500" />,
      action: addBlankPage,
      disabled: false,
      category: 'Page Operations'
    },
    {
      id: 'rotate',
      label: 'Rotate Selected',
      icon: <RefreshCw className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" />,
      action: () => rotateSelectedPages(90),
      disabled: selectedPages.size === 0,
      category: 'Page Operations'
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="w-4 h-4 mr-2 text-red-600 dark:text-red-500" />,
      action: deleteSelectedPages,
      disabled: selectedPages.size === 0,
      category: 'Page Operations'
    },
    {
      id: 'select-text',
      label: isTextSelectMode ? 'Disable Selection' : 'Select Text', 
      icon: <MousePointer2 className={`w-4 h-4 mr-2 ${isTextSelectMode ? 'text-blue-600 dark:text-blue-400' : ''}`} />,
      action: toggleTextSelectMode, 
      disabled: false, 
      category: 'Content Tools'
    },
    {
      id: 'add-text',
      label: 'Add Text',
      icon: <Type className="w-4 h-4 mr-2" />,
      action: () => {},
      disabled: true,
      category: 'Content Tools'
    },
    {
      id: 'whiteout',
      label: 'Whiteout',
      icon: <Eraser className="w-4 h-4 mr-2" />,
      action: () => {},
      disabled: true,
      category: 'Content Tools'
    },
    {
      id: 'add-image',
      label: 'Add Image',
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
      action: () => {},
      disabled: true,
      category: 'Content Tools'
    }
  ];

  // Filter Logic
  const filteredTools = allTools.filter(tool => 
    tool.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof allTools>);

  return (
    <aside className={`
      absolute lg:relative top-0 left-0 h-full w-64 
      bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
      shadow-xl lg:shadow-none z-20 
      transition-all duration-300 ease-in-out flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Editor Tools</h2>
          
          {/* UNDO / REDO BUTTONS */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
              onClick={undo} 
              disabled={historyIndex <= 0} 
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
              onClick={redo} 
              disabled={historyIndex >= history.length - 1} 
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search tools..." 
            className="pl-8 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-blue-500 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {Object.keys(groupedTools).length === 0 ? (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            No tools found.
          </div>
        ) : (
          Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-200 mb-2 transition-colors">{category}</h3>
              <div className="space-y-1">
                {tools.map(tool => (
                  <Button 
                    key={tool.id}
                    variant="ghost" 
                    className={`
                      w-full justify-start h-9 transition-colors
                      ${tool.id === 'delete' 
                        ? 'text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400' 
                        : 'text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }
                    `} 
                    onClick={tool.action}
                    disabled={tool.disabled}
                  >
                    {tool.icon} {tool.label}
                  </Button>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
           <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-colors">
            <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">Status</p>
            {selectedPages.size === 0 
              ? "Select pages to edit." 
              : `${selectedPages.size} page(s) selected.`}
          </div>
        </div>
      </div>
    </aside>
  );
};