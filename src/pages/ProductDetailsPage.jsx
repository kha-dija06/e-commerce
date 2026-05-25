import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { useState, useEffect } from 'react';
import api from '../services/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { addItem } = useCart(); // ✅ useCart bدل addToCart
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const isRTL = i18n.language === 'ar';

  // Fetch product
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/produits/${id}`)
      .then(res => {
        const productData = res.data?.data || res.data;
        setProduct(productData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const favorites = useSelector(state => state.favorites?.items || []);
  const isFavorite = favorites.some(item => item.id === product?.id);

  const handleAddToCart = async () => {
    if (product && product.stock > 0) {
      await addItem(product.id, quantity); // ✅ khdm b backend
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return `https://picsum.photos/seed/${id}/800/800`;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/storage/${image}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
          <p className="text-gray-500 mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium mb-4">{t('common.error')}</p>
          <Link to="/products" className="text-emerald-600 hover:underline">
            {t('common.back_to_products')}
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center text-emerald-600 font-semibold hover:underline group"
      >
        <ChevronLeft size={20} className={`mr-1 ${isRTL ? 'rotate-180 ml-1 mr-0' : ''} group-hover:-translate-x-1 transition-transform`} />
        {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            <img
              src={getImageUrl(product.image)}
              alt={product.nom}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                  {product.categorie?.nom || t('product.category')}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mt-4">{product.nom}</h1>
              </div>
              <button
                onClick={() => dispatch(toggleFavorite(product))}
                className={`p-3 rounded-full shadow-sm transition ${
                  isFavorite ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100'
                }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} fill={i <= 4 ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm font-medium">(48 {t('product.reviews')})</span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(product.prix, i18n.language)}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description || t('product.no_description')}
          </p>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
            <div>
              <p className="text-sm text-gray-400">{t('product.region')}</p>
              <p className="font-semibold text-gray-800">{product.region || 'Moyen Atlas'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('product.artisan')}</p>
              <p className="font-semibold text-gray-800">{product.artisan || 'Coopérative Artisanale'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('product.material')}</p>
              <p className="font-semibold text-gray-800">{product.categorie?.nom || 'Artisanal'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('product.stock')}</p>
              <p className={`font-semibold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                {isAvailable
                  ? isLowStock
                    ? `${product.stock} ${t('product.units')} (${t('product.low_stock')})`
                    : `${product.stock} ${t('product.units')}`
                  : t('product.out_of_stock')
                }
              </p>
            </div>
          </div>

          {/* Quantity + Add to cart */}
          {isAvailable ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:text-emerald-600 transition"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:text-emerald-600 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-grow py-4 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <ShoppingCart size={20} />
                <span>{added ? '✓ Ajouté !' : t('product.add_to_cart')}</span>
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed">
              {t('product.out_of_stock')}
            </button>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xs font-medium text-gray-600">{t('product.secure_payment')}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <Truck size={24} />
              </div>
              <span className="text-xs font-medium text-gray-600">{t('product.express_delivery')}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <RotateCcw size={24} />
              </div>
              <span className="text-xs font-medium text-gray-600">{t('product.free_returns')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
// import { useTranslation } from 'react-i18next';
// import { useParams, Link } from 'react-router-dom';
// import { Heart, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFavorite } from '../store/slices/favoritesSlice';
// import { addToCart } from '../store/slices/cartSlice';
// import { formatPrice } from '../utils/formatters';
// import { useState, useEffect } from 'react';
// import api from '../services/api';

// const ProductDetailsPage = () => {
//   const { id } = useParams();
//   const { t, i18n } = useTranslation();
//   const dispatch = useDispatch();
//   const [quantity, setQuantity] = useState(1);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const isRTL = i18n.language === 'ar';

//   // Parse response
//   const parseResponse = (data) => {
//     if (typeof data === 'string') {
//       try {
//         return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
//       } catch (e) {
//         console.error('JSON Parse error:', e);
//         return null;
//       }
//     }
//     return data;
//   };

//   // Fetch product from API
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
    
//     api.get(`/produits/${id}`)
//       .then(res => {
//         const raw = parseResponse(res.data);
//         const productData = raw.data || raw;
//         setProduct(productData);
//       })
//       .catch(err => {
//         console.error('Error fetching product:', err);
//         setError(true);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   const favorites = useSelector(state => state.favorites?.items || []);
//   const isFavorite = favorites.some(item => item.id === product?.id);

//   const handleAddToCart = () => {
//     if (product && product.stock > 0) {
//       dispatch(addToCart({ ...product, quantity }));
//     }
//   };

//   const getImageUrl = (image) => {
//     if (!image) return `https://picsum.photos/seed/${id}/800/800`;
//     if (image.startsWith('http')) return image;
//     return `http://localhost:8000/storage/${image}`;
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-20">
//         <div className="flex flex-col items-center justify-center">
//           <Loader2 className="animate-spin text-emerald-600" size={48} />
//           <p className="text-gray-500 mt-4">{t('common.loading')}</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !product) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-20">
//         <div className="text-center">
//           <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
//           <p className="text-gray-600 font-medium mb-4">{t('common.error')}</p>
//           <Link to="/products" className="text-emerald-600 hover:underline">
//             {t('common.back_to_products')}
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const isAvailable = product.stock > 0;
//   const isLowStock = product.stock > 0 && product.stock <= 5;

//   return (
//     <div className="max-w-7xl mx-auto px-4 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
//       {/* Back Button */}
//       <Link 
//         to="/products" 
//         className="inline-flex items-center text-emerald-600 font-semibold hover:underline group"
//       >
//         <ChevronLeft size={20} className={`mr-1 ${isRTL ? 'rotate-180 ml-1 mr-0' : ''} group-hover:-translate-x-1 ${isRTL ? 'group-hover:translate-x-1' : ''} transition-transform`} />
//         {t('common.back')}
//       </Link>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Image - wahda kbira */}
//         <div className="space-y-4">
//           <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
//             <img 
//               src={getImageUrl(product.image)}
//               alt={product.nom} 
//               className="w-full h-full object-cover"
//               referrerPolicy="no-referrer"
//             />
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-8">
//           <div className="space-y-4">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
//                   {product.categorie?.nom || product.category || t('product.category')}
//                 </span>
//                 <h1 className="text-4xl font-bold text-gray-900 mt-4">{product.nom}</h1>
//               </div>
//               <button 
//                 onClick={() => dispatch(toggleFavorite(product))}
//                 className={`p-3 rounded-full shadow-sm transition ${
//                   isFavorite ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100'
//                 }`}
//               >
//                 <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
//               </button>
//             </div>

//             <div className="flex items-center space-x-4 rtl:space-x-reverse">
//               <div className="flex items-center text-yellow-400">
//                 {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} fill={i <= 4 ? "currentColor" : "none"} />)}
//               </div>
//               <span className="text-gray-500 text-sm font-medium">(48 {t('product.reviews')})</span>
//             </div>

//             <p className="text-3xl font-bold text-gray-900">{formatPrice(product.prix, i18n.language)}</p>
//           </div>

//           <p className="text-gray-600 leading-relaxed text-lg">
//             {product.description || t('product.no_description')}
//           </p>

//           <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
//             <div>
//               <p className="text-sm text-gray-400">{t('product.region')}</p>
//               <p className="font-semibold text-gray-800">{product.region || 'Moyen Atlas'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">{t('product.artisan')}</p>
//               <p className="font-semibold text-gray-800">{product.artisan || 'Coopérative Artisanale'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">{t('product.material')}</p>
//               <p className="font-semibold text-gray-800">{product.material || product.categorie?.nom || 'Artisanal'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">{t('product.stock')}</p>
//               <p className={`font-semibold ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
//                 {isAvailable 
//                   ? (isLowStock 
//                       ? `${product.stock} ${t('product.units')} (${t('product.low_stock')})` 
//                       : `${product.stock} ${t('product.units')}`)
//                   : t('product.out_of_stock')
//                 }
//               </p>
//             </div>
//           </div>

//           {isAvailable && (
//             <div className="flex items-center space-x-6 rtl:space-x-reverse">
//               <div className="flex items-center border border-gray-200 rounded-xl p-1">
//                 <button 
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 flex items-center justify-center hover:text-emerald-600 transition"
//                 >
//                   <Minus size={18} />
//                 </button>
//                 <span className="w-12 text-center font-bold text-lg">{quantity}</span>
//                 <button 
//                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                   className="w-10 h-10 flex items-center justify-center hover:text-emerald-600 transition"
//                 >
//                   <Plus size={18} />
//                 </button>
//               </div>
//               <button 
//                 onClick={handleAddToCart}
//                 disabled={!isAvailable}
//                 className="flex-grow bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:bg-gray-300 disabled:cursor-not-allowed"
//               >
//                 <ShoppingCart size={20} />
//                 <span>{t('product.add_to_cart')}</span>
//               </button>
//             </div>
//           )}

//           {!isAvailable && (
//             <button 
//               disabled
//               className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed"
//             >
//               {t('product.out_of_stock')}
//             </button>
//           )}

//           <div className="grid grid-cols-3 gap-4 pt-8">
//             <div className="flex flex-col items-center text-center space-y-2">
//               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><ShieldCheck size={24} /></div>
//               <span className="text-xs font-medium text-gray-600">{t('product.secure_payment')}</span>
//             </div>
//             <div className="flex flex-col items-center text-center space-y-2">
//               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><Truck size={24} /></div>
//               <span className="text-xs font-medium text-gray-600">{t('product.express_delivery')}</span>
//             </div>
//             <div className="flex flex-col items-center text-center space-y-2">
//               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><RotateCcw size={24} /></div>
//               <span className="text-xs font-medium text-gray-600">{t('product.free_returns')}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsPage;