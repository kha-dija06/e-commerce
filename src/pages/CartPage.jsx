import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { items, totalAmount, removeItem, updateItemQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={48} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{t('cart.empty')}</h1>
        <p className="text-gray-500">{t('home.hero_subtitle')}</p>
        <Link to="/" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition">
          {t('home.shop_now')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-emerald-600 font-semibold">{formatPrice(item.price, i18n.language)}</p>
                <p className="text-xs text-gray-400 mt-1">{item.category}</p>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse bg-gray-50 p-2 rounded-lg">
                <button 
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-1 hover:text-emerald-600 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:text-emerald-600 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-4">{t('cart.total')}</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(totalAmount, i18n.language)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('cart.shipping')}</span>
                <span className="text-emerald-600 font-medium">{t('cart.free')}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(totalAmount, i18n.language)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center group"
            >
              {t('cart.checkout')}
              <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
