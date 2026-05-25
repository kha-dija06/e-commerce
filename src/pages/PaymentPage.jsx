import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatters';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../services/api';

const PaymentPage = () => {
  const { t, i18n }   = useTranslation();
  const { clear }     = useCart();
  const location      = useLocation();
  const navigate      = useNavigate();
  const { total = 0 } = location.state || {};

  const [status, setStatus] = useState('idle');
  const [error, setError]   = useState('');
  const [form, setForm]     = useState({ nom: '', numero: '', expiry: '', cvv: '' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Validation carte
  const validate = () => {
    if (!form.nom.trim())                             return 'Nom requis';
    if (form.numero.replace(/\s/g, '').length !== 16) return 'Numéro de carte invalide (16 chiffres)';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))         return 'Date invalide (MM/YY)';
    if (form.cvv.length < 3)                          return 'CVV invalide';
    return null;
  };

  const handlePayment = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setStatus('processing');
    setError('');

    // Mock — zid real payment gateway hna
    setTimeout(async () => {
      await clear();
      setStatus('success');
    }, 2000);
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{t('common.success')}</h1>
          <p className="text-gray-500 text-lg">Votre commande a été enregistrée avec succès.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/orders')} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition">
            {t('order.history')}
          </button>
          <button onClick={() => navigate('/')} className="bg-white text-emerald-600 border border-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition">
            {t('nav.home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Paiement Sécurisé</h1>
        <p className="text-gray-500">
          Montant à régler: <span className="font-bold text-emerald-600">{formatPrice(total, i18n.language)}</span>
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">{error}</div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Nom sur la carte</label>
            <input name="nom" value={form.nom} onChange={handleChange}
              type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="M. Ahmed Mansouri" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Numéro de carte</label>
            <div className="relative">
              <input name="numero" value={form.numero} onChange={handleChange}
                type="text" maxLength={19}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0000 0000 0000 0000" />
              <CreditCard className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Date d&apos;expiration</label>
              <input name="expiry" value={form.expiry} onChange={handleChange}
                type="text" maxLength={5}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">CVV</label>
              <input name="cvv" value={form.cvv} onChange={handleChange}
                type="password" maxLength={4}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="•••" />
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="text-emerald-600 mt-0.5 shrink-0" size={20} />
          <p className="text-xs text-emerald-800 leading-relaxed">
            Vos données de paiement sont cryptées et sécurisées.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={status === 'processing'}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center disabled:bg-emerald-400"
        >
          {status === 'processing' ? (
            <><Loader2 className="animate-spin mr-2" size={20} /> Traitement...</>
          ) : (
            `Payer ${formatPrice(total, i18n.language)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
// import { useTranslation } from 'react-i18next';
// import { useCart } from '../hooks/useCart';
// import { formatPrice } from '../utils/formatters';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CheckCircle2, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
// import { motion } from 'motion/react';

// const PaymentPage = () => {
//   const { t, i18n } = useTranslation();
//   const { totalAmount, clear } = useCart();
//   const [status, setStatus] = useState('idle'); // idle, processing, success
//   const navigate = useNavigate();

//   const handlePayment = () => {
//     setStatus('processing');
//     // Mock payment processing
//     setTimeout(() => {
//       setStatus('success');
//       clear();
//     }, 2000);
//   };

//   if (status === 'success') {
//     return (
//       <div className="max-w-2xl mx-auto text-center py-20 space-y-8">
//         <motion.div 
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600"
//         >
//           <CheckCircle2 size={64} />
//         </motion.div>
//         <div className="space-y-4">
//           <h1 className="text-4xl font-bold text-gray-900">{t('common.success')}</h1>
//           <p className="text-gray-500 text-lg">Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation sous peu.</p>
//         </div>
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button 
//             onClick={() => navigate('/orders')}
//             className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg"
//           >
//             {t('order.history')}
//           </button>
//           <button 
//             onClick={() => navigate('/')}
//             className="bg-white text-emerald-600 border border-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition"
//           >
//             {t('nav.home')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto space-y-8">
//       <div className="text-center space-y-4">
//         <h1 className="text-3xl font-bold text-gray-900">Paiement Sécurisé</h1>
//         <p className="text-gray-500">Montant à régler: <span className="font-bold text-emerald-600">{formatPrice(totalAmount, i18n.language)}</span></p>
//       </div>

//       <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
//         <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-8">
//           <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
//           <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
//           <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
//         </div>

//         <div className="space-y-6">
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-gray-700">Nom sur la carte</label>
//             <input type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="M. Ahmed Mansouri" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-gray-700">Numéro de carte</label>
//             <div className="relative">
//               <input type="text" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0000 0000 0000 0000" />
//               <CreditCard className="absolute left-4 top-3.5 text-gray-400" size={20} />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">Date d&apos;expiration</label>
//               <input type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="MM/YY" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">CVV</label>
//               <input type="text" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="123" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-emerald-50 p-4 rounded-xl flex items-start space-x-3 rtl:space-x-reverse">
//           <ShieldCheck className="text-emerald-600 mt-0.5" size={20} />
//           <p className="text-xs text-emerald-800 leading-relaxed">
//             Vos données de paiement sont cryptées et sécurisées. Nous ne stockons jamais vos informations bancaires sur nos serveurs.
//           </p>
//         </div>

//         <button 
//           onClick={handlePayment}
//           disabled={status === 'processing'}
//           className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center justify-center disabled:bg-emerald-400"
//         >
//           {status === 'processing' ? (
//             <>
//               <Loader2 className="animate-spin mr-2 rtl:mr-0 rtl:ml-2" size={20} />
//               Traitement en cours...
//             </>
//           ) : (
//             `Payer ${formatPrice(totalAmount, i18n.language)}`
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
