// services/favoriteService.js
import api from './api';

const favoriteService = {
  getFavorites: () => {
    return api.get('/favorites');
  },
  
  addFavorite: (productId) => {
    return api.post('/favorites', { produit_id: productId });
  },
  
  removeFavorite: (productId) => {
    return api.delete(`/favorites/${productId}`);
  },
  
  checkFavorite: (productId) => {
    return api.get(`/favorites/check/${productId}`);
  }
};

export default favoriteService;


