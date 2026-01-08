import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { FileUp } from 'lucide-react';
import { useEditorStore } from '@/modules/editor/store';

export const PdfUploader = () => {
  const { setPdf, setScale, setRotation } = useEditorStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const buffer = await file.arrayBuffer();
        setPdf(file, new Uint8Array(buffer));
        setScale(1.0);
        setRotation(0);
      }
    },
  });

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card {...getRootProps()} className={`p-10 w-full max-w-xl text-center border-2 border-dashed cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}>
        <input {...getInputProps()} />
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileUp className="text-blue-600 w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-700">Upload PDF</h3>
        <p className="text-slate-500 mt-2">Drag & drop or click to browse</p>
      </Card>
    </div>
  );
};