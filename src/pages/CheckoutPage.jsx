// import { useTranslation } from 'react-i18next';
// import { useCart } from '../hooks/useCart';
// import { useAuth } from '../hooks/useAuth';
// import { formatPrice } from '../utils/formatters';
// import { useNavigate } from 'react-router-dom';
// import { Package, CreditCard, Truck, ChevronRight } from 'lucide-react';

// const CheckoutPage = () => {
//   const { t, i18n } = useTranslation();
//   const { items, totalAmount } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       <h1 className="text-3xl font-bold text-gray-900">{t('order.checkout')}</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Shipping Address */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
//             <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-600">
//               <Truck size={20} />
//               <h2 className="text-xl font-bold text-gray-900">{t('order.shipping_address')}</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" placeholder={t('auth.name')} defaultValue={user?.name} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
//               <input type="text" placeholder={t('auth.phone')} className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
//               <input type="text" placeholder={t('auth.address')} className="md:col-span-2 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
//             <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-600">
//               <CreditCard size={20} />
//               <h2 className="text-xl font-bold text-gray-900">{t('order.payment_method')}</h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {['cih', 'paypal', 'cash'].map((method) => (
//                 <label key={method} className="relative flex flex-col items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-500 transition group">
//                   <input type="radio" name="payment" className="absolute top-3 right-3 w-4 h-4 text-emerald-600" />
//                   <span className="font-bold text-gray-800 mt-2 uppercase">{t(`order.${method}`)}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
//             <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-600 border-b pb-4">
//               <Package size={20} />
//               <h2 className="text-xl font-bold text-gray-900">{t('order.summary')}</h2>
//             </div>
            
//             <div className="max-h-60 overflow-y-auto space-y-3">
//               {items.map((item) => (
//                 <div key={item.id} className="flex justify-between text-sm">
//                   <span className="text-gray-600 line-clamp-1">{item.quantity}x {item.name}</span>
//                   <span className="font-bold text-gray-900 whitespace-nowrap">{formatPrice(item.price * item.quantity, i18n.language)}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-3 pt-4 border-t">
//               <div className="flex justify-between text-xl font-bold text-gray-900">
//                 <span>{t('cart.total')}</span>
//                 <span>{formatPrice(totalAmount, i18n.language)}</span>
//               </div>
//             </div>

//             <button 
//               onClick={() => navigate('/payment')}
//               className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center group"
//             >
//               {t('order.confirm')}
//               <ChevronRight className="ml-2 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" size={20} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { Package, CreditCard, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const { items, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [method, setMethod]   = useState('paiement_livraison');
  const [form, setForm]       = useState({
    nom:       user?.name || '',
    telephone: user?.telephone || '',
    adresse:   user?.adresse || '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.nom || !form.telephone || !form.adresse) {
      setError(t('errors.required_fields') || 'Veuillez remplir tous les champs');
      return;
    }
    if (items.length === 0) {
      setError('Panier vide');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        nom:               form.nom,
        telephone:         form.telephone,
        adresse:           form.adresse,
        methode_paiement:  method,
      });

      if (res.data.success) {
        if (method === 'carte' || method === 'paypal') {
          navigate('/payment', { state: { commande_id: res.data.commande_id, total: res.data.total } });
        } else {
          navigate('/orders', { state: { success: true } });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('order.checkout')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Truck size={20} />
              <h2 className="text-xl font-bold text-gray-900">{t('order.shipping_address')}</h2>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" name="nom" value={form.nom} onChange={handleChange}
                placeholder={t('auth.name')}
                className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text" name="telephone" value={form.telephone} onChange={handleChange}
                placeholder={t('auth.phone')}
                className="p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text" name="adresse" value={form.adresse} onChange={handleChange}
                placeholder={t('auth.address')}
                className="md:col-span-2 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CreditCard size={20} />
              <h2 className="text-xl font-bold text-gray-900">{t('order.payment_method')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'carte',              label: t('order.cih') },
                { value: 'paypal',             label: t('order.paypal') },
                { value: 'paiement_livraison', label: t('order.cash') },
              ].map((m) => (
                <label
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition ${
                    method === m.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <input type="radio" name="payment" className="absolute top-3 right-3 w-4 h-4 text-emerald-600" checked={method === m.value} readOnly />
                  <span className="font-bold text-gray-800 mt-2 uppercase">{m.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24 space-y-6">
            <div className="flex items-center gap-2 text-emerald-600 border-b pb-4">
              <Package size={20} />
              <h2 className="text-xl font-bold text-gray-900">{t('order.summary')}</h2>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1">{item.quantity}x {item.name}</span>
                  <span className="font-bold text-gray-900 whitespace-nowrap">
                    {formatPrice(item.price * item.quantity, i18n.language)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(totalAmount, i18n.language)}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-emerald-400"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>{t('order.confirm')} <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;