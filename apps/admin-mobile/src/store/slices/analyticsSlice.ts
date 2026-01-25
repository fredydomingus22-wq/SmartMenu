import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsData, AnalyticsFilters } from '../../types/analytics';

interface AnalyticsState {
  data: AnalyticsData | null;
  filters: AnalyticsFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  filters: {
    period: 'today',
  },
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action: PayloadAction<AnalyticsData>) => {
      state.data = action.payload;
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<AnalyticsFilters>) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setAnalyticsData, setFilters, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;