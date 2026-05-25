// import { useTranslation } from 'react-i18next';
// import { Search, Filter, Eye, MoreVertical, User, MapPin, Calendar, CreditCard, Mail } from 'lucide-react';
// import { formatPrice } from '../utils/formatters';
// import { useState } from 'react';
// import Modal from '../components/Modal';

// const AdminOrdersPage = () => {
//   const { t, i18n } = useTranslation();
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const [orders, setOrders] = useState([
//     { 
//       id: 'ORD-2024-001', 
//       customer: 'Ahmed Mansouri', 
//       email: 'ahmed@email.com',
//       address: '123 Rue de la Liberté, Casablanca',
//       date: '12 Mars 2024', 
//       total: 1250, 
//       status: 'confirmed', 
//       items: [
//         { name: 'Tapis Beni Ourain', quantity: 1, price: 2500 },
//         { name: 'Tajine Céramique', quantity: 2, price: 350 },
//       ]
//     },
//     { 
//       id: 'ORD-2024-002', 
//       customer: 'Fatima Zahra', 
//       email: 'fatima@email.com',
//       address: '45 Avenue Mohammed V, Rabat',
//       date: '11 Mars 2024', 
//       total: 850, 
//       status: 'pending', 
//       items: [
//         { name: 'Pouf Cuir', quantity: 1, price: 450 },
//         { name: 'Lanterne Cuivre', quantity: 1, price: 400 },
//       ]
//     },
//     { 
//       id: 'ORD-2024-003', 
//       customer: 'Youssef Alami', 
//       email: 'youssef@email.com',
//       address: '78 Boulevard Anfa, Casablanca',
//       date: '10 Mars 2024', 
//       total: 2100, 
//       status: 'shipped', 
//       items: [
//         { name: 'Tapis Beni Ourain', quantity: 1, price: 2100 },
//       ]
//     },
//     { 
//       id: 'ORD-2024-004', 
//       customer: 'Khadija Bennani', 
//       email: 'khadija@email.com',
//       address: '12 Rue Al Quods, Fès',
//       date: '09 Mars 2024', 
//       total: 450, 
//       status: 'delivered', 
//       items: [
//         { name: 'Pouf Cuir', quantity: 1, price: 450 },
//       ]
//     },
//   ]);

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleUpdateStatus = (orderId, newStatus) => {
//     setOrders(orders.map(order => 
//       order.id === orderId ? { ...order, status: newStatus } : order
//     ));
//     if (selectedOrder && selectedOrder.id === orderId) {
//       setSelectedOrder({ ...selectedOrder, status: newStatus });
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'confirmed': return 'bg-amber-100 text-amber-700 border-amber-200';
//       case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
//       case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const filteredOrders = orders.filter(order => 
//     order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     order.customer.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.orders')}</h1>
//         <div className="flex space-x-2 rtl:space-x-reverse">
//           <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">{t('admin.export_csv')}</button>
//           <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">{t('admin.new_order')}</button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//           <input 
//             type="text" 
//             placeholder={t('admin.search_order')} 
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
//             <Filter size={18} className="mr-2 rtl:mr-0 rtl:ml-2" />
//             {t('order.status')}
//           </button>
//           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
//             {t('order.date')}
//           </button>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin.order_id')}</th>
//                 <th className="px-6 py-4">{t('admin.customer')}</th>
//                 <th className="px-6 py-4">{t('order.date')}</th>
//                 <th className="px-6 py-4">{t('cart.total')}</th>
//                 <th className="px-6 py-4">{t('order.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50 transition group">
//                   <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="font-medium text-gray-900">{order.customer}</span>
//                       <span className="text-xs text-gray-500">{order.items.length} {t('order.items_count')}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">{order.date}</td>
//                   <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(order.total, i18n.language)}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
//                       {t(`order.${order.status}`)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right rtl:text-left">
//                     <div className="flex justify-end space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition">
//                       <button 
//                         onClick={() => handleViewDetails(order)}
//                         className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"><MoreVertical size={18} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Order Details Modal */}
//       <Modal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         title={`${t('admin.order_details')} ${selectedOrder?.id}`}
//       >
//         {selectedOrder && (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Customer Info */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.customer_info')}</h4>
//                 <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
//                   <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
//                     <User size={20} className="text-emerald-600" />
//                     <span className="font-bold">{selectedOrder.customer}</span>
//                   </div>
//                   <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                     <Mail size={20} className="text-emerald-600" />
//                     <span>{selectedOrder.email}</span>
//                   </div>
//                   <div className="flex items-start space-x-3 rtl:space-x-reverse text-slate-600">
//                     <MapPin size={20} className="text-emerald-600 mt-1" />
//                     <span>{selectedOrder.address}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Info */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.order_info')}</h4>
//                 <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                       <Calendar size={20} className="text-emerald-600" />
//                       <span>{t('order.date')}</span>
//                     </div>
//                     <span className="font-bold text-slate-900">{selectedOrder.date}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                       <CreditCard size={20} className="text-emerald-600" />
//                       <span>{t('cart.total')}</span>
//                     </div>
//                     <span className="font-bold text-emerald-600 text-lg">{formatPrice(selectedOrder.total, i18n.language)}</span>
//                   </div>
//                   <div className="pt-4 border-t border-slate-200">
//                     <label className="text-xs font-bold text-slate-400 uppercase block mb-2">{t('admin.order_status')}</label>
//                     <select 
//                       value={selectedOrder.status}
//                       onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
//                       className={`w-full px-4 py-2 rounded-xl font-bold border outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${getStatusBadge(selectedOrder.status)}`}
//                     >
//                       <option value="pending">{t('order.pending')}</option>
//                       <option value="confirmed">{t('order.confirmed')}</option>
//                       <option value="processing">{t('admin.processing')}</option>
//                       <option value="shipped">{t('order.shipped')}</option>
//                       <option value="delivered">{t('order.delivered')}</option>
//                       <option value="cancelled">{t('order.cancelled')}</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Products List */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.ordered_products')}</h4>
//               <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
//                 <table className="w-full text-left rtl:text-right">
//                   <thead className="bg-slate-50 text-slate-500 text-xs font-bold">
//                     <tr>
//                       <th className="px-6 py-3">{t('admin.product')}</th>
//                       <th className="px-6 py-3 text-center">{t('product.quantity')}</th>
//                       <th className="px-6 py-3 text-right">{t('admin.unit_price')}</th>
//                       <th className="px-6 py-3 text-right">{t('cart.total')}</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {selectedOrder.items.map((item, i) => (
//                       <tr key={i}>
//                         <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
//                         <td className="px-6 py-4 text-center text-slate-600">{item.quantity}</td>
//                         <td className="px-6 py-4 text-right text-slate-600">{formatPrice(item.price, i18n.language)}</td>
//                         <td className="px-6 py-4 text-right font-bold text-slate-900">{formatPrice(item.price * item.quantity, i18n.language)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="flex justify-end pt-6">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
//               >
//                 {t('admin.close')}
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };
import { useTranslation } from 'react-i18next';
import { Search, Eye, Download, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import api from '../services/api';

// ✅ confirmed supprimé
const STATUS_MAP = {
  pending:    { label: 'order.pending',    style: 'bg-gray-100 text-gray-700 border-gray-200' },
  processing: { label: 'admin.processing', style: 'bg-purple-100 text-purple-700 border-purple-200' },
  shipped:    { label: 'order.shipped',    style: 'bg-blue-100 text-blue-700 border-blue-200' },
  delivered:  { label: 'order.delivered',  style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled:  { label: 'order.cancelled',  style: 'bg-red-100 text-red-700 border-red-200' },
};

const AdminOrdersPage = () => {
  const { t, i18n } = useTranslation();

  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pagination, setPagination]     = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ── Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, per_page: 10 };
      if (searchQuery)  params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/admin/orders', { params });

      if (res.data.success) {
        setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        setPagination(res.data.pagination || {
          current_page: 1, last_page: 1, per_page: 10, total: 0,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, t]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  // ── View details
  const handleViewDetails = async (orderId) => {
    setLoadingDetail(true);
    setIsModalOpen(true);
    setSelectedOrder(null);
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      if (res.data.success) {
        setSelectedOrder(res.data.data);
      }
    } catch (err) {
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || t('common.error'));
    }
  };

  // ── Export CSV
  const handleExportCSV = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/orders/export/csv', {
        params,
        responseType: 'blob',
      });
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `commandes_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(t('common.error'));
    }
  };

  // ── Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  // ── Status filter buttons — ✅ confirmed supprimé
  const statusFilters = [
    { value: '',           label: t('common.all'),       active: 'bg-slate-800 text-white border-slate-800',       inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
    { value: 'pending',    label: t('order.pending'),    active: 'bg-gray-600 text-white border-gray-600',         inactive: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400' },
    { value: 'processing', label: t('admin.processing'), active: 'bg-purple-600 text-white border-purple-600',     inactive: 'bg-white text-purple-600 border-purple-200 hover:border-purple-400' },
    { value: 'shipped',    label: t('order.shipped'),    active: 'bg-blue-600 text-white border-blue-600',         inactive: 'bg-white text-blue-600 border-blue-200 hover:border-blue-400' },
    { value: 'delivered',  label: t('order.delivered'),  active: 'bg-emerald-600 text-white border-emerald-600',   inactive: 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400' },
    { value: 'cancelled',  label: t('order.cancelled'),  active: 'bg-red-600 text-white border-red-600',           inactive: 'bg-white text-red-600 border-red-200 hover:border-red-400' },
  ];

  // ── Status select options — ✅ confirmed supprimé, réutilisable
  const StatusSelect = ({ value, onChange, className }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      <option value="pending">{t('order.pending')}</option>
      <option value="processing">{t('admin.processing')}</option>
      <option value="shipped">{t('order.shipped')}</option>
      <option value="delivered">{t('order.delivered')}</option>
      <option value="cancelled">{t('order.cancelled')}</option>
    </select>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.orders')}</h1>
        <button
          onClick={handleExportCSV}
          className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
        >
          <Download size={18} />
          {t('admin.export_csv')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('admin.search_order')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('order.status')} :</span>
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                statusFilter === f.value ? f.active : f.inactive
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">{t('admin.order_id')}</th>
                <th className="px-6 py-4">{t('admin.customer')}</th>
                <th className="px-6 py-4">{t('order.date')}</th>
                <th className="px-6 py-4">{t('cart.total')}</th>
                <th className="px-6 py-4">{t('order.status')}</th>
                <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={28} />
                    <p className="text-sm">{t('common.loading')}</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                    {t('common.no_results')}
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statut = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">{order.customer}</span>
                          <span className="text-xs text-gray-400">{order.items_count} {t('order.items_count')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        {formatPrice(order.total, i18n.language)}
                      </td>
                      <td className="px-6 py-4">
                        {/* ✅ StatusSelect component — confirmed supprimé */}
                        <StatusSelect
                          value={order.status}
                          onChange={(val) => handleUpdateStatus(order.id, val)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer outline-none ${statut.style}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {`${(pagination.current_page - 1) * pagination.per_page + 1}–${Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )} / ${pagination.total}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className={`p-1.5 rounded-lg transition ${
                  currentPage === pagination.last_page
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }}
        title={selectedOrder ? `${t('admin.order_details')} #${selectedOrder.id}` : t('admin.order_details')}
      >
        {loadingDetail ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : selectedOrder && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('admin.customer_info')}
                </h4>
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                      {selectedOrder.customer?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.email}</p>
                    </div>
                  </div>
                  {selectedOrder.address && (
                    <p className="text-sm text-gray-600 pl-12">{selectedOrder.address}</p>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('admin.order_info')}
                </h4>
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('order.date')}</span>
                    <span className="font-medium text-gray-900">{selectedOrder.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('order.payment_method')}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {selectedOrder.methode_paiement?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{t('cart.total')}</span>
                    <span className="font-bold text-emerald-600 text-base">
                      {formatPrice(selectedOrder.total, i18n.language)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                      {t('admin.order_status')}
                    </label>
                    {/* ✅ StatusSelect component — confirmed supprimé */}
                    <StatusSelect
                      value={selectedOrder.status}
                      onChange={(val) => handleUpdateStatus(selectedOrder.id, val)}
                      className={`w-full px-4 py-2 rounded-xl font-bold border outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                        STATUS_MAP[selectedOrder.status]?.style || STATUS_MAP.pending.style
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('admin.ordered_products')}
                </h4>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left rtl:text-right">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold">
                      <tr>
                        <th className="px-5 py-3">{t('admin.product')}</th>
                        <th className="px-5 py-3 text-center">{t('product.quantity')}</th>
                        <th className="px-5 py-3 text-right">{t('admin.unit_price')}</th>
                        <th className="px-5 py-3 text-right">{t('cart.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-5 py-3 font-medium text-slate-900 text-sm">{item.name}</td>
                          <td className="px-5 py-3 text-center text-slate-600 text-sm">{item.quantity}</td>
                          <td className="px-5 py-3 text-right text-slate-600 text-sm">
                            {formatPrice(item.price, i18n.language)}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-slate-900 text-sm">
                            {formatPrice(item.price * item.quantity, i18n.language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={3} className="px-5 py-3 text-right font-bold text-slate-600 text-sm">
                          {t('cart.total')}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-emerald-600 text-sm">
                          {formatPrice(selectedOrder.total, i18n.language)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }}
                className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition text-sm"
              >
                {t('admin.close')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
// export default AdminOrdersPage;
// import { useTranslation } from 'react-i18next';
// import { Search, Filter, Eye, User, MapPin, Calendar, CreditCard, Mail, Download, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { formatPrice } from '../utils/formatters';
// import { useState, useEffect } from 'react';
// import Modal from '../components/Modal';
// import api from '../services/api';

// const AdminOrdersPage = () => {
//   const { t, i18n } = useTranslation();
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     last_page: 1,
//     per_page: 10,
//     total: 0,
//   });

//   // Statuts disponibles
//   const statusOptions = [
//     { value: '', label: 'Tous les statuts' },
//     { value: 'pending', label: 'En attente' },
//     { value: 'processing', label: 'En traitement' },
//     { value: 'shipped', label: 'Expédiée' },
//     { value: 'delivered', label: 'Livrée' },
//     { value: 'cancelled', label: 'Annulée' },
//   ];

//   // Charger les commandes
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (searchQuery) params.search = searchQuery;
//       if (statusFilter) params.status = statusFilter;
//       params.page = currentPage;
//       params.per_page = 10;

//       const response = await api.get('/admin/orders', { params });
      
//       if (response.data.success) {
//         setOrders(response.data.data);
//         setPagination(response.data.pagination);
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [searchQuery, statusFilter, currentPage]);

//   // Debounce pour la recherche
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (currentPage === 1) {
//         fetchOrders();
//       } else {
//         setCurrentPage(1);
//       }
//     }, 500);
//     return () => clearTimeout(timeout);
//   }, [searchQuery]);

//   const handleViewDetails = async (orderId) => {
//     try {
//       const response = await api.get(`/admin/orders/${orderId}`);
//       if (response.data.success) {
//         setSelectedOrder(response.data.data);
//         setIsModalOpen(true);
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//     }
//   };

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     try {
//       const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
//       if (response.data.success) {
//         // Rafraîchir la liste
//         fetchOrders();
//         if (selectedOrder && selectedOrder.id === orderId) {
//           setSelectedOrder({ ...selectedOrder, status: newStatus });
//         }
//       }
//     } catch (error) {
//       console.error('Erreur mise à jour:', error);
//     }
//   };

//   const handleExportCSV = async () => {
//     try {
//       const params = statusFilter ? { status: statusFilter } : {};
//       const response = await api.get('/admin/orders/export/csv', {
//         params,
//         responseType: 'blob',
//       });
      
//       // Télécharger le fichier
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       const filename = `commandes_${new Date().toISOString().slice(0, 19)}.csv`;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Erreur export:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'confirmed': return 'bg-amber-100 text-amber-700 border-amber-200';
//       case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
//       case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'delivered': return t('order.delivered');
//       case 'shipped': return t('order.shipped');
//       case 'processing': return t('admin.processing');
//       case 'confirmed': return t('order.confirmed');
//       case 'pending': return t('order.pending');
//       case 'cancelled': return t('order.cancelled');
//       default: return status;
//     }
//   };

//   // Pagination
//   const goToPage = (page) => {
//     if (page >= 1 && page <= pagination.last_page) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.orders')}</h1>
//         <div className="flex space-x-2 rtl:space-x-reverse">
//           <button 
//             onClick={handleExportCSV}
//             className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
//           >
//             <Download size={18} />
//             {t('admin.export_csv')}
//           </button>
//           <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center gap-2">
//             <Plus size={18} />
//             {t('admin.new_order')}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//           <input 
//             type="text" 
//             placeholder={t('admin.search_order')} 
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
        
//         <div className="relative">
//           <button 
//             onClick={() => setShowStatusDropdown(!showStatusDropdown)}
//             className="flex items-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition gap-2 min-w-[160px] justify-between"
//           >
//             <div className="flex items-center gap-2">
//               <Filter size={18} />
//               <span>
//                 {statusFilter 
//                   ? statusOptions.find(s => s.value === statusFilter)?.label 
//                   : t('order.status')}
//               </span>
//             </div>
//             <ChevronLeft size={16} className={`transform transition ${showStatusDropdown ? '-rotate-90' : 'rotate-90'}`} />
//           </button>
          
//           {showStatusDropdown && (
//             <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
//               {statusOptions.map((option) => (
//                 <button
//                   key={option.value}
//                   onClick={() => {
//                     setStatusFilter(option.value);
//                     setShowStatusDropdown(false);
//                     setCurrentPage(1);
//                   }}
//                   className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm ${
//                     statusFilter === option.value ? 'bg-emerald-50 text-emerald-600' : ''
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin.order_id')}</th>
//                 <th className="px-6 py-4">{t('admin.customer')}</th>
//                 <th className="px-6 py-4">{t('order.date')}</th>
//                 <th className="px-6 py-4">{t('cart.total')}</th>
//                 <th className="px-6 py-4">{t('order.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
//                     </div>
//                   </td>
//                 </tr>
//               ) : orders.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                     Aucune commande trouvée
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr key={order.id} className="hover:bg-gray-50 transition group">
//                     <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <span className="font-medium text-gray-900">{order.customer}</span>
//                         <span className="text-xs text-gray-500">{order.items_count} {t('order.items_count')}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">{order.date}</td>
//                     <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(order.total, i18n.language)}</td>
//                     <td className="px-6 py-4">
//                       <select
//                         value={order.status}
//                         onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                         className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer ${getStatusBadge(order.status)}`}
//                       >
//                         <option value="pending">{t('order.pending')}</option>
//                         <option value="processing">{t('admin.processing')}</option>
//                         <option value="confirmed">{t('order.confirmed')}</option>
//                         <option value="shipped">{t('order.shipped')}</option>
//                         <option value="delivered">{t('order.delivered')}</option>
//                         <option value="cancelled">{t('order.cancelled')}</option>
//                       </select>
//                     </td>
//                     <td className="px-6 py-4 text-right rtl:text-left">
//                       <button 
//                         onClick={() => handleViewDetails(order.id)}
//                         className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
//                       >
//                         <Eye size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {!loading && pagination.last_page > 1 && (
//           <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
//                 currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <ChevronLeft size={16} />
//               Précédent
//             </button>
//             <div className="flex gap-1">
//               {[...Array(pagination.last_page)].map((_, i) => (
//                 <button
//                   key={i + 1}
//                   onClick={() => goToPage(i + 1)}
//                   className={`w-8 h-8 rounded-lg text-sm transition ${
//                     currentPage === i + 1
//                       ? 'bg-emerald-600 text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === pagination.last_page}
//               className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
//                 currentPage === pagination.last_page ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Suivant
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal */}
//       <Modal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         title={`${t('admin.order_details')} ${selectedOrder?.id}`}
//       >
//         {selectedOrder && (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Customer Info */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.customer_info')}</h4>
//                 <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
//                   <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700">
//                     <User size={20} className="text-emerald-600" />
//                     <span className="font-bold">{selectedOrder.customer}</span>
//                   </div>
//                   <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                     <Mail size={20} className="text-emerald-600" />
//                     <span>{selectedOrder.email}</span>
//                   </div>
//                   <div className="flex items-start space-x-3 rtl:space-x-reverse text-slate-600">
//                     <MapPin size={20} className="text-emerald-600 mt-1" />
//                     <span>{selectedOrder.address}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Info */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.order_info')}</h4>
//                 <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                       <Calendar size={20} className="text-emerald-600" />
//                       <span>{t('order.date')}</span>
//                     </div>
//                     <span className="font-bold text-slate-900">{selectedOrder.date}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600">
//                       <CreditCard size={20} className="text-emerald-600" />
//                       <span>{t('cart.total')}</span>
//                     </div>
//                     <span className="font-bold text-emerald-600 text-lg">{formatPrice(selectedOrder.total, i18n.language)}</span>
//                   </div>
//                   <div className="pt-4 border-t border-slate-200">
//                     <label className="text-xs font-bold text-slate-400 uppercase block mb-2">{t('admin.order_status')}</label>
//                     <select 
//                       value={selectedOrder.status}
//                       onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
//                       className={`w-full px-4 py-2 rounded-xl font-bold border outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${getStatusBadge(selectedOrder.status)}`}
//                     >
//                       <option value="pending">{t('order.pending')}</option>
//                       <option value="processing">{t('admin.processing')}</option>
//                       <option value="confirmed">{t('order.confirmed')}</option>
//                       <option value="shipped">{t('order.shipped')}</option>
//                       <option value="delivered">{t('order.delivered')}</option>
//                       <option value="cancelled">{t('order.cancelled')}</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Products List */}
//             {selectedOrder.items && selectedOrder.items.length > 0 && (
//               <div className="space-y-4">
//                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('admin.ordered_products')}</h4>
//                 <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
//                   <table className="w-full text-left rtl:text-right">
//                     <thead className="bg-slate-50 text-slate-500 text-xs font-bold">
//                       <tr>
//                         <th className="px-6 py-3">{t('admin.product')}</th>
//                         <th className="px-6 py-3 text-center">{t('product.quantity')}</th>
//                         <th className="px-6 py-3 text-right">{t('admin.unit_price')}</th>
//                         <th className="px-6 py-3 text-right">{t('cart.total')}</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {selectedOrder.items.map((item, i) => (
//                         <tr key={i}>
//                           <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
//                           <td className="px-6 py-4 text-center text-slate-600">{item.quantity}</td>
//                           <td className="px-6 py-4 text-right text-slate-600">{formatPrice(item.price, i18n.language)}</td>
//                           <td className="px-6 py-4 text-right font-bold text-slate-900">{formatPrice(item.price * item.quantity, i18n.language)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-end pt-6">
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
//               >
//                 {t('admin.close')}
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default AdminOrdersPage;