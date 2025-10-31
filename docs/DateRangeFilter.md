# useDateRangeFilter - Reusable Date Range Filter

Composable untuk mengelola date range filter dengan integrasi penuh ke `useTableState`. Mengurangi boilerplate code dan membuat implementasi date range filter menjadi sangat mudah.

## 📦 Instalasi

File sudah tersedia di: `@/composables/helper/data-filters/useDateRangeFilter.js`

## 🚀 Quick Start

### Basic Usage

```vue
<script setup>
import { useTableState } from "@/composables/helper/data-table/useTableState";
import { useDateRangeFilter } from "@/composables/helper/data-table/useDateRangeFilter";
import DateRangeComponent from "@/components/common/DateRangeComponent.vue";

const tableStateName = "my_table";

// Setup table state
const tableState = useTableState(tableStateName);

// Setup date range - HANYA INI YANG DIPERLUKAN!
const { datePickerValue, handleDateChange, dateRangeFormatted } = useDateRangeFilter(tableState);

// Gunakan dateRangeFormatted untuk API call
const { data } = useMyQuery(
  computed(() => ({
    start: dateRangeFormatted.value.start,
    end: dateRangeFormatted.value.end,
  }))
);
</script>

<template>
  <DateRangeComponent
    :model-value="datePickerValue"
    @update:model-value="handleDateChange"
  />
</template>
```

## 📖 API Reference

### useDateRangeFilter(tableState, options)

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tableState` | Object | ✅ Yes | Object dari `useTableState()` |
| `options` | Object | ❌ No | Konfigurasi tambahan |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoUpdate` | Boolean | `true` | Auto reset pagination ke page 1 saat tanggal berubah |
| `onDateChange` | Function | `null` | Callback function saat tanggal berubah |

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `datePickerValue` | Ref<Object> | Value untuk DateRangeComponent `{ start, end }` |
| `handleDateChange` | Function | Handler untuk `@update:model-value` |
| `dateRangeFormatted` | ComputedRef<Object> | Date range dalam format PHP `{ start: 'Y-m-d', end: 'Y-m-d' }` |
| `resetDateRange` | Function | Reset date range ke default |
| `isInitializing` | Ref<Boolean> | Flag untuk status initialization |

## 💡 Advanced Usage

### Custom Callback

```javascript
const { datePickerValue, handleDateChange } = useDateRangeFilter(tableState, {
  autoUpdate: true,
  onDateChange: (dates) => {
    console.log('Date changed:', dates);
    // dates.start - PHP formatted start date
    // dates.end - PHP formatted end date
    // dates.raw - Original CalendarDate objects
    
    // Custom logic here
    fetchAdditionalData(dates.start, dates.end);
  }
});
```

### Disable Auto Pagination Reset

```javascript
const { datePickerValue, handleDateChange } = useDateRangeFilter(tableState, {
  autoUpdate: false // Tidak akan reset pagination saat tanggal berubah
});
```

### Manual Date Reset

```javascript
const { datePickerValue, handleDateChange, resetDateRange } = useDateRangeFilter(tableState);

// Reset ke default date range
const handleReset = () => {
  resetDateRange();
};
```

## 🔄 Integration dengan Export

```javascript
import { useDateRangeFilter } from "@/composables/helper/data-table/useDateRangeFilter";
import { useExportData } from "@/composables/queries/useExport";

const tableState = useTableState("my_table");
const { dateRangeFormatted } = useDateRangeFilter(tableState);

// Gunakan langsung untuk export
const { exportData, isExporting } = useExportData(
  computed(() => ({
    start: dateRangeFormatted.value.start,
    end: dateRangeFormatted.value.end,
  }))
);
```

## 📋 Complete Example

```vue
<script setup>
import PageTitle from "@/components/common/PageTitle.vue";
import DateRangeComponent from "@/components/common/DateRangeComponent.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/composables/helper/data-table/useTableState";
import { useDateRangeFilter } from "@/composables/helper/data-table/useDateRangeFilter";
import { useMyData, useExportData } from "@/composables/queries/useMyData";
import { ExcelExportService } from "@/composables/helper/excel-export";
import { computed } from "vue";

const tableStateName = "my_data_table";

// Table state
const tableState = useTableState(tableStateName);
const { filters, pagination, updatePagination } = tableState;

// Date range filter
const { datePickerValue, handleDateChange, dateRangeFormatted } = useDateRangeFilter(tableState, {
  onDateChange: (dates) => {
    console.log('Fetching data from', dates.start, 'to', dates.end);
  }
});

// Fetch data
const { data: result, isLoading } = useMyData(
  computed(() => ({
    page: pagination.value.currentPage,
    limit: pagination.value.limit,
    start: dateRangeFormatted.value.start,
    end: dateRangeFormatted.value.end,
  }))
);

// Export
const { exportData, isExporting } = useExportData(dateRangeFormatted);

const handleExport = async () => {
  const data = await exportData();
  await ExcelExportService.downloadExcel(data);
};
</script>

<template>
  <div class="w-full mx-auto grid gap-4">
    <PageTitle title="My Data Table" />
    
    <!-- Date Filter -->
    <div class="flex gap-4">
      <DateRangeComponent
        :model-value="datePickerValue"
        @update:model-value="handleDateChange"
      />
      
      <Button @click="handleExport" :disabled="isExporting">
        {{ isExporting ? "Exporting..." : "Export" }}
      </Button>
    </div>

    <!-- Data Table -->
    <DataTable
      :data="result?.data || []"
      :columns="columns"
      :tableStateName="tableStateName"
      :pagination="result?.pagination"
      :loading="isLoading"
      @page-change="(page) => updatePagination({ currentPage: page })"
    />
  </div>
</template>
```

## ✨ Features

✅ **Auto-initialization** - Otomatis load dari filters atau set default  
✅ **Auto-sync** - Sinkronisasi 2-arah dengan tableState  
✅ **Auto-validation** - Validasi date range otomatis  
✅ **Auto-format** - Konversi format tanggal otomatis  
✅ **Prevention** - Mencegah circular updates  
✅ **Reset Support** - Mendukung reset filter dari luar  
✅ **Customizable** - Callback dan opsi kustomisasi  

## 🔍 Troubleshooting

### Date tidak ter-update
- Pastikan menggunakan `@update:model-value` bukan `@change`
- Cek console untuk error validasi

### Pagination tidak reset
- Set `autoUpdate: true` di options
- Pastikan `tableState` memiliki method `updatePagination`

### Date format tidak sesuai
- Pastikan `useDateRange` composable sudah di-import dengan benar
- Cek format di `dateRangeFormatted` (harus PHP format 'Y-m-d')

## 📝 Migration Guide

### Before (Old Way)

```javascript
// ~100 baris code untuk handle date range
const datePickerValue = ref({ start: null, end: null });
const isInitializing = ref(true);
const isUpdatingFromFilter = ref(false);

const initializeDatePicker = () => {
  // ... 50+ lines of code
};

const handleDateChange = (newValue) => {
  // ... 30+ lines of code
};

watch(() => [filters.value.startDate, filters.value.endDate], () => {
  // ... 20+ lines of code
});

onMounted(() => {
  initializeDatePicker();
});
```

### After (New Way)

```javascript
// 1 BARIS CODE!
const { datePickerValue, handleDateChange, dateRangeFormatted } = useDateRangeFilter(tableState);
```

**Penghematan:** ~100 baris code per halaman! 🎉

## 🤝 Contributing

Jika menemukan bug atau ingin menambahkan fitur:
1. Buat issue di repository
2. Submit pull request
3. Update dokumentasi ini

## 📄 License

Internal use only - [Your Company Name]