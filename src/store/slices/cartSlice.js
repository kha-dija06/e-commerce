import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCartAsync = createAsyncThunk('cart/add', async ({ produit_id, quantite = 1 }, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart', { produit_id, quantite });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartAsync = createAsyncThunk('cart/update', async ({ produit_id, quantite }, { rejectWithValue }) => {
  try {
    await api.put(`/cart/${produit_id}`, { quantite });
    return { produit_id, quantite };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromCartAsync = createAsyncThunk('cart/remove', async (produit_id, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/${produit_id}`);
    return produit_id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCartAsync = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const existing = state.items.find(i => i.id === action.payload.id);
        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(updateCartAsync.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.produit_id);
        if (item) item.quantity = action.payload.quantite;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;