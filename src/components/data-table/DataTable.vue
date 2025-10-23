<script setup>
import { ref, computed } from "vue";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { valueUpdater } from "@/components/ui/table/utils";
import DataTableToolbar from "./DataTableToolbar.vue";
import DataTableContent from "./DataTableContent.vue";
import DataTablePagination from "./DataTablePagination.vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  filterColumn: {
    type: [String, Array],
    default: null,
  },
  filterPlaceholder: {
    type: String,
    default: "Filter...",
  },
  showColumnVisibility: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  enableSelection: {
    type: Boolean,
    default: false,
  },
  enableExpanding: {
    type: Boolean,
    default: false,
  },
  pinnedColumns: {
    type: Object,
    default: () => ({}),
  },
  rowClassName: {
    type: [String, Function],
    default: null,
  },
  cellClassName: {
    type: [String, Function],
    default: null,
  },
  headerClassName: {
    type: [String, Function],
    default: null,
  },
  // API pagination data
  pagination: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["rowClick", "selectionChange", "pageChange"]);

const sorting = ref([]);
const columnFilters = ref([]);
const columnVisibility = ref({});
const rowSelection = ref({});
const expanded = ref({});
const globalFilter = ref("");

// Normalize filterColumn to always be an array
const filterColumns = computed(() => {
  if (!props.filterColumn) return [];
  return Array.isArray(props.filterColumn)
    ? props.filterColumn
    : [props.filterColumn];
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => {
    valueUpdater(updaterOrValue, rowSelection);
    emit("selectionChange", rowSelection.value);
  },
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  onGlobalFilterChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, globalFilter),
  globalFilterFn: (row, columnId, filterValue) => {
    // Custom global filter that searches across multiple specified columns
    if (!filterValue) return true;

    const searchValue = filterValue.toLowerCase();

    // If filterColumns are specified, search only those columns
    if (filterColumns.value.length > 0) {
      return filterColumns.value.some((col) => {
        const cellValue = row.getValue(col);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(searchValue);
      });
    }

    // Otherwise search all columns
    return Object.values(row.original).some((value) => {
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchValue);
    });
  },
  initialState: {
    pagination: {
      pageSize: props.pageSize,
    },
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    get columnPinning() {
      return props.pinnedColumns;
    },
    get globalFilter() {
      return globalFilter.value;
    },
  },
  // Disable client-side pagination if using API pagination
  manualPagination: props.pagination !== null,
  pageCount: props.pagination?.total_pages ?? -1,
});

const handleRowClick = (row) => {
  emit("rowClick", row.original);
};

const handlePageChange = (page) => {
  emit("pageChange", page);
};
</script>

<template>
  <div class="w-full">
    <DataTableToolbar
      v-if="filterColumn || showColumnVisibility"
      :table="table"
      :filter-columns="filterColumns"
      :filter-placeholder="filterPlaceholder"
      :show-column-visibility="showColumnVisibility"
    >
      <template #actions>
        <slot name="actions" />
      </template>
    </DataTableToolbar>

    <DataTableContent
      :table="table"
      :columns-length="columns.length"
      :enable-expanding="enableExpanding"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :header-class-name="headerClassName"
      @row-click="handleRowClick"
    />

    <DataTablePagination
      v-if="showPagination"
      :table="table"
      :enable-selection="enableSelection"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </div>
</template>
