'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// This is the "Gate" that stops Server Side Rendering (ssr: false)
const PdfEditor = dynamic(
  () => import('@/modules/editor/components/PdfEditorShell'),
  { 
    ssr: false, 
    loading: () => <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  }
);

// This is the default page that Next.js looks for
export default function Home() {
  return <PdfEditor />;
}