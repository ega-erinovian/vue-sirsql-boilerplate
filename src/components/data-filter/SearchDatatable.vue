<script setup>
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search...",
  },
  debounce: {
    type: Number,
    default: 500,
  },
  tableState: {
    type: Object,
    required: true,
  },
});

const searchValue = ref("");
let debounceTimeout = null;

onMounted(() => {
  if (props.tableState.filters.value.search) {
    searchValue.value = props.tableState.filters.value.search;
  }
});

// Watch search value dengan debounce
watch(
  () => searchValue.value,
  (newValue) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      props.tableState.updateFilters({
        search: newValue,
      });
    }, props.debounce);
  }
);
</script>

<template>
  <div class="relative w-full max-w-lg items-center">
    <Input
      v-model="searchValue"
      id="search"
      type="text"
      :placeholder="placeholder"
      class="pl-8"
    />
    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Search class="size-4 text-muted-foreground" />
    </span>
  </div>
</template>