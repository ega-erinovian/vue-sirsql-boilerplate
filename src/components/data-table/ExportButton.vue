<script setup>
import { ExcelExportService } from '@/composables/helper/excel-export';
import { ref } from 'vue';
import { Button } from '../ui/button';
import { IconFileTypeXls } from '@tabler/icons-vue';


const props = defineProps({
  // Function yang return promise dengan data
  fetchData: {
    type: Function,
    required: true,
  },
  // Mode export untuk ExcelExportService
  mode: {
    type: String,
    required: true,
  },
  // Title untuk file excel
  title: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  // Key data di response (misal: 'users', 'menus', 'products')
  dataKey: {
    type: String,
    required: true,
  },
});

const isExporting = ref(false);

const handleExport = async () => {
  if (isExporting.value) return;

  try {
    isExporting.value = true;
    
    // Fetch data
    const response = await props.fetchData();
    
    // Ambil data berdasarkan dataKey
    const data = response?.data?.[props.dataKey];
    
    if (!data || data.length === 0) {
      console.error("❌ Tidak ada data yang bisa diexport");
      return;
    }

    // Export data
    const exportData = {
      mode: props.mode,
      titel: props.title,
      data: {
        [props.dataKey]: data,
      },
    };

    await ExcelExportService.downloadExcel(exportData, props.fileName);
    console.log("✅ Export berhasil");
  } catch (error) {
    console.error("❌ Gagal export data", error);
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <Button
    @click="handleExport"
    :disabled="isExporting"
    class="flex items-center gap-2 cursor-pointer"
  >
    <span v-if="isExporting" class="animate-spin">⏳</span>
    <IconFileTypeXls v-else />
    <span>{{ isExporting ? "Exporting..." : "Export" }}</span>
  </Button>
</template>