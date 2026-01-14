'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const MobileFloatingAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const respawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial show on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (respawnTimerRef.current) clearTimeout(respawnTimerRef.current);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    // Clear any existing timer just in case
    if (respawnTimerRef.current) clearTimeout(respawnTimerRef.current);

    // Set timer to show ad again after 2 minutes (120,000 ms)
    respawnTimerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 2 * 60 * 1000); // 10 minutes
  };

  // Don't render anything if hidden (animation handles the slide down)
  // We use CSS class toggle instead of returning null to allow animation
  
  return (
    <div 
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-[60] 
        flex flex-col items-center justify-end pointer-events-none
        transition-transform duration-500 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-[150%]'}
      `}
    >
      {/* Close Button Tab */}
      <div className="w-full max-w-[320px] flex justify-end px-1 pointer-events-auto">
        <button
          onClick={handleClose}
          className="
            mb-1 flex items-center justify-center gap-1
            bg-slate-800/90 text-white text-[10px] px-2 py-1 rounded-t-md backdrop-blur-sm
            hover:bg-slate-700 transition-colors shadow-sm
          "
        >
          Close <X className="w-3 h-3" />
        </button>
      </div>
      
      {/* Ad Container */}
      <div className="
        relative pointer-events-auto
        w-full bg-white dark:bg-slate-900 
        border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
        flex flex-col items-center justify-center
        pb-safe-area-bottom min-h-[60px]
      ">
        
        {/* Compliance Label */}
        <div className="absolute top-0 left-2 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 text-[9px] text-slate-500 dark:text-slate-300 px-1 rounded">
          Ad
        </div>

        {/* Ad Slot */}
        <div className="w-[320px] h-[50px] bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded my-1">
           Mobile Banner (320x50)
        </div>

      </div>
    </div>
  );
};