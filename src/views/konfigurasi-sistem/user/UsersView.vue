<script setup>
import EmptyResult from "@/components/common/EmptyResult.vue";
import PageTitle from "@/components/common/PageTitle.vue";
import DataTable from "@/components/data-table/DataTable.vue";
import AddMenuModal from "@/components/features/konfigurasi-sistem/menu/AddMenuModal.vue";
import { allUserResponse } from "@/components/features/konfigurasi-sistem/user/consts";
import UserTableAction from "@/components/features/konfigurasi-sistem/user/UserTableAction.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllUsers } from "@/composables/queries/useUsers";
// import { Skeleton } from "@/components/ui/skeleton";
import CardLayout from "@/layouts/CardLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  createActionsColumn,
  createSelectionColumn,
  createSortableColumn,
} from "@/lib/tableColumnHelpers";
import { createColumnHelper } from "@tanstack/vue-table";
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const currentPage = ref(1);
const limit = ref(15);
const sort = ref("desc");
const { data: users, isLoading } = useAllUsers(
  computed(() => ({
    page: currentPage.value,
    limit: limit.value,
    sort: sort.value,
  })),
  {
    staleTime: 5 * 60 * 1000,
  },
);

// Dummy data
const allUserData = allUserResponse;

// Define columns
const columnHelper = createColumnHelper();

const columns = [
  // Selection column
  createSelectionColumn(columnHelper),

  createSortableColumn(columnHelper, "id", "ID"),

  // Menu Name column
  createSortableColumn(columnHelper, "nama_user", "Nama"),

  // Path column
  createSortableColumn(columnHelper, "login_terakhir", "Last Login"),

  createActionsColumn(columnHelper, (row) => {
    return [h(UserTableAction, { userId: row.original.id })];
  }),
];

// Event handlers
const handleRowClick = (row) => {
  console.log("Row clicked:", row);
};

const handleSelectionChange = (selection) => {
  console.log("Selection changed:", selection);
};

const handlePageChange = (page) => {
  // Call your API with the new page number
  // Example:
  currentPage.value = page;
};

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
      <PageTitle title="Konfigurasi User" />
      <CardLayout>
        <div v-if="isLoading" class="grid gap-4">
          <Skeleton class="h-10" />
          <Skeleton class="h-96" />
        </div>
        <div v-else>
          <DataTable
            v-if="users"
            :data="users.data"
            :columns="columns"
            :filter-column="['nama_user']"
            filter-placeholder="Search name"
            :show-column-visibility="true"
            :show-pagination="true"
            :enable-selection="true"
            :page-size="limit"
            :cell-class-name="getCellColor"
            :pagination="users.pagination"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
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
