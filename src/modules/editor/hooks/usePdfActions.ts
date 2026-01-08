import { useEditorStore } from '@/modules/editor/store';
import { PdfProcessor } from '@/lib/pdf-processor/core';

export const usePdfActions = () => {
  const { 
    pdfBytes, updatePdfBytes, selectedPages, activePageIndex, deselectAll 
  } = useEditorStore();

  const deleteSelectedPages = async () => {
    if (!pdfBytes || selectedPages.size === 0) return;
    if (confirm(`Delete ${selectedPages.size} selected page(s)?`)) {
      const indices = Array.from(selectedPages);
      const newBytes = await PdfProcessor.deletePages(pdfBytes, indices);
      updatePdfBytes(newBytes);
      deselectAll();
    }
  };

  const addBlankPage = async () => {
    if (!pdfBytes) return;
    const index = activePageIndex + 1;
    const newBytes = await PdfProcessor.addBlankPage(pdfBytes, index);
    updatePdfBytes(newBytes);
  };

  const rotateSelectedPages = async (angle: number = 90) => {
    if (!pdfBytes || selectedPages.size === 0) return;
    const indices = Array.from(selectedPages);
    const newBytes = await PdfProcessor.rotatePages(pdfBytes, indices, angle);
    updatePdfBytes(newBytes);
  };

  return { deleteSelectedPages, addBlankPage, rotateSelectedPages };
};