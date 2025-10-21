/*
 * Reusable column helper functions
 */

import { h } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-vue-next";

/**
 * Creates a selection column for row selection
 */
export function createSelectionColumn(columnHelper) {
  return columnHelper.display({
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) => {
      return h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      });
    },
    enableSorting: false,
    enableHiding: false,
  });
}

/**
 * Creates a sortable text column
 */
export function createSortableColumn(columnHelper, accessor, label, options = {}) {
  return columnHelper.accessor(accessor, {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => [label, h(ChevronsUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      const value = row.getValue(accessor);
      const className = options.className || "";
      return h("div", { class: className }, value);
    },
    ...options
  });
}

/**
 * Creates a currency column
 */
export function createCurrencyColumn(columnHelper, accessor, label = "Amount", currency = "USD") {
  return columnHelper.accessor(accessor, {
    header: () => h("div", { class: "text-right" }, label),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue(accessor));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  });
}

/**
 * Creates a date column
 */
export function createDateColumn(columnHelper, accessor, label, options = {}) {
  return columnHelper.accessor(accessor, {
    header: () => h("div", label),
    cell: ({ row }) => {
      const date = new Date(row.getValue(accessor));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options.dateFormat
      });
      return h("div", formatted);
    },
    ...options
  });
}

/**
 * Creates a badge/status column
 */
export function createBadgeColumn(columnHelper, accessor, label, badgeConfig = {}) {
  return columnHelper.accessor(accessor, {
    header: () => h("div", label),
    cell: ({ row }) => {
      const value = row.getValue(accessor);
      const config = badgeConfig[value] || { class: "bg-gray-500", label: value };
      return h(
        "span",
        { 
          class: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.class}` 
        },
        config.label || value
      );
    },
  });
}

/**
 * Creates an actions column
 */
export function createActionsColumn(columnHelper, renderActions) {
  return columnHelper.display({
    id: "actions",
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) => {
      return h("div", { class: "justify-end flex gap-1" }, [renderActions(row)]);
    },
  });
}