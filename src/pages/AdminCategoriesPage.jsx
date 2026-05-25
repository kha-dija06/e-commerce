import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit2, Trash2, Upload, X, Loader2, AlertCircle, Tag } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import api from '../services/api';

const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [saving, setSaving]           = useState(false);
  const [modalError, setModalError]   = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat]   = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile]     = useState(null);

  // ── Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, per_page: 10 };
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/admin/categories', { params });
      setCategories(res.data.data.data || res.data.data);
      setPagination(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, t]);

  useEffect(() => {
    const timer = setTimeout(fetchCategories, 300);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  // ── Handlers
  const handleAdd = () => {
    setEditingCat(null);
    setImagePreview(null);
    setImageFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setImagePreview(
      cat.image
        ? `http://localhost:8000/storage/categories/${cat.image}`
        : null
    );
    setImageFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || t('common.error'));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    const formData = new FormData(e.target);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingCat) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/categories/${editingCat.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      fetchCategories();
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

  const getCatImage = (cat) => {
    if (cat.image) return `http://localhost:8000/storage/categories/${cat.image}`;
    return null;
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.categories')}</h1>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          {t('common.add')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
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
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">{t('admin.categories')}</th>
                <th className="px-6 py-4">{t('admin.products')}</th>
                <th className="px-6 py-4 text-right">{t('admin_support.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={28} />
                    <p className="text-sm">{t('common.loading')}</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-400 text-sm">
                    {t('common.no_results')}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Image ou icone */}
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {getCatImage(cat) ? (
                            <img
                              src={getCatImage(cat)}
                              alt={cat.nom}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Tag size={18} className="text-gray-400" />
                          )}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{cat.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">
                        {cat.produits_count ?? 0} {t('nav.products')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
              {pagination.from}–{pagination.to} / {pagination.total}
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
        title={editingCat ? t('common.edit') : t('common.add')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {modalError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {modalError}
            </div>
          )}

          {/* Upload image */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-emerald-500 transition-all group">
            {imagePreview ? (
              <div className="relative w-full h-40">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer w-full">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-bold text-slate-700">{t('admin.upload_image')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('admin.upload_hint')}</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{t('admin.categories')}</label>
            <input
              name="nom"
              defaultValue={editingCat?.nom}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
              placeholder="Ex: Tapis et Tissage"
            />
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
              {editingCat ? t('common.save') : t('common.add')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;