// import { useTranslation } from 'react-i18next';
// import { Search, Filter, MoreVertical, Shield, UserX, UserCheck, Plus, Trash2, Edit2 } from 'lucide-react';
// import { useState } from 'react';
// import Modal from '../components/Modal';

// const AdminUsersPage = () => {
//   const { t } = useTranslation();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const [users, setUsers] = useState([
//     { id: 1, name: 'Ahmed Mansouri', email: 'ahmed@email.com', role: 'admin', status: 'active', orders: 12 },
//     { id: 2, name: 'Fatima Zahra', email: 'fatima@email.com', role: 'user', status: 'active', orders: 5 },
//     { id: 3, name: 'Youssef Alami', email: 'youssef@email.com', role: 'user', status: 'inactive', orders: 0 },
//     { id: 4, name: 'Khadija Bennani', email: 'khadija@email.com', role: 'user', status: 'active', orders: 8 },
//   ]);

//   const handleAddUser = () => {
//     setEditingUser(null);
//     setIsModalOpen(true);
//   };

//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setIsModalOpen(true);
//   };

//   const handleDeleteUser = (id) => {
//     if (window.confirm(t('admin.delete_user_confirm'))) {
//       setUsers(users.filter(u => u.id !== id));
//     }
//   };

//   const handleToggleStatus = (id) => {
//     setUsers(users.map(u => 
//       u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
//     ));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const userData = {
//       id: editingUser ? editingUser.id : users.length + 1,
//       name: formData.get('name'),
//       email: formData.get('email'),
//       role: formData.get('role'),
//       status: formData.get('status'),
//       orders: editingUser ? editingUser.orders : 0,
//     };

//     if (editingUser) {
//       setUsers(users.map(u => u.id === editingUser.id ? userData : u));
//     } else {
//       setUsers([...users, userData]);
//     }
//     setIsModalOpen(false);
//   };

//   const filteredUsers = users.filter(user => 
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.users')}</h1>
//         <button 
//           onClick={handleAddUser}
//           className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center"
//         >
//           <Plus size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
//           {t('admin.add_user')}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//           <input 
//             type="text" 
//             placeholder={t('admin.search_user')} 
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
//             <Filter size={18} className="mr-2 rtl:mr-0 rtl:ml-2" />
//             {t('admin.role')}
//           </button>
//           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
//             {t('admin.status')}
//           </button>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin.user')}</th>
//                 <th className="px-6 py-4">{t('admin.role')}</th>
//                 <th className="px-6 py-4">{t('admin.orders')}</th>
//                 <th className="px-6 py-4">{t('admin.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50 transition group">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center space-x-3 rtl:space-x-reverse">
//                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
//                         {user.name.charAt(0)}
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-bold text-gray-900">{user.name}</span>
//                         <span className="text-xs text-gray-500">{user.email}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-md text-xs font-bold ${
//                       user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {user.role === 'admin' && <Shield size={12} />}
//                       <span className="capitalize">{user.role}</span>
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600 font-medium">{user.orders} {t('order.orders_count')}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                       user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {user.status === 'active' ? t('admin.active_status') : t('admin.inactive_status')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right rtl:text-left">
//                     <div className="flex justify-end space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition">
//                       <button 
//                         onClick={() => handleToggleStatus(user.id)}
//                         className={`p-2 rounded-lg transition ${
//                           user.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
//                         }`}
//                         title={user.status === 'active' ? t('admin.deactivate') : t('admin.activate')}
//                       >
//                         {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
//                       </button>
//                       <button 
//                         onClick={() => handleEditUser(user)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleDeleteUser(user.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                       >
//                         <Trash2 size={18} />
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

//       {/* User Modal */}
//       <Modal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         title={editingUser ? t('admin.edit_user') : t('admin.add_user')}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.full_name')}</label>
//               <input 
//                 name="name"
//                 defaultValue={editingUser?.name}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                 placeholder={t('admin.full_name_placeholder')}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
//               <input 
//                 name="email"
//                 type="email"
//                 defaultValue={editingUser?.email}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                 placeholder={t('admin.email_placeholder')}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.role')}</label>
//               <select 
//                 name="role"
//                 defaultValue={editingUser?.role || 'user'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//               >
//                 <option value="user">{t('admin.user_role')}</option>
//                 <option value="admin">{t('admin.admin_role')}</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
//               <select 
//                 name="status"
//                 defaultValue={editingUser?.status || 'active'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//               >
//                 <option value="active">{t('admin.active_status')}</option>
//                 <option value="inactive">{t('admin.inactive_status')}</option>
//               </select>
//             </div>
//           </div>
//           <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t border-slate-100">
//             <button 
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
//             >
//               {t('common.cancel')}
//             </button>
//             <button 
//               type="submit"
//               className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
//             >
//               {editingUser ? t('common.save') : t('common.add')}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminUsersPage;
// import { useTranslation } from 'react-i18next';
// import { Search, Filter, MoreVertical, Shield, UserX, UserCheck, Plus, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
// import { useState, useEffect, useCallback } from 'react';
// import Modal from '../components/Modal';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// // Interceptor — zid token f koll request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// const AdminUsersPage = () => {
//   const { t } = useTranslation();

//   const [users, setUsers]             = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [error, setError]             = useState(null);
//   const [saving, setSaving]           = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterRole, setFilterRole]   = useState('');
//   const [filterStatut, setFilterStatut] = useState('');
//   const [pagination, setPagination]   = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [modalError, setModalError]   = useState(null);

//   // ── Fetch users ──────────────────────────────────────────
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { page: currentPage };
//       if (searchQuery) params.search  = searchQuery;
//       if (filterRole)  params.role    = filterRole;
//       if (filterStatut) params.statut = filterStatut;

//       const res = await api.get('/admin/users', { params });
//       setUsers(res.data.data.data);
//       setPagination(res.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Erreur lors du chargement');
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, filterRole, filterStatut]);

//   useEffect(() => {
//     const timer = setTimeout(fetchUsers, 300); // debounce search
//     return () => clearTimeout(timer);
//   }, [fetchUsers]);

//   // ── Handlers ─────────────────────────────────────────────
//   const handleAddUser = () => {
//     setEditingUser(null);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm(t('admin.delete_user_confirm'))) return;
//     try {
//       await api.delete(`/admin/users/${id}`);
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Erreur suppression');
//     }
//   };

//   const handleToggleStatus = async (user) => {
//     const nextStatut = user.statut === 'actif' ? 'inactif' : 'actif';
//     try {
//       await api.patch(`/admin/users/${user.id}/statut`, { statut: nextStatut });
//       setUsers(prev => prev.map(u =>
//         u.id === user.id ? { ...u, statut: nextStatut } : u
//       ));
//     } catch (err) {
//       alert(err.response?.data?.message || 'Erreur mise à jour statut');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setModalError(null);

//     const formData = new FormData(e.target);
//     const payload = {
//       name:      formData.get('name'),
//       email:     formData.get('email'),
//       role:      formData.get('role'),
//       statut:    formData.get('statut'),
//       telephone: formData.get('telephone'),
//       ville:     formData.get('ville'),
//     };

//     if (!editingUser) {
//       payload.password = formData.get('password');
//     }

//     try {
//       if (editingUser) {
//         await api.put(`/admin/users/${editingUser.id}`, payload);
//       } else {
//         await api.post('/admin/users', payload);
//       }
//       setIsModalOpen(false);
//       fetchUsers();
//     } catch (err) {
//       const errors = err.response?.data?.errors;
//       if (errors) {
//         setModalError(Object.values(errors).flat().join(' — '));
//       } else {
//         setModalError(err.response?.data?.message || 'Erreur');
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Render helpers ────────────────────────────────────────
//   const getRoleBadge = (role) => {
//     const isAdmin = role === 'administrateur';
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
//         isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
//       }`}>
//         {isAdmin && <Shield size={12} />}
//         {isAdmin ? 'Admin' : t('admin.user_role')}
//       </span>
//     );
//   };

//   const getStatutBadge = (statut) => {
//     const map = {
//       actif:   'bg-emerald-100 text-emerald-700',
//       inactif: 'bg-red-100 text-red-700',
//       banni:   'bg-gray-200 text-gray-600',
//     };
//     const labelMap = {
//       actif:   t('admin.active_status'),
//       inactif: t('admin.inactive_status'),
//       banni:   t('admin.banned_status') || 'Banni',
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[statut] || map.inactif}`}>
//         {labelMap[statut] || statut}
//       </span>
//     );
//   };

//   // ── JSX ───────────────────────────────────────────────────
//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.users')}</h1>
//         <button
//           onClick={handleAddUser}
//           className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
//         >
//           <Plus size={20} />
//           {t('admin.add_user')}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder={t('admin.search_user')}
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
//             value={searchQuery}
//             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//           />
//         </div>
//         <select
//           value={filterRole}
//           onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
//           className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
//         >
//           <option value="">{t('admin.role')} — {t('common.all') || 'Tous'}</option>
//           <option value="utilisateur">{t('admin.user_role')}</option>
//           <option value="administrateur">{t('admin.admin_role')}</option>
//         </select>
//         <select
//           value={filterStatut}
//           onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
//           className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
//         >
//           <option value="">{t('admin.status')} — {t('common.all') || 'Tous'}</option>
//           <option value="actif">{t('admin.active_status')}</option>
//           <option value="inactif">{t('admin.inactive_status')}</option>
//           <option value="banni">{t('admin.banned_status') || 'Banni'}</option>
//         </select>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin.user')}</th>
//                 <th className="px-6 py-4">{t('admin.role')}</th>
//                 <th className="px-6 py-4">{t('admin.orders')}</th>
//                 <th className="px-6 py-4">{t('admin.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
//                     <Loader2 className="animate-spin mx-auto mb-2" size={28} />
//                     <p className="text-sm">Chargement...</p>
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
//                     Aucun utilisateur trouvé
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-bold text-gray-900 text-sm">{user.name}</p>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
//                     <td className="px-6 py-4 text-gray-600 font-medium text-sm">
//                       {user.commandes_count ?? 0} {t('order.orders_count')}
//                     </td>
//                     <td className="px-6 py-4">{getStatutBadge(user.statut)}</td>
//                     <td className="px-6 py-4 text-right rtl:text-left">
//                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
//                         <button
//                           onClick={() => handleToggleStatus(user)}
//                           className={`p-2 rounded-lg transition ${
//                             user.statut === 'actif'
//                               ? 'text-amber-600 hover:bg-amber-50'
//                               : 'text-emerald-600 hover:bg-emerald-50'
//                           }`}
//                           title={user.statut === 'actif' ? t('admin.deactivate') : t('admin.activate')}
//                         >
//                           {user.statut === 'actif' ? <UserX size={18} /> : <UserCheck size={18} />}
//                         </button>
//                         <button
//                           onClick={() => handleEditUser(user)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                         >
//                           <Edit2 size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination && pagination.last_page > 1 && (
//           <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
//             <p className="text-sm text-gray-500">
//               {pagination.from}–{pagination.to} / {pagination.total} utilisateurs
//             </p>
//             <div className="flex gap-1">
//               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
//                     page === currentPage
//                       ? 'bg-emerald-600 text-white'
//                       : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal Ajouter/Modifier */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingUser ? t('admin.edit_user') : t('admin.add_user')}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {modalError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
//               <AlertCircle size={16} /> {modalError}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.full_name')}</label>
//               <input
//                 name="name"
//                 defaultValue={editingUser?.name}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder={t('admin.full_name_placeholder')}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
//               <input
//                 name="email"
//                 type="email"
//                 defaultValue={editingUser?.email}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="exemple@email.com"
//               />
//             </div>
//             {!editingUser && (
//               <div className="space-y-2 md:col-span-2">
//                 <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
//                 <input
//                   name="password"
//                   type="password"
//                   required
//                   minLength={6}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                   placeholder="••••••••"
//                 />
//               </div>
//             )}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.role')}</label>
//               <select
//                 name="role"
//                 defaultValue={editingUser?.role || 'utilisateur'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="utilisateur">{t('admin.user_role')}</option>
//                 <option value="administrateur">{t('admin.admin_role')}</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
//               <select
//                 name="statut"
//                 defaultValue={editingUser?.statut || 'actif'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="actif">{t('admin.active_status')}</option>
//                 <option value="inactif">{t('admin.inactive_status')}</option>
//                 <option value="banni">{t('admin.banned_status') || 'Banni'}</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">Téléphone</label>
//               <input
//                 name="telephone"
//                 defaultValue={editingUser?.telephone}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="+212 6XX XXX XXX"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">Ville</label>
//               <input
//                 name="ville"
//                 defaultValue={editingUser?.ville}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="Casablanca"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
//             <button
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition text-sm"
//             >
//               {t('common.cancel')}
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2 text-sm disabled:bg-emerald-400"
//             >
//               {saving && <Loader2 size={16} className="animate-spin" />}
//               {editingUser ? t('common.save') : t('common.add')}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminUsersPage;
// import { useTranslation } from 'react-i18next';
// import { Search, Shield, UserX, UserCheck, Plus, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
// import { useState, useEffect, useCallback } from 'react';
// import Modal from '../components/Modal';
// import api from '../services/api';

// const AdminUsersPage = () => {
//   const { t } = useTranslation();

//   const [users, setUsers]               = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState(null);
//   const [saving, setSaving]             = useState(false);
//   const [searchQuery, setSearchQuery]   = useState('');
//   const [filterRole, setFilterRole]     = useState('');
//   const [filterStatut, setFilterStatut] = useState('');
//   const [pagination, setPagination]     = useState(null);
//   const [currentPage, setCurrentPage]   = useState(1);
//   const [isModalOpen, setIsModalOpen]   = useState(false);
//   const [editingUser, setEditingUser]   = useState(null);
//   const [modalError, setModalError]     = useState(null);

//   // ── Fetch users ──────────────────────────────────────────
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { page: currentPage };
//       if (searchQuery)  params.search = searchQuery;
//       if (filterRole)   params.role   = filterRole;
//       if (filterStatut) params.statut = filterStatut;

//       const res = await api.get('/admin/users', { params });
//       setUsers(res.data.data.data);
//       setPagination(res.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || t('common.error'));
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, filterRole, filterStatut, t]);

//   useEffect(() => {
//     const timer = setTimeout(fetchUsers, 300);
//     return () => clearTimeout(timer);
//   }, [fetchUsers]);

//   // ── Handlers ─────────────────────────────────────────────
//   const handleAddUser = () => {
//     setEditingUser(null);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleDeleteUser = async (id) => {
//     if (!window.confirm(t('admin.delete_user_confirm'))) return;
//     try {
//       await api.delete(`/admin/users/${id}`);
//       fetchUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || t('common.error'));
//     }
//   };

//   const handleToggleStatus = async (user) => {
//     const nextStatut = user.statut === 'actif' ? 'inactif' : 'actif';
//     try {
//       await api.patch(`/admin/users/${user.id}/statut`, { statut: nextStatut });
//       setUsers(prev => prev.map(u =>
//         u.id === user.id ? { ...u, statut: nextStatut } : u
//       ));
//     } catch (err) {
//       alert(err.response?.data?.message || t('common.error'));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setModalError(null);

//     const formData = new FormData(e.target);
//     const payload = {
//       name:      formData.get('name'),
//       email:     formData.get('email'),
//       role:      formData.get('role'),
//       statut:    formData.get('statut'),
//       telephone: formData.get('telephone'),
//       ville:     formData.get('ville'),
//     };

//     if (!editingUser) {
//       payload.password = formData.get('password');
//     }

//     try {
//       if (editingUser) {
//         await api.put(`/admin/users/${editingUser.id}`, payload);
//       } else {
//         await api.post('/admin/users', payload);
//       }
//       setIsModalOpen(false);
//       fetchUsers();
//     } catch (err) {
//       const errors = err.response?.data?.errors;
//       if (errors) {
//         setModalError(Object.values(errors).flat().join(' — '));
//       } else {
//         setModalError(err.response?.data?.message || t('common.error'));
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Badges ───────────────────────────────────────────────
//   const getRoleBadge = (role) => {
//     const isAdmin = role === 'administrateur';
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
//         isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
//       }`}>
//         {isAdmin && <Shield size={12} />}
//         {isAdmin ? t('admin.admin_role') : t('admin.user_role')}
//       </span>
//     );
//   };

//   const getStatutBadge = (statut) => {
//     const styles = {
//       actif:   'bg-emerald-100 text-emerald-700',
//       inactif: 'bg-red-100 text-red-700',
//       banni:   'bg-gray-200 text-gray-600',
//     };
//     const labels = {
//       actif:   t('admin.active_status'),
//       inactif: t('admin.inactive_status'),
//       banni:   t('admin.banned_status'),
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || styles.inactif}`}>
//         {labels[statut] || statut}
//       </span>
//     );
//   };

//   // ── JSX ───────────────────────────────────────────────────
//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.users')}</h1>
//         <button
//           onClick={handleAddUser}
//           className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
//         >
//           <Plus size={20} />
//           {t('admin.add_user')}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder={t('admin.search_user')}
//             className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
//             value={searchQuery}
//             onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//           />
//         </div>
//         <select
//           value={filterRole}
//           onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
//           className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
//         >
//           <option value="">{t('admin.role')} — {t('common.all')}</option>
//           <option value="utilisateur">{t('admin.user_role')}</option>
//           <option value="administrateur">{t('admin.admin_role')}</option>
//         </select>
//         <select
//           value={filterStatut}
//           onChange={(e) => { setFilterStatut(e.target.value); setCurrentPage(1); }}
//           className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
//         >
//           <option value="">{t('admin.status')} — {t('common.all')}</option>
//           <option value="actif">{t('admin.active_status')}</option>
//           <option value="inactif">{t('admin.inactive_status')}</option>
//           <option value="banni">{t('admin.banned_status')}</option>
//         </select>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left rtl:text-right">
//             <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
//               <tr>
//                 <th className="px-6 py-4">{t('admin.user')}</th>
//                 <th className="px-6 py-4">{t('admin.role')}</th>
//                 <th className="px-6 py-4">{t('admin.orders')}</th>
//                 <th className="px-6 py-4">{t('admin.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
//                     <Loader2 className="animate-spin mx-auto mb-2" size={28} />
//                     <p className="text-sm">{t('common.loading')}</p>
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-16 text-center text-gray-400 text-sm">
//                     {t('common.no_results')}
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-bold text-gray-900 text-sm">{user.name}</p>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
//                     <td className="px-6 py-4 text-gray-600 font-medium text-sm">
//                       {user.commandes_count ?? 0} {t('order.orders_count')}
//                     </td>
//                     <td className="px-6 py-4">{getStatutBadge(user.statut)}</td>
//                     <td className="px-6 py-4 text-right rtl:text-left">
//                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
//                         <button
//                           onClick={() => handleToggleStatus(user)}
//                           className={`p-2 rounded-lg transition ${
//                             user.statut === 'actif'
//                               ? 'text-amber-600 hover:bg-amber-50'
//                               : 'text-emerald-600 hover:bg-emerald-50'
//                           }`}
//                           title={user.statut === 'actif' ? t('admin.deactivate') : t('admin.activate')}
//                         >
//                           {user.statut === 'actif' ? <UserX size={18} /> : <UserCheck size={18} />}
//                         </button>
//                         <button
//                           onClick={() => handleEditUser(user)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                         >
//                           <Edit2 size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination && pagination.last_page > 1 && (
//           <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
//             <p className="text-sm text-gray-500">
//               {pagination.from}–{pagination.to} / {pagination.total} {t('admin.users')}
//             </p>
//             <div className="flex gap-1">
//               {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
//                     page === currentPage
//                       ? 'bg-emerald-600 text-white'
//                       : 'text-gray-500 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={editingUser ? t('admin.edit_user') : t('admin.add_user')}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {modalError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
//               <AlertCircle size={16} /> {modalError}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.full_name')}</label>
//               <input
//                 name="name"
//                 defaultValue={editingUser?.name}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder={t('admin.full_name_placeholder')}
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
//               <input
//                 name="email"
//                 type="email"
//                 defaultValue={editingUser?.email}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder={t('admin.email_placeholder')}
//               />
//             </div>

//             {!editingUser && (
//               <div className="space-y-2 md:col-span-2">
//                 <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
//                 <input
//                   name="password"
//                   type="password"
//                   required
//                   minLength={6}
//                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                   placeholder="••••••••"
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.role')}</label>
//               <select
//                 name="role"
//                 defaultValue={editingUser?.role || 'utilisateur'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="utilisateur">{t('admin.user_role')}</option>
//                 <option value="administrateur">{t('admin.admin_role')}</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
//               <select
//                 name="statut"
//                 defaultValue={editingUser?.statut || 'actif'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="actif">{t('admin.active_status')}</option>
//                 <option value="inactif">{t('admin.inactive_status')}</option>
//                 <option value="banni">{t('admin.banned_status')}</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('auth.phone')}</label>
//               <input
//                 name="telephone"
//                 defaultValue={editingUser?.telephone}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="+212 6XX XXX XXX"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('auth.ville')}</label>
//               <input
//                 name="ville"
//                 defaultValue={editingUser?.ville}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="Casablanca"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
//             <button
//               type="button"
//               onClick={() => setIsModalOpen(false)}
//               className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition text-sm"
//             >
//               {t('common.cancel')}
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2 text-sm disabled:bg-emerald-400"
//             >
//               {saving && <Loader2 size={16} className="animate-spin" />}
//               {editingUser ? t('common.save') : t('common.add')}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminUsersPage;
import { useTranslation } from 'react-i18next';
import { Search, Shield, Plus, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import api from '../services/api';

const AdminUsersPage = () => {
  const { t } = useTranslation();

  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [saving, setSaving]             = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [pagination, setPagination]     = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingUser, setEditingUser]   = useState(null);
  const [modalError, setModalError]     = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage };
      if (searchQuery)  params.search = searchQuery;
      if (filterStatut) params.statut = filterStatut;

      const res = await api.get('/admin/users', { params });
      setUsers(res.data.data.data);
      setPagination(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filterStatut, t]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(t('admin.delete_user_confirm'))) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || t('common.error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    const formData = new FormData(e.target);
    const payload = {
      name:      formData.get('name'),
      email:     formData.get('email'),
      statut:    formData.get('statut'),
      telephone: formData.get('telephone'),
      ville:     formData.get('ville'),
      adresse:   formData.get('adresse'),
    };

    if (!editingUser) {
      payload.password = formData.get('password');
    }

    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, payload);
      } else {
        await api.post('/admin/users', payload);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setModalError(Object.values(errors).flat().join(' — '));
      } else {
        setModalError(err.response?.data?.message || t('common.error'));
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      actif:   'bg-emerald-100 text-emerald-700',
      inactif: 'bg-amber-100 text-amber-700',
      banni:   'bg-red-100 text-red-700',
    };
    const labels = {
      actif:   t('admin.active_status'),
      inactif: t('admin.inactive_status'),
      banni:   t('admin.banned_status'),
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[statut] || styles.inactif}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const statutFilters = [
    { value: '',        label: t('common.all'),            active: 'bg-slate-800 text-white border-slate-800',     inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
    { value: 'actif',   label: t('admin.active_status'),   active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400' },
    { value: 'inactif', label: t('admin.inactive_status'), active: 'bg-amber-500 text-white border-amber-500',     inactive: 'bg-white text-amber-600 border-amber-200 hover:border-amber-400' },
    { value: 'banni',   label: t('admin.banned_status'),   active: 'bg-red-600 text-white border-red-600',         inactive: 'bg-white text-red-600 border-red-200 hover:border-red-400' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.users')}</h1>
        <button
          onClick={handleAddUser}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          {t('admin.add_user')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('admin.search_user')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Statut filter buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-400 uppercase">{t('admin.status')} :</span>
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
                <th className="px-6 py-4">{t('admin.user')}</th>
                <th className="px-6 py-4">{t('auth.phone')}</th>
                <th className="px-6 py-4">{t('auth.city')}</th>
                <th className="px-6 py-4">{t('admin.orders')}</th>
                <th className="px-6 py-4">{t('admin.status')}</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                    {t('common.no_results')}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.telephone || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm capitalize">
                      {user.ville || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                      {user.commandes_count ?? 0} {t('order.orders_count')}
                    </td>
                    <td className="px-6 py-4">{getStatutBadge(user.statut)}</td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title={t('common.edit')}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={t('common.delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pagination.from}–{pagination.to} / {pagination.total} {t('admin.users')}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                    page === currentPage
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? t('admin.edit_user') : t('admin.add_user')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {modalError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {modalError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Nom */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.full_name')}</label>
              <input
                name="name"
                defaultValue={editingUser?.name}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder={t('admin.full_name_placeholder')}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                defaultValue={editingUser?.email}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder={t('admin.email_placeholder')}
              />
            </div>

            {/* Password — création uniquement */}
            {!editingUser && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
              <select
                name="statut"
                defaultValue={editingUser?.statut || 'actif'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
              >
                <option value="actif">{t('admin.active_status')}</option>
                <option value="inactif">{t('admin.inactive_status')}</option>
                <option value="banni">{t('admin.banned_status')}</option>
              </select>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('auth.phone')}</label>
              <input
                name="telephone"
                defaultValue={editingUser?.telephone}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder="+212 6XX XXX XXX"
              />
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('auth.city')}</label>
              <input
                name="ville"
                defaultValue={editingUser?.ville}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder="Casablanca"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">{t('auth.address')}</label>
              <textarea
                name="adresse"
                defaultValue={editingUser?.adresse}
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm resize-none"
                placeholder="25 Rue Hassan II, Casablanca"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition text-sm"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2 text-sm disabled:bg-emerald-400"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingUser ? t('common.save') : t('common.add')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;