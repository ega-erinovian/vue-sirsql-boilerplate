/* * Example: How to use the reusable DataTable component */

<script setup>
import ButtonTooltip from "@/components/common/ButtonTooltipComponent.vue";
import EmptyResult from "@/components/common/EmptyResult.vue";
import PageTitle from "@/components/common/PageTitle.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import AddMenuModal from "@/components/features/konfigurasi-sistem/menu/AddMenuModal.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllMenus } from "@/composables/queries/useMenus";
import { useAllRoles } from "@/composables/queries/useRoles";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  createActionsColumn,
  createBadgeColumn,
  createSelectionColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { createColumnHelper } from "@tanstack/vue-table";
import { Pencil, Trash } from "lucide-vue-next";
import { h } from "vue";
import { useRouter } from "vue-router";

const { data: roles, isLoading } = useAllRoles({
  staleTime: 5 * 60 * 1000,
});

const router = useRouter();

// Define columns
const columnHelper = createColumnHelper();

const columns = [
  // Selection column
  createSelectionColumn(columnHelper),

  createSortableColumn(columnHelper, "namaperan", "Nama Role"),

  createActionsColumn(columnHelper, (row) => {
    return [
      h(
        ButtonTooltip,
        {
          tooltip: "Edit",
          color: "warning",
          onBtnClick: () => {
            event?.stopPropagation(); // prevent row click
            console.log("Edit", row.original.nama_menu);
          },
        },
        () => h(Pencil, { class: "p-[2px]" }),
      ),
      h(
        ButtonTooltip,
        {
          tooltip: "Hapus",
          color: "danger",
          onBtnClick: () => {
            event?.stopPropagation(); // prevent row click
            console.log("Delete", row.original.nama_menu);
          },
        },
        () => h(Trash, { class: "p-[2px]" }),
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
            v-if="roles"
            :data="roles.data"
            :columns="columns"
            :filter-column="['namaperan']"
            filter-placeholder="Search name"
            :show-column-visibility="true"
            :enable-selection="true"
            :page-size="10"
            :cell-class-name="getCellColor"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
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
