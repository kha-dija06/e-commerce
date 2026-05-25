import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Settings, LogOut, Menu, Bell, ChevronRight, Tag,
  BarChart2, MessageSquare, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

const AdminLayout = () => {
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();
  const location  = useLocation();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifDrop, setShowNotifDrop] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };
  const markAllRead  = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const navItems = [
    { path: '/admin',            icon: LayoutDashboard, label: t('admin.dashboard'), exact: true },
    { path: '/admin/products',   icon: Package,         label: t('admin.products') },
    { path: '/admin/orders',     icon: ShoppingBag,     label: t('admin.orders') },
    { path: '/admin/users',      icon: Users,           label: t('admin.users') },
    { path: '/admin/categories', icon: Tag,             label: t('admin.categories') },
   
    { path: '/admin/support',    icon: MessageSquare,   label: t('admin.support') },
   
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-700/50 shrink-0">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className={`text-white font-bold text-lg ${mobile ? 'block' : 'hidden xl:block'}`}>
            MoroccoArt
          </span>
        </Link>
        {mobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-grow py-4 overflow-y-auto space-y-1 px-3">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              <span className={`text-sm font-medium ${mobile ? 'block' : 'hidden xl:block'}`}>
                {item.label}
              </span>
              {active && !mobile && <ChevronRight size={14} className="ml-auto hidden xl:block" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-slate-700/50 shrink-0 space-y-1">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800 ${mobile ? 'flex' : 'hidden xl:flex'}`}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-white text-xs font-bold truncate">{user?.name || 'Admin'}</p>
            <p className="text-emerald-400 text-[10px]">{t('admin.dashboard')}</p>
          </div>
        </div>
        <div className={`flex justify-center py-1 ${mobile ? 'hidden' : 'xl:hidden flex'}`}>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition w-full"
        >
          <LogOut size={18} className="shrink-0" />
          <span className={`text-sm font-medium ${mobile ? 'block' : 'hidden xl:block'}`}>
            {t('nav.logout')}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-16 xl:w-56 z-40 transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-grow lg:ml-16 xl:ml-56 transition-all duration-300">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 gap-4">

          {/* Left — mobile burger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-slate-400">{t('admin.panel')}</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-700 font-semibold">
                {navItems.find(i => isActive(i))?.label || t('admin.dashboard')}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            {/* ✅ Language switcher */}
            <LanguageSwitcher />

            
            {/* Profil */}
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            > 
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:flex flex-col leading-tight text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {user?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {t('admin.dashboard')}
                </span>
              </div>
            </Link>

          </div>
        </header>

        {/* Content */}
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-[70] lg:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;