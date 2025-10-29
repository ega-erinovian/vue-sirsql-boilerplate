import { getLocalTimeZone, today } from "@internationalized/date";

export function useDefaultDateRange() {
  const getDefaultDateRange = () => ({
    start: today(getLocalTimeZone()).set({ day: 1 }), // Tanggal 1 bulan ini
    end: today(getLocalTimeZone()), // Hari ini
  });

  return { getDefaultDateRange };
}
