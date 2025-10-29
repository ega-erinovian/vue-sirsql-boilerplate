import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";

export function useDateRange() {
  /**
   * Konversi CalendarDate ke format PHP (Y-m-d string)
   */
  const parseDateToPhpFormat = (date) => {
    if (!date) return null;
    
    // Pastikan date adalah CalendarDate object
    if (date.day && date.month && date.year) {
      const month = String(date.month).padStart(2, '0');
      const day = String(date.day).padStart(2, '0');
      return `${date.year}-${month}-${day}`;
    }
    
    return null;
  };

  /**
   * Get default date range (awal bulan sampai hari ini)
   */
  const getDefaultDateRange = () => ({
    start: today(getLocalTimeZone()).set({ day: 1 }),
    end: today(getLocalTimeZone())
  });

  /**
   * Konversi string PHP date (Y-m-d) ke CalendarDate object
   * CRITICAL: RangeCalendar membutuhkan CalendarDate, bukan plain object!
   */
  const convertFromPhpDate = (phpDateString) => {
    if (!phpDateString) return null;
    
    try {
      const [year, month, day] = phpDateString.split('-').map(Number);
      
      if (!year || !month || !day) {
        console.warn('Invalid PHP date format:', phpDateString);
        return null;
      }
      
      // Validasi nilai
      if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
        console.warn('Date values out of range:', { year, month, day });
        return null;
      }
      
      // Kembalikan CalendarDate object, bukan plain object
      return new CalendarDate(year, month, day);
    } catch (error) {
      console.error('Failed to parse PHP date:', phpDateString, error);
      return null;
    }
  };

  /**
   * Konversi plain object ke CalendarDate
   * Ini untuk backward compatibility jika ada kode yang masih pakai plain object
   */
  const convertToDateObject = (dateObj) => {
    if (!dateObj) return null;
    
    // Jika sudah CalendarDate, return as-is
    if (dateObj instanceof CalendarDate) {
      return dateObj;
    }
    
    // Jika plain object dengan day, month, year
    if (dateObj.day && dateObj.month && dateObj.year) {
      try {
        return new CalendarDate(dateObj.year, dateObj.month, dateObj.day);
      } catch (error) {
        console.error('Failed to convert to CalendarDate:', dateObj, error);
        return null;
      }
    }
    
    return null;
  };

  /**
   * Validasi apakah date range valid
   */
  const isValidDateRange = (start, end) => {
    if (!start || !end) return false;
    
    try {
      // Cek apakah keduanya CalendarDate
      if (!(start instanceof CalendarDate) || !(end instanceof CalendarDate)) {
        return false;
      }
      
      // Cek apakah start <= end
      return start.compare(end) <= 0;
    } catch (error) {
      console.error('Date range validation error:', error);
      return false;
    }
  };

  /**
   * Format CalendarDate untuk display (DD/MM/YYYY)
   */
  const formatDateDisplay = (date) => {
    if (!date) return '';
    
    try {
      const day = String(date.day).padStart(2, '0');
      const month = String(date.month).padStart(2, '0');
      return `${day}/${month}/${date.year}`;
    } catch (error) {
      console.error('Format date display error:', error);
      return '';
    }
  };

  return { 
    parseDateToPhpFormat, 
    getDefaultDateRange, 
    convertFromPhpDate, 
    convertToDateObject,
    isValidDateRange,
    formatDateDisplay
  };
}