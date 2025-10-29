# Excel Export Service Documentation

## 📋 Overview

Excel Export Service adalah modul reusable untuk menghasilkan file Excel/CSV dari data Vue.js aplikasi. Service ini menggunakan pendekatan template-based HTML yang kompatibel dengan Microsoft Excel.

## 🚀 Quick Start

### 1. Installation

```bash
npm install csv-generate
```

### 2. Project Structure

```
src/
├── services/
│   ├── excelExport/
│   │   ├── index.js              # Main service
│   │   ├── baseTemplate.js       # Base template wrapper
│   │   ├── templates/
│   │   │   ├── index.js          # Template registry
│   │   │   ├── userReport.js     # User report template
│   │   │   ├── laporanDataObat.js
│   │   │   └── ... (other templates)
│   │   └── utils/
│   │       └── formatters.js     # Formatting utilities
```

### 3. Basic Usage

```javascript
// Dalam Vue component
import { ExcelExportService } from '@/services/excelExport';

const exportData = {
  mode: 'user_report',
  titel: 'Laporan_User',
  data: {
    users: yourUserDataArray
  },
  options: {
    subtitle: 'Periode Januari 2024',
    includeTimestamp: true
  }
};

const result = await ExcelExportService.downloadExcel(exportData);
if (result.success) {
  console.log('File downloaded:', result.filename);
} else {
  console.error('Export failed:', result.error);
}
```

## 📁 File Documentation

### 1. Main Export Service (`index.js`)

**Fungsi Utama:**
- `generateExcel(exportData)` - Generate HTML content untuk Excel
- `downloadExcel(exportData, filename)` - Generate dan download file
- `getAvailableReports()` - Daftar report yang tersedia
- `registerTemplate()` - Register template baru

**Contoh Penggunaan:**
```javascript
// Basic export
await ExcelExportService.downloadExcel({
  mode: 'user_report',
  titel: 'User_Report',
  data: { users: userList }
});

// Dengan custom options
await ExcelExportService.downloadExcel({
  mode: 'user_report',
  titel: 'Laporan_Khusus',
  data: { users: filteredUsers },
  options: {
    subtitle: 'Data Filtered per Department',
    author: 'HR Department',
    includeTimestamp: false
  }
}, 'custom_filename.xls');
```

### 2. Base Template (`baseTemplate.js`)

**Fungsi:**
- `wrapExcelDocument(content, title, options)` - Wrap content dengan template Excel
- `generateHeader(title, subtitle)` - Generate header section

**Contoh:**
```javascript
// Manual template usage
const content = '<table>...</table>';
const excelContent = BaseTemplate.wrapExcelDocument(
  content, 
  'My Report',
  { author: 'My App' }
);
```

### 3. Formatters Utility (`formatters.js`)

**Available Functions:**

| Function | Description | Example |
|----------|-------------|---------|
| `formatDate()` | Format date to Indonesian | `"15/10/2023"` |
| `formatDateTime()` | Format datetime | `"15/10/2023 14:30:00"` |
| `formatCurrency()` | Format number to currency | `"1.000.000"` |
| `escapeHtml()` | Escape HTML characters | `"&lt;script&gt;"` |
| `sanitizeForExcel()` | Clean text for Excel | Escape formula chars |

**Usage:**
```javascript
import { Formatters } from '@/services/excelExport/utils/formatters';

const safeText = Formatters.escapeHtml(userInput);
const formattedDate = Formatters.formatDate('2023-10-15');
const currency = Formatters.formatCurrency(1000000);
```

### 4. Template Registry (`templates/index.js`)

**Current Available Reports:**

| Mode | Template Class | Description |
|------|----------------|-------------|
| `user_report` | UserReportTemplate | Laporan data user |
| `laporandataobat` | LaporanDataObatTemplate | Laporan data obat |
| `kasir_versipasien` | KasirVersiPasienTemplate | Kwitansi pasien |
| `pelayananperiksa` | PelayananPeriksaTemplate | Laporan pelayanan |

## 🛠️ Creating New Templates

### Step 1: Create Template File

```javascript
// services/excelExport/templates/myNewReport.js

import { BaseTemplate } from '../baseTemplate.js';
import { Formatters } from '../utils/formatters.js';

export class MyNewReportTemplate {
  static generate(exportData) {
    const { data, options = {} } = exportData;
    const { title = 'My New Report' } = options;

    const content = `
    ${BaseTemplate.generateHeader(title)}
    ${this.generateDataTable(data.items)}
    ${this.generateSummary(data.items)}`;

    return content;
  }

  static generateDataTable(items) {
    if (!items || items.length === 0) {
      return '<p>No data available</p>';
    }

    return `
    <table border="1" style="width: 100%;">
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, index) => this.generateTableRow(item, index)).join('')}
      </tbody>
    </table>`;
  }

  static generateTableRow(item, index) {
    return `
    <tr>
      <td class="number">${index + 1}</td>
      <td>${Formatters.escapeHtml(item.name)}</td>
      <td class="currency">${Formatters.formatCurrency(item.value)}</td>
    </tr>`;
  }

  static generateSummary(items) {
    const total = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
    
    return `
    <table border="1" style="width: 100%; margin-top: 20px;">
      <tr>
        <td><strong>Total Items</strong></td>
        <td class="number">${items.length}</td>
        <td><strong>Total Value</strong></td>
        <td class="currency">${Formatters.formatCurrency(total)}</td>
      </tr>
    </table>`;
  }
}
```

### Step 2: Register Template

```javascript
// services/excelExport/templates/index.js

import { MyNewReportTemplate } from './myNewReport.js';

// Tambahkan ke registry
export const TemplateRegistry = {
  // ... existing templates
  my_new_report: MyNewReportTemplate,
};

export const AvailableReports = {
  // ... existing reports
  my_new_report: 'My New Report',
};
```

### Step 3: Use in Component

```javascript
const exportData = {
  mode: 'my_new_report',
  titel: 'My_Custom_Report',
  data: {
    items: yourDataArray
  }
};

await ExcelExportService.downloadExcel(exportData);
```

## 📊 Example Implementations

### 1. Users Data Export

```vue
<template>
  <div>
    <button 
      @click="exportUsers" 
      :disabled="isExporting"
      class="export-btn"
    >
      {{ isExporting ? 'Exporting...' : 'Export Users' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ExcelExportService } from '@/services/excelExport';

const props = defineProps({
  users: Array,
  filters: Object
});

const isExporting = ref(false);

const exportUsers = async () => {
  if (!props.users?.length) {
    alert('No data to export');
    return;
  }

  isExporting.value = true;

  try {
    const exportData = {
      mode: 'user_report',
      titel: `User_Report_${new Date().toISOString().split('T')[0]}`,
      data: {
        users: props.users
      },
      options: {
        subtitle: props.filters ? `Filter: ${JSON.stringify(props.filters)}` : 'All Users',
        includeTimestamp: true
      }
    };

    const result = await ExcelExportService.downloadExcel(exportData);
    
    if (result.success) {
      console.log('✅ Export successful:', result.filename);
    } else {
      alert(`❌ Export failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    alert('Export error occurred');
  } finally {
    isExporting.value = false;
  }
};
</script>
```

### 2. Advanced Export with Filtering

```vue
<script setup>
import { computed } from 'vue';

// Filter data sebelum export
const filteredUsers = computed(() => {
  return props.users.filter(user => {
    // Your filter logic here
    return user.isActive && user.department === 'IT';
  });
});

const exportFiltered = async () => {
  const exportData = {
    mode: 'user_report',
    titel: 'Active_IT_Users',
    data: {
      users: filteredUsers.value
    },
    options: {
      subtitle: 'Active IT Department Users Only',
      author: 'IT Manager'
    }
  };

  await ExcelExportService.downloadExcel(exportData);
};
</script>
```

## 🎨 Styling & Customization

### Excel-Compatible CSS Classes

```css
/* Available in base template */
.number    /* Right-aligned numbers */
.currency  /* Currency formatting */
.text-center
.text-right
```

### Custom Styling in Templates

```javascript
static generateStyledTable() {
  return `
  <table border="1" style="
    width: 100%; 
    border-collapse: collapse;
    font-family: Arial, sans-serif;
  ">
    <tr style="background-color: #f0f0f0;">
      <th style="padding: 8px; border: 1px solid #ddd;">Header</th>
    </tr>
  </table>`;
}
```

## 🔧 Advanced Features

### 1. Batch Export

```javascript
const exportMultipleReports = async () => {
  const reports = [
    { mode: 'user_report', title: 'Users', data: users },
    { mode: 'laporandataobat', title: 'Medicines', data: medicines }
  ];

  for (const report of reports) {
    await ExcelExportService.downloadExcel({
      mode: report.mode,
      titel: report.title,
      data: report.data
    });
  }
};
```

### 2. Error Handling & Validation

```javascript
const safeExport = async (exportData) => {
  try {
    // Validate required fields
    if (!exportData.mode || !exportData.data) {
      throw new Error('Mode and data are required');
    }

    // Check if template exists
    const available = ExcelExportService.getAvailableReports();
    if (!available[exportData.mode]) {
      throw new Error(`Report type '${exportData.mode}' not available`);
    }

    const result = await ExcelExportService.downloadExcel(exportData);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Export failed:', error);
    // Show user-friendly message
    alert(`Cannot export: ${error.message}`);
  }
};
```

### 3. Progress Tracking

```javascript
const exportWithProgress = async (largeDataset) => {
  const batchSize = 1000;
  const batches = [];
  
  for (let i = 0; i < largeDataset.length; i += batchSize) {
    batches.push(largeDataset.slice(i, i + batchSize));
  }
  
  for (let i = 0; i < batches.length; i++) {
    const progress = ((i + 1) / batches.length) * 100;
    console.log(`Export progress: ${progress.toFixed(1)}%`);
    
    await ExcelExportService.downloadExcel({
      mode: 'user_report',
      titel: `Users_Batch_${i + 1}`,
      data: { users: batches[i] }
    });
  }
};
```

## 🐛 Troubleshooting

### Common Issues & Solutions

1. **"Template mode not found"**
   - Check template registry in `templates/index.js`
   - Verify mode spelling in export data

2. **"escapeHtml is not a function"**
   - Import Formatters correctly: `import { Formatters } from './utils/formatters.js'`
   - Check file paths in imports

3. **Excel formatting issues**
   - Use provided CSS classes (`.number`, `.currency`)
   - Avoid complex CSS not supported by Excel

4. **Download not working**
   - Check browser popup blocker
   - Verify Blob support in browser

### Debug Mode

```javascript
// Enable debug logging
const testExport = async () => {
  console.log('Available templates:', ExcelExportService.getTemplateInfo());
  
  const testData = {
    mode: 'user_report',
    titel: 'Test_Report',
    data: {
      users: [/* sample data */]
    }
  };

  try {
    const htmlContent = await ExcelExportService.generateExcel(testData);
    console.log('Generated HTML:', htmlContent);
    
    const result = await ExcelExportService.downloadExcel(testData);
    console.log('Download result:', result);
  } catch (error) {
    console.error('Debug error:', error);
  }
};
```

## 📈 Best Practices

### 1. Performance
- Export data in chunks for large datasets
- Use pagination for very large exports
- Implement loading states for better UX

### 2. Security
- Always escape user-generated content
- Validate export data before processing
- Limit export frequency if needed

### 3. User Experience
- Provide clear loading indicators
- Show success/error messages
- Offer filtered vs full data exports
- Include timestamps in filenames

### 4. Maintenance
- Keep templates modular and focused
- Use consistent naming conventions
- Document new templates thoroughly
- Test with various data scenarios

## 🔮 Future Enhancements

Potential improvements for the service:

1. **PDF Export Support**
2. **Excel Formula Integration**
3. **Charts and Graphs**
4. **Multi-sheet Workbooks**
5. **Template Customization UI**
6. **Export Scheduling**
7. **Cloud Storage Integration**

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Verify all imports and file paths
3. Test with sample data first
4. Check browser console for errors

**Happy Exporting! 🎉**