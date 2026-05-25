import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../store/slices/filtersSlice';
import { Search, RotateCcw } from 'lucide-react';

const Filters = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const filters = useSelector(state => state.filters);

  const categories = ['all', 'tapis', 'poterie', 'cuir', 'bijoux', 'vetements'];


  const handleFilterChange = (name, value) => {
    dispatch(setFilter({ [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">{t('common.filter')}</h3>
        <button 
          onClick={() => dispatch(resetFilters())}
          className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"
        >
          <RotateCcw size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
          {t('common.clear')}
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('common.search')}</label>
          <div className="relative">
            <input 
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder={t('common.search')}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('home.categories')}</label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer group">
                <input 
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => handleFilterChange('category', cat)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-600 group-hover:text-emerald-600 transition capitalize">
                  {cat === 'all' ? t('common.clear') : cat}
                </span>
              </label>
            ))}
          </div>
        </div>
        

        {/* Regions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('home.regions')}</label>
          <select 
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition capitalize"
          >
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg === 'all' ? t('common.clear') : reg}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('product.price')}</label>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input 
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              placeholder="Min"
              className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm outline-none"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              placeholder="Max"
              className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
