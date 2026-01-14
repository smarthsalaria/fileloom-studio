'use client';

import React from 'react';

export const DesktopAdSidebar = () => {
  return (
    <aside 
      className="
        hidden xl:flex w-[300px] flex-col shrink-0 
        border-l border-slate-200 dark:border-slate-800 
        bg-slate-50 dark:bg-slate-950 
        transition-colors duration-300
        
        /* FIX: Constrain height and enable scroll */
        sticky top-0 h-screen overflow-y-auto
      "
    >
      <div className="p-4 space-y-6">
        
        {/* Ad Header */}
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center transition-colors">
          Advertisement
        </div>

        <div className="shrink-0 w-full h-[300px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
          Ad Slot (300x300)
        </div>


        <div className="shrink-0 w-full h-[300px] bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm transition-colors">
          Ad Slot (300x300)
        </div>

      </div>
    </aside>
  );
};