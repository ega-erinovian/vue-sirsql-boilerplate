/*
 *  Column definitions composable
 */

import { createColumnHelper } from "@tanstack/vue-table";
import { h } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-vue-next";

const columnHelper = createColumnHelper();

function useTableColumns() {
  return [
    columnHelper.display({
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
      enableSorting: true,
      enableHiding: true,
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => {
        return h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => ["Email", h(ChevronsUpDown, { class: "ml-2 h-4 w-4" })],
        );
      },
      cell: ({ row }) =>
        h("div", { class: "lowercase" }, row.getValue("email")),
    }),
    columnHelper.accessor("amount", {
      header: () => h("div", { class: "text-right" }, "Amount"),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return h("div", { class: "text-right font-medium" }, formatted);
      },
    }),
  ];
}

export default useTableColumns;
