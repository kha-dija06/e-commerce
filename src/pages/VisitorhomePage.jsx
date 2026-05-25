// import { useTranslation } from 'react-i18next';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'motion/react';
// import { ShoppingCart, Heart, Loader2, Search, Filter, X } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';

// const VisitorHomePage = () => {
//   const { t }        = useTranslation();
//   const navigate     = useNavigate();
//   const { isAuthenticated } = useAuth();

//   const [products, setProducts]       = useState([]);
//   const [categories, setCategories]   = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination]   = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterCat, setFilterCat]     = useState('');
//   const [activeCat, setActiveCat]     = useState(null);

//   // ── Fetch categories
//   useEffect(() => {
//     fetch('http://localhost:8000/api/categories', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(r => r.json())
//       .then(d => setCategories(d.data || []))
//       .catch(() => {});
//   }, []);

//   // ── Fetch products
//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams({ page: currentPage, per_page: 8 });
//         if (searchQuery) params.set('search', searchQuery);
//         if (filterCat)   params.set('categorie_id', filterCat);

//         const res = await fetch(`http://localhost:8000/api/produits?${params}`, {
//           headers: { 'Accept': 'application/json' }
//         });
//         const data = await res.json();
//         setProducts(Array.isArray(data.data) ? data.data : []);
//         setPagination(data.pagination || null);
//       } catch {
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [currentPage, searchQuery, filterCat]);

//   // ── Click catégorie — filtre f nfs page
//   const handleCategoryFilter = (cat) => {
//     if (activeCat?.id === cat.id) {
//       setActiveCat(null);
//       setFilterCat('');
//     } else {
//       setActiveCat(cat);
//       setFilterCat(String(cat.id));
//     }
//     setCurrentPage(1);
//   };

//   // ── Reset filter
//   const clearFilter = () => {
//     setActiveCat(null);
//     setFilterCat('');
//     setSearchQuery('');
//     setCurrentPage(1);
//   };

//   // ── Guard — redirect vers login
//   const handleProtectedAction = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigate('/login', { state: { from: '/products' } });
//   };

//   const getImageUrl = (image) => {
//     if (!image) return `https://picsum.photos/seed/product-default/400/400`;
//     if (image.startsWith('http')) return image;
//     return `http://localhost:8000/storage/${image}`;
//   };

//   const getCatImageUrl = (cat) => {
//     if (cat.image && cat.image.startsWith('http') && !cat.image.includes('pin.it')) {
//       return cat.image;
//     }
//     return `https://picsum.photos/seed/cat-${cat.id}-moroccan/600/400`;
//   };

//   return (
//     <div className="space-y-10">

//       {/* ══ Hero ══ */}
//       <section className="relative h-[480px] rounded-3xl overflow-hidden">
//         <img
//           src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
//           alt="Moroccan Culture"
//           className="w-full h-full object-cover"
//           referrerPolicy="no-referrer"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
//           <div className="container mx-auto px-12 space-y-6">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
//             >
//               {t('home.hero_title')}
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15 }}
//               className="text-white/80 text-lg max-w-md"
//             >
//               {t('home.hero_subtitle')}
//             </motion.p>
//           </div>
//         </div>
//       </section>

    

//       {/* ══ Search + filter actif ══ */}
//       <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//         {/* <div className="relative flex-grow max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
//           <input
//             type="text"
//             placeholder={t('common.search')}
//             value={searchQuery}
//             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//             className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
//           />
//           {searchQuery && (
//             <button
//               onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X size={14} />
//             </button>
//           )}
//         </div> */}


//         {pagination && (
//           <span className="text-gray-400 text-sm ml-auto">
//             {pagination.total} {t('nav.products')}
//           </span>
//         )}
//       </div>

//       {/* ══ Products grid ══ */}
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {activeCat ? activeCat.nom : t('home.featured_products')}
//           </h2>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="animate-spin text-emerald-600" size={36} />
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-gray-400 text-sm">{t('common.no_results')}</p>
//             {(activeCat || searchQuery) && (
//               <button onClick={clearFilter} className="mt-3 text-emerald-600 text-sm font-medium hover:underline">
//                 {t('common.clear')}
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {products.map((product, i) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.04 }}
//                 className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
//               >
//                 {/* Image */}
//                 <div className="relative aspect-square overflow-hidden bg-gray-50">
//                   <img
//                     src={getImageUrl(product.image)}
//                     alt={product.nom}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/400`; }}
//                   />
//                   {product.stock === 0 && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                       <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
//                         {t('product.out_of_stock')}
//                       </span>
//                     </div>
//                   )}
//                   {/* Favoris */}
//                   <button
//                     onClick={handleProtectedAction}
//                     className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
//                   >
//                     <Heart size={15} className="text-gray-400 hover:text-red-500 transition" />
//                   </button>
//                   {/* Stock bas */}
//                   {product.stock > 0 && product.stock <= 5 && (
//                     <div className="absolute top-3 left-3">
//                       <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//                         {product.stock} {t('product.units')}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="p-4 space-y-3">
//                   <div>
//                     <p className="text-xs text-emerald-600 font-medium mb-0.5">
//                       {product.categorie?.nom}
//                     </p>
//                     <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
//                       {product.nom}
//                     </h3>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="font-bold text-gray-900 text-base">
//                       {product.prix.toLocaleString()} DH
//                     </span>
//                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
//                       product.statut === 'disponible'
//                         ? 'bg-emerald-50 text-emerald-600'
//                         : 'bg-red-50 text-red-500'
//                     }`}>
//                       {product.statut === 'disponible' ? t('admin.active') : t('product.out_of_stock')}
//                     </span>
//                   </div>

//                   {/* Bouton panier */}
//                   <button
//                     onClick={handleProtectedAction}
//                     disabled={product.stock === 0}
//                     className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
//                       product.stock === 0
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
//                     }`}
//                   >
//                     <ShoppingCart size={15} />
//                     {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination && pagination.last_page > 1 && (
//           <div className="flex justify-center gap-2 pt-4">
//             <button
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
//                 currentPage === 1
//                   ? 'text-gray-300 cursor-not-allowed'
//                   : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               {t('common.previous')}
//             </button>
//             {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                 className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
//                   page === currentPage
//                     ? 'bg-emerald-600 text-white'
//                     : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
//               disabled={currentPage === pagination.last_page}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
//                 currentPage === pagination.last_page
//                   ? 'text-gray-300 cursor-not-allowed'
//                   : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               {t('common.next')}
//             </button>
//           </div>
//         )}

//         {/* Login CTA */}
//         <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3">
//           <p className="font-bold text-gray-900">{t('auth.no_account')}</p>
//           <p className="text-gray-500 text-sm">{t('home.hero_subtitle')}</p>
//           <div className="flex justify-center gap-3">
//             <button
//               onClick={() => navigate('/login')}
//               className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
//             >
//               {t('auth.login')}
//             </button>
//             <button
//               onClick={() => navigate('/register')}
//               className="bg-white text-emerald-700 border border-emerald-200 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition"
//             >
//               {t('auth.register')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VisitorHomePage;

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Loader2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const VisitorHomePage = () => {
  const { t }        = useTranslation();
  const navigate     = useNavigate();
  const { isAuthenticated } = useAuth();

  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination]   = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat]     = useState('');
  const [activeCat, setActiveCat]     = useState(null);

  // Fetch categories
  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data.data || []))
      .catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: currentPage, per_page: 8 });
        if (searchQuery) params.set('search', searchQuery);
        if (filterCat)   params.set('categorie_id', filterCat);

        const res = await api.get(`/produits?${params}`);
        setProducts(Array.isArray(res.data.data) ? res.data.data : []);
        setPagination(res.data.pagination || null);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, filterCat]);

  const handleCategoryFilter = (cat) => {
    if (activeCat?.id === cat.id) {
      setActiveCat(null);
      setFilterCat('');
    } else {
      setActiveCat(cat);
      setFilterCat(String(cat.id));
    }
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setActiveCat(null);
    setFilterCat('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleProtectedAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/login', { state: { from: '/products' } });
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const getImageUrl = (image) => {
    if (!image) return `https://picsum.photos/seed/product-default/400/400`;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/storage/${image}`;
  };

  const getCatImageUrl = (cat) => {
    if (cat.image && cat.image.startsWith('http') && !cat.image.includes('pin.it')) {
      return cat.image;
    }
    return `https://picsum.photos/seed/cat-${cat.id}-moroccan/600/400`;
  };

  return (
    <div className="space-y-13">

      {/* Hero */}
      <section className="relative h-[480px] rounded-3xl overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
          alt="Moroccan Culture"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-12 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
            >
              {t('home.hero_title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-white/80 text-lg max-w-md"
            >
              {t('home.hero_subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Count */}
      <div className="flex items-center justify-end">
        {pagination && (
          <span className="text-gray-400 text-sm">
            {pagination.total} {t('nav.products')}
          </span>
        )}
      </div>

      {/* Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCat ? activeCat.nom : t('home.featured_products')}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">{t('common.no_results')}</p>
            {(activeCat || searchQuery) && (
              <button onClick={clearFilter} className="mt-3 text-emerald-600 text-sm font-medium hover:underline">
                {t('common.clear')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                onClick={() => handleCardClick(product.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/400`; }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                        {t('product.out_of_stock')}
                      </span>
                    </div>
                  )}
                  {/* Heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProtectedAction(e); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                  >
                    <Heart size={15} className="text-gray-400 hover:text-red-500 transition" />
                  </button>
                  {/* Stock bas */}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {product.stock} {t('product.units')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-emerald-600 font-medium mb-0.5">
                      {product.categorie?.nom}
                    </p>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                      {product.nom}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-base">
                      {product.prix?.toLocaleString()} DH
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.statut === 'disponible'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {product.statut === 'disponible' ? t('admin.active') : t('product.out_of_stock')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProtectedAction(e); }}
                    disabled={product.stock === 0}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
                      product.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                    }`}
                  >
                    <ShoppingCart size={15} />
                    {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('common.previous')}
            </button>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition ${
                  page === currentPage ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
              disabled={currentPage === pagination.last_page}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                currentPage === pagination.last_page ? 'text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('common.next')}
            </button>
          </div>
        )}

        {/* Login CTA */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3">
          <p className="font-bold text-gray-900">{t('auth.no_account')}</p>
          <p className="text-gray-500 text-sm">{t('home.hero_subtitle')}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-emerald-700 border border-emerald-200 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition"
            >
              {t('auth.register')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorHomePage;