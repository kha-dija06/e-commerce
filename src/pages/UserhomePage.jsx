// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'motion/react';
// import { useAuth } from '../hooks/useAuth';
 
// // ─────────────────────────────────────────────────────────────
// // Catégories — id correspond aux IDs de la table CATEGORIES BDD
// // ─────────────────────────────────────────────────────────────
// const CATEGORIES = [
//   {
//     id: 1,
//     key: 'electronique',
//     image: 'https://picsum.photos/seed/electronics-maroc/600/400',
//     gradient: 'from-blue-700/80 to-blue-950/70',
//     accent: 'bg-blue-400',
//   },
//   {
//     id: 2,
//     key: 'mode',
//     image: 'https://picsum.photos/seed/fashion-maroc/600/400',
//     gradient: 'from-pink-600/80 to-rose-950/70',
//     accent: 'bg-pink-400',
//   },
//   {
//     id: 3,
//     key: 'maison',
//     image: 'https://picsum.photos/seed/home-maroc/600/400',
//     gradient: 'from-amber-600/80 to-orange-950/70',
//     accent: 'bg-amber-400',
//   },
//   {
//     id: 4,
//     key: 'beaute',
//     image: 'https://picsum.photos/seed/beauty-maroc/600/400',
//     gradient: 'from-purple-600/80 to-violet-950/70',
//     accent: 'bg-purple-400',
//   },
//   {
//     id: 5,
//     key: 'sport',
//     image: 'https://picsum.photos/seed/sport-maroc/600/400',
//     gradient: 'from-green-600/80 to-emerald-950/70',
//     accent: 'bg-green-400',
//   },
//   {
//     id: 6,
//     key: 'terroir',
//     image: 'https://picsum.photos/seed/terroir-maroc/600/400',
//     gradient: 'from-red-700/80 to-red-950/70',
//     accent: 'bg-red-500',
//   },
// ];
 
// // ─────────────────────────────────────────────────────────────
// const UserHomePage = () => {
//   const { t, i18n } = useTranslation();
//   const navigate     = useNavigate();
//   const { user }     = useAuth();
 
//   const isRTL = i18n.language === 'ar';
 
//   // Clic sur une card → /products?categorie_id=X
//   const handleCategoryClick = (categoryId) => {
//     navigate(`/products?categorie_id=${categoryId}`);
//   };
 
//   return (
//     <div className="space-y-10" dir={isRTL ? 'rtl' : 'ltr'}>
//   <section className="relative h-[500px] rounded-3xl overflow-hidden">
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
//             {/* <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-xl text-gray-200 max-w-lg"
//             >
//               {t('home.hero_subtitle')}
//             </motion.p>
//             {/* <motion.button
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
//             >
//               {t('home.shop_now')}
//             </motion.button> */}
//           </div>
//         </div>
//       </section>
     
//         <div
//           className="absolute inset-0 opacity-10 pointer-events-none"
//           style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
//             backgroundSize: '40px 40px',
//           }}
//         />
//         <div className="relative z-10">

//           <h1 className="text-white text-2xl font-bold mt-1">
//             {user?.nom ?? user?.name ?? ''}
//           </h1>
//         </div>
//       {/* </motion.div> */}
 
//       {/* ══ En-tête section ════════════════════════════════════ */}
//       <motion.div
//         initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <h2 className="text-2xl font-bold text-gray-900">
//           {t('home.categories')}
//         </h2>
//         <p className="text-gray-500 text-sm mt-1">
//           {t('home.categories_subtitle')}
//         </p>
//       </motion.div>
 
//       {/* ══ Grille des catégories ══════════════════════════════ */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {CATEGORIES.map((cat, i) => (
//           <motion.div
//             key={cat.id}
//             initial={{ opacity: 0, y: 28 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
//             whileHover={{ y: -5, transition: { duration: 0.2 } }}
//             onClick={() => handleCategoryClick(cat.id)}
//             className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
//           >
//             {/* ── Image ── */}
//             <div className="relative aspect-[4/3] overflow-hidden">
//               <img
//                 src={cat.image}
//                 alt={t(`categories.${cat.key}`)}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 referrerPolicy="no-referrer"
//               />
//               {/* Overlay gradient */}
//               <div
//                 className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} transition-opacity duration-300 group-hover:opacity-90`}
//               />
//             </div>
 
//             {/* ── Texte sur l'image ── */}
//             <div className="absolute inset-0 flex flex-col justify-end p-5">
//               {/* Barre accent colorée */}
//               <div className={`h-1 w-10 ${cat.accent} rounded-full mb-3`} />
 
//               {/* Nom catégorie */}
//               <h3 className="text-white text-xl font-bold leading-snug drop-shadow">
//                 {t(`categories.${cat.key}`)}
//               </h3>
 
//               {/* Bouton voir produits */}
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-3 w-fit inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
//               >
//                 <span>{t('home.see_products')}</span>
//                 {/* Flèche qui tient compte du RTL */}
//                 <svg
//                   className={`w-4 h-4 transition-transform duration-200 ${
//                     isRTL
//                       ? 'rotate-180 group-hover:-translate-x-1'
//                       : 'group-hover:translate-x-1'
//                   }`}
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2.5}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </motion.button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
 
//       {/* ══ Bouton tous les produits ═══════════════════════════ */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="flex justify-center pb-4"
//       >
//         <button
//           onClick={() => navigate('/products')}
//           className="group flex items-center gap-2 text-emerald-700 font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-200"
//         >
//           <span>{t('home.all_products')}</span>
//           <svg
//             className={`w-4 h-4 transition-transform duration-200 ${
//               isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2.5}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </motion.div>
 
//     </div>
//   );
// };
 
// export default UserHomePage;
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'motion/react';
// import { useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
// import api from '../services/api';

// // Colors pour les categories
// const CAT_STYLES = [
//   { gradient: 'from-blue-700/80 to-blue-950/70',   accent: 'bg-blue-400',   image: 'https://picsum.photos/seed/bijoux-maroc/600/400' },
//   { gradient: 'from-green-600/80 to-emerald-950/70', accent: 'bg-green-400',  image: 'https://picsum.photos/seed/naturel-maroc/600/400' },
//   { gradient: 'from-amber-600/80 to-orange-950/70', accent: 'bg-amber-400',  image: 'https://picsum.photos/seed/artisanat-maroc/600/400' },
//   { gradient: 'from-red-700/80 to-red-950/70',      accent: 'bg-red-500',    image: 'https://picsum.photos/seed/tapis-maroc/600/400' },
//   { gradient: 'from-pink-600/80 to-rose-950/70',    accent: 'bg-pink-400',   image: 'https://picsum.photos/seed/mode-maroc/600/400' },
//   { gradient: 'from-purple-600/80 to-violet-950/70', accent: 'bg-purple-400', image: 'https://picsum.photos/seed/beaute-maroc/600/400' },
// ];

// const UserHomePage = () => {
//   const { t, i18n } = useTranslation();
//   const navigate     = useNavigate();
//   const { user }     = useAuth();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const isRTL = i18n.language === 'ar';

//   useEffect(() => {
//     api.get('/categories').then(res => {
//       setCategories(res.data.data || []);
//     }).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const handleCategoryClick = (categoryId) => {
//     navigate(`/products?categorie_id=${categoryId}`);
//   };

//   return (
//     <div className="space-y-10" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* ══ Hero ══ */}
//       <section className="relative h-[500px] rounded-3xl overflow-hidden">
//         <img
//           src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
//           alt="Moroccan Culture"
//           className="w-full h-full object-cover"
//           referrerPolicy="no-referrer"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
//           <div className="container mx-auto px-12 space-y-3">
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-emerald-400 font-medium text-lg"
//             >
//               {t('home.welcome_back')} {user?.name}
//             </motion.p>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
//             >
//               {t('home.hero_title')}
//             </motion.h1>
//           </div>
//         </div>
//       </section>

//       {/* ══ Categories ══ */}
//       <motion.div
//         initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <h2 className="text-2xl font-bold text-gray-900">{t('home.categories')}</h2>
//         <p className="text-gray-500 text-sm mt-1">{t('home.categories_subtitle')}</p>
//       </motion.div>

//       {loading ? (
//         <div className="flex justify-center py-16">
//           <Loader2 className="animate-spin text-emerald-600" size={36} />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {categories.map((cat, i) => {
//             const style = CAT_STYLES[i % CAT_STYLES.length];
//             return (
//               <motion.div
//                 key={cat.id}
//                 initial={{ opacity: 0, y: 28 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
//                 whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 onClick={() => handleCategoryClick(cat.id)}
//                 className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
//               >
//                 <div className="relative aspect-[4/3] overflow-hidden">
//                   <img
//                     src={cat.image && cat.image.startsWith('http') ? `https://picsum.photos/seed/cat-${cat.id}/600/400` : style.image}
//                     alt={cat.nom}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     referrerPolicy="no-referrer"
//                   />
//                   <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} transition-opacity duration-300 group-hover:opacity-90`} />
//                 </div>

//                 <div className="absolute inset-0 flex flex-col justify-end p-5">
//                   <div className={`h-1 w-10 ${style.accent} rounded-full mb-3`} />
//                   <h3 className="text-white text-xl font-bold leading-snug drop-shadow">
//                     {cat.nom}
//                   </h3>
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     className="mt-3 w-fit inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
//                   >
//                     <span>{t('home.see_products')}</span>
//                     <svg
//                       className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </motion.button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* ══ Bouton tous les produits ══ */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="flex justify-center pb-4"
//       >
//         <button
//           onClick={() => navigate('/products')}
//           className="group flex items-center gap-2 text-emerald-700 font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-200"
//         >
//           <span>{t('home.all_products')}</span>
//           <svg
//             className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </motion.div>
//     </div>
//   );
// };

// export default UserHomePage;
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'motion/react';
// import { useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';

// const CAT_STYLES = [
//   { gradient: 'from-blue-700/80 to-blue-950/70',    accent: 'bg-blue-400'   },
//   { gradient: 'from-green-600/80 to-emerald-950/70', accent: 'bg-green-400'  },
//   { gradient: 'from-amber-600/80 to-orange-950/70',  accent: 'bg-amber-400'  },
//   { gradient: 'from-red-700/80 to-red-950/70',       accent: 'bg-red-500'    },
//   { gradient: 'from-pink-600/80 to-rose-950/70',     accent: 'bg-pink-400'   },
//   { gradient: 'from-purple-600/80 to-violet-950/70', accent: 'bg-purple-400' },
// ];

// const FALLBACK_IMAGES = [
//   'https://picsum.photos/seed/bijoux-maroc/600/400',
//   'https://picsum.photos/seed/naturel-maroc/600/400',
//   'https://picsum.photos/seed/artisanat-maroc/600/400',
//   'https://picsum.photos/seed/tapis-maroc/600/400',
//   'https://picsum.photos/seed/mode-maroc/600/400',
//   'https://picsum.photos/seed/beaute-maroc/600/400',
// ];

// const UserHomePage = () => {
//   const { t, i18n } = useTranslation();
//   const navigate     = useNavigate();
//   const { user }     = useAuth();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const isRTL = i18n.language === 'ar';

//   useEffect(() => {
//     fetch('http://localhost:8000/api/categories', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(r => r.json())
//       .then(d => setCategories(d.data || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   // ✅ Click → /products?categorie_id=X
//   const handleCategoryClick = (categoryId) => {
//     navigate(`/products?categorie_id=${categoryId}`);
//   };

//   // const getCatImage = (cat, index) => {
//   //   // Si image kayna f BDD w mashi pin.it
//   //   if (cat.image && !cat.image.includes('pin.it') && cat.image.startsWith('http')) {
//   //     return cat.image;
//   //   }
//   //   // Sinon fallback picsum
//   //   return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
//   // };
 
// const getCatImage = (cat, index) => {
//   if (cat.image) {
//     return `http://localhost:8000/storage/categories/${cat.image}`;
//   }
//   return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
// };
//   return (
//     <div className="space-y-10" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* ══ Hero ══ */}
//       <section className="relative h-[500px] rounded-3xl overflow-hidden">
//         <img
//           src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
//           alt="Moroccan Culture"
//           className="w-full h-full object-cover"
//           referrerPolicy="no-referrer"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
//           <div className="container mx-auto px-12 space-y-3">
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-emerald-400 font-medium text-lg"
//             >
//               {t('home.welcome_back')} {user?.name} 👋
//             </motion.p>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
//             >
//               {t('home.hero_title')}
//             </motion.h1>
//           </div>
//         </div>
//       </section>

//       {/* ══ Header section ══ */}
//       <motion.div
//         initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <h2 className="text-2xl font-bold text-gray-900">{t('home.categories')}</h2>
//         <p className="text-gray-500 text-sm mt-1">{t('home.categories_subtitle')}</p>
//       </motion.div>

//       {/* ══ Categories grid ══ */}
//       {loading ? (
//         <div className="flex justify-center py-16">
//           <Loader2 className="animate-spin text-emerald-600" size={36} />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {categories.map((cat, i) => {
//             const style = CAT_STYLES[i % CAT_STYLES.length];
//             return (
//               <motion.div
//                 key={cat.id}
//                 initial={{ opacity: 0, y: 28 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
//                 whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 onClick={() => handleCategoryClick(cat.id)}
//                 className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
//               >
//                 {/* Image */}
//                 <div className="relative aspect-[4/3] overflow-hidden">
//                   <img
//                     src={getCatImage(cat, i)}
//                     alt={cat.nom}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     referrerPolicy="no-referrer"
//                     onError={(e) => { e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }}
//                   />
//                   <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} transition-opacity duration-300 group-hover:opacity-90`} />
//                 </div>

//                 {/* Text overlay */}
//                 <div className="absolute inset-0 flex flex-col justify-end p-5">
//                   <div className={`h-1 w-10 ${style.accent} rounded-full mb-3`} />
//                   <h3 className="text-white text-xl font-bold leading-snug drop-shadow">
//                     {cat.nom}
//                   </h3>
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     className="mt-3 w-fit inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
//                   >
//                     <span>{t('home.see_products')}</span>
//                     <svg
//                       className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </motion.button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* ══ Voir tous les produits ══ */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="flex justify-center pb-4"
//       >
//         <button
//           onClick={() => navigate('/products')}
//           className="group flex items-center gap-2 text-emerald-700 font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-200"
//         >
//           <span>{t('home.all_products')}</span>
//           <svg
//             className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </motion.div>
//     </div>
//   );
// };

// export default UserHomePage;
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'motion/react';
// import { useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';

// const CAT_STYLES = [
//   { accent: 'bg-blue-400'   },
//   { accent: 'bg-green-400'  },
//   { accent: 'bg-amber-400'  },
//   { accent: 'bg-red-500'    },
//   { accent: 'bg-pink-400'   },
//   { accent: 'bg-purple-400' },
// ];

// const FALLBACK_IMAGES = [
//   'https://picsum.photos/seed/bijoux-maroc/600/400',
//   'https://picsum.photos/seed/naturel-maroc/600/400',
//   'https://picsum.photos/seed/artisanat-maroc/600/400',
//   'https://picsum.photos/seed/tapis-maroc/600/400',
//   'https://picsum.photos/seed/mode-maroc/600/400',
//   'https://picsum.photos/seed/beaute-maroc/600/400',
// ];

// const UserHomePage = () => {
//   const { t, i18n } = useTranslation();
//   const navigate     = useNavigate();
//   const { user }     = useAuth();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const isRTL = i18n.language === 'ar';

//   useEffect(() => {
//     fetch('http://localhost:8000/api/categories', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(r => r.json())
//       .then(d => setCategories(d.data || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const handleCategoryClick = (categoryId) => {
//     navigate(`/products?categorie_id=${categoryId}`);
//   };

//   // ✅ Image depuis public/storage/categories/
//   const getCatImage = (cat, index) => {
//     if (cat.image) {
//       return `http://localhost:8000/storage/categories/${cat.image}`;
//     }
//     return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
//   };

//   return (
//     <div className="space-y-10" dir={isRTL ? 'rtl' : 'ltr'}>

//       {/* ══ Hero ══ */}
//       <section className="relative h-[500px] rounded-3xl overflow-hidden">
//         <img
//           src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
//           alt="Moroccan Culture"
//           className="w-full h-full object-cover"
//           referrerPolicy="no-referrer"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
//           <div className="container mx-auto px-12 space-y-3">
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-emerald-400 font-medium text-lg"
//             >
//               {t('home.welcome_back')} {user?.name} 👋
//             </motion.p>
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
//             >
//               {t('home.hero_title')}
//             </motion.h1>
//           </div>
//         </div>
//       </section>

//       {/* ══ Header section ══ */}
//       <motion.div
//         initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <h2 className="text-2xl font-bold text-gray-900">{t('home.categories')}</h2>
//         <p className="text-gray-500 text-sm mt-1">{t('home.categories_subtitle')}</p>
//       </motion.div>

//       {/* ══ Categories grid ══ */}
//       {loading ? (
//         <div className="flex justify-center py-16">
//           <Loader2 className="animate-spin text-emerald-600" size={36} />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {categories.map((cat, i) => {
//             const style = CAT_STYLES[i % CAT_STYLES.length];
//             return (
//               <motion.div
//                 key={cat.id}
//                 initial={{ opacity: 0, y: 28 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
//                 whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 onClick={() => handleCategoryClick(cat.id)}
//                 className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
//               >
//                 {/* Image — tabi3i bla gradient lwane */}
//                 <div className="relative aspect-[4/3] overflow-hidden">
//                   <img
//                     src={getCatImage(cat, i)}
//                     alt={cat.nom}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     referrerPolicy="no-referrer"
//                     onError={(e) => { e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }}
//                   />
//                   {/* ✅ Gradient noir léger f bas bash text itqra — bla lwane */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
//                 </div>

//                 {/* Text overlay */}
//                 <div className="absolute inset-0 flex flex-col justify-end p-5">
//                   <div className={`h-1 w-10 ${style.accent} rounded-full mb-3`} />
//                   <h3 className="text-white text-xl font-bold leading-snug drop-shadow">
//                     {cat.nom}
//                   </h3>
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     className="mt-3 w-fit inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
//                   >
//                     <span>{t('home.see_products')}</span>
//                     <svg
//                       className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//                       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </motion.button>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/* ══ Voir tous les produits ══ */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.7 }}
//         className="flex justify-center pb-4"
//       >
//         <button
//           onClick={() => navigate('/products')}
//           className="group flex items-center gap-2 text-emerald-700 font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-200"
//         >
//           <span>{t('home.all_products')}</span>
//           <svg
//             className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
//             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </motion.div>
//     </div>
//   );
// };

// export default UserHomePage;


import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const CAT_STYLES = [
  { accent: 'bg-blue-400'   },
  { accent: 'bg-green-400'  },
  { accent: 'bg-amber-400'  },
  { accent: 'bg-red-500'    },
  { accent: 'bg-pink-400'   },
  { accent: 'bg-purple-400' },
];

const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/bijoux-maroc/600/400',
  'https://picsum.photos/seed/naturel-maroc/600/400',
  'https://picsum.photos/seed/artisanat-maroc/600/400',
  'https://picsum.photos/seed/tapis-maroc/600/400',
  'https://picsum.photos/seed/mode-maroc/600/400',
  'https://picsum.photos/seed/beaute-maroc/600/400',
];

const UserHomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const isRTL = i18n.language === 'ar';

  const parseResponse = (data) => {
    if (typeof data === 'string') {
      return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
    }
    return data;
  };

  useEffect(() => {
    api.get('/categories')
      .then(r => {
        const raw = parseResponse(r.data);
        setCategories(raw.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?categorie_id=${categoryId}`);
  };

  const getCatImage = (cat, index) => {
    if (cat.image) {
      return `http://localhost:8000/storage/categories/${cat.image}`;
    }
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/d7/8f/ff/d78fffebebdf64bb7b06ad9afd1cb535.jpg"
          alt="Moroccan Culture"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-12 space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
            >
              {t('home.hero_title')}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 16 : -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900">{t('home.categories')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('home.categories_subtitle')}</p>
      </motion.div>

      {/* Categories grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-emerald-600" size={36} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => {
            const style = CAT_STYLES[i % CAT_STYLES.length];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getCatImage(cat, i)}
                    alt={cat.nom}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className={`h-1 w-10 ${style.accent} rounded-full mb-3`} />
                  <h3 className="text-white text-xl font-bold leading-snug drop-shadow">
                    {cat.nom}
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 w-fit inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    <span>{t('home.see_products')}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Voir tous */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center pb-4"
      >
        <button
          onClick={() => navigate('/products')}
          className="group flex items-center gap-2 text-emerald-700 font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all duration-200"
        >
          <span>{t('home.all_products')}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default UserHomePage;