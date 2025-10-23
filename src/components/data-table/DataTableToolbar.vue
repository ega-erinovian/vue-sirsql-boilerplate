/* * Data Table Toolbar - Search and column visibility */

<script setup>
import { ChevronDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  filterColumns: {
    type: Array,
    default: () => [],
  },
  filterPlaceholder: {
    type: String,
    default: "Filter...",
  },
  showColumnVisibility: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="flex gap-2 items-center justify-between pb-4">
    <slot name="actions" />

    <div class="flex gap-4">
      <Input
        v-if="filterColumns.length > 0"
        class="max-w-xl"
        :placeholder="filterPlaceholder"
        :model-value="table.getState().globalFilter ?? ''"
        @update:model-value="table.setGlobalFilter($event)"
      />

      <DropdownMenu v-if="showColumnVisibility">
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
