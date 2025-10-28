// composables/usePdfExport.js
import html2pdf from 'html2pdf.js';

export function usePdfExport() {
  const exportToPdf = (element, options = {}) => {
    const defaultOptions = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      ...options
    };

    return html2pdf()
      .from(element)
      .set(defaultOptions)
      .save();
  };

  const exportToPdfFromHtml = (htmlString, options = {}) => {
    const defaultOptions = {
      margin: 10,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      ...options
    };

    return html2pdf()
      .from(htmlString)
      .set(defaultOptions)
      .save();
  };

  return {
    exportToPdf,
    exportToPdfFromHtml
  };
}