import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartMini = () => {
  const { t, i18n } = useTranslation();
  const { items, totalAmount, removeItem } = useCart();

  return (
    <div className="w-80 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
      <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingBag size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
          <span className="font-bold">{t('cart.title')}</span>
        </div>
        <span className="bg-white text-emerald-600 text-xs px-2 py-0.5 rounded-full font-bold">
          {items.length}
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t('cart.empty')}</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex space-x-3 rtl:space-x-reverse">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price, i18n.language)}</p>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-600">{t('cart.total')}</span>
            <span className="font-bold text-emerald-700">{formatPrice(totalAmount, i18n.language)}</span>
          </div>
          <Link 
            to="/cart" 
            className="block w-full bg-emerald-600 text-white text-center py-2 rounded-md hover:bg-emerald-700 transition"
          >
            {t('cart.checkout')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartMini;
