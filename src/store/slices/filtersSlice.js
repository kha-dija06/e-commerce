import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'all',
  region: 'all',
  minPrice: 0,
  maxPrice: 10000,
  search: '',
  sortBy: 'newest',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
