import {create} from 'zustand';

interface StoreState {
    loading: boolean;
    error: string | null;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
  }
  
  const useStore = create<StoreState>((set) => ({
    loading: false,
    error: null,
  
    setLoading: (isLoading) => set({ loading: isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  }));
  
  export default useStore;