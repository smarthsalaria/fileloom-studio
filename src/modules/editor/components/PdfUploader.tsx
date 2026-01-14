'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { Upload, AlertCircle } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

export const PdfUploader = () => {
  const { setPdf } = useEditorStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    try {
      setIsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Initialize the store with the new file
      setPdf(file, uint8Array);
      
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read the file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [setPdf]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Header Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
            Upload your PDF
          </h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">
            Drag and drop your file here, or click to browse.
          </p>
        </div>

        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={`
            relative group cursor-pointer flex flex-col items-center justify-center 
            w-full h-64 rounded-xl border-2 border-dashed transition-all duration-200
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]' 
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }
            ${error ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4 p-4">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragActive 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 dark:group-hover:text-blue-400'
              } 
            `}>
              {isLoading ? (
                <div className="h-8 w-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-8 w-8" />
              )}
            </div>
            
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors">
                {isDragActive ? "Drop PDF now" : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 transition-colors">
                PDF files up to 50MB (Client-side only)
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-900 transition-colors">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Features List */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 justify-center transition-colors">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
             99.9% Privacy Client-Side Processing (Added Umami Cloud for Analytics)
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 justify-center transition-colors">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
             Instant Editing
          </div>
        </div>

      </div>
    </div>
  );
};