'use client';

import React, { useMemo, useEffect, useRef, useState } from 'react'; 
import { useDropzone } from 'react-dropzone';
import { Document, Page } from 'react-pdf';
import { useEditorStore } from '@/modules/editor/store';
import { setupPdfWorker } from '@/lib/setup-pdf-worker';
import { PdfProcessor } from '@/lib/pdf-processor/core'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  FileUp, Loader2, ZoomIn, ZoomOut, RotateCw, X, 
  Trash2, PlusSquare, RefreshCw, Menu, Eye, 
  Layout, LayoutList, ChevronLeft, ChevronRight
} from 'lucide-react';

// CRITICAL: CSS for Text Selection
import 'react-pdf/dist/Page/AnnotationLayer.css';  
import 'react-pdf/dist/Page/TextLayer.css';       

// Initialize worker
setupPdfWorker();

export default function PdfEditorShell() {
  const { 
    pdfBytes, setPdf, numPages, setNumPages, 
    scale, setScale, rotation, setRotation,
    selectedPages, togglePageSelection, selectAll, deselectAll,
    viewMode, setViewMode, activePageIndex, setActivePageIndex
  } = useEditorStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pdfVersion, setPdfVersion] = useState(0);

  // Measure Container
  useEffect(() => {
    function onResize() {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    }
    const timer = setTimeout(onResize, 100);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, [isMobileMenuOpen, viewMode]);

  // FIX: Create TWO separate copies of the file data.
  // One for the Main Viewer, one for the Thumbnails.
  // This prevents the "Detached ArrayBuffer" crash.
  const pdfFileMain = useMemo(() => 
    pdfBytes ? { data: pdfBytes.slice(0) } : undefined
  , [pdfBytes, pdfVersion]);

  const pdfFileThumb = useMemo(() => 
    pdfBytes ? { data: pdfBytes.slice(0) } : undefined
  , [pdfBytes, pdfVersion]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const buffer = await file.arrayBuffer();
        setPdf(file, new Uint8Array(buffer));
        if (setScale) setScale(1.0);
      }
    },
  });

  // --- ACTIONS ---
  const handleUpdatePdf = (newBytes: Uint8Array) => {
    const blob = new Blob([newBytes], { type: 'application/pdf' });
    const file = new File([blob], "modified.pdf", { type: 'application/pdf' });
    setPdf(file, newBytes);
    setPdfVersion(v => v + 1);
  };

  const handleDeletePages = async () => {
    if (!pdfBytes || selectedPages.size === 0) return;
    if (confirm(`Delete ${selectedPages.size} selected page(s)?`)) {
      const indices = Array.from(selectedPages);
      const newBytes = await PdfProcessor.deletePages(pdfBytes, indices);
      handleUpdatePdf(newBytes);
      deselectAll();
    }
  };

  const handleAddBlankPage = async () => {
    if (!pdfBytes) return;
    const index = activePageIndex + 1;
    const newBytes = await PdfProcessor.addBlankPage(pdfBytes, index);
    handleUpdatePdf(newBytes);
  };

  const handleRotatePages = async () => {
    if (!pdfBytes || selectedPages.size === 0) return;
    const indices = Array.from(selectedPages);
    const newBytes = await PdfProcessor.rotatePages(pdfBytes, indices, 90);
    handleUpdatePdf(newBytes);
  };

  const handlePreview = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isMulti = e.ctrlKey || e.metaKey;
    togglePageSelection(index, isMulti);
    setActivePageIndex(index);
  };

  const pageWidth = containerWidth 
    ? Math.min(containerWidth - 48, 800) * scale 
    : 600;

  return (
    <div className="flex flex-col h-screen bg-slate-100 relative overflow-hidden">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm z-30">
        <div className="flex items-center gap-3">
          {pdfBytes && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-red-600">PDF</span> Studio
          </h1>
        </div>
        
        {pdfBytes && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-md">
              <Button 
                variant={viewMode === 'scroll' ? 'white' : 'ghost'} size="sm" className="h-7 px-2"
                onClick={() => setViewMode('scroll')}
              >
                <LayoutList className="w-4 h-4 mr-1" /> Scroll
              </Button>
              <Button 
                variant={viewMode === 'single' ? 'white' : 'ghost'} size="sm" className="h-7 px-2"
                onClick={() => setViewMode('single')}
              >
                <Layout className="w-4 h-4 mr-1" /> Single
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handlePreview} className="hidden sm:flex">
              <Eye className="w-4 h-4 mr-1" /> Preview
            </Button>

            <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="text-slate-500 hover:text-red-600">
              <X className="w-4 h-4 mr-1" /> Close
            </Button>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR */}
        {pdfBytes && (
          <aside className={`
            absolute lg:relative top-0 left-0 h-full w-64 bg-white border-r shadow-xl lg:shadow-none z-20 
            transition-transform duration-300 ease-in-out flex flex-col
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-slate-900 mb-2">Edit Tools</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={handleAddBlankPage}>
                  <PlusSquare className="w-4 h-4 mr-2 text-green-600" /> Insert Blank Page
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-600 disabled:opacity-50" 
                  onClick={handleRotatePages}
                  disabled={selectedPages.size === 0}
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-600" /> Rotate Selected
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50" 
                  onClick={handleDeletePages}
                  disabled={selectedPages.size === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
                </Button>
              </div>

               <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100 text-xs text-blue-700">
                <p className="font-semibold mb-1">Selection Info</p>
                {selectedPages.size === 0 ? "No pages selected." : `${selectedPages.size} page(s) selected.`}
              </div>
            </div>
          </aside>
        )}

        {/* CENTER VIEWER */}
        <main className="flex-1 relative flex flex-col bg-slate-100/50 min-w-0">
          {!pdfBytes ? (
             <div className="flex flex-1 items-center justify-center p-6">
                <Card {...getRootProps()} className="p-10 w-full max-w-xl text-center border-2 border-dashed cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><FileUp className="text-blue-600 w-8 h-8" /></div>
                  <h3 className="text-xl font-semibold text-slate-700">Upload PDF</h3>
                </Card>
             </div>
          ) : (
            <>
              {/* --- MAIN PDF DISPLAY --- */}
              {/* We use pdfFileMain here */}
              <div ref={containerRef} className={`w-full h-full overflow-y-auto overflow-x-hidden flex justify-center p-4 md:p-8 ${viewMode === 'single' ? 'pb-40' : 'pb-32'}`}>
                <Document
                  file={pdfFileMain}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<Loader2 className="animate-spin mt-20" />}
                  className="max-w-full"
                >
                  {/* MODE 1: SCROLL VIEW */}
                  {viewMode === 'scroll' && Array.from(new Array(numPages), (el, index) => (
                    <div 
                      key={`page_${index}_${pdfVersion}`}
                      onClick={(e) => handlePageClick(index, e)}
                      className={`mb-6 shadow-lg transition-all duration-200 cursor-pointer relative group ${selectedPages.has(index) ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-slate-300'}`}
                    >
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded z-10">
                        {index + 1}
                      </div>
                      <Page 
                        pageNumber={index + 1} 
                        width={pageWidth} 
                        scale={1.0} 
                        renderTextLayer={true} // Enabled for Main View
                        renderAnnotationLayer={true} // Enabled for Main View
                        className="bg-white" 
                      />
                    </div>
                  ))}

                  {/* MODE 2: SINGLE VIEW */}
                  {viewMode === 'single' && (
                    <div className="shadow-2xl transition-all duration-200">
                      <Page 
                        key={`single_${activePageIndex}_${pdfVersion}`} 
                        pageNumber={activePageIndex + 1} 
                        width={pageWidth} 
                        scale={1.0} 
                        renderTextLayer={true} // Enabled for Main View
                        renderAnnotationLayer={true} // Enabled for Main View
                        className="bg-white" 
                      />
                    </div>
                  )}
                </Document>
              </div>

              {/* --- BOTTOM THUMBNAIL STRIP --- */}
              {/* We use pdfFileThumb here (Separate Copy) */}
              {viewMode === 'single' && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-white border-t shadow-inner z-20 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-1 bg-slate-50 border-b text-xs text-slate-500">
                    <span>Page {activePageIndex + 1} of {numPages}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}><ChevronLeft className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setActivePageIndex(Math.min(numPages - 1, activePageIndex + 1))}><ChevronRight className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-x-auto flex items-center gap-3 p-3">
                     <Document file={pdfFileThumb}>
                      {Array.from(new Array(numPages), (el, index) => (
                        <div 
                          key={`thumb_${index}`}
                          onClick={(e) => handlePageClick(index, e)}
                          className={`
                            relative min-w-[60px] h-[80px] bg-slate-200 border cursor-pointer transition-all
                            ${selectedPages.has(index) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-300 hover:border-slate-400'}
                            ${activePageIndex === index ? 'scale-105 shadow-md' : 'opacity-80'}
                          `}
                        >
                          <Page 
                            pageNumber={index + 1} 
                            width={60} 
                            renderTextLayer={false} // Disabled for Thumbnails (Prevents Errors)
                            renderAnnotationLayer={false} // Disabled for Thumbnails
                          />
                          <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1">{index + 1}</div>
                        </div>
                      ))}
                    </Document>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}