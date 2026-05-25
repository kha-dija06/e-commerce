
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  History,
  LifeBuoy,
  Search,
  Menu,
  LogOut,
  Home,
  Package,
  User,
  Bell,
  X,
  Tag,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchFavorites } from '../store/slices/favoritesSlice';
import { fetchCart } from '../store/slices/cartSlice';
import api from '../services/api';

const UserLayout = () => {
  const { t }      = useTranslation();
  const { isRTL }  = useLanguage();
  const location   = useLocation();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items }  = useCart();

  const [isSidebarOpen, setIsSidebarOpen]   = useState(false);
  const [showBanner, setShowBanner]         = useState(true);
  const [searchQuery, setSearchQuery]       = useState('');
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [showCartDrop, setShowCartDrop]     = useState(false);
  const [showNotifDrop, setShowNotifDrop]   = useState(false);
  const [categories, setCategories]         = useState([]);
  const [filterCat, setFilterCat]           = useState('');
  const [suggestions, setSuggestions]       = useState([]);

  const [notifications, setNotifications]   = useState([]);
  const [notifsLoading, setNotifsLoading]   = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const searchRef = useRef(null);
  const cartRef   = useRef(null);
  const notifRef  = useRef(null);

  // Fetch favorites + cart
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  // Fetch notifications on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    setNotifsLoading(true);
    try {
      const r = await api.get('/notifications');
      setNotifications(r.data.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setNotifsLoading(false);
    }
  };

  // Mark all read
  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  // ✅ Mark single read + navigate hsab type
  const handleNotifClick = async (notif) => {
    // Mark read f DB ila machi mqri
    if (!notif.read) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setNotifications(prev =>
          prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
        );
      } catch {}
    }

    // ✅ Navigate hsab type
    setShowNotifDrop(false);
    if (notif.type === 'order') {
      navigate('/orders');
    } else if (notif.type === 'support') {
      navigate('/support');
    }
  };

  // Toggle notif dropdown — refresh kol mra kayftah
  const handleNotifToggle = () => {
    setShowNotifDrop(prev => {
      if (!prev) fetchNotifications();
      return !prev;
    });
    setShowCartDrop(false);
  };

  // Fetch categories
  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  // Search suggestions
  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get('/produits', { params: { search: searchQuery, per_page: 5 } });
        setSuggestions(res.data.data || []);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDrop(false);
      if (cartRef.current   && !cartRef.current.contains(e.target))   setShowCartDrop(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))  setShowNotifDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSearchDrop(false);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filterCat)   params.set('categorie_id', filterCat);
    navigate(`/products?${params.toString()}`);
  };

  const handleSuggestionClick = (nom) => {
    setSearchQuery(nom);
    setShowSearchDrop(false);
    navigate(`/products?q=${encodeURIComponent(nom)}`);
  };

  const sidebarItems = [
    { path: '/',          icon: Home,         label: t('nav.home') },
    { path: '/products',  icon: Package,      label: t('nav.products') },
    { path: '/favorites', icon: Heart,        label: t('nav.favorites') },
    { path: '/cart',      icon: ShoppingCart, label: t('nav.cart'), count: items.length },
    { path: '/orders',    icon: History,      label: t('order.history') },
    { path: '/support',   icon: LifeBuoy,     label: t('nav.support') },
  ];

  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-white shadow-sm ${isRTL ? 'border-l' : 'border-r'} border-gray-100`}>
      <nav className="flex-grow py-6 flex flex-col items-center space-y-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`relative w-full flex flex-col items-center py-3 group transition-all duration-200 ${
                isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-bar-user"
                  className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-2 bottom-2 w-1 bg-emerald-600 ${isRTL ? 'rounded-l-full' : 'rounded-r-full'}`}
                />
              )}
              <div className="relative">
                <item.icon size={22} className={isActive ? 'text-emerald-600' : 'group-hover:scale-110 transition-transform'} />
                {item.count > 0 && (
                  <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-emerald-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white`}>
                    {item.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-emerald-600' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="py-4 border-t border-gray-50">
        <div className="w-full h-10" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 shadow-sm border-b bg-white border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition lg:hidden"
              >
                <Menu size={24} />
              </button>
            )}
            <Link to="/" className="text-2xl font-bold text-emerald-700 shrink-0">
              MoroccoArt
            </Link>
          </div>

          {/* Center — Search */}
          <div className="hidden md:flex flex-grow max-w-2xl items-center gap-2">
            <form onSubmit={handleSearch} className="relative flex-grow" ref={searchRef}>
              <div className="flex items-center gap-2 p-1 rounded-xl border bg-gray-100 border-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                <div className="relative flex-grow">
                  <Search
                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`}
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDrop(true); }}
                    onFocus={() => setShowSearchDrop(true)}
                    placeholder={t('common.search')}
                    className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-1.5 bg-transparent border-none outline-none text-sm`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-700 transition shadow-md shrink-0"
                >
                  {t('common.search').replace('...', '')}
                </button>
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSearchDrop && (searchQuery.length > 1 ? suggestions.length > 0 : categories.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {searchQuery.length > 1 && suggestions.length > 0 ? (
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">{t('common.search')}</p>
                        {suggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-3 transition"
                            onClick={() => handleSuggestionClick(s.nom)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {s.image && (
                                <img src={s.image} alt={s.nom} className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; }} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{s.nom}</p>
                              <p className="text-xs text-emerald-600 font-bold">{s.prix} DH</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery.length <= 1 && categories.length > 0 ? (
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-1">{t('home.categories')}</p>
                        {categories.slice(0, 4).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition"
                            onClick={() => {
                              setFilterCat(String(cat.id));
                              setShowSearchDrop(false);
                              navigate(`/products?categorie_id=${cat.id}`);
                            }}
                          >
                            {cat.nom}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Select categorie */}
            <select
              value={filterCat}
              onChange={(e) => {
                const val = e.target.value;
                setFilterCat(val);
                navigate(val ? `/products?categorie_id=${val}` : '/products');
              }}
              className="bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none cursor-pointer hover:text-emerald-600 hover:border-emerald-300 transition px-3 py-2 shrink-0"
            >
              <option value="">{t('home.categories')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {isAuthenticated && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleNotifToggle}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition relative text-gray-500 hover:bg-gray-100"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifDrop && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-80 rounded-xl shadow-lg border z-50 overflow-hidden bg-white border-gray-100`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                          <span className="text-sm font-bold text-gray-800">
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-2 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </span>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-[11px] text-emerald-600 hover:underline font-medium"
                            >
                              Tout marquer lu
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                          {notifsLoading ? (
                            <div className="flex justify-center py-6">
                              <div className="animate-spin w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full" />
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                              <p className="text-xs text-gray-400">Aucune notification</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => handleNotifClick(n)}
                                className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition ${
                                  !n.read
                                    ? 'bg-emerald-50/60 hover:bg-emerald-50'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                  !n.read ? 'bg-emerald-500' : 'bg-gray-300'
                                }`} />
                                <div className="flex-grow min-w-0">
                                  <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">{n.time_label}</p>
                                </div>
                                {/* ✅ Icon + hint navigate */}
                                <div className="flex flex-col items-center gap-0.5 shrink-0">
                                  {n.type === 'order' && (
                                    <>
                                      <Package size={14} className="text-emerald-500" />
                                      <span className="text-[9px] text-emerald-400">commande</span>
                                    </>
                                  )}
                                  {n.type === 'support' && (
                                    <>
                                      <Bell size={14} className="text-blue-500" />
                                      <span className="text-[9px] text-blue-400">ticket</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Footer — count safi, mafi "voir mes commandes" */}
                        {notifications.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100 flex justify-end">
                            <span className="text-[10px] text-gray-400">
                              {notifications.length} notification{notifications.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                <div className="relative" ref={cartRef}>
                  <button
                    onClick={() => { setShowCartDrop(!showCartDrop); setShowNotifDrop(false); }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition relative text-gray-500 hover:bg-gray-100"
                  >
                    <ShoppingCart size={18} />
                    {items.length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showCartDrop && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-72 rounded-xl shadow-lg border z-50 overflow-hidden bg-white border-gray-100`}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <span className="text-sm font-bold text-gray-800">
                            {t('cart.title')} ({items.length})
                          </span>
                        </div>
                        {items.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <ShoppingCart size={32} className="text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">{t('cart.empty')}</p>
                          </div>
                        ) : (
                          <>
                            <div className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
                              {items.slice(0, 4).map((item, i) => (
                                <div key={i} className="px-4 py-3 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <p className="text-xs font-medium truncate text-gray-800">{item.name}</p>
                                    <p className="text-[11px] text-emerald-600 font-bold">{item.price} MAD</p>
                                  </div>
                                  <span className="text-[11px] text-gray-400">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="px-4 py-3 border-t border-gray-100">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-gray-500">{t('cart.total')}</span>
                                <span className="text-sm font-bold text-gray-800">
                                  {items.reduce((acc, i) => acc + i.price * i.quantity, 0)} MAD
                                </span>
                              </div>
                              <Link
                                to="/cart"
                                onClick={() => setShowCartDrop(false)}
                                className="block w-full bg-emerald-600 text-white text-xs font-bold text-center py-2 rounded-lg hover:bg-emerald-700 transition"
                              >
                                {t('cart.checkout')} →
                              </Link>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <div className="w-px h-5 mx-1 bg-gray-200" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <User size={16} className="text-emerald-600 shrink-0" />
                  <div className="hidden sm:flex flex-col leading-tight text-left">
                    <span className="text-xs font-bold leading-none text-gray-900">
                      {user?.name || 'Utilisateur'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {user?.role === 'administrateur' ? 'Admin' : t('nav.member')}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
                  title={t('nav.logout')}
                >
                  <LogOut size={18} className={`${isRTL ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'} transition-transform`} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-grow relative">
        {isAuthenticated && (
          <aside className={`hidden lg:block fixed ${isRTL ? 'right-0' : 'left-0'} top-16 bottom-0 w-20 z-40`}>
            <SidebarContent />
          </aside>
        )}
        <main className={`flex-grow min-w-0 transition-all duration-300 ${isAuthenticated ? (isRTL ? 'lg:mr-20' : 'lg:ml-20') : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-20 bg-white z-[70] lg:hidden`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UserLayout;