import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import filtersReducer from './slices/filtersSlice';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,

      favorites: favoritesReducer,
    filters: filtersReducer,
    language: languageReducer,
  },
});
