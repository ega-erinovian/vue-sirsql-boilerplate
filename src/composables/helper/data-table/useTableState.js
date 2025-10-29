// composables/useTableState.js
import { useTableStateStore } from '@/store/datatable';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';

export function useTableState(tableName, defaultState = {}) {
  const store = useTableStateStore();
  
  // Initialize state untuk table ini
  // eslint-disable-next-line no-unused-vars
  const tableState = store.initializeTableState(tableName, defaultState);
  
  // Convert to refs untuk reactivity
  const { states } = storeToRefs(store);
  
  // Computed untuk easy access
  const filters = computed(() => store.getFilters(tableName));
  const pagination = computed(() => store.getPagination(tableName));
  
  // Actions
  const updateFilters = (newFilters) => {
    store.updateFilters(tableName, newFilters);
  };
  
  const updatePagination = (newPagination) => {
    store.updatePagination(tableName, newPagination);
  };
  
  const resetState = () => {
    store.resetTableState(tableName, defaultState);
  };
  
  const clearState = () => {
    store.clearTableState(tableName);
  };
  
  // Watch untuk auto-save (optional)
  watch(
    () => states.value[tableName],
    (newState) => {
      if (newState) {
        store.saveToSessionStorage(tableName);
      }
    },
    { deep: true, immediate: true }
  );
  
  return {
    filters,
    pagination,
    updateFilters,
    updatePagination,
    resetState,
    clearState,
    tableState: computed(() => store.getTableState(tableName))
  };
}