// import api from './api';

// export const productService = {
//   getAll: (params) => api.get('/products', { params }),
//   getById: (id) => api.get(`/products/${id}`),
//   getCategories: () => api.get('/categories'),
//   getRegions: () => api.get('/regions'),
// };

// export default productService;
// services/productService.js
// import api from './api';

// const productService = {
//   // Get all products with pagination & filters
//   getProducts: (params = {}) => {
//     return api.get('/produits', { params });
//   },
  
//   // Get single product by ID
//   getProduct: (id) => {
//     return api.get(`/produits/${id}`);
//   },
  
//   // Get all categories
//   getCategories: () => {
//     return api.get('/categories');
//   },
  
//   // Get single category by ID
//   getCategory: (id) => {
//     return api.get(`/categories/${id}`);
//   },
  
//   // Search products by keyword
//   searchProducts: (query, params = {}) => {
//     return api.get('/produits', { 
//       params: { ...params, search: query } 
//     });
//   },
  
//   // Get products by category
//   getProductsByCategory: (categoryId, params = {}) => {
//     return api.get('/produits', {
//       params: { ...params, categorie_id: categoryId }
//     });
//   },
  
//   // Get featured products (if you have this endpoint)
//   getFeaturedProducts: (params = {}) => {
//     return api.get('/produits/featured', { params });
//   },
  
//   // Get related products
//   getRelatedProducts: (productId, params = {}) => {
//     return api.get(`/produits/${productId}/related`, { params });
//   }
// };

// export default productService;
// services/productService.js
import api from './api';

const productService = {
  // Get all products with pagination & filters
  getProducts: (params = {}) => {
    return api.get('/produits', { params });
  },
  
  // Get single product by ID
  getProduct: (id) => {
    return api.get(`/produits/${id}`);
  },
  
  // Get featured products
  getFeaturedProducts: () => {
    return api.get('/produits/vedettes');
  },
  
  // Get all categories (hna l moshkila)
  getCategories: () => {
    return api.get('/categories'); // ✅ Had endpoint kayn f ProductPublicController
  },
  
  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get('/produits', {
      params: { ...params, categorie_id: categoryId }
    });
  }
};

export default productService;