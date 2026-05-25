// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { Heart, ShoppingCart, Star } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavorite } from '../store/slices/favoritesSlice';
// import { addToCart } from '../store/slices/cartSlice';
// import { formatPrice } from '../utils/formatters';

// const ProductCard = ({ product }) => {
//   const { t, i18n } = useTranslation();
//   const dispatch = useDispatch();
//   const favorites = useSelector(state => state.favorites.items);
//   const isFavorite = favorites.some(item => item.id === product.id);

//   const handleToggleFavorite = (e) => {
//     e.preventDefault();
//     dispatch(toggleFavorite(product));
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     dispatch(addToCart({ ...product, quantity: 1 }));
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group border border-gray-100">
//       <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
//         <img 
//           src={product.image || 'https://picsum.photos/seed/morocco/400/400'} 
//           alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           referrerPolicy="no-referrer"
//         />
//         <button 
//           onClick={handleToggleFavorite}
//           className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition ${
//             isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
//           }`}
//         >
//           <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
//         </button>
//         {product.stock === 0 && (
//           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//             <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
//               {t('product.out_of_stock')}
//             </span>
//           </div>
//         )}
//       </Link>
      
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-1">
//           <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
//             {product.category}
//           </span>
//           <div className="flex items-center text-yellow-400 text-xs">
//             <Star size={12} fill="currentColor" />
//             <span className="ml-1 text-gray-500">4.8</span>
//           </div>
//         </div>
        
//         <Link to={`/product/${product.id}`}>
//           <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-emerald-600 transition">
//             {product.name}
//           </h3>
//         </Link>
        
//         <div className="flex items-center justify-between mt-4">
//           <span className="text-lg font-bold text-gray-900">
//             {formatPrice(product.price, i18n.language)}
//           </span>
//           <button 
//             onClick={handleAddToCart}
//             disabled={product.stock === 0}
//             className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition"
//           >
//             <ShoppingCart size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
// components/ProductCard.js
// import { Heart } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavorite } from '../store/slices/favoritesSlice';
// import { useAuth } from '../hooks/useAuth';
// import { useNavigate } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const favorites = useSelector(state => state.favorites.items);
//   const isFavorite = favorites.some(item => item.id === product.id);

//   const handleFavoriteClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated) {
//       navigate('/login', { state: { from: '/products' } });
//       return;
//     }
    
//     dispatch(toggleFavorite(product));
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         <img 
//           src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
//           alt={product.nom}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <button
//           onClick={handleFavoriteClick}
//           className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition ${
//             isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
//           }`}
//         >
//           <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
//         </button>
//       </div>
//       <div className="p-4">
//         <h3 className="font-bold text-gray-900">{product.nom}</h3>
//         <p className="text-emerald-600 font-bold mt-2">{product.prix} DH</p>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
// import { Heart } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavorite } from '../store/slices/favoritesSlice';
// import { useAuth } from '../hooks/useAuth';
// import { useNavigate } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
  
//   // Get favorites from Redux store
//   const favorites = useSelector(state => state.favorites.items);
//   const isFavorite = favorites?.some(item => item?.id === product?.id) || false;

//   const handleCardClick = () => {
//     navigate(`/product/${product.id}`);
//   };

//   const handleFavoriteClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated) {
//       navigate('/login', { state: { from: '/products' } });
//       return;
//     }
    
//     dispatch(toggleFavorite(product));
//   };

//   const getImageUrl = (image) => {
//     if (!image) return `https://picsum.photos/seed/${product?.id}/400/400`;
//     if (image.startsWith('http')) return image;
//     return `http://localhost:8000/storage/${image}`;
//   };

//   return (
//     <div 
//       onClick={handleCardClick}
//       className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
//     >
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         <img 
//           src={getImageUrl(product?.image)}
//           alt={product?.nom}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           onError={(e) => {
//             e.target.src = `https://picsum.photos/seed/${product?.id}/400/400`;
//           }}
//         />
        
//         {/* Stock badge */}
//         {product?.stock === 0 && (
//           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//             <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
//               Rupture de stock
//             </span>
//           </div>
//         )}
        
//         {product?.stock > 0 && product?.stock <= 5 && (
//           <div className="absolute top-3 left-3">
//             <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//               {product.stock} unités
//             </span>
//           </div>
//         )}
        
//         {/* Favorite button */}
//         <button
//           onClick={handleFavoriteClick}
//           className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition ${
//             isFavorite 
//               ? 'bg-red-500 text-white' 
//               : 'bg-white text-gray-400 hover:text-red-500'
//           }`}
//         >
//           <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
//         </button>
//       </div>
      
//       <div className="p-4 space-y-2">
//         {/* Category */}
//         {product?.categorie?.nom && (
//           <p className="text-xs text-emerald-600 font-medium">
//             {product.categorie.nom}
//           </p>
//         )}
        
//         {/* Product name */}
//         <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-emerald-600 transition">
//           {product?.nom}
//         </h3>
        
//         {/* Price */}
//         <div className="flex items-center justify-between pt-1">
//           <span className="font-bold text-gray-900 text-base">
//             {product?.prix?.toLocaleString()} DH
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
// components/ProductCard.jsx
// components/ProductCard.jsx
// components/ProductCard.jsx
import { Heart, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart(); // ✅ dakhel le composant

  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites?.some(item => item?.id === product?.id) || false;
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }
    setIsLoading(true);
    await dispatch(toggleFavorite(product));
    setIsLoading(false);
  };

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } });
      return;
    }
    await addItem(product.id, 1); // ✅ khddam
  };

  const getImageUrl = (image) => {
    if (!image) return `https://picsum.photos/seed/${product?.id}/400/400`;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/storage/${image}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product?.image)}
          alt={product?.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product?.id}/400/400`; }}
        />
        {product?.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
              {t('product.out_of_stock')}
            </span>
          </div>
        )}
        {product?.stock > 0 && product?.stock <= 5 && (
          <div className="absolute top-3 left-3">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.stock} {t('product.units')}
            </span>
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
        >
          <Heart
            size={18}
            className={`transition-all duration-200 ${
              isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-emerald-600 font-medium mb-0.5">
            {product?.categorie?.nom}
          </p>
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
            {product?.nom}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base">
            {product?.prix?.toLocaleString()} DH
          </span>
          {product?.statut && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.statut === 'disponible'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}>
              {product.statut === 'disponible' ? t('admin.active') : t('product.out_of_stock')}
            </span>
          )}
        </div>
        <button
          onClick={handleCartClick}
          disabled={product?.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
            product?.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
          }`}
        >
          <ShoppingCart size={15} />
          {product?.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
