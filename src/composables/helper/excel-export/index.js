// services/excelExport/index.js

import { BaseTemplate } from './baseTemplate.js';
import { TemplateRegistry, AvailableReports } from './templates/index.js';

export class ExcelExportService {
  static async generateExcel(exportData) {
    const { mode, titel, data, options = {} } = exportData;
    
    // Validasi mode
    if (!TemplateRegistry[mode]) {
      const availableModes = Object.keys(TemplateRegistry).join(', ');
      throw new Error(`Template mode '${mode}' tidak ditemukan. Available modes: ${availableModes}`);
    }

    // Validasi data
    if (!data) {
      throw new Error('Data export tidak boleh kosong');
    }

    try {
      console.log(`Generating Excel for mode: ${mode}`, data);
      
      // Generate content dari template yang sesuai
      const templateClass = TemplateRegistry[mode];
      const content = templateClass.generate({
        ...data,
        options: { ...options, title: titel }
      });

      // Wrap dengan template Excel
      const excelContent = BaseTemplate.wrapExcelDocument(content, titel, options);
      
      return excelContent;
    } catch (error) {
      console.error('Error generating Excel:', error);
      throw new Error(`Gagal generate Excel: ${error.message}`);
    }
  }

  static async downloadExcel(exportData, filename = null) {
    try {
      const excelContent = await this.generateExcel(exportData);
      const finalFilename = filename || `${exportData.titel}_${new Date().getTime()}.xls`;
      
      this.triggerDownload(excelContent, finalFilename);
      
      return { success: true, filename: finalFilename };
    } catch (error) {
      console.error('Download Excel error:', error);
      return { success: false, error: error.message };
    }
  }

  static triggerDownload(content, filename) {
    try {
      const blob = new Blob([content], { 
        type: 'application/vnd.ms-excel' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      throw new Error(`Gagal mendownload file: ${error.message}`);
    }
  }

  static getAvailableReports() {
    return AvailableReports;
  }

  static registerTemplate(mode, templateClass, reportName) {
    TemplateRegistry[mode] = templateClass;
    AvailableReports[mode] = reportName;
  }

  // Utility untuk debug
  static getTemplateInfo() {
    return {
      availableTemplates: Object.keys(TemplateRegistry),
      availableReports: AvailableReports
    };
  }
}