'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf'; // Import Page for Single View
import { LazyPage } from './LazyPage';      // Import LazyPage for Scroll View
import { Loader2 } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface MainViewerProps {
  pdfFile: { data: Uint8Array } | undefined;
}

export const MainViewer = ({ pdfFile }: MainViewerProps) => {
  const { 
    numPages, setNumPages, 
    scale, rotation, pdfVersion, 
    viewMode, activePageIndex, setActivePageIndex,
    selectedPages, togglePageSelection 
  } = useEditorStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const onResize = () => containerRef.current && setContainerWidth(containerRef.current.clientWidth);
    const timer = setTimeout(onResize, 100);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, [viewMode]);

  const pageWidth = containerWidth ? Math.min(containerWidth - 32, 800) * scale : 600;

  const handlePageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePageSelection(index, e.ctrlKey || e.metaKey);
    setActivePageIndex(index);
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (activePageIndex >= numPages) setActivePageIndex(Math.max(0, numPages - 1));
    setTimeout(() => {
      document.getElementById(`page_scroll_${activePageIndex}`)?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }, 100);
  };

  const safePageIndex = Math.min(Math.max(0, activePageIndex), Math.max(0, numPages - 1));
  const safePageNumber = safePageIndex + 1;

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-y-auto overflow-x-hidden flex justify-center p-4"
    >
      <Document
        key={`main_doc_${pdfVersion}`} 
        file={pdfFile}
        onLoadSuccess={handleDocumentLoadSuccess}
        loading={<div className="mt-20 flex flex-col items-center gap-2"><Loader2 className="animate-spin text-blue-500" /> Loading PDF...</div>}
        className="max-w-full"
      >
        {/* MODE 1: SCROLL VIEW (Uses LazyPage for performance) */}
        {viewMode === 'scroll' && Array.from(new Array(numPages), (el, index) => (
          <div 
            id={`page_scroll_${index}`}
            key={`page_scroll_${index}_${pdfVersion}_${rotation}`}
            onClick={(e) => handlePageClick(index, e)}
            className={`mb-6 shadow-lg transition-all duration-200 cursor-pointer relative group ${selectedPages.has(index) ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-slate-300'}`}
          >
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded z-10 pointer-events-none">{index + 1}</div>
            
            {/* FIX: Use LazyPage here to prevent "TextLayer task cancelled" */}
            <LazyPage 
              pageNumber={index + 1} 
              width={pageWidth} 
              rotation={rotation}
              scale={1.0} 
            />
          </div>
        ))}

        {/* MODE 2: SINGLE VIEW (Standard Page is fine here) */}
        {viewMode === 'single' && numPages > 0 && (
          <div className="shadow-2xl transition-all duration-200 h-fit">
            <Page 
              key={`page_single_${safePageIndex}_${rotation}`} 
              pageNumber={safePageNumber} 
              width={pageWidth} 
              rotate={rotation} 
              scale={1.0} 
              renderTextLayer={true} 
              renderAnnotationLayer={true} 
              className="bg-white" 
            />
          </div>
        )}
      </Document>
    </div>
  );
};