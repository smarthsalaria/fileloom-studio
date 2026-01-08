'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export const ThumbnailStrip = () => {
  const { 
    pdfBytes, numPages, activePageIndex, setActivePageIndex, 
    selectedPages, togglePageSelection, pdfVersion 
  } = useEditorStore();

  const activeThumbRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(String(activePageIndex + 1));
  const [localNumPages, setLocalNumPages] = useState<number>(numPages);

  useEffect(() => {
    setLocalNumPages(numPages);
  }, [numPages]);

  useEffect(() => {
    setInputValue(String(activePageIndex + 1));
  }, [activePageIndex]);

  const localPdfData = useMemo(() => 
    pdfBytes ? { data: pdfBytes.slice(0) } : null
  , [pdfBytes, pdfVersion]);

  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({ 
        behavior: 'smooth', block: 'nearest', inline: 'center' 
      });
    }
  }, [activePageIndex]);

  const commitPageChange = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val) && val >= 1 && val <= numPages) {
      setActivePageIndex(val - 1);
    } else {
      setInputValue(String(activePageIndex + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const isSelected = selectedPages.has(index);
    if (checked !== isSelected) {
      togglePageSelection(index, true); 
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setLocalNumPages(numPages);
  };

  if (!localPdfData) return null;
  
  // Hide if only 1 page (no need for strip)
  if (localNumPages <= 1) return null;

  return (
    <div className="w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex flex-col shrink-0">
      
      {/* TOP BAR: Pagination */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 bg-slate-50 border-b">
        <div className="text-xs text-slate-400 font-medium w-0 md:w-20 hidden md:block">
           {selectedPages.size > 0 && `${selectedPages.size} Selected`}
        </div>

        <div className="flex items-center gap-1 md:gap-2 mx-auto md:mx-0">
          <Button 
            variant="ghost" size="icon" className="h-8 w-8" 
            onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
            disabled={activePageIndex <= 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1 md:gap-2 text-sm font-medium text-slate-600 bg-white px-2 py-1 rounded border shadow-sm">
            <span className="text-slate-400 text-xs uppercase tracking-wider hidden sm:inline">Page</span>
            <Input 
              className="w-10 h-6 text-center p-0 border-0 focus-visible:ring-0 font-bold text-slate-800" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={commitPageChange}
              onKeyDown={handleKeyDown}
            />
            <span className="text-slate-400 text-xs whitespace-nowrap">/ {numPages}</span>
          </div>

          <Button 
            variant="ghost" size="icon" className="h-8 w-8" 
            onClick={() => setActivePageIndex(Math.min(numPages - 1, activePageIndex + 1))}
            disabled={activePageIndex >= numPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-0 md:w-20 hidden md:block"></div>
      </div>
      
      {/* THUMBNAILS */}
      <div className="h-28 md:h-32 overflow-x-auto flex items-center gap-3 p-2 md:p-4 bg-slate-100/50 touch-pan-x">
         <Document 
            file={localPdfData} 
            className="flex gap-3 md:gap-4"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
         >
          {Array.from(new Array(localNumPages), (el, index) => (
            <div 
              key={`thumb_${index}_${pdfVersion}`}
              ref={index === activePageIndex ? activeThumbRef : null}
              onClick={() => setActivePageIndex(index)}
              className={`
                relative min-w-[70px] md:min-w-[80px] h-[90px] md:h-[100px] bg-white cursor-pointer transition-all duration-200 flex items-center justify-center
                border group
                ${activePageIndex === index ? 'border-blue-500 ring-1 ring-blue-500 shadow-md scale-105 z-10' : 'border-slate-300 hover:border-slate-400 opacity-90'}
                ${selectedPages.has(index) ? 'bg-blue-50/50' : ''}
              `}
            >
              {/* Checkbox */}
              <div 
                className="absolute top-0 right-0 p-1.5 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox 
                  checked={selectedPages.has(index)}
                  onCheckedChange={(checked) => handleCheckboxChange(index, checked === true)}
                  className="h-5 w-5 bg-white/90 border-slate-400 data-[state=checked]:bg-blue-600 shadow-sm"
                />
              </div>

              {/* PDF Page Image Only */}
              <div className="pointer-events-none w-full h-full flex items-center justify-center overflow-hidden">
                <Page 
                  pageNumber={index + 1} 
                  width={80} // Fixed width for both mobile/desktop (CSS scales container)
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                />
              </div>
              
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                {index + 1}
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};  