import { create } from 'zustand';

interface EditorState {
  pdfFile: File | null;
  pdfBytes: Uint8Array | null;
  pdfVersion: number; // Used to force re-renders
  numPages: number;
  scale: number;
  rotation: number; // Global View Rotation
  
  selectedPages: Set<number>; 
  viewMode: 'scroll' | 'single';
  activePageIndex: number; 

  setPdf: (file: File, bytes: Uint8Array) => void;
  updatePdfBytes: (bytes: Uint8Array) => void; // New helper
  setNumPages: (n: number) => void;
  setScale: (n: number) => void;
  setRotation: (n: number) => void;
  
  togglePageSelection: (index: number, multi?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setViewMode: (mode: 'scroll' | 'single') => void;
  setActivePageIndex: (n: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  pdfFile: null,
  pdfBytes: null,
  pdfVersion: 0,
  numPages: 0,
  scale: 1.0,
  rotation: 0,
  
  selectedPages: new Set(),
  viewMode: 'scroll',
  activePageIndex: 0,

  setPdf: (file, bytes) => set({ 
    pdfFile: file, 
    pdfBytes: bytes, 
    pdfVersion: 0,
    selectedPages: new Set(),
    activePageIndex: 0 
  }),
  
  // Use this when editing (Rotate/Delete) to increment version
  updatePdfBytes: (bytes) => set((state) => ({ 
    pdfBytes: bytes,
    pdfVersion: state.pdfVersion + 1 
  })),

  setNumPages: (n) => set({ numPages: n }),
  setScale: (n) => set({ scale: n }),
  setRotation: (n) => set({ rotation: n }),

  togglePageSelection: (index, multi = false) => set((state) => {
    const newSet = new Set(multi ? state.selectedPages : []);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    return { selectedPages: newSet, activePageIndex: index };
  }),

  selectAll: () => set((state) => {
    const newSet = new Set();
    for(let i=0; i<state.numPages; i++) newSet.add(i);
    return { selectedPages: newSet };
  }),

  deselectAll: () => set({ selectedPages: new Set() }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActivePageIndex: (n) => set({ activePageIndex: n }),
}));