import { create } from "zustand";
import { ServiceMeterReadings } from "@/types/types";

// Define Zustand store interface
interface ServiceMeterReadingsStore {
  readings: ServiceMeterReadings[];
  reading: ServiceMeterReadings | null;  // Add null as a possible type
  addReading: (reading: ServiceMeterReadings) => void;
  updateReading: (id: string, updatedReading: Partial<ServiceMeterReadings>) => void;
  removeReading: (id: string) => void;
  setReadings: (newReadings: ServiceMeterReadings[]) => void;
  clearReadings: () => void;
  setCurrentReading: (reading: ServiceMeterReadings | null) => void;
  setReading: (reading: ServiceMeterReadings) => void;  // Accepts a full ServiceMeterReadings object
  filterReadings: (predicate: (reading: ServiceMeterReadings) => boolean) => void;
  sortReadings: (key: keyof ServiceMeterReadings, ascending?: boolean) => void;
}

// Create the Zustand store
const useServiceMeterReadingsStore = create<ServiceMeterReadingsStore>((set) => ({
  readings: [],
  reading: null,

  // Add a new reading to the array and immediately reverse the order
  addReading: (reading) =>
    set((state) => ({
      readings: [reading, ...state.readings], // Add at the beginning
    })),

  // Update an existing reading by its Id
  updateReading: (id, updatedReading) =>
    set((state) => ({
      readings: state.readings.map((reading) =>
        reading.id === id ? { ...reading, ...updatedReading } : reading
      ),
    })),

  // Remove a reading by its Id
  removeReading: (id) =>
    set((state) => ({
      readings: state.readings.filter((reading) => reading.id !== id),
    })),

  // Set the entire readings array (useful for initializing or resetting data)
  setReadings: (newReadings) =>
    set(() => ({
      readings: newReadings.reverse(), // Reverse the array directly when new data is set
    })),

  // Clear all readings in the array
  clearReadings: () =>
    set(() => ({
      readings: [],
    })),

  // Set the current reading (useful for setting an active reading to display/edit)
  setCurrentReading: (reading) =>
    set(() => ({
      reading,
    })),

  // New function to set the current reading (accepts the full ServiceMeterReadings object)
  setReading: (reading) =>
    set(() => ({
      reading,  // Sets the entire reading object
    })),

  // Filter readings based on a custom condition (predicate)
  filterReadings: (predicate) =>
    set((state) => ({
      readings: state.readings.filter(predicate),
    })),

  // Sort readings by a specific key, ascending or descending order
  sortReadings: (key, ascending = true) =>
    set((state) => ({
      readings: [...state.readings].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
  
        // Handle null/undefined values by treating them as the lowest possible value
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return ascending ? -1 : 1;
        if (bVal == null) return ascending ? 1 : -1;
  
        // Perform the comparison when values are valid
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
      }),
    })),
}));

export default useServiceMeterReadingsStore;
