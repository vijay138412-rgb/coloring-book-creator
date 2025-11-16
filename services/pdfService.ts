
// Assume jspdf is loaded from a script tag in index.html
declare const jspdf: any;

export const createColoringBookPdf = async (images: string[], title: string) => {
  try {
    const doc = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const imgMaxWidth = pageWidth - (margin * 2);
    const imgMaxHeight = pageHeight - (margin * 2) - 10; // Reserve space for page number

    for (let i = 0; i < images.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      const imgData = `data:image/png;base64,${images[i]}`;
      
      const img = new Image();
      img.src = imgData;
      await new Promise(resolve => { img.onload = resolve });

      const imgRatio = img.width / img.height;
      
      let finalWidth = imgMaxWidth;
      let finalHeight = finalWidth / imgRatio;

      if (finalHeight > imgMaxHeight) {
        finalHeight = imgMaxHeight;
        finalWidth = finalHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = margin; // Start image from top margin

      doc.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

      // Add page numbering
      doc.setFontSize(10);
      doc.setTextColor(150); // Light gray
      
      const pageLabel = i === 0 ? 'Cover' : `Page ${i}`;
      const textWidth = doc.getTextWidth(pageLabel);
      
      // Position at the bottom center
      doc.text(pageLabel, (pageWidth - textWidth) / 2, pageHeight - 7);
    }
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeTitle}_coloring_book.pdf`);
    return true;
  } catch (error) {
    console.error("Failed to create PDF:", error);
    return false;
  }
};
