/* * Data Table Pagination with Numbered Pages */

<script setup>
import { Button } from "@/components/ui/button";
import { PaginationList, PaginationListItem } from "reka-ui";
import { computed } from "vue";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  enableSelection: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: null,
  },
  tableStateName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["pageChange"]);

const isApiPagination = computed(() => props.pagination !== null);

// Current page (1-indexed)
const currentPage = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.current_page;
  }
  return props.table.getState().pagination.pageIndex + 1;
});

// Total pages
const totalPages = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.total_pages;
  }
  const pageCount = props.table.getPageCount();
  // Fallback calculation if pageCount is not available
  if (pageCount === 0 || pageCount === -1) {
    const totalRows = props.table.getFilteredRowModel().rows.length;
    const pageSize = props.table.getState().pagination.pageSize;
    return Math.ceil(totalRows / pageSize);
  }
  return pageCount;
});

// Total items
const totalItems = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.total;
  }
  return props.table.getFilteredRowModel().rows.length;
});

// Items per page
const itemsPerPage = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.per_page;
  }
  return props.table.getState().pagination.pageSize;
});

// Generate page numbers to display
const pageNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 0) return pages;

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push("ellipsis-start");
    }

    // Show pages around current page
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("ellipsis-end");
    }

    // Always show last page
    pages.push(total);
  }

  return pages;
});

const goToPage = (page) => {
  if (isApiPagination.value) {
    emit("pageChange", page);
  } else {
    props.table.setPageIndex(page - 1);
  }
};

const goToFirstPage = () => {
  goToPage(1);
};

const goToLastPage = () => {
  goToPage(totalPages.value);
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

// FIXED: Corrected canPreviousPage logic
const canPreviousPage = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.has_prev || currentPage.value > 1;
  }
  return currentPage.value > 1;
});

// FIXED: Corrected canNextPage logic
const canNextPage = computed(() => {
  if (isApiPagination.value) {
    return props.pagination.has_next || currentPage.value < totalPages.value;
  }
  return currentPage.value < totalPages.value;
});

// Check if pagination should be shown (more than 1 page)
const showPaginationControls = computed(() => {
  return totalPages.value > 1;
});
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-4 gap-4 md:flex-row md:justify-between">
    <div class="flex gap-2 items-center justify-center md:justify-start w-full">
      {{ pagination?.total_records || totalItems }} Data Found
    </div>
    <!-- Show pagination only if there's more than 1 page -->
    <Pagination
      v-if="showPaginationControls"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      show-edges
      :default-page="currentPage"
      :page="currentPage"
    >
      <PaginationList class="flex justify-center md:justify-end items-center gap-1">
        <PaginationFirst
          class="cursor-pointer w-8 h-8"  
          @click="goToFirstPage" 
          :disabled="!canPreviousPage || currentPage === 1" 
        />
        <PaginationPrevious
          class="cursor-pointer w-8 h-8"  
          @click="goToPreviousPage"
          :disabled="!canPreviousPage"
        />

        <template v-for="(item, index) in pageNumbers" :key="index">
          <PaginationListItem
            v-if="typeof item === 'number'"
            :value="item"
            as-child
          >
            <Button
              class="w-8 h-8 p-0"
              :class="[item === currentPage ? 'cursor-auto border' : 'cursor-pointer']"
              :variant="item === currentPage ? 'secondary' : 'outline'"
              @click="goToPage(item)"
            >
              {{ item }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :key="`ellipsis-${index}`"
            :index="index"
          />
        </template>

        <PaginationNext 
          class="cursor-pointer w-8 h-8"
          @click="goToNextPage" 
          :disabled="!canNextPage" 
        />
        <PaginationLast 
          class="cursor-pointer w-8 h-8"
          @click="goToLastPage" 
          :disabled="!canNextPage || currentPage === totalPages" 
        />
      </PaginationList>
    </Pagination>
  </div>
</template>