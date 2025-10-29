<script setup>
import EmptyResult from "@/components/common/EmptyResult.vue";
import PageTitle from "@/components/common/PageTitle.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import AddMenuModal from "@/components/features/konfigurasi-sistem/menu/AddMenuModal.vue";
import UserTableAction from "@/components/features/konfigurasi-sistem/user/UserTableAction.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllUsers, useExportUsers } from "@/composables/queries/useUsers";
import DateRangeComponent from "@/components/common/DateRangeComponent.vue";
import { Button } from "@/components/ui/button";
import { useTableState } from "@/composables/helper/data-table/useTableState";
import { ExcelExportService } from "@/composables/helper/excel-export";
import { useDateRange } from "@/composables/helper/useDateRange";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DataTableFilter from "@/layouts/DataTableFilter.vue";
import {
  createActionsColumn,
  createDateColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { IconFileTypeXls } from "@tabler/icons-vue";
import { createColumnHelper } from "@tanstack/vue-table";
import { computed, h, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const tableStateName = "administrator_users";
const { filters, pagination, updateFilters, updatePagination } =
  useTableState(tableStateName);

const datePickerValue = ref({ start: null, end: null });

// Flag untuk mencegah circular updates
const isInitializing = ref(true);
const isUpdatingFromFilter = ref(false);

const {
  parseDateToPhpFormat,
  getDefaultDateRange,
  convertFromPhpDate,
  isValidDateRange,
} = useDateRange();

// Initialize datePickerValue dari filters atau default
const initializeDatePicker = () => {
  isInitializing.value = true;
  isUpdatingFromFilter.value = true;

  const { startDate, endDate } = filters.value;

  if (startDate && endDate) {
    // Konversi dari PHP date string ke CalendarDate
    const startParsed = convertFromPhpDate(startDate);
    const endParsed = convertFromPhpDate(endDate);

    if (startParsed && endParsed && isValidDateRange(startParsed, endParsed)) {
      datePickerValue.value = {
        start: startParsed,
        end: endParsed,
      };
    } else {
      console.warn('Invalid date range from filters, using default');
      const defaultRange = getDefaultDateRange();
      datePickerValue.value = defaultRange;
      
      // Update filters dengan default range
      updateFilters({
        startDate: parseDateToPhpFormat(defaultRange.start),
        endDate: parseDateToPhpFormat(defaultRange.end),
      });
    }
  } else {
    // Jika tidak ada filters, set default
    const defaultRange = getDefaultDateRange();
    datePickerValue.value = defaultRange;
    
    // Update filters dengan default range
    updateFilters({
      startDate: parseDateToPhpFormat(defaultRange.start),
      endDate: parseDateToPhpFormat(defaultRange.end),
    });
  }

  // Reset flags setelah initialization
  setTimeout(() => {
    isInitializing.value = false;
    isUpdatingFromFilter.value = false;
  }, 100);
};

// Handle date change dari DateRangeComponent
const handleDateChange = (newValue) => {
  // Skip jika sedang initialization atau update dari filter
  if (isInitializing.value || isUpdatingFromFilter.value) {
    return;
  }

  // Validasi date range
  if (!newValue?.start || !newValue?.end) {
    console.warn('Invalid date range received:', newValue);
    return;
  }

  if (!isValidDateRange(newValue.start, newValue.end)) {
    console.warn('Invalid date range: start date must be before or equal to end date');
    return;
  }

  // Update local state
  datePickerValue.value = newValue;

  // Update filters
  try {
    const startDateStr = parseDateToPhpFormat(newValue.start);
    const endDateStr = parseDateToPhpFormat(newValue.end);

    if (startDateStr && endDateStr) {
      updateFilters({
        startDate: startDateStr,
        endDate: endDateStr,
      });
      updatePagination({currentPage: 1})
    }
  } catch (error) {
    console.error('Error updating filters:', error);
  }
};

// Watch filters untuk sync dengan external changes (misal: reset filter)
watch(
  () => [filters.value.startDate, filters.value.endDate],
  ([newStart, newEnd], [oldStart, oldEnd]) => {
    // Skip jika sedang initialization atau tidak ada perubahan
    if (isInitializing.value || isUpdatingFromFilter.value) {
      return;
    }

    if (newStart === oldStart && newEnd === oldEnd) {
      return;
    }

    // Update date picker jika filters berubah dari luar
    if (newStart && newEnd) {
      isUpdatingFromFilter.value = true;
      
      const startParsed = convertFromPhpDate(newStart);
      const endParsed = convertFromPhpDate(newEnd);

      if (startParsed && endParsed && isValidDateRange(startParsed, endParsed)) {
        datePickerValue.value = {
          start: startParsed,
          end: endParsed,
        };
      }

      setTimeout(() => {
        isUpdatingFromFilter.value = false;
      }, 50);
    }
  },
  { deep: true }
);

onMounted(() => {
  initializeDatePicker();
});

const { data: result, isLoading } = useAllUsers(
  computed(() => ({
    page: pagination.value.currentPage,
    limit: pagination.value.limit,
    sort: pagination.value.sortOrder,
    start: filters.value.startDate,
    end: filters.value.endDate,
  })),
  {
    staleTime: 5 * 60 * 1000,
  },
);

// Define columns
const columnHelper = createColumnHelper();

const columns = [
  createSortableColumn(columnHelper, "username", "Username"),
  createSortableColumn(columnHelper, "nama_pegawai", "Nama Lengkap"),
  createDateColumn(columnHelper, "login_terakhir", "Last Login"),
  createActionsColumn(columnHelper, (row) => {
    return [h(UserTableAction, { userId: String(row.original.id) })];
  }),
];

// Event handlers
const handleRowClick = (row) => {
  console.log("Row clicked:", row);
};

const handlePageChange = (page) => {
  updatePagination({ currentPage: page });
};

const handleRefreshPage = () => {
  router.go();
};

const { exportAllUsers, isExporting } = useExportUsers(
  computed(() => ({
    start: filters.value.startDate,
    end: filters.value.endDate,
  })),
);

const exportAllData = async () => {
  try {
    const allUsers = await exportAllUsers();

    if (allUsers?.data?.users?.length > 0) {
      const exportData = {
        mode: "user_report",
        titel: "All User",
        data: {
          users: allUsers.data.users,
        },
      };

      await ExcelExportService.downloadExcel(exportData);
    } else {
      console.error("❌ Tidak ada data yang bisa diexport");
    }
  } catch (error) {
    console.error("❌ Gagal export data", error);
  }
};
</script>

<template>
  <DashboardLayout>
    <div class="w-full mx-auto grid gap-4">
      <PageTitle title="Konfigurasi User" />
      <DataTableFilter>
        <DateRangeComponent
          :model-value="datePickerValue"
          @update:model-value="handleDateChange"
        />
      </DataTableFilter>
      <CardLayout>
        <div v-if="isLoading" class="grid gap-4">
          <Skeleton class="h-10" />
          <Skeleton class="h-96" />
        </div>
        <div v-else>
          <DataTable
            v-if="result"
            :data="result.data.users || []"
            :columns="columns"
            :tableStateName="tableStateName"
            :filter-column="['username', 'nama_pegawai']"
            filter-placeholder="Search name"
            :show-column-visibility="true"
            :show-pagination="true"
            :enable-selection="true"
            :page-size="Number(pagination.limit)"
            :pagination="result.data.pagination"
            @row-click="handleRowClick"
            @page-change="handlePageChange"
          >
            <template #empty>
              <div class="text-center">
                <p class="text-muted-foreground">No menu items found.</p>
              </div>
            </template>

            <template #actions>
              <AddMenuModal />
            </template>

            <template #tools>
              <div class="flex gap-2">
                <Button
                  @click="exportAllData"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <span v-if="isExporting" class="animate-spin">⏳</span>
                  <span v-else><IconFileTypeXls /></span>
                  <span>{{ isExporting ? "Exporting..." : "Export" }}</span>
                </Button>
              </div>
            </template>
          </DataTable>
          <EmptyResult v-else @refresh-btn-click="handleRefreshPage" />
        </div>
      </CardLayout>
    </div>
  </DashboardLayout>
</template>