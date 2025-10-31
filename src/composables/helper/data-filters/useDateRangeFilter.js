// composables/helper/data-table/useDateRangeFilter.js
import { ref, watch, computed, onMounted } from 'vue';
import { useDateRange } from '../useDateRange';

/**
 * Reusable composable untuk mengelola date range filter dengan tableState
 * @param {Object} tableState - Object dari useTableState yang berisi filters dan updateFilters
 * @param {Object} options - Konfigurasi tambahan
 * @param {boolean} options.autoUpdate - Auto update pagination ke halaman 1 saat tanggal berubah (default: true)
 * @param {Function} options.onDateChange - Callback saat tanggal berubah
 * @returns {Object} - datePickerValue dan handleDateChange
 */
export function useDateRangeFilter(tableState, options = {}) {
  const {
    autoUpdate = true,
    onDateChange = null
  } = options;

  const {
    parseDateToPhpFormat,
    getDefaultDateRange,
    convertFromPhpDate,
    isValidDateRange,
  } = useDateRange();

  // Local state
  const datePickerValue = ref({ start: null, end: null });
  const isInitializing = ref(true);
  const isUpdatingFromFilter = ref(false);

  /**
   * Initialize date picker dari filters atau default
   */
  const initializeDatePicker = () => {
    isInitializing.value = true;
    isUpdatingFromFilter.value = true;

    const { startDate, endDate } = tableState.filters.value;

    if (startDate && endDate) {
      const startParsed = convertFromPhpDate(startDate);
      const endParsed = convertFromPhpDate(endDate);

      if (startParsed && endParsed && isValidDateRange(startParsed, endParsed)) {
        datePickerValue.value = {
          start: startParsed,
          end: endParsed,
        };
      } else {
        console.warn('Invalid date range from filters, using default');
        setDefaultDateRange();
      }
    } else {
      setDefaultDateRange();
    }

    setTimeout(() => {
      isInitializing.value = false;
      isUpdatingFromFilter.value = false;
    }, 100);
  };

  /**
   * Set default date range
   */
  const setDefaultDateRange = () => {
    const defaultRange = getDefaultDateRange();
    datePickerValue.value = defaultRange;
    
    tableState.updateFilters({
      startDate: parseDateToPhpFormat(defaultRange.start),
      endDate: parseDateToPhpFormat(defaultRange.end),
    });
  };

  /**
   * Handle perubahan tanggal dari DateRangeComponent
   * @param {Object} newValue - Object dengan start dan end date
   */
  const handleDateChange = (newValue) => {
    if (isInitializing.value || isUpdatingFromFilter.value) {
      return;
    }

    if (!newValue?.start || !newValue?.end) {
      console.warn('Invalid date range received:', newValue);
      return;
    }

    if (!isValidDateRange(newValue.start, newValue.end)) {
      console.warn('Invalid date range: start date must be before or equal to end date');
      return;
    }

    datePickerValue.value = newValue;

    try {
      const startDateStr = parseDateToPhpFormat(newValue.start);
      const endDateStr = parseDateToPhpFormat(newValue.end);

      if (startDateStr && endDateStr) {
        const updates = {
          startDate: startDateStr,
          endDate: endDateStr,
        };

        tableState.updateFilters(updates);

        // Reset ke halaman 1 jika autoUpdate aktif
        if (autoUpdate && tableState.updatePagination) {
          tableState.updatePagination({ currentPage: 1 });
        }

        // Callback jika ada
        if (onDateChange) {
          onDateChange({
            start: startDateStr,
            end: endDateStr,
            raw: newValue
          });
        }
      }
    } catch (error) {
      console.error('Error updating date filters:', error);
    }
  };

  /**
   * Watch filters untuk sync dengan perubahan external (reset filter, dll)
   */
  watch(
    () => [tableState.filters.value.startDate, tableState.filters.value.endDate],
    ([newStart, newEnd], [oldStart, oldEnd]) => {
      if (isInitializing.value || isUpdatingFromFilter.value) {
        return;
      }

      if (newStart === oldStart && newEnd === oldEnd) {
        return;
      }

      if (newStart && newEnd) {
        isUpdatingFromFilter.value = true;
        
        const startParsed = convertFromPhpDate(newStart);
        const endParsed = convertFromPhpDate(newEnd);

        if (startParsed && endParsed && isValidDateRange(startParsed, endParsed)) {
          datePickerValue.value = {
            start: startParsed,
            end: endParsed,
          };
        }

        setTimeout(() => {
          isUpdatingFromFilter.value = false;
        }, 50);
      }
    },
    { deep: true }
  );

  /**
   * Computed untuk mendapatkan date range dalam format PHP
   */
  const dateRangeFormatted = computed(() => ({
    start: tableState.filters.value.startDate,
    end: tableState.filters.value.endDate,
  }));

  /**
   * Reset date range ke default
   */
  const resetDateRange = () => {
    isUpdatingFromFilter.value = true;
    setDefaultDateRange();
    setTimeout(() => {
      isUpdatingFromFilter.value = false;
    }, 100);
  };

  // Initialize on mount
  onMounted(() => {
    initializeDatePicker();
  });

  return {
    datePickerValue,
    dateRangeFormatted,
    handleDateChange,
    resetDateRange,
    isInitializing,
  };
}