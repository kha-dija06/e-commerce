import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const Layout = () => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <header className="py-8 px-4 text-center">
        <Link to="/" className="text-3xl font-bold text-emerald-700">
          MoroccoArt
        </Link>
      </header>
      <main className="flex-grow container mx-auto px-4 pb-12">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100">
        &copy; {new Date().getFullYear()} MoroccoArt. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Layout;
