'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MobileFloatingAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    // Shows only on Mobile/Tablet (lg:hidden)
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] p-2 flex justify-center pointer-events-none">
      
      {/* Container */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-t-lg w-full max-w-sm pointer-events-auto overflow-hidden transition-colors duration-300">
        
        {/* Close Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1 right-1 h-6 w-6 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full z-10 transition-colors"
          onClick={() => setIsVisible(false)}
        >
          <X className="w-3 h-3 text-slate-500 dark:text-slate-400" />
        </Button>

        {/* Ad Content Placeholder */}
        <div className="w-full h-[70px] bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium border-t-2 border-blue-500 transition-colors duration-300">
           Mobile Banner Ad (320x50)
        </div>
      </div>
    </div>
  );
};