import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';

export const useFavorites = () => {
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  const isFavorite = (productId) => favorites.some(item => item.id === productId);

  return {
    favorites,
    toggle: (product) => dispatch(toggleFavorite(product)),
    isFavorite,
  };
};
