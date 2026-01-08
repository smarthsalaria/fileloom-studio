'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Page } from 'react-pdf';
import { Loader2 } from 'lucide-react';

interface LazyPageProps {
  pageNumber: number;
  width: number;
  rotation: number;
  scale: number;
}

export const LazyPage = ({ pageNumber, width, rotation, scale }: LazyPageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Once visible, stay rendered
        }
      },
      { rootMargin: '500px' } // Load pages 500px before they appear
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative bg-white shadow-sm"
      style={{ 
        width: width, 
        // Estimate height to prevent scroll jumps (A4 ratio approx 1.41)
        minHeight: isVisible ? 'auto' : width * 1.41 
      }}
    >
      {isVisible ? (
        <Page 
          pageNumber={pageNumber} 
          width={width} 
          rotate={rotation} 
          scale={scale} 
          renderTextLayer={true} 
          renderAnnotationLayer={true} 
          className="bg-white"
          loading={
            <div className="flex items-center justify-center h-full w-full bg-slate-50 text-slate-400">
               <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
          error={<div className="text-red-500 text-xs p-2">Error loading page</div>}
        />
      ) : (
        // Placeholder while waiting to scroll into view
        <div className="flex items-center justify-center text-slate-300 text-sm">
           Page {pageNumber}
        </div>
      )}
    </div>
  );
};