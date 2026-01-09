import { create } from 'zustand';

interface EditorState {
  pdfFile: File | null;
  pdfBytes: Uint8Array | null;
  pdfVersion: number;
  numPages: number;

  // Virtual Order: Positive numbers = Original Page Index. 
  pageOrder: number[];

  // NEW: Track rotation per page (Visual Index -> Degrees)
  pageRotations: Record<number, number>;

  scale: number;
  // Global view rotation
  rotation: number;

  selectedPages: Set<number>;
  viewMode: 'scroll' | 'single';
  activePageIndex: number;
  isTextSelectMode: boolean;
  isProcessing: boolean;

  // History
  history: Uint8Array[];
  historyIndex: number;

  // Actions
  setIsProcessing: (isBusy: boolean) => void;
  setPdf: (file: File, bytes: Uint8Array) => void;
  updatePdfBytes: (bytes: Uint8Array, saveToHistory?: boolean) => void;
  setPageOrder: (newOrder: number[]) => void;

  // NEW: Set rotation for specific pages
  setPageRotation: (pageIndex: number, angle: number) => void;

  undo: () => void;
  redo: () => void;

  setNumPages: (n: number) => void;
  setScale: (n: number) => void;
  setRotation: (n: number) => void;
  togglePageSelection: (index: number, multi?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setViewMode: (mode: 'scroll' | 'single') => void;
  setActivePageIndex: (n: number) => void;
  toggleTextSelectMode: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  // ----------------------------------------------------------------
  // INITIAL STATE
  // ----------------------------------------------------------------
  pdfFile: null,
  pdfBytes: null,
  pdfVersion: 0,
  numPages: 0,
  pageOrder: [],

  // Initialize empty rotations
  pageRotations: {},

  scale: 1.0,
  rotation: 0,
  selectedPages: new Set(),
  viewMode: 'scroll',
  activePageIndex: 0,
  history: [],
  historyIndex: -1,
  isTextSelectMode: false,
  isProcessing: false,

  // ----------------------------------------------------------------
  // ACTIONS
  // ----------------------------------------------------------------
  setIsProcessing: (isBusy) => set({ isProcessing: isBusy }),

  setPdf: (file, bytes) => set({
    pdfFile: file,
    pdfBytes: bytes,
    pdfVersion: 0,
    selectedPages: new Set(),
    activePageIndex: 0,
    history: [bytes],
    historyIndex: 0,
    isTextSelectMode: false,
    pageOrder: [],
    pageRotations: {}, // Reset rotations on new file
    isProcessing: false
  }),

  updatePdfBytes: (bytes, saveToHistory = true) => set((state) => {
    const newHistory = saveToHistory
      ? [...state.history.slice(0, state.historyIndex + 1), bytes]
      : state.history;

    return {
      pdfBytes: bytes,
      pdfVersion: state.pdfVersion + 1,
      history: newHistory,
      historyIndex: saveToHistory ? newHistory.length - 1 : state.historyIndex,

      // IMPORTANT: Reset order and rotations after a "hard" update (like delete/merge)
      // because the page indices physically change in the new PDF bytes.
      pageOrder: [],
      pageRotations: {}, 
      selectedPages: new Set()
    };
  }),

  setPageOrder: (newOrder) => set({ pageOrder: newOrder }),

  // Update rotation for a specific visual index
  setPageRotation: (index, angle) => set((state) => ({
    pageRotations: {
      ...state.pageRotations,
      [index]: angle
    }
  })),

  setNumPages: (n) => set((state) => ({
    numPages: n,
    // If pageOrder length matches new count, keep it; otherwise reset to 0..N
    pageOrder: state.pageOrder.length === n 
      ? state.pageOrder 
      : Array.from({ length: n }, (_, i) => i)
  })),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    const newIndex = state.historyIndex - 1;
    return {
      pdfBytes: state.history[newIndex],
      historyIndex: newIndex,
      pdfVersion: state.pdfVersion + 1,
      pageOrder: [],
      pageRotations: {}
    };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    const newIndex = state.historyIndex + 1;
    return {
      pdfBytes: state.history[newIndex],
      historyIndex: newIndex,
      pdfVersion: state.pdfVersion + 1,
      pageOrder: [],
      pageRotations: {}
    };
  }),

  setScale: (n) => set({ scale: n }),
  setRotation: (n) => set({ rotation: n }),

  togglePageSelection: (index, multi = false) => set((state) => {
    const newSet = new Set(multi ? state.selectedPages : []);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    return { selectedPages: newSet, activePageIndex: index };
  }),

  selectAll: () => set((state) => {
    const newSet = new Set<number>();
    for (let i = 0; i < state.numPages; i++) newSet.add(i);
    return { selectedPages: newSet };
  }),

  deselectAll: () => set({ selectedPages: new Set() }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActivePageIndex: (n) => set({ activePageIndex: n }),
  toggleTextSelectMode: () => set((state) => ({ isTextSelectMode: !state.isTextSelectMode })),
}));