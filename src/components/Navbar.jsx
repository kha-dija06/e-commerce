// import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
// import { useState } from 'react';
// import LanguageSwitcher from './LanguageSwitcher';
// import { useAuth } from '../hooks/useAuth';
// import { useCart } from '../hooks/useCart';

// const Navbar = () => {
//   const { t } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);
//   const { isAuthenticated, isAdmin } = useAuth();
//   const { items } = useCart();

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="text-2xl font-bold text-emerald-700">
//             MoroccoArt
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
//             <Link to="/" className="text-gray-600 hover:text-emerald-600 transition">
//               {t('nav.home')}
//             </Link>
//             <Link to="/products" className="text-gray-600 hover:text-emerald-600 transition">
//               {t('nav.products')}
//             </Link>
            
//             <div className="flex items-center space-x-4 rtl:space-x-reverse border-l rtl:border-l-0 rtl:border-r px-4">
//               <LanguageSwitcher />
              
//               <Link to="/favorites" className="relative text-gray-600 hover:text-emerald-600 transition">
//                 <Heart size={24} />
//               </Link>
              
//               <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600 transition">
//                 <ShoppingCart size={24} />
//                 {items.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {items.length}
//                   </span>
//                 )}
//               </Link>

//               {isAuthenticated ? (
//                 <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                   <Link to="/profile" className="text-gray-600 hover:text-emerald-600 transition">
//                     <User size={24} />
//                   </Link>
//                   {isAdmin && (
//                     <Link to="/admin" className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-md text-sm font-medium">
//                       {t('nav.admin')}
//                     </Link>
//                   )}
//                 </div>
//               ) : (
//                 <Link to="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
//                   {t('nav.login')}
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         {/* Mobile Nav */}
//         {isOpen && (
//           <div className="md:hidden pb-6 space-y-4">
//             <Link to="/" className="block text-gray-600 py-2">{t('nav.home')}</Link>
//             <Link to="/products" className="block text-gray-600 py-2">{t('nav.products')}</Link>
//             <div className="flex justify-between items-center py-2">
//               <LanguageSwitcher />
//               <div className="flex space-x-4 rtl:space-x-reverse">
//                 <Link to="/favorites"><Heart size={24} /></Link>
//                 <Link to="/cart"><ShoppingCart size={24} /></Link>
//               </div>
//             </div>
//             {isAuthenticated ? (
//               <Link to="/profile" className="block bg-emerald-600 text-white text-center py-2 rounded-md">{t('nav.profile')}</Link>
//             ) : (
//               <Link to="/login" className="block bg-emerald-600 text-white text-center py-2 rounded-md">{t('nav.login')}</Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { ShoppingCart, Heart, Search, LogOut } from 'lucide-react';
// import { useState } from 'react';
// import LanguageSwitcher from './LanguageSwitcher';
// import { useAuth } from '../hooks/useAuth';
// import { useCart } from '../hooks/useCart';

// const CATEGORIES = [
//   'nav.all', 'nav.pottery', 'nav.rugs', 'nav.jewelry',
//   'nav.zellige', 'nav.babouches', 'nav.leather', 'nav.candles', 'nav.lanterns'
// ];

// const Navbar = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [search, setSearch] = useState('');
//   const [activeCategory, setActiveCategory] = useState('nav.all');
//   const { isAuthenticated, isAdmin, user, logout } = useAuth();
//   const { items } = useCart();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
//       {/* Row 1 — logo + search + icons */}
//       <div className="flex items-center gap-3 px-6 h-14">

//         {/* Logo */}
//         <Link to="/" className="text-lg font-medium text-emerald-700 shrink-0">
//           MoroccoArt
//         </Link>

//         {/* Search bar */}
//         <form onSubmit={handleSearch} className="flex flex-1 items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-9">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={t('nav.search')}
//             className="flex-1 bg-transparent px-3 text-sm outline-none text-gray-800 placeholder-gray-400"
//           />
//           <button type="submit" className="w-9 h-9 bg-emerald-700 flex items-center justify-center shrink-0">
//             <Search size={15} className="text-white" />
//           </button>
//         </form>

//         {/* Right icons */}
//         <div className="flex items-center gap-1">
//           <LanguageSwitcher />

//           <div className="w-px h-5 bg-gray-200 mx-1" />

//           <Link to="/favorites" className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition">
//             <Heart size={18} />
//           </Link>

//           <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition">
//             <ShoppingCart size={18} />
//             {items.length > 0 && (
//               <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-700 text-white text-[9px] font-medium rounded-full flex items-center justify-center">
//                 {items.length}
//               </span>
//             )}
//           </Link>

//           {isAuthenticated && (
//             <>
//               <div className="w-px h-5 bg-gray-200 mx-1" />

//               <Link to="/profile" className="flex items-center gap-2 px-2.5 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
//                 <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-medium text-emerald-700">
//                   {user?.name?.slice(0, 2).toUpperCase()}
//                 </div>
//                 <div className="flex flex-col leading-tight text-left">
//                   <span className="text-[13px] font-medium text-gray-800">{user?.name}</span>
//                   <span className="text-[11px] text-emerald-700">{isAdmin ? t('nav.admin') : t('nav.member')}</span>
//                 </div>
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-700 transition"
//                 title={t('nav.logout')}
//               >
//                 <LogOut size={16} />
//               </button>
//             </>
//           )}

//           {!isAuthenticated && (
//             <Link to="/login" className="ml-1 bg-emerald-700 text-white text-sm px-4 h-9 flex items-center rounded-lg hover:bg-emerald-800 transition">
//               {t('nav.login')}
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Row 2 — categories */}
//       <div className="flex items-center gap-1.5 px-6 h-10 border-t border-gray-100 overflow-x-auto scrollbar-hide">
//         {CATEGORIES.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActiveCategory(cat)}
//             className={`px-3.5 py-1 rounded-full text-[13px] whitespace-nowrap border transition
//               ${activeCategory === cat
//                 ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-medium'
//                 : 'border-gray-200 text-gray-500 hover:border-emerald-500 hover:text-emerald-700'
//               }`}
//           >
//             {t(cat)}
//           </button>
//         ))}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
