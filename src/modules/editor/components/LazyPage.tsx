'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Page } from 'react-pdf';
import { Loader2 } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

interface LazyPageProps {
  pageNumber: number;
  width: number;
  rotation: number;
  scale: number;
}

export const LazyPage = ({ pageNumber, width, rotation, scale }: LazyPageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTextSelectMode } = useEditorStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      // UPDATED: bg-white -> dark:bg-slate-800 for the container background
      className="relative bg-white dark:bg-slate-800 shadow-sm transition-colors duration-200"
      style={{ 
        width: width, 
        minHeight: isVisible ? 'auto' : width * 1.41 
      }}
    >
      {isVisible ? (
        <Page 
          pageNumber={pageNumber} 
          width={width} 
          rotate={rotation} 
          scale={scale} 
          renderTextLayer={isTextSelectMode} 
          renderAnnotationLayer={isTextSelectMode} 
          // UPDATED: Ensure the PDF canvas container is white in light mode, but handles transparency if needed
          className="bg-white dark:bg-slate-800"
          loading={
            // UPDATED: Dark mode styling for the loading state
            <div className="flex items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 transition-colors">
               <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
        />
      ) : (
        // UPDATED: Placeholder styling
        <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-600 text-sm transition-colors">
           Page {pageNumber}
        </div>
      )}
    </div>
  );
};