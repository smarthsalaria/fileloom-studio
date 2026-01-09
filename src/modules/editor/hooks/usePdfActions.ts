import { useEditorStore } from '@/modules/editor/store';
import { PdfProcessor } from '@/lib/pdf-processor/core';
import { PDFDocument, degrees } from 'pdf-lib';

export const usePdfActions = () => {
  const { 
    pdfBytes, updatePdfBytes, selectedPages, activePageIndex, 
    deselectAll, pageOrder, setPageOrder, setIsProcessing,
    pageRotations, setPageRotation, numPages
  } = useEditorStore();

  const commitPageOrderAndRotations = async (bytes: Uint8Array, order: number[], rotations: Record<number, number>) => {
    // 1. Load the Source Document
    const pdfDoc = await PDFDocument.load(bytes);
    
    // 2. Create a New Document
    const newPdfDoc = await PDFDocument.create();

    // 3. Fallback: If pageOrder is empty, assume natural order [0, 1, 2...]
    // This prevents saving an empty file if the user didn't reorder anything.
    const finalOrder = order.length > 0 
      ? order 
      : Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
    
    // 4. Copy pages from Source to New Doc
    const pages = await newPdfDoc.copyPages(pdfDoc, finalOrder);
    
    // 5. Add pages to New Doc AND Apply Rotations
    pages.forEach((page, visualIndex) => {
      const rotationToAdd = rotations[visualIndex] || 0;
      
      if (rotationToAdd !== 0) {
        // Get existing rotation (e.g., file is already 90)
        const currentAngle = page.getRotation().angle;
        // Add new rotation (e.g., 90 + 90 = 180)
        page.setRotation(degrees((currentAngle + rotationToAdd) % 360));
      }
      
      newPdfDoc.addPage(page);
    });
    
    // 6. Return new bytes
    return await newPdfDoc.save();
  };

  const saveChanges = async () => {
    if (!pdfBytes) return;
    try {
      setIsProcessing(true);
      // Small delay to allow UI to show the spinner
      await new Promise(resolve => setTimeout(resolve, 50));

      const newBytes = await commitPageOrderAndRotations(pdfBytes, pageOrder, pageRotations);
      
      // Update store with new file
      updatePdfBytes(newBytes, true);
      
      // OPTIONAL: Deselect pages after save to avoid confusion
      deselectAll();

    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save changes.");
    } finally {
      setIsProcessing(false);
    }
  };

  // VIRTUAL ROTATE (Instant)
  const rotateSelectedPages = (angle: number = 90) => {
    if (selectedPages.size === 0) return;
    
    selectedPages.forEach(visualIndex => {
      // 1. Get current virtual rotation
      const currentRotation = pageRotations[visualIndex] || 0;
      // 2. Add angle (90)
      const newRotation = (currentRotation + angle) % 360;
      // 3. Update Store
      setPageRotation(visualIndex, newRotation);
    });
  };

  // VIRTUAL REORDER (Instant)
  const reorderPage = (fromIndex: number, toIndex: number) => {
    const newOrder = [...pageOrder];
    // If pageOrder was empty, fill it first
    if (newOrder.length === 0) {
       for(let i=0; i<numPages; i++) newOrder.push(i);
    }

    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setPageOrder(newOrder);

    // If there were rotations, we must commit them because 
    // tracking rotation of a moved page purely by index is complex.
    if (Object.keys(pageRotations).length > 0) {
       saveChanges().then(() => {
          // Logic to re-apply the move on the clean file if needed
          // But usually, saveChanges resets everything, so the user might need to drag again.
          // For a perfect UX, we would map the rotations to the new IDs, but that's complex.
          // Simple approach: Auto-save commits the state.
       });
    }
  };

  // Simple Wrappers for existing Logic
  const deleteSelectedPages = async () => {
    if (!pdfBytes || selectedPages.size === 0) return;
    if (confirm(`Delete ${selectedPages.size} selected page(s)?`)) {
       await saveChanges(); // Commit any pending rotations first
       // Use fresh state
       const currentBytes = useEditorStore.getState().pdfBytes!;
       const indices = Array.from(selectedPages);
       const finalBytes = await PdfProcessor.deletePages(currentBytes, indices);
       updatePdfBytes(finalBytes, true);
       deselectAll();
    }
  };

  const addBlankPage = async () => {
    await saveChanges();
    const currentBytes = useEditorStore.getState().pdfBytes!;
    const index = activePageIndex + 1;
    const finalBytes = await PdfProcessor.addBlankPage(currentBytes, index);
    updatePdfBytes(finalBytes, true);
  }

  return { 
    rotateSelectedPages, 
    reorderPage, 
    deleteSelectedPages, 
    addBlankPage, 
    saveChanges 
  };
};