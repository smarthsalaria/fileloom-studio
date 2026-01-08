// src/lib/setup-pdf-worker.ts
import { pdfjs } from 'react-pdf';

export const setupPdfWorker = () => {
  if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
};