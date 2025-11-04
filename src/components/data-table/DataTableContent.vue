/* * Data Table Content - Table rows and cells */

<script setup>
import { FlexRender } from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const props = defineProps({
  table: {
    type: Object,
    required: true,
  },
  columnsLength: {
    type: Number,
    required: true,
  },
  enableExpanding: {
    type: Boolean,
    default: false,
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
});

const emit = defineEmits(["rowClick"]);

const handleRowClick = (row, event) => {
  // Check if the click target is an interactive element or inside one
  const target = event.target;

  // List of selectors for interactive elements that should not trigger row click
  const interactiveSelectors = [
    "button",
    "a",
    "input",
    "select",
    "textarea",
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    ".prevent-row-click", // Custom class for preventing row click
  ];

  // Check if the clicked element or any of its parents match the selectors
  const isInteractive = interactiveSelectors.some((selector) => {
    return target.closest(selector) !== null;
  });

  // Only emit rowClick if not clicking on interactive elements
  if (!isInteractive) {
    emit("rowClick", row, event);
  }
};

const getRowClass = (row) => {
  if (!props.rowClassName) return "";

  if (typeof props.rowClassName === "function") {
    return props.rowClassName(row.original, row.index);
  }
  return props.rowClassName;
};

const getCellClass = (cell, row) => {
  if (!props.cellClassName) return "";

  if (typeof props.cellClassName === "function") {
    return props.cellClassName(cell.column.id, row.original, row.index);
  }
  return props.cellClassName;
};

const getHeaderClass = (header) => {
  if (!props.headerClassName) return "";

  if (typeof props.headerClassName === "function") {
    return props.headerClassName(header.column.id, header.index);
  }
  return props.headerClassName;
};
</script>

<template>
  <div class="rounded-md shadow-sm w-full">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="(header, index) in headerGroup.headers"
            :key="header.id"
            :data-pinned="header.column.getIsPinned()"
            :class="
              cn(
                {
                  'sticky bg-background/95': header.column.getIsPinned(),
                  'rounded-tl-sm': index === 0,
                  'rounded-tr-sm': index === headerGroup.headers.length - 1,
                },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                'bg-brand-primary text-white',
                getHeaderClass(header),
              )
            "
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow
              :data-state="row.getIsSelected() && 'selected'"
              @click="handleRowClick(row, $event)"
              :class="['cursor-pointer', getRowClass(row)]"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :data-pinned="cell.column.getIsPinned()"
                :class="
                  cn(
                    {
                      'sticky bg-background/95': cell.column.getIsPinned(),
                    },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                    getCellClass(cell, row),
                  )
                "
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="enableExpanding && row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
                <slot name="expanded-row" :row="row">
                  {{ JSON.stringify(row.original) }}
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </template>

        <TableRow v-else>
          <TableCell :colspan="columnsLength" class="h-24 text-center">
            <slot name="empty"> No results. </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
