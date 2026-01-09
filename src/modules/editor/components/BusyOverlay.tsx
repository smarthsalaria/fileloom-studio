'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

export const BusyOverlay = () => {
  const { isProcessing } = useEditorStore();

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[1px] flex items-center justify-center cursor-wait">
      <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 transition-colors">
        <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-500 animate-spin" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Processing PDF...</span>
      </div>
    </div>
  );
};