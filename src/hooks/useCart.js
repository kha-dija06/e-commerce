import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCart,
  addToCartAsync,
  removeFromCartAsync,
  updateCartAsync,
  clearCartAsync,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const { items, loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalAmount = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  return {
    items,
    loading,
    totalAmount,
    fetchCart:           ()           => dispatch(fetchCart()),
    addItem:             (produit_id, quantite) => dispatch(addToCartAsync({ produit_id, quantite })),
    removeItem:          (id)         => dispatch(removeFromCartAsync(id)),
    updateItemQuantity:  (id, qty)    => dispatch(updateCartAsync({ produit_id: id, quantite: qty })),
    clear:               ()           => dispatch(clearCartAsync()),
  };
};
