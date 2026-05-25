import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/slices/favoritesSlice';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const ProductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterCat, setFilterCat] = useState(searchParams.get('categorie_id') || '');

  // Fetch favorites when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  // Parse response
  const parseResponse = (data) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
      } catch (e) {
        console.error('JSON Parse error:', e);
        return null;
      }
    }
    return data;
  };

  // Fetch categories
  useEffect(() => {
    api.get('/categories')
      .then(r => {
        const raw = parseResponse(r.data);
        setCategories(raw.data || []);
      })
      .catch(err => console.error('Categories error:', err));
  }, []);

  // Sync URL params to states
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setFilterCat(searchParams.get('categorie_id') || '');
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 12,
        ...(searchQuery && { search: searchQuery }),
        ...(filterCat && { categorie_id: filterCat })
      });

      api.get(`/produits?${params}`)
        .then(r => {
          const raw = parseResponse(r.data);
          setProducts(Array.isArray(raw.data) ? raw.data : []);
          setPagination(raw.pagination || null);
        })
        .catch(err => {
          console.error('Products error:', err);
          setProducts([]);
          setPagination(null);
        })
        .finally(() => setLoading(false));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, filterCat]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearAll = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  const getImageUrl = (image) => {
    if (!image) return `https://picsum.photos/seed/product-default/400/400`;
    if (image.startsWith('http')) return image;
    return `http://localhost:8000/storage/${image}`;
  };

  const activeCatName = categories.find(c => String(c.id) === String(filterCat))?.nom;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {activeCatName || t('nav.products')}
          </h1>
          {pagination && (
            <p className="text-gray-500 text-sm mt-1">
              {pagination.total} {t('nav.products')}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={36} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">{t('common.no_results')}</p>
          <button onClick={clearAll} className="mt-3 text-emerald-600 text-sm font-medium hover:underline">
            {t('common.clear')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} />
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
    </div>
  );
};

export default ProductsPage;