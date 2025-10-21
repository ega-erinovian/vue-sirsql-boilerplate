/*
 * Data Table Pagination
 */

<script setup>
import { Button } from "@/components/ui/button";

const props = defineProps({
  table: {
    type: Object,
    required: true
  },
  enableSelection: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div v-if="enableSelection" class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        Next
      </Button>
    </div>
  </div>
</template>