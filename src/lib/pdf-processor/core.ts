import { PDFDocument, PageSizes, degrees } from 'pdf-lib';

export const PdfProcessor = {
  // 1. DELETE PAGES (Sort indices desc to avoid shifting issues)
  async deletePages(pdfBytes: Uint8Array, pageIndices: number[]): Promise<Uint8Array> {
    const cleanBytes = new Uint8Array(pdfBytes);
    const pdfDoc = await PDFDocument.load(cleanBytes);
    
    // Sort descending so we delete from end first
    const sortedIndices = pageIndices.sort((a, b) => b - a);
    sortedIndices.forEach(idx => {
      if (idx >= 0 && idx < pdfDoc.getPageCount()) {
        pdfDoc.removePage(idx);
      }
    });
    return pdfDoc.save();
  },

  // 2. ROTATE PAGES (Iterate over all selected)
  async rotatePages(pdfBytes: Uint8Array, pageIndices: number[], angle: number): Promise<Uint8Array> {
    const cleanBytes = new Uint8Array(pdfBytes);
    const pdfDoc = await PDFDocument.load(cleanBytes);
    
    pageIndices.forEach(idx => {
      if (idx >= 0 && idx < pdfDoc.getPageCount()) {
        const page = pdfDoc.getPage(idx);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }
    });
    return pdfDoc.save();
  },

  // 3. ADD BLANK (No changes needed, adds after active page)
  async addBlankPage(pdfBytes: Uint8Array, atIndex: number = -1): Promise<Uint8Array> {
    const cleanBytes = new Uint8Array(pdfBytes);
    const pdfDoc = await PDFDocument.load(cleanBytes);
    const page = pdfDoc.insertPage(atIndex === -1 ? pdfDoc.getPageCount() : atIndex, PageSizes.A4);
    return pdfDoc.save();
  }
};