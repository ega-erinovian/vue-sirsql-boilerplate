/* * Example: How to use the reusable DataTable component */

<script setup>
import ButtonTooltip from "@/components/ButtonTooltip.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { Button } from "@/components/ui/button";
import { useAllMenus } from "@/composables/queries/useMenus";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  createActionsColumn,
  createBadgeColumn,
  createSelectionColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { createColumnHelper } from "@tanstack/vue-table";
import { Pencil, Plus, Trash } from "lucide-vue-next";
import { h } from "vue";

const {
  data: menus,
  isLoading,
  isError,
} = useAllMenus({
  staleTime: 5 * 60 * 1000,
});

// Define columns
const columnHelper = createColumnHelper();

const columns = [
  // Selection column
  createSelectionColumn(columnHelper),

  // Menu Name column
  createSortableColumn(columnHelper, "nama_menu", "Nama Menu"),

  // Path column
  createSortableColumn(columnHelper, "path", "Path"),

  // Status badge column
  createBadgeColumn(columnHelper, "is_active", "Status", {
    1: { class: "bg-green-100 text-green-800", label: "Active" },
    0: { class: "bg-red-100 text-red-800", label: "Inactive" },
  }),

  createActionsColumn(columnHelper, (row) => {
    return [
      h(
        ButtonTooltip,
        {
          tooltip: "Edit",
          color:"warning",
          onBtnClick: () => console.log("Edit", row.original.nama_menu),
        },
        () => h(Pencil, { class: "p-[2px]" })
      ),
      h(
        ButtonTooltip,
        {
          tooltip: "Hapus",
          color:"danger",
          onBtnClick: () => console.log("Delete", row.original.nama_menu),
        },
        () => h(Trash, { class: "p-[2px]" })
      ),
    ];
  }),
];

// Event handlers
const handleRowClick = (row) => {
  console.log("Row clicked:", row);
};

const handleSelectionChange = (selection) => {
  console.log("Selection changed:", selection);
};

// Row color based on status
// const getRowColor = (row, index) => {
//   if (row.is_active === "0") return "bg-red-50 hover:bg-red-100";
//   if (row.id_parent) return "bg-blue-50 hover:bg-blue-100"; // Child menu
//   return "hover:bg-gray-50";
// };

// Cell color based on column
const getCellColor = (columnId, row, index) => {
  if (columnId === "nama_menu" && !row.id_parent) {
    return "font-bold text-gray-900"; // Parent menu bold
  }
  if (columnId === "path") {
    return "text-blue-600 font-mono text-sm";
  }
  return "";
};
</script>

<template>
  <LoadingScreen v-if="isLoading" />

  <DashboardLayout v-else>
    <div class="w-full mx-auto">
      <CardLayout cardClass="rounded-md p-0" contentClass="px-4">
        <DataTable
          :data="menus.data"
          :columns="columns"
          :filter-column="['nama_menu', 'icon']"
          filter-placeholder="Search name"
          :show-column-visibility="true"
          :show-pagination="true"
          :enable-selection="true"
          :page-size="10"
          :cell-class-name="getCellColor"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <template #empty>
            <div class="text-center py-8">
              <p class="text-muted-foreground">No menu items found.</p>
            </div>
          </template>

          <template #actions>
            <Button class="bg-bs-success hover:bg-bs-success-dark cursor-pointer"><Plus />Add</Button>
          </template>
        </DataTable>
      </CardLayout>
    </div>
  </DashboardLayout>
</template>
