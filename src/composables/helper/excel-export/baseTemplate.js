import { Formatters } from './utils/formatters.js';

export class BaseTemplate {
  static wrapExcelDocument(content, title) {
    return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${title}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
                <x:Print>
                  <x:ValidPrinterInfo/>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; }
        td { mso-number-format:"\\@"; padding: 4px 8px; font-family: Arial, sans-serif; }
        th { background-color: #02BD00; color: white; padding: 8px; font-weight: bold; }
        .number { mso-number-format: "#,##0"; text-align: right; }
        .currency { mso-number-format: "\\#\\#\\#\\#\\#\\#\\#0"; text-align: right; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>`;
  }

  static generateHeader(title, subtitle = '') {
    const escapedTitle = Formatters.escapeHtml(title);
    const escapedSubtitle = subtitle ? Formatters.escapeHtml(subtitle) : '';
    
    return `
    <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #02BD00; padding-bottom: 15px;">
      <h1 style="margin: 0; color: #333;">${escapedTitle}</h1>
      ${escapedSubtitle ? `<h3 style="margin: 10px 0 0 0; color: #666;">${escapedSubtitle}</h3>` : ''}
      <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
        Generated on: ${new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>`;
  }

  // Helper method untuk consistency
  static escapeHtml(text) {
    return Formatters.escapeHtml(text);
  }

  static formatDate(dateString) {
    return Formatters.formatDate(dateString);
  }

  static formatCurrency(amount) {
    return Formatters.formatCurrency(amount);
  }
}