'use client';

import React, { useMemo, useState } from 'react'; 
import { useEditorStore } from '@/modules/editor/store';
import { setupPdfWorker } from '@/lib/setup-pdf-worker';
import { Button } from '@/components/ui/button';
import { 
  Menu, Eye, Layout, LayoutList, X, ZoomIn, ZoomOut, Save, 
  Mail, Github, Linkedin, Twitter
} from 'lucide-react';

// --- SUB-COMPONENTS ---
import { PdfUploader } from './PdfUploader';
import { EditorSidebar } from './EditorSidebar';
import { MainViewer } from './MainViewer';
import { ThumbnailStrip } from './ThumbnailStrip';
import { BusyOverlay } from './BusyOverlay';

// --- HOOKS ---
import { usePdfActions } from '@/modules/editor/hooks/usePdfActions';

// --- ADS & THEME ---
import { DesktopAdSidebar } from './ads/DesktopAdSidebar';
import { MobileFloatingAd } from './ads/MobileFloatingAd';
import { ThemeToggle } from '@/components/ThemeToggle'; 
import { PrivacyDialog } from '@/components/privacy-dialog';

// Initialize Worker
setupPdfWorker();

export default function PdfEditorShell() {
  const { 
    pdfBytes, 
    viewMode, setViewMode,
    scale, setScale,
    pageRotations
  } = useEditorStore();

  const { saveChanges } = usePdfActions();
  
  // Check if there are virtual changes (rotations) pending save
  const hasChanges = Object.keys(pageRotations).length > 0;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pdfVersion, setPdfVersion] = useState(0);

  // Memoize the file data for the Main Viewer to prevent unnecessary re-renders
  const pdfFileMain = useMemo(() => 
    pdfBytes ? { data: pdfBytes.slice(0) } : undefined
  , [pdfBytes, pdfVersion]);

  const handlePreview = () => {
    if (!pdfBytes) return;
    
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleZoomIn = () => setScale(Math.min(2.5, scale + 0.25));
  const handleZoomOut = () => setScale(Math.max(0.5, scale - 0.25));

  return (
    // ROOT CONTAINER: Handles Full Height & Dark Mode Background
    <div className="flex flex-col h-dvh bg-slate-100 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      
      {/* 0. GLOBAL OVERLAYS */}
      <BusyOverlay />
      <MobileFloatingAd />

      {/* 1. HEADER */}
      <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-30 shrink-0 transition-colors duration-300">
        
        {/* LEFT: Logo & Mobile Menu */}
        <div className="flex items-center gap-1 md:gap-3">
          

          {/* Mobile Menu Toggle */}
          {pdfBytes && (
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-700 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Logo */}
          <h1 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <span className="text-red-600">FileLoom</span> <span className="hidden sm:inline">Studio</span>
          </h1>
        </div>

        {/* RIGHT: Tools & Toggles */}
        <div className="flex items-center gap-2">
          {/* Save Button (Only appears when changes exist) */}
          {hasChanges && (
            <Button size="sm" onClick={saveChanges} className="bg-blue-600 hover:bg-blue-700 text-white animate-pulse cursor-pointer">
              <Save className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Save Changes</span>
            </Button>
          )}
          <ThemeToggle />

          {pdfBytes && (
            <>
              {/* View Mode Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-md transition-colors">
                <Button 
                  variant={viewMode === 'scroll' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`h-7 px-2 cursor-pointer ${viewMode === 'scroll' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  onClick={() => setViewMode('scroll')}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'single' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={`h-7 px-2 cursor-pointer ${viewMode === 'single' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  onClick={() => setViewMode('single')}
                >
                  <Layout className="w-4 h-4" />
                </Button>
              </div>

              {/* Zoom Controls (Desktop) */}
              <div className="hidden lg:flex items-center gap-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-1 text-slate-700 dark:text-slate-200 transition-colors">
                 <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={handleZoomOut}><ZoomOut className="w-3 h-3" /></Button>
                 <span className="text-xs font-medium w-8 text-center">{Math.round(scale * 100)}%</span>
                 <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={handleZoomIn}><ZoomIn className="w-3 h-3" /></Button>
              </div>

              {/* Preview Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview} 
                // CHANGED: Removed 'hidden'. Added 'px-2' for better icon sizing on mobile.
                className="flex items-center dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 px-2 sm:px-3 cursor-pointer"
              >
                <Eye className="w-4 h-4 sm:mr-1" /> {/* Icon is always visible */}
                
                {/* Text is hidden on mobile (default), visible on sm+ screens */}
                <span className="hidden sm:inline ">Preview</span>
              </Button>

              {/* Close / Reload */}
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: Tools Sidebar */}
        {pdfBytes && (
          <EditorSidebar isOpen={isMobileMenuOpen} />
        )}

        {/* CENTER: Work Area */}
        <main 
          className="flex-1 relative flex flex-col bg-slate-100/50 dark:bg-slate-950 min-w-0 transition-colors duration-300"
          onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
        >
          {!pdfBytes ? (
             <PdfUploader />
          ) : (
            <>
              {/* MAIN VIEWER */}
              <div className="flex-1 overflow-hidden min-h-0 relative">
                <MainViewer pdfFile={pdfFileMain} />
                
                {/* Mobile Zoom (Floating) */}
                <div className="lg:hidden absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                   <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-8 w-8 opacity-80" onClick={handleZoomIn}>
                     <ZoomIn className="w-4 h-4"/>
                   </Button>
                   <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-8 w-8 opacity-80" onClick={handleZoomOut}>
                     <ZoomOut className="w-4 h-4"/>
                   </Button>
                </div>
              </div>

              {/* BOTTOM THUMBNAILS - Always visible for Reordering */}
              <ThumbnailStrip />
              
            </>
          )}
        </main>
        
        {/* DESKTOP ADS */}
        <DesktopAdSidebar />
      </div>
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 mt-0 md:mt-0">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Flex Container: Stacks on mobile, Spreads on Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* SECTION 1: Branding (Top on mobile, Left on desktop) */}
          <div className="text-center md:text-left space-y-0.5">
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Designed & Developed by <span className="text-slate-900 dark:text-slate-100 font-semibold">Smarth Salaria</span>
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              © 2026 // ALL RIGHTS RESERVED
            </p>
          </div>

          {/* SECTION 2: Privacy + Socials (Side-by-side on Mobile & Desktop) */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Privacy Link */}
            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
              <PrivacyDialog />
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/smarthsalaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
              
              <a 
                href="https://linkedin.com/in/smarthsalaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 md:p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>

              <a 
                href="mailto:smarthsalaria@gmail.com"
                className="p-1.5 md:p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all duration-300"
                aria-label="Contact"
              >
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
    </div>
    
    
  );
}