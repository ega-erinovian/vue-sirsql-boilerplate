<script setup>
import EmptyResult from "@/components/common/EmptyResult.vue";
import PageTitle from "@/components/common/PageTitle.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import AddMenuModal from "@/components/features/konfigurasi-sistem/menu/AddMenuModal.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useTableState } from "@/composables/helper/data-table/useTableState";
import { useAllMenus } from "@/composables/queries/useMenus";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  createBadgeColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { createColumnHelper } from "@tanstack/vue-table";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const { pagination, updatePagination } = useTableState("administrator_menus");

const limit = ref(computed(() => pagination.value?.limit));
const forceRefetchDummy = ref(0);

const { data: menus, isLoading } = useAllMenus({
  staleTime: 5 * 60 * 1000,
  queryKey: ["menus", forceRefetchDummy],
});

watch(
  limit,
  () => {
    forceRefetchDummy.value++;
  },
  { deep: true },
);

// Define columns
const columnHelper = createColumnHelper();

const columns = [
  // Menu Name column
  createSortableColumn(columnHelper, "nama_menu", "Nama Menu"),

  // Path column
  createSortableColumn(columnHelper, "path", "Path"),

  createSortableColumn(columnHelper, "icon", "Icon"),

  // Status badge column
  createBadgeColumn(columnHelper, "is_active", "Status", {
    1: { class: "bg-green-100 text-green-800", label: "Active" },
    0: { class: "bg-red-100 text-red-800", label: "Inactive" },
  }),
];

// Event handlers
const handleRowClick = (row) => {
  console.log("Row clicked:", row);
};

// Row color based on status
// const getRowColor = (row, index) => {
//   if (row.is_active === "0") return "bg-red-50 hover:bg-red-100";
//   if (row.id_parent) return "bg-blue-50 hover:bg-blue-100"; // Child menu
//   return "hover:bg-gray-50";
// };

// Cell color based on column

const getCellColor = (columnId, row) => {
  if (columnId === "nama_menu" && !row.id_parent) {
    return "font-bold text-gray-900"; // Parent menu bold
  }
  if (columnId === "path") {
    return "text-blue-600 font-mono text-sm";
  }
  return "";
};

const handlePageChange = (page) => {
  updatePagination({ currentPage: page });
};

const handleRefreshPage = () => {
  router.go();
};
</script>

<template>
  <DashboardLayout>
    <div class="w-full mx-auto grid gap-4">
      <PageTitle title="Sidebar Menu" />
      <CardLayout>
        <div v-if="isLoading" class="grid gap-4">
          <Skeleton class="h-10" />
          <Skeleton class="h-96" />
        </div>
        <div v-else>
          <DataTable
            v-if="menus"
            :data="menus.data"
            tableStateName="administrator_menus"
            :columns="columns"
            :filter-column="['nama_menu', 'icon']"
            filter-placeholder="Search name"
            :show-column-visibility="true"
            :show-pagination="true"
            :enable-selection="true"
            :page-size="Number(pagination.limit)"
            :cell-class-name="getCellColor"
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
          </DataTable>
          <EmptyResult v-else @refresh-btn-click="handleRefreshPage" />
        </div>
      </CardLayout>
    </div>
  </DashboardLayout>
</template>
