
import { useTranslation } from 'react-i18next';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, XCircle, Loader2, X } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../services/api';

const OrderHistoryPage = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders]            = useState([]);
  const [loading, setLoading]          = useState(true);
  const [error, setError]              = useState(null);
  const [selectedOrder, setSelected]   = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data.data || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const openModal = async (orderId) => {
    setModalLoading(true);
    setSelected({ id: orderId });
    try {
      const r = await api.get(`/orders/${orderId}`);
      setSelected(r.data.data);
    } catch {
      setSelected(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setSelected(null);

  const handleCancel = async (orderId) => {
    if (!window.confirm(t('order.cancel_confirm') || "Confirmer l'annulation ?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, statut: 'annulee' } : o
      ));
      if (selectedOrder?.id === orderId) {
        setSelected(prev => ({ ...prev, statut: 'annulee' }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  // Map statut Laravel → ancien status design
  const getStatusStyle = (statut) => {
    switch (statut) {
      case 'livree':        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'expediee':      return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'en_traitement': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'en_attente':    return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'annulee':       return 'bg-red-100 text-red-700 border-red-200';
      default:              return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'livree':        return <CheckCircle2 size={16} />;
      case 'expediee':      return <Truck size={16} />;
      case 'en_traitement': return <Clock size={16} />;
      case 'en_attente':    return <AlertCircle size={16} />;
      case 'annulee':       return <XCircle size={16} />;
      default:              return null;
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'livree':        return t('order.delivered')   || 'Livrée';
      case 'expediee':      return t('order.shipped')     || 'Expédiée';
      case 'en_traitement': return t('order.confirmed')   || 'Confirmée';
      case 'en_attente':    return t('order.pending')     || 'En attente';
      case 'annulee':       return t('order.cancelled')   || 'Annulée';
      default:              return statut;
    }
  };

  const getProgressBar = (statut) => {
    switch (statut) {
      case 'livree':        return 'w-full bg-emerald-500';
      case 'expediee':      return 'w-2/3 bg-blue-500';
      case 'en_traitement': return 'w-1/3 bg-amber-500';
      case 'annulee':       return 'w-full bg-red-500';
      default:              return 'w-1/12 bg-gray-300';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(
      i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(
      i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-emerald-600" size={36} />
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 font-medium">Erreur lors du chargement des commandes</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('order.history')}</h1>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-500">
          {orders.length} {t('order.orders_count')}
        </div>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Package size={64} className="text-gray-200 mx-auto" />
          <p className="text-gray-400 font-medium">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-emerald-200 transition-all group"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* Order Info */}
                  <div className="flex items-start space-x-6 rtl:space-x-reverse">
                    <div className="p-4 bg-gray-50 text-gray-600 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                      <Package size={32} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{String(order.id).padStart(6, '0')}
                        </h3>
                        <div className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.statut)}`}>
                          {getStatusIcon(order.statut)}
                          <span className="ml-1">{getStatusLabel(order.statut)}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 font-medium">
                        {formatDate(order.date)} • {order.lignes?.length || 0} {t('order.items_count')}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-end gap-4">
                    <div className="text-right rtl:text-left">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {t('order.total_order')}
                      </p>
                      <p className="text-2xl font-black text-gray-900">
                        {formatPrice(order.total, i18n.language)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {(order.statut === 'en_attente' || order.statut === 'en_traitement') && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          {t('order.cancel_order')}
                        </button>
                      )}
                      <button
                        onClick={() => openModal(order.id)}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-900/10"
                      >
                        {t('order.details_button')} <ChevronRight size={18} className="rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 flex">
                <div className={`h-full transition-all duration-1000 ${getProgressBar(order.statut)}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {modalLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-emerald-600" size={36} />
                  </div>
                ) : (
                  <>
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-900">
                          Commande #{String(selectedOrder.id).padStart(6, '0')}
                        </h2>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(selectedOrder.statut)}`}>
                          {getStatusIcon(selectedOrder.statut)}
                          <span className="ml-1">{getStatusLabel(selectedOrder.statut)}</span>
                        </div>
                      </div>
                      <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-500">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">

                      {/* Progress Steps */}
                      <div className="bg-gray-50 rounded-2xl p-5">
                        <p className="text-sm font-bold text-gray-500 mb-4">Suivi de commande</p>
                        <div className="flex items-center justify-between">
                          {[
                            { key: 'en_attente',    label: 'En attente', Icon: AlertCircle },
                            { key: 'en_traitement', label: 'Confirmée',  Icon: Clock },
                            { key: 'expediee',      label: 'Expédiée',   Icon: Truck },
                            { key: 'livree',        label: 'Livrée',     Icon: CheckCircle2 },
                          ].map((step, i, arr) => {
                            const steps = ['en_attente', 'en_traitement', 'expediee', 'livree'];
                            const currentIdx = steps.indexOf(selectedOrder.statut);
                            const stepIdx    = steps.indexOf(step.key);
                            const isDone     = selectedOrder.statut !== 'annulee' && stepIdx <= currentIdx;
                            return (
                              <div key={step.key} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-300'
                                  }`}>
                                    <step.Icon size={16} />
                                  </div>
                                  <span className={`text-[10px] font-bold text-center ${isDone ? 'text-emerald-600' : 'text-gray-300'}`}>
                                    {step.label}
                                  </span>
                                </div>
                                {i < arr.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${
                                    selectedOrder.statut !== 'annulee' && stepIdx < currentIdx
                                      ? 'bg-emerald-500' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {selectedOrder.statut === 'annulee' && (
                          <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center">
                            ❌ Commande annulée
                          </div>
                        )}
                      </div>

                      {/* Produits */}
                      <div>
                        <p className="text-sm font-bold text-gray-500 mb-3">
                          Articles ({selectedOrder.lignes?.length || 0})
                        </p>
                        <div className="space-y-3">
                          {selectedOrder.lignes?.map((ligne, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                              {ligne.image ? (
                                <img src={ligne.image} alt={ligne.nom} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0 flex items-center justify-center">
                                  <Package size={20} className="text-gray-400" />
                                </div>
                              )}
                              <div className="flex-grow">
                                <p className="font-bold text-gray-900 text-sm">{ligne.nom}</p>
                                <p className="text-xs text-gray-500">{ligne.quantite} × {formatPrice(ligne.prix, i18n.language)}</p>
                              </div>
                              <p className="font-black text-gray-900 text-sm shrink-0">
                                {formatPrice(ligne.prix * ligne.quantite, i18n.language)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-500 text-sm">
                          <span>Sous-total</span>
                          <span>{formatPrice(selectedOrder.total, i18n.language)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-sm">
                          <span>Livraison</span>
                          <span className="text-emerald-600 font-bold">Gratuite</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-gray-900 pt-1">
                          <span>Total</span>
                          <span>{formatPrice(selectedOrder.total, i18n.language)}</span>
                        </div>
                      </div>

                      {/* Adresse + Paiement */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-2">📍 Adresse</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.adresse}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-2">💳 Paiement</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {selectedOrder.methode_paiement?.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(selectedOrder.date)}</p>
                        </div>
                      </div>

                      {/* Cancel */}
                      {(selectedOrder.statut === 'en_attente' || selectedOrder.statut === 'en_traitement') && (
                        <button
                          onClick={() => handleCancel(selectedOrder.id)}
                          className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition border border-red-100"
                        >
                          {t('order.cancel_order')}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistoryPage;