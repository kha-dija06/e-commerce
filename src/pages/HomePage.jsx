// import { useTranslation } from 'react-i18next';
// import { useState } from 'react';
// import ProductCard from '../components/ProductCard';
// import Pagination from '../components/Pagination';
// import { motion } from 'motion/react';
// import { useAuth } from '../hooks/useAuth';

// const HomePage = () => {
//   const { t } = useTranslation();
//   const { isAuthenticated } = useAuth();
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 5; // Mock total pages

//   // Mock data for demonstration
//   const products = [
//     { id: 1, name: 'Tapis Beni Ourain', price: 2500, category: 'Tapis', image: 'https://picsum.photos/seed/rug/400/400', stock: 5 },
//     { id: 2, name: 'Tajine en Céramique', price: 350, category: 'Poterie', image: 'https://picsum.photos/seed/pot/400/400', stock: 12 },
//     { id: 3, name: 'Pouf en Cuir Marron', price: 450, category: 'Cuir', image: 'https://picsum.photos/seed/leather/400/400', stock: 8 },
//     { id: 4, name: 'Lanterne en Cuivre', price: 600, category: 'Décoration', image: 'https://picsum.photos/seed/lamp/400/400', stock: 3 },
//     { id: 5, name: 'Babouches Traditionnelles', price: 150, category: 'Vêtements', image: 'https://picsum.photos/seed/shoes/400/400', stock: 20 },
//     { id: 6, name: 'Plateau en Argent', price: 1200, category: 'Bijoux', image: 'https://picsum.photos/seed/silver/400/400', stock: 0 },
//   ];

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="space-y-12">
//       {/* Hero Section - Only for visitors */}
//       {!isAuthenticated && (
//         <section className="relative h-[500px] rounded-3xl overflow-hidden">
//           <img 
//             src="https://picsum.photos/seed/morocco-hero/1920/1080" 
//             alt="Moroccan Culture" 
//             className="w-full h-full object-cover"
//             referrerPolicy="no-referrer"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
//             <div className="container mx-auto px-12 space-y-6">
//               <motion.h1 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-5xl md:text-7xl font-bold text-white max-w-2xl leading-tight"
//               >
//                 {t('home.hero_title')}
//               </motion.h1>
//               <motion.p 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-xl text-gray-200 max-w-lg"
//               >
//                 {t('home.hero_subtitle')}
//               </motion.p>
//               <motion.button 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
//               >
//                 {t('home.shop_now')}
//               </motion.button>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Main Content */}
//       <div className="space-y-8">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {isAuthenticated ? t('home.all_products') : t('home.featured_products')}
//           </h2>
//           <span className="text-gray-500 text-sm">{products.length} {t('nav.products')}</span>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         <Pagination 
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;
// import { useAuth } from '../hooks/useAuth';
// import VisitorHomePage from './VisitorhomePage';

// import UserHomePage from './UserhomePage';

// /**
//  * Point d'entrée unique pour la page d'accueil.
//  * - Visiteur non connecté → VisitorHomePage (hero + produits vedettes)
//  * - Utilisateur connecté  → UserHomePage (catégories + tous les produits)
//  */
// const HomePage = () => {
//   const { isAuthenticated } = useAuth();

//   return ( <>
    
     
//      {isAuthenticated ? <UserHomePage /> : <VisitorHomePage />};

//     </>
//   ) 
// };

// export default HomePage;
import { useAuth } from '../hooks/useAuth';
import VisitorHomePage from './VisitorhomePage';
import UserHomePage from './UserhomePage';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <UserHomePage /> : <VisitorHomePage />}
    </>
  );
};

export default HomePage;