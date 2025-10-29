export class Formatters {
    static formatDate(dateString) {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return dateString;
      }
    }
  
    static formatDateTime(dateString) {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch {
        return dateString;
      }
    }
  
    static formatCurrency(amount) {
      if (amount === null || amount === undefined || amount === '') return '0';
      const num = parseFloat(amount);
      if (isNaN(num)) return '0';
      
      return new Intl.NumberFormat('id-ID').format(num);
    }
  
    static escapeHtml(text) {
      if (text === null || text === undefined) return '';
      
      const textStr = text.toString();
      const div = document.createElement('div');
      div.textContent = textStr;
      return div.innerHTML.replace(/\n/g, '<br>');
    }
  
    static getBaseUrl() {
      return window.location.origin + '/';
    }
  
    static formatNumber(value) {
      if (value === null || value === undefined || value === '') return '0';
      const num = parseFloat(value);
      return isNaN(num) ? '0' : num.toString();
    }
  
    // Helper untuk membersihkan string dari karakter khusus Excel
    static sanitizeForExcel(text) {
      if (!text) return '';
      return text.toString()
        .replace(/^[=+\-@]/, "'$&") // Escape formula characters at start
        .replace(/\t/g, ' ')        // Replace tabs with spaces
        .replace(/\r\n/g, ' ')      // Replace newlines with spaces
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ');
    }
  }