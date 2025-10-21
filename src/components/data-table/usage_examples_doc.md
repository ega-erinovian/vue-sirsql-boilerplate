# Reusable DataTable Component - Usage Guide

## Basic Usage

```vue
<script setup>
import { createColumnHelper } from "@tanstack/vue-table";
import DataTable from "@/components/DataTable/DataTable.vue";
import { createSortableColumn } from "@/utils/tableColumnHelpers";

const data = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" },
];

const columnHelper = createColumnHelper();

const columns = [
  createSortableColumn(columnHelper, "name", "Name"),
  createSortableColumn(columnHelper, "email", "Email"),
];
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | required | Your table data array |
| `columns` | Array | required | Column definitions |
| `filterColumn` | String | null | Column ID to filter on |
| `filterPlaceholder` | String | "Filter..." | Placeholder text for filter input |
| `showColumnVisibility` | Boolean | true | Show column visibility dropdown |
| `showPagination` | Boolean | true | Show pagination controls |
| `pageSize` | Number | 10 | Number of rows per page |
| `enableSelection` | Boolean | false | Enable row selection |
| `enableExpanding` | Boolean | false | Enable row expanding |
| `pinnedColumns` | Object | {} | Pin columns left/right |
| `rowClassName` | String\|Function | null | CSS class(es) for rows |
| `cellClassName` | String\|Function | null | CSS class(es) for cells |
| `headerClassName` | String\|Function | null | CSS class(es) for table headers |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `rowClick` | row data | Fired when row is clicked |
| `selectionChange` | selection object | Fired when selection changes |

## Column Helper Functions

### 1. Selection Column
```js
import { createSelectionColumn } from "@/utils/tableColumnHelpers";

createSelectionColumn(columnHelper)
```

### 2. Sortable Column
```js
import { createSortableColumn } from "@/utils/tableColumnHelpers";

createSortableColumn(columnHelper, "email", "Email", {
  className: "lowercase" // optional
})
```

### 3. Currency Column
```js
import { createCurrencyColumn } from "@/utils/tableColumnHelpers";

createCurrencyColumn(columnHelper, "amount", "Amount", "USD")
```

### 4. Date Column
```js
import { createDateColumn } from "@/utils/tableColumnHelpers";

createDateColumn(columnHelper, "createdAt", "Created", {
  dateFormat: { month: "short", day: "numeric", year: "numeric" }
})
```

### 5. Badge/Status Column
```js
import { createBadgeColumn } from "@/utils/tableColumnHelpers";

createBadgeColumn(columnHelper, "status", "Status", {
  active: { class: "bg-green-100 text-green-800", label: "Active" },
  inactive: { class: "bg-gray-100 text-gray-800", label: "Inactive" },
})
```

### 6. Actions Column
```js
import { createActionsColumn } from "@/utils/tableColumnHelpers";
import { h } from "vue";
import { Button } from "@/components/ui/button";

createActionsColumn(columnHelper, (row) => {
  return h(Button, {
    size: "sm",
    onClick: () => console.log("Edit", row.original)
  }, "Edit");
})
```

## Advanced Example

```vue
<script setup>
import { createColumnHelper } from "@tanstack/vue-table";
import DataTable from "@/components/DataTable/DataTable.vue";
import {
  createSelectionColumn,
  createSortableColumn,
  createCurrencyColumn,
  createBadgeColumn,
  createActionsColumn,
} from "@/utils/tableColumnHelpers";
import { h } from "vue";
import { Button } from "@/components/ui/button";

const data = [
  { id: 1, name: "Product A", price: 99.99, status: "active" },
  { id: 2, name: "Product B", price: 149.99, status: "inactive" },
];

const columnHelper = createColumnHelper();

const columns = [
  createSelectionColumn(columnHelper),
  createSortableColumn(columnHelper, "name", "Product Name"),
  createCurrencyColumn(columnHelper, "price", "Price", "USD"),
  createBadgeColumn(columnHelper, "status", "Status", {
    active: { class: "bg-green-100 text-green-800", label: "Active" },
    inactive: { class: "bg-gray-100 text-gray-800", label: "Inactive" },
  }),
  createActionsColumn(columnHelper, (row) => {
    return h("div", { class: "flex gap-2" }, [
      h(Button, {
        size: "sm",
        variant: "outline",
        onClick: () => editItem(row.original)
      }, "Edit"),
      h(Button, {
        size: "sm",
        variant: "destructive",
        onClick: () => deleteItem(row.original)
      }, "Delete"),
    ]);
  }),
];

const editItem = (item) => {
  console.log("Edit:", item);
};

const deleteItem = (item) => {
  console.log("Delete:", item);
};
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    filter-column="name"
    filter-placeholder="Search products..."
    :enable-selection="true"
    :page-size="10"
    @row-click="(row) => console.log('Clicked:', row)"
  >
    <template #empty>
      <div class="text-center py-8">
        <p class="text-lg font-semibold">No products found</p>
        <p class="text-sm text-muted-foreground">Try adjusting your search</p>
      </div>
    </template>
  </DataTable>
</template>
```

## Custom Slots

### Empty State
```vue
<template #empty>
  <div class="text-center py-8">
    Custom empty message
  </div>
</template>
```

### Toolbar Actions
```vue
<template #actions>
  <Button @click="addNew">Add New</Button>
</template>
```

### Expanded Row Content
```vue
<template #expanded-row="{ row }">
  <div class="p-4">
    {{ row.original }}
  </div>
</template>
```

## Row & Cell Styling

### Static Row Color
```vue
<DataTable 
  :data="data" 
  :columns="columns"
  row-class-name="bg-blue-50 hover:bg-blue-100"
/>
```

### Static Header Color
```vue
<DataTable 
  :data="data" 
  :columns="columns"
  header-class-name="bg-blue-600 text-white font-bold"
/>
```

### Dynamic Row Color (Function)
```vue
<script setup>
const getRowColor = (row, index) => {
  // Color based on row data
  if (row.status === "error") return "bg-red-50 hover:bg-red-100";
  if (row.status === "warning") return "bg-yellow-50 hover:bg-yellow-100";
  if (row.status === "success") return "bg-green-50 hover:bg-green-100";
  
  // Alternate row colors
  return index % 2 === 0 ? "bg-gray-50" : "bg-white";
};
</script>

<template>
  <DataTable 
    :data="data" 
    :columns="columns"
    :row-class-name="getRowColor"
  />
</template>
```

### Dynamic Cell Color (Function)
```vue
<script setup>
const getCellColor = (columnId, row, index) => {
  // Highlight specific column
  if (columnId === "amount" && row.amount > 1000) {
    return "font-bold text-green-600 bg-green-50";
  }
  
  // Color based on status in any cell
  if (row.status === "urgent") {
    return "text-red-600";
  }
  
  return "";
};
</script>

<template>
  <DataTable 
    :data="data" 
    :columns="columns"
    :cell-class-name="getCellColor"
  />
</template>
```

### Dynamic Header Color (Function)
```vue
<script setup>
const getHeaderColor = (columnId, index) => {
  // Color specific headers
  if (columnId === "email") return "bg-blue-100 text-blue-900";
  if (columnId === "status") return "bg-purple-100 text-purple-900";
  if (columnId === "amount") return "bg-green-100 text-green-900";
  
  // Default header color
  return "bg-gray-100 text-gray-900";
};
</script>

<template>
  <DataTable 
    :data="data" 
    :columns="columns"
    :header-class-name="getHeaderColor"
  />
</template>
```

### Complete Styling Example
```vue
<script setup>
const orders = [
  { id: 1, product: "Laptop", amount: 1200, status: "delivered", priority: "high" },
  { id: 2, product: "Mouse", amount: 25, status: "pending", priority: "low" },
  { id: 3, product: "Keyboard", amount: 80, status: "cancelled", priority: "medium" },
];

// Header styling
const getHeaderColor = (columnId, index) => {
  const headerColors = {
    product: "bg-blue-600 text-white",
    amount: "bg-green-600 text-white",
    status: "bg-purple-600 text-white",
    priority: "bg-orange-600 text-white",
  };
  return `${headerColors[columnId] || "bg-gray-600 text-white"} font-bold`;
};

// Row styling based on status
const getRowColor = (row, index) => {
  const statusColors = {
    delivered: "bg-green-50 hover:bg-green-100",
    pending: "bg-yellow-50 hover:bg-yellow-100",
    cancelled: "bg-red-50 hover:bg-red-100",
  };
  return statusColors[row.status] || "";
};

// Cell styling for amounts and priority
const getCellColor = (columnId, row, index) => {
  // Highlight high value orders
  if (columnId === "amount" && row.amount >= 1000) {
    return "font-bold text-green-700";
  }
  
  // Color priority column
  if (columnId === "priority") {
    const priorityColors = {
      high: "text-red-600 font-semibold",
      medium: "text-yellow-600 font-medium",
      low: "text-gray-500",
    };
    return priorityColors[row.priority] || "";
  }
  
  return "";
};
</script>

<template>
  <DataTable
    :data="orders"
    :columns="columns"
    :header-class-name="getHeaderColor"
    :row-class-name="getRowColor"
    :cell-class-name="getCellColor"
  />
</template>
```

### Styling Tips

**Available Tailwind classes for headers:**
- **Background**: `bg-blue-600`, `bg-green-600`, `bg-purple-600`, etc.
- **Text**: `text-white`, `text-gray-900`, `font-bold`, `font-semibold`
- **Combinations**: `bg-blue-600 text-white font-bold`

**Available Tailwind classes for rows/cells:**
- **Background**: `bg-red-50`, `bg-green-50`, `bg-blue-50`, etc.
- **Hover**: `hover:bg-red-100`, `hover:bg-green-100`, etc.
- **Text**: `text-red-600`, `text-green-700`, `font-bold`, `font-semibold`
- **Border**: `border-l-4`, `border-red-500`, etc.

**Function signatures:**
```js
// Header class function
(columnId, columnIndex) => string

// Row class function
(rowData, rowIndex) => string

// Cell class function  
(columnId, rowData, rowIndex) => string
```
