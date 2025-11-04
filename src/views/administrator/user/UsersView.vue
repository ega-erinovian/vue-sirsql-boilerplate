<script setup>
import DateRangeComponent from "@/components/common/DateRangeComponent.vue";
import EmptyResult from "@/components/common/EmptyResult.vue";
import PageTitle from "@/components/common/PageTitle.vue";
import SearchDatatable from "@/components/data-filter/SearchDatatable.vue";
import DataLimit from "@/components/data-table/DataLimit.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import ExportButton from "@/components/data-table/ExportButton.vue";
import AddMenuModal from "@/components/features/konfigurasi-sistem/menu/AddMenuModal.vue";
import UserTableAction from "@/components/features/konfigurasi-sistem/user/UserTableAction.vue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateRangeFilter } from "@/composables/helper/data-filters/useDateRangeFilter";
import { useTableState } from "@/composables/helper/data-table/useTableState";
import { useAllUsers, useExportUsers } from "@/composables/queries/useUsers";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DataTableFilter from "@/layouts/DataTableFilter.vue";
import {
  createActionsColumn,
  createDateColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { IconRefresh } from "@tabler/icons-vue";
import { createColumnHelper } from "@tanstack/vue-table";
import { computed, h, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tableStateName = "administrator_users";
const searchName = ref("");

// Initialize table state
const tableState = useTableState(tableStateName);
const { filters, pagination, updatePagination, updateFilters } = tableState;

// Initialize date range filter dengan tableState
const { datePickerValue, handleDateChange } = useDateRangeFilter(tableState, {
  autoUpdate: true, // Auto reset ke page 1 saat tanggal berubah
  onDateChange: (dates) => {
    // tambahkan fungsi lainnya saat date berubah
    console.log("Date changed:", dates);
  },
});

const { data: result, isLoading } = useAllUsers(
  computed(() => ({
    page: pagination.value.currentPage,
    limit: pagination.value.limit,
    sort: pagination.value.sortOrder,
    search: filters.value.search,
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

const { exportAllUsers } = useExportUsers(
  computed(() => ({
    start: filters.value.startDate,
    end: filters.value.endDate,
  })),
);

// Search data by Name
watch(
  () => searchName.value,
  () => {
    setTimeout(() => {
      updateFilters({
        search: searchName.value,
      });
    }, 500);
  },
);
</script>

<template>
  <DashboardLayout>
    <div class="w-full mx-auto grid gap-4">
      <PageTitle title="Konfigurasi User" />
      <DataTableFilter>
        <Button variant="warning"><IconRefresh/> Refresh</Button>
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
              <DataLimit :tableStateName="tableStateName" />
            </template>

            <template #tools>
              <div class="flex gap-2">
                <SearchDatatable
                  :table-state="tableState"
                  placeholder="Search users..."
                />
                <AddMenuModal />
                <ExportButton
                  :fetch-data="exportAllUsers"
                  mode="user_report"
                  title="All Users"
                  :fileName="`Report-User_${filters.startDate}SD${filters.endDate}`"
                  data-key="users"
                />
              </div>
            </template>
          </DataTable>
          <EmptyResult v-else @refresh-btn-click="handleRefreshPage" />
        </div>
      </CardLayout>
    </div>
  </DashboardLayout>
</template>
