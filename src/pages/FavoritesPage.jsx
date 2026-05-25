// import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
// import { Heart } from 'lucide-react';
// import ProductCard from '../components/ProductCard';
// import { Link } from 'react-router-dom';

// const FavoritesPage = () => {
//   const { t } = useTranslation();
//   const favorites = useSelector(state => state.favorites.items);

//   if (favorites.length === 0) {
//     return (
//       <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
//         <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
//           <Heart size={48} className="text-red-500" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900">{t('favorites.empty')}</h1>
//         <p className="text-gray-500">{t('favorites.add')}</p>
//         <Link to="/" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition">
//           {t('home.shop_now')}
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('favorites.title')}</h1>
//         <span className="text-gray-500">{favorites.length} {t('nav.products')}</span>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {favorites.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FavoritesPage;
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { fetchFavorites } from '../store/slices/favoritesSlice';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: favorites, loading, error } = useSelector(state => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <Heart size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('favorites.error')}</h1>
        <p className="text-gray-500">{error}</p>
        <button 
          onClick={() => dispatch(fetchFavorites())}
          className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <Heart size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('favorites.empty')}</h1>
        <p className="text-gray-500">{t('favorites.add')}</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition">
          {t('home.shop_now')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('favorites.title')}</h1>
        <span className="text-gray-500">{favorites.length} {t('nav.products')}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;