import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, X, Send } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const STATUT_MAP = {
  ouvert:     { label: 'admin_support.open',    style: 'bg-red-100 text-red-700 border-red-200' },
  en_cours:   { label: 'admin_support.pending', style: 'bg-amber-100 text-amber-700 border-amber-200' },
  en_attente: { label: 'admin_support.pending', style: 'bg-amber-100 text-amber-700 border-amber-200' },
  resolu:     { label: 'admin_support.closed',  style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  ferme:      { label: 'admin_support.closed',  style: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const PRIORITE_MAP = {
  basse:   { label: 'admin_support.low',    style: 'text-blue-600 bg-blue-50' },
  moyenne: { label: 'admin_support.medium', style: 'text-amber-600 bg-amber-50' },
  haute:   { label: 'admin_support.high',   style: 'text-red-600 bg-red-50' },
  urgente: { label: 'admin_support.high',   style: 'text-red-700 bg-red-100' },
};

const AdminSupportPage = () => {
  const { t } = useTranslation();

  const [tickets, setTickets]         = useState([]);
  const [stats, setStats]             = useState({ ouvert: 0, en_attente: 0, resolu: 0 });
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [pagination, setPagination]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetail, setTicketDetail]     = useState(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);
  const [reponse, setReponse]         = useState('');
  const [sendingReponse, setSendingReponse] = useState(false);
  const [updatingStatut, setUpdatingStatut] = useState(false);

  // ── Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/support/stats');
      setStats(res.data.data);
    } catch {}
  }, []);

  // ── Fetch tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage };
      if (searchQuery)   params.search = searchQuery;
      if (filterStatut)  params.statut = filterStatut;

      const res = await api.get('/admin/support', { params });
      setTickets(res.data.data.data);
      setPagination(res.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filterStatut]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(fetchTickets, 300);
    return () => clearTimeout(timer);
  }, [fetchTickets]);

  // ── Fetch ticket detail
  const openTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setLoadingDetail(true);
    setReponse('');
    try {
      const res = await api.get(`/admin/support/${ticket.id}`);
      setTicketDetail(res.data.data);
    } catch {
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setSelectedTicket(null);
    setTicketDetail(null);
  };

  // ── Envoyer reponse
  const handleRepondre = async () => {
    if (!reponse.trim()) return;
    setSendingReponse(true);
    try {
      await api.post(`/admin/support/${ticketDetail.id}/reponses`, { message: reponse });
      setReponse('');
      const res = await api.get(`/admin/support/${ticketDetail.id}`);
      setTicketDetail(res.data.data);
      fetchTickets();
      fetchStats();
    } catch {
    } finally {
      setSendingReponse(false);
    }
  };

  // ── Update statut
  const handleUpdateStatut = async (id, statut) => {
    setUpdatingStatut(true);
    try {
      await api.patch(`/admin/support/${id}/statut`, { statut });
      if (ticketDetail?.id === id) {
        setTicketDetail(prev => ({ ...prev, statut }));
      }
      setTickets(prev => prev.map(t => t.id === id ? { ...t, statut } : t));
      fetchStats();
    } catch {
    } finally {
      setUpdatingStatut(false);
    }
  };

  const statutFilters = [
    { value: '',           label: t('admin_support.all_statuses'), active: 'bg-slate-800 text-white border-slate-800',     inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
    { value: 'ouvert',     label: t('admin_support.open'),         active: 'bg-red-600 text-white border-red-600',         inactive: 'bg-white text-red-600 border-red-200 hover:border-red-400' },
    { value: 'en_cours',   label: t('admin_support.pending'),      active: 'bg-amber-500 text-white border-amber-500',     inactive: 'bg-white text-amber-600 border-amber-200 hover:border-amber-400' },
    { value: 'resolu',     label: t('admin_support.closed'),       active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin_support.title')}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('admin_support.open_tickets')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.ouvert}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('admin_support.pending_tickets')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.en_attente}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('admin_support.resolved_tickets')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.resolu}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('admin_support.search_placeholder')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('admin_support.status')} :</span>
          {statutFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilterStatut(f.value); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                filterStatut === f.value ? f.active : f.inactive
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">{t('admin_support.ticket_id')}</th>
                <th className="px-6 py-4">{t('admin_support.user')}</th>
                <th className="px-6 py-4">{t('admin_support.subject')}</th>
                <th className="px-6 py-4">{t('admin_support.priority')}</th>
                <th className="px-6 py-4">{t('admin_support.status')}</th>
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
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                    {t('common.no_results')}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const statut   = STATUT_MAP[ticket.statut]   || STATUT_MAP.ouvert;
                  const priorite = PRIORITE_MAP[ticket.priorite] || PRIORITE_MAP.moyenne;
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            {ticket.utilisateur?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{ticket.utilisateur?.name}</p>
                            <p className="text-xs text-gray-400">{ticket.utilisateur?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium text-sm">{ticket.sujet}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${priorite.style}`}>
                          {t(priorite.label).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statut.style}`}>
                          {t(statut.label).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <button
                          onClick={() => openTicket(ticket)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <MessageSquare size={18} />
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
        {pagination && pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pagination.from}–{pagination.to} / {pagination.total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    page === currentPage ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Ticket #{selectedTicket.id}</h2>
                <p className="text-sm text-gray-500">{selectedTicket.sujet}</p>
              </div>
              <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} />
              </button>
            </div>

            {loadingDetail ? (
              <div className="flex-grow flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : ticketDetail && (
              <>
                {/* Ticket info */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">{t('admin_support.user')} : </span>
                    <span className="font-medium">{ticketDetail.utilisateur?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('admin_support.priority')} : </span>
                    <span className={`font-bold ${PRIORITE_MAP[ticketDetail.priorite]?.style}`}>
                      {t(PRIORITE_MAP[ticketDetail.priorite]?.label || 'admin_support.medium')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t('admin_support.status')} : </span>
                    <select
                      value={ticketDetail.statut}
                      onChange={(e) => handleUpdateStatut(ticketDetail.id, e.target.value)}
                      disabled={updatingStatut}
                      className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ouvert">{t('admin_support.open')}</option>
                      <option value="en_cours">{t('admin_support.pending')}</option>
                      <option value="en_attente">{t('admin_support.pending')}</option>
                      <option value="resolu">{t('admin_support.closed')}</option>
                      <option value="ferme">{t('admin.close')}</option>
                    </select>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                  {/* Message original */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                        {ticketDetail.utilisateur?.name?.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{ticketDetail.utilisateur?.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(ticketDetail.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{ticketDetail.message}</p>
                  </div>

                  {/* Réponses */}
                  {ticketDetail.reponses?.map((rep) => (
                    <div key={rep.id} className={`rounded-xl p-4 ${
                      rep.utilisateur_id === ticketDetail.utilisateur_id
                        ? 'bg-gray-50'
                        : 'bg-emerald-50 ml-6'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          rep.utilisateur_id === ticketDetail.utilisateur_id
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {rep.utilisateur?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{rep.utilisateur?.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(rep.date_creation).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{rep.message}</p>
                    </div>
                  ))}
                </div>

                {/* Répondre */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <textarea
                      value={reponse}
                      onChange={(e) => setReponse(e.target.value)}
                      rows={2}
                      placeholder="Répondre au ticket..."
                      className="flex-grow px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                    />
                    <button
                      onClick={handleRepondre}
                      disabled={sendingReponse || !reponse.trim()}
                      className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 text-sm font-bold disabled:bg-emerald-300 shrink-0"
                    >
                      {sendingReponse
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Send size={16} />
                      }
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;

// import { Search, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';

// const AdminSupportPage = () => {
//   const { t } = useTranslation();
//   const [filter, setFilter] = useState('all');

//   const tickets = [
//     { id: 'TKT-001', user: 'Ahmed M.', subject: t('admin_support.subject_placeholder'), status: 'open', priority: 'high', date: 'Il y a 2h' },
//     { id: 'TKT-002', user: 'Fatima Z.', subject: t('admin_support.subject_placeholder'), status: 'closed', priority: 'low', date: 'Hier' },
//     { id: 'TKT-003', user: 'Youssef A.', subject: t('admin_support.subject_placeholder'), status: 'pending', priority: 'medium', date: 'Il y a 5h' },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'open': return 'bg-red-100 text-red-700 border-red-200';
//       case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
//       case 'closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin_support.title')}</h1>
//         <div className="flex space-x-2 rtl:space-x-reverse">
//           <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition">{t('admin_support.new_ticket')}</button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
//           <div className="p-3 bg-red-50 text-red-600 rounded-xl">
//             <AlertCircle size={24} />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500 font-medium">{t('admin_support.open_tickets')}</p>
//             <h3 className="text-2xl font-bold text-gray-900">12</h3>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
//           <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
//             <Clock size={24} />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500 font-medium">{t('admin_support.pending_tickets')}</p>
//             <h3 className="text-2xl font-bold text-gray-900">5</h3>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 rtl:space-x-reverse">
//           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//             <CheckCircle size={24} />
//           </div>
//           <div>
//             <p className="text-sm text-gray-500 font-medium">{t('admin_support.resolved_tickets')}</p>
//             <h3 className="text-2xl font-bold text-gray-900">28</h3>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//           <input type="text" placeholder={t('admin_support.search_placeholder')} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
//         </div>
//         <div className="flex gap-2">
//           <select 
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-gray-600"
//           >
//             <option value="all">{t('admin_support.all_statuses')}</option>
//             <option value="open">{t('admin_support.open')}</option>
//             <option value="pending">{t('admin_support.pending')}</option>
//             <option value="closed">{t('admin_support.closed')}</option>
//           </select>
//         </div>
//       </div>

//       {/* Tickets List */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin_support.ticket_id')}</th>
//                 <th className="px-6 py-4">{t('admin_support.user')}</th>
//                 <th className="px-6 py-4">{t('admin_support.subject')}</th>
//                 <th className="px-6 py-4">{t('admin_support.priority')}</th>
//                 <th className="px-6 py-4">{t('admin_support.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {tickets.map((ticket) => (
//                 <tr key={ticket.id} className="hover:bg-gray-50 transition group">
//                   <td className="px-6 py-4 font-bold text-gray-900">{ticket.id}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
//                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
//                         {ticket.user.charAt(0)}
//                       </div>
//                       <span className="font-medium text-gray-900">{ticket.user}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-col">
//                       <span className="text-gray-900 font-medium">{ticket.subject}</span>
//                       <span className="text-xs text-gray-500">{ticket.date}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 rounded-md text-xs font-bold ${
//                       ticket.priority === 'high' ? 'text-red-600 bg-red-50' : 
//                       ticket.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
//                     }`}>
//                       {t(`admin_support.${ticket.priority}`).toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
//                       {t(`admin_support.${ticket.status}`).toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right rtl:text-left">
//                     <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
//                       <MessageSquare size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSupportPage;
