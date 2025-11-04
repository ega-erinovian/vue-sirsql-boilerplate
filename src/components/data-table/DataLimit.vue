<script setup>
import { useTableState } from '@/composables/helper/data-table/useTableState';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ref, watch } from 'vue';

const props = defineProps({
  tableStateName: {
    type: String,
    required: true
  },
});

const { pagination: paginationStore, updatePagination } = useTableState(props.tableStateName);

const limit = ref(paginationStore.value?.limit || "10");

watch(limit, (newLimit) => {
  if (newLimit) {
    updatePagination({ limit: newLimit });
    updatePagination({ currentPage: 1 })
  }
});
</script>
<template>
    <div class="flex gap-2 items-center w-full">
      Showing
      <Select v-model="limit">
        <SelectTrigger>
          <SelectValue :aria-label="limit">
            {{ limit }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="10"> 10 </SelectItem>
            <SelectItem value="30"> 30 </SelectItem>
            <SelectItem value="50"> 50 </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      Entries
    </div>
</template>