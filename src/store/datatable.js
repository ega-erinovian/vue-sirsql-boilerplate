// stores/tableStateStore.js
import { defineStore } from 'pinia';

export const useTableStateStore = defineStore('tableState', {
  state: () => ({
    states: {} // { [tableName]: { filters: {}, pagination: {} } }
  }),
  
  actions: {
    // Initialize atau get state untuk table tertentu
    initializeTableState(tableName, defaultState = {}) {
      if (!this.states[tableName]) {
        this.states[tableName] = {
          filters: {
            search: '',
            startDate: null,
            endDate: null,
            // tambahkan filter default lainnya
            ...defaultState.filters
          },
          pagination: {
            currentPage: 1,
            limit: 10,
            sortBy: 'created_at',
            sortOrder: 'desc',
            ...defaultState.pagination
          },
          ...defaultState
        };
        
        // Load dari session storage jika ada
        this.loadFromSessionStorage(tableName);
      }
      return this.states[tableName];
    },
    
    // Update filters
    updateFilters(tableName, newFilters) {
      if (this.states[tableName]) {
        this.states[tableName].filters = {
          ...this.states[tableName].filters,
          ...newFilters
        };
        this.saveToSessionStorage(tableName);
      }
    },
    
    // Update pagination
    updatePagination(tableName, newPagination) {
      if (this.states[tableName]) {
        this.states[tableName].pagination = {
          ...this.states[tableName].pagination,
          ...newPagination
        };
        this.saveToSessionStorage(tableName);
      }
    },
    
    // Reset state untuk table tertentu
    resetTableState(tableName, defaultState = {}) {
      this.states[tableName] = {
        filters: {
          search: '',
          startDate: null,
          endDate: null,
          ...defaultState.filters
        },
        pagination: {
          currentPage: 1,
          limit: 10,
          sortBy: 'created_at',
          sortOrder: 'desc',
          ...defaultState.pagination
        },
        ...defaultState
      };
      this.saveToSessionStorage(tableName);
    },
    
    // Session storage methods
    saveToSessionStorage(tableName) {
      if (this.states[tableName]) {
        sessionStorage.setItem(`tableState_${tableName}`, JSON.stringify(this.states[tableName]));
      }
    },
    
    loadFromSessionStorage(tableName) {
      const stored = sessionStorage.getItem(`tableState_${tableName}`);
      if (stored) {
        this.states[tableName] = JSON.parse(stored);
      }
    },
    
    // Clear state untuk table tertentu
    clearTableState(tableName) {
      delete this.states[tableName];
      sessionStorage.removeItem(`tableState_${tableName}`);
    }
  },
  
  getters: {
    getTableState: (state) => (tableName) => {
      return state.states[tableName] || null;
    },
    
    getFilters: (state) => (tableName) => {
      return state.states[tableName]?.filters || {};
    },
    
    getPagination: (state) => (tableName) => {
      return state.states[tableName]?.pagination || {};
    }
  }
});