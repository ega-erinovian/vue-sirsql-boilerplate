<script setup>
import { ChevronsUpDown, Search, Check } from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select an option...'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  emptyText: {
    type: String,
    default: 'No results found.'
  },
  debounceMs: {
    type: Number,
    default: 300
  },
  // New props to support custom key mapping
  valueKey: {
    type: String,
    default: 'idperan' // Support idperan as default
  },
  labelKey: {
    type: String,
    default: 'namaperan' // Support namaperan as default
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'search'])

const isOpen = ref(false)
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const selectedValue = ref(props.modelValue)
const triggerRef = ref(null)
const dropdownRef = ref(null)
let debounceTimeout = null

// Watch for external model value changes
watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal
})

// Debounce search query
watch(searchQuery, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newValue
    emit('search', newValue)
  }, props.debounceMs)
})

const filteredOptions = computed(() => {
  if (!debouncedSearchQuery.value) return props.options
  
  return props.options.filter(option => {
    const label = option[props.labelKey] || option.label || ''
    return label.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
  })
})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => {
    const value = opt[props.valueKey] || opt.value
    return value === selectedValue.value || value === String(selectedValue.value)
  })
  if (selected) {
    return selected[props.labelKey] || selected.label || props.placeholder
  }
  return props.placeholder
})

const selectOption = (option) => {
  const value = option[props.valueKey] || option.value
  selectedValue.value = value
  emit('update:modelValue', value)
  emit('change', option)
  isOpen.value = false
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    setTimeout(() => {
      const searchInput = dropdownRef.value?.querySelector('input')
      searchInput?.focus()
    }, 50)
  } else {
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
  }
}

const handleClickOutside = (e) => {
  if (
    triggerRef.value &&
    dropdownRef.value &&
    !triggerRef.value.contains(e.target) &&
    !dropdownRef.value.contains(e.target)
  ) {
    isOpen.value = false
    searchQuery.value = ''
    debouncedSearchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
})
</script>

<template>
    <div class="w-full space-y-4">
      
      <div class="relative">
        <!-- Trigger Button -->
        <button
          ref="triggerRef"
          type="button"
          @click="toggleDropdown"
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :class="{ 'ring-2 ring-ring ring-offset-2': isOpen }"
        >
          <span :class="selectedValue ? 'text-foreground' : 'text-muted-foreground'">
            {{ selectedLabel }}
          </span>
          <ChevronsUpDown class="h-4 w-4 opacity-50" />
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            ref="dropdownRef"
            class="absolute z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none"
          >
            <!-- Search Input -->
            <div class="flex items-center border-b px-3">
              <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="searchPlaceholder"
                class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <!-- Options List -->
            <div class="max-h-[300px] overflow-y-auto p-1">
              <div
                v-if="filteredOptions.length === 0"
                class="py-6 text-center text-sm text-muted-foreground"
              >
                {{ emptyText }}
              </div>
              
              <button
                v-for="option in filteredOptions"
                :key="option[valueKey] || option.value"
                type="button"
                @click="selectOption(option)"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                :class="{
                  'bg-accent': selectedValue == (option[valueKey] || option.value)
                }"
              >
                <Check
                  class="mr-2 h-4 w-4"
                  :class="selectedValue == (option[valueKey] || option.value) ? 'opacity-100' : 'opacity-0'"
                />
                <span>{{ option[labelKey] || option.label }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
</template>