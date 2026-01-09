'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// This is the "Gate" that stops Server Side Rendering (ssr: false)
const PdfEditor = dynamic(
  () => import('@/modules/editor/components/PdfEditorShell'),
  { 
    ssr: false, 
    loading: () => (
      // UPDATED: Added dark mode background and text colors for a smooth startup
      <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-950 transition-colors">
         <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Studio...</p>
         </div>
      </div>
    )
  }
);

// This is the default page that Next.js looks for
export default function Home() {
  return <PdfEditor />;
}