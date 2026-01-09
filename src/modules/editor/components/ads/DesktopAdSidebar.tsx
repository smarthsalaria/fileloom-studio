'use client';

import React from 'react';

export const DesktopAdSidebar = () => {
  return (
    <aside className="hidden xl:flex w-[300px] flex-col border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 overflow-y-auto transition-colors duration-300">
      <div className="p-4 space-y-6">
        
        {/* Ad Header */}
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center transition-colors">
          Advertisement
        </div>

        {/* Ad Slot 1: Rectangular (300x250) */}
        <div className="w-full h-[250px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
          Ad Slot (300x250)
        </div>

        {/* Ad Slot 2: Vertical Skyscraper (300x600) */}
        <div className="w-full h-[600px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
          Ad Slot (300x600)
        </div>

      </div>
    </aside>
  );
};