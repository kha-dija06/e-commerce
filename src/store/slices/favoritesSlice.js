import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoriteService from '../../services/favoriteService';

const parseResponse = (data) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data.trim().replace(/^\uFEFF/, '')); }
    catch { return null; }
  }
  return data;
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteService.getFavorites();
      const raw = parseResponse(response.data);
      return raw?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (product, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const isFavorite = state.favorites.items.some(item => item.id === product.id);

      if (isFavorite) {
        await favoriteService.removeFavorite(product.id);
        return { type: 'remove', productId: product.id };
      } else {
        await favoriteService.addFavorite(product.id);
        return { type: 'add', product };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.type === 'add') {
          state.items.push(action.payload.product);
        } else {
          state.items = state.items.filter(item => item.id !== action.payload.productId);
        }
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;