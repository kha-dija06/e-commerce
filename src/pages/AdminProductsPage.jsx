import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit2, Trash2, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import api from '../services/api';

const STATUT_MAP = {
  disponible:    { label: 'admin.active',       style: 'bg-emerald-100 text-emerald-700' },
  rupture_stock: { label: 'admin.out_of_stock', style: 'bg-red-100 text-red-700' },
  abandonne:     { label: 'admin.abandoned',    style: 'bg-gray-100 text-gray-600' },
};

const AdminProductsPage = () => {
  const { t } = useTranslation();

  const [products, setProducts]             = useState([]);
  const [categories, setCategories]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [saving, setSaving]                 = useState(false);
  const [modalError, setModalError]         = useState(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [filterCat, setFilterCat]           = useState('');
  const [filterStatut, setFilterStatut]     = useState('');
  const [pagination, setPagination]         = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview]     = useState(null);
  const [imageFile, setImageFile]           = useState(null);

  // ── Fetch categories — ✅ fix: extraire l'array correctement
  useEffect(() => {
    api.get('/admin/categories', { params: { per_page: 100 } })
      .then(res => {
        // API retourne { success, data: { data: [...], total, ... } } (paginator)
        // ou { success, data: [...] } (array direct)
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, []);

  // ── Fetch products — ✅ fix: extraire l'array + pagination correctement
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage };
      if (searchQuery)  params.search       = searchQuery;
      if (filterCat)    params.categorie_id = filterCat;
      if (filterStatut) params.statut       = filterStatut;

      const res = await api.get('/admin/products', { params });

      // ✅ res.data.data est un paginator Laravel: { data: [...], total, last_page, ... }
      const paginator = res.data?.data;
      setProducts(Array.isArray(paginator?.data) ? paginator.data : []);
      setPagination(paginator || null);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filterCat, filterStatut, t]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // ── Handlers
  const handleAdd = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImagePreview(
      product.image
        ? `${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/storage/${product.image}`
        : null
    );
    setImageFile(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
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

    // Stock 0 → rupture_stock auto
    const stock = parseInt(formData.get('stock'));
    if (stock === 0) formData.set('statut', 'rupture_stock');

    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingProduct) {
        formData.append('_method', 'PUT');
        await api.post(`/admin/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setIsModalOpen(false);
      fetchProducts();
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

  const statutFilters = [
    { value: '',               label: t('common.all'),                        active: 'bg-slate-800 text-white border-slate-800',     inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
    { value: 'disponible',    label: t('admin.active'),                      active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400' },
    { value: 'rupture_stock', label: t('admin.out_of_stock'),                active: 'bg-red-600 text-white border-red-600',         inactive: 'bg-white text-red-600 border-red-200 hover:border-red-400' },
    { value: 'abandonne',     label: t('admin.abandoned') || 'Abandonné',   active: 'bg-gray-600 text-white border-gray-600',       inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
  ];

  const getImageUrl = (image) => {
    if (!image) return `https://picsum.photos/seed/default/100/100`;
    if (image.startsWith('http')) return image;
    return `${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/storage/${image}`;
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.products')}</h1>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          {t('admin.add_product')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('admin.search_product')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => { setFilterCat(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
          >
            <option value="">{t('product.category')} — {t('common.all')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </div>

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
                <th className="px-6 py-4">{t('admin.product')}</th>
                <th className="px-6 py-4">{t('product.category')}</th>
                <th className="px-6 py-4">{t('product.price')}</th>
                <th className="px-6 py-4">{t('product.stock')}</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                    {t('common.no_results')}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const statut = STATUT_MAP[product.statut] || STATUT_MAP.disponible;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.nom}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{product.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {product.categorie?.nom || '—'}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                        {product.prix} DH
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium text-sm ${product.stock < 5 ? 'text-amber-600' : 'text-gray-600'}`}>
                          {product.stock} {t('product.units')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statut.style}`}>
                          {t(statut.label)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
              {pagination.from}–{pagination.to} / {pagination.total} {t('admin.products')}
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
        title={editingProduct ? t('admin.edit_product') : t('admin.add_product')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {modalError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {modalError}
            </div>
          )}

          {/* Upload image */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-emerald-500 transition-all group relative overflow-hidden">
            {imagePreview ? (
              <div className="relative w-full h-48">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-2xl"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Nom */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.product_name')}</label>
              <input
                name="nom"
                defaultValue={editingProduct?.nom}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder={t('admin.product_name_placeholder')}
              />
            </div>

            {/* Categorie */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('product.category')}</label>
              <select
                name="categorie_id"
                defaultValue={editingProduct?.categorie_id || ''}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
              >
                <option value="">{t('common.all')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.price_dh')}</label>
              <input
                name="prix"
                type="number"
                step="0.01"
                min="0"
                defaultValue={editingProduct?.prix}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('product.stock')}</label>
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={editingProduct?.stock}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
                placeholder="0"
              />
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
              <select
                name="statut"
                defaultValue={editingProduct?.statut || 'disponible'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
              >
                <option value="disponible">{t('admin.active')}</option>
                <option value="rupture_stock">{t('admin.out_of_stock')}</option>
                <option value="abandonne">{t('admin.abandoned') || 'Abandonné'}</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">{t('product.description')}</label>
              <textarea
                name="description"
                defaultValue={editingProduct?.description}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm resize-none"
                placeholder={t('admin.description_placeholder')}
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
              {editingProduct ? t('common.save') : t('common.add')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
// import { useTranslation } from 'react-i18next';
// import { Search, Plus, Edit2, Trash2, Upload, X, Loader2, AlertCircle } from 'lucide-react';
// import { useState, useEffect, useCallback } from 'react';
// import Modal from '../components/Modal';
// import api from '../services/api';

// const STATUT_MAP = {
//   disponible:   { label: 'admin.active',        style: 'bg-emerald-100 text-emerald-700' },
//   rupture_stock:{ label: 'admin.out_of_stock',  style: 'bg-red-100 text-red-700' },
//   abandonne:    { label: 'admin.abandoned',      style: 'bg-gray-100 text-gray-600' },
// };

// const AdminProductsPage = () => {
//   const { t } = useTranslation();

//   const [products, setProducts]         = useState([]);
//   const [categories, setCategories]     = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [error, setError]               = useState(null);
//   const [saving, setSaving]             = useState(false);
//   const [modalError, setModalError]     = useState(null);
//   const [searchQuery, setSearchQuery]   = useState('');
//   const [filterCat, setFilterCat]       = useState('');
//   const [filterStatut, setFilterStatut] = useState('');
//   const [pagination, setPagination]     = useState(null);
//   const [currentPage, setCurrentPage]   = useState(1);
//   const [isModalOpen, setIsModalOpen]   = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [imageFile, setImageFile]       = useState(null);

//   // ── Fetch categories
//   useEffect(() => {
//     api.get('/admin/categories').then(res => {
//       setCategories(res.data.data);
//     }).catch(() => {});
//   }, []);

//   // ── Fetch products
//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = { page: currentPage };
//       if (searchQuery)   params.search       = searchQuery;
//       if (filterCat)     params.categorie_id = filterCat;
//       if (filterStatut)  params.statut       = filterStatut;

//       const res = await api.get('/admin/products', { params });
//       setProducts(res.data.data.data);
//       setPagination(res.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || t('common.error'));
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, filterCat, filterStatut, t]);

//   useEffect(() => {
//     const timer = setTimeout(fetchProducts, 300);
//     return () => clearTimeout(timer);
//   }, [fetchProducts]);

//   // ── Handlers
//   const handleAdd = () => {
//     setEditingProduct(null);
//     setImagePreview(null);
//     setImageFile(null);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setImagePreview(
//       product.image
//         ? `${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/storage/${product.image}`
//         : null
//     );
//     setImageFile(null);
//     setModalError(null);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(t('admin.delete_confirm'))) return;
//     try {
//       await api.delete(`/admin/products/${id}`);
//       fetchProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || t('common.error'));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setImagePreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setModalError(null);

//     const formData = new FormData(e.target);

//     // Stock 0 → rupture_stock auto
//     const stock = parseInt(formData.get('stock'));
//     if (stock === 0) formData.set('statut', 'rupture_stock');

//     if (imageFile) formData.append('image', imageFile);

//     try {
//       if (editingProduct) {
//         formData.append('_method', 'PUT');
//         await api.post(`/admin/products/${editingProduct.id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await api.post('/admin/products', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       setIsModalOpen(false);
//       fetchProducts();
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

//   const statutFilters = [
//     { value: '',              label: t('common.all'),          active: 'bg-slate-800 text-white border-slate-800',     inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
//     { value: 'disponible',   label: t('admin.active'),        active: 'bg-emerald-600 text-white border-emerald-600', inactive: 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400' },
//     { value: 'rupture_stock',label: t('admin.out_of_stock'),  active: 'bg-red-600 text-white border-red-600',         inactive: 'bg-white text-red-600 border-red-200 hover:border-red-400' },
//     { value: 'abandonne',    label: t('admin.abandoned') || 'Abandonné', active: 'bg-gray-600 text-white border-gray-600', inactive: 'bg-white text-gray-500 border-gray-200 hover:border-gray-400' },
//   ];

//   const getImageUrl = (image) => {
//     if (!image) return `https://picsum.photos/seed/default/100/100`;
//     if (image.startsWith('http')) return image;
//     return `${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/storage/${image}`;
//   };

//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h1 className="text-3xl font-bold text-gray-900">{t('admin.products')}</h1>
//         <button
//           onClick={handleAdd}
//           className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
//         >
//           <Plus size={20} />
//           {t('admin.add_product')}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">

//         {/* Row 1 — search + categorie */}
//         <div className="flex flex-col md:flex-row gap-3">
//           <div className="relative flex-grow">
//             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder={t('admin.search_product')}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
//               value={searchQuery}
//               onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//             />
//           </div>
//           <select
//             value={filterCat}
//             onChange={(e) => { setFilterCat(e.target.value); setCurrentPage(1); }}
//             className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600 bg-white"
//           >
//             <option value="">{t('product.category')} — {t('common.all')}</option>
//             {categories.map(cat => (
//               <option key={cat.id} value={cat.id}>{cat.nom}</option>
//             ))}
//           </select>
//         </div>

//         {/* Row 2 — statut buttons */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-xs font-bold text-gray-400 uppercase">{t('admin.status')} :</span>
//           {statutFilters.map((f) => (
//             <button
//               key={f.value}
//               onClick={() => { setFilterStatut(f.value); setCurrentPage(1); }}
//               className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
//                 filterStatut === f.value ? f.active : f.inactive
//               }`}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>
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
//                 <th className="px-6 py-4">{t('admin.product')}</th>
//                 <th className="px-6 py-4">{t('product.category')}</th>
//                 <th className="px-6 py-4">{t('product.price')}</th>
//                 <th className="px-6 py-4">{t('product.stock')}</th>
//                 <th className="px-6 py-4">{t('admin.status')}</th>
//                 <th className="px-6 py-4 text-right rtl:text-left">{t('admin_support.actions')}</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
//                     <Loader2 className="animate-spin mx-auto mb-2" size={28} />
//                     <p className="text-sm">{t('common.loading')}</p>
//                   </td>
//                 </tr>
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
//                     {t('common.no_results')}
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((product) => {
//                   const statut = STATUT_MAP[product.statut] || STATUT_MAP.disponible;
//                   return (
//                     <tr key={product.id} className="hover:bg-gray-50 transition group">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
//                             <img
//                               src={getImageUrl(product.image)}
//                               alt={product.nom}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <span className="font-bold text-gray-900 text-sm">{product.nom}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-600 text-sm">
//                         {product.categorie?.nom || '—'}
//                       </td>
//                       <td className="px-6 py-4 font-bold text-gray-900 text-sm">
//                         {product.prix} DH
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`font-medium text-sm ${product.stock < 5 ? 'text-amber-600' : 'text-gray-600'}`}>
//                           {product.stock} {t('product.units')}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${statut.style}`}>
//                           {t(statut.label)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right rtl:text-left">
//                         <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
//                           <button
//                             onClick={() => handleEdit(product)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(product.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination && pagination.last_page > 1 && (
//           <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
//             <p className="text-sm text-gray-500">
//               {pagination.from}–{pagination.to} / {pagination.total} {t('admin.products')}
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
//         title={editingProduct ? t('admin.edit_product') : t('admin.add_product')}
//       >
//         <form onSubmit={handleSubmit} className="space-y-6">

//           {modalError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
//               <AlertCircle size={16} /> {modalError}
//             </div>
//           )}

//           {/* Upload image */}
//           <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-emerald-500 transition-all group relative overflow-hidden">
//             {imagePreview ? (
//               <div className="relative w-full h-48">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-full h-full object-contain rounded-2xl"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => { setImagePreview(null); setImageFile(null); }}
//                   className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <label className="flex flex-col items-center cursor-pointer w-full">
//                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
//                   <Upload size={32} />
//                 </div>
//                 <p className="text-sm font-bold text-slate-700">{t('admin.upload_image')}</p>
//                 <p className="text-xs text-slate-400 mt-1">{t('admin.upload_hint')}</p>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/jpeg,image/png,image/webp"
//                   onChange={handleImageChange}
//                 />
//               </label>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//             {/* Nom */}
//             <div className="space-y-2 md:col-span-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.product_name')}</label>
//               <input
//                 name="nom"
//                 defaultValue={editingProduct?.nom}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder={t('admin.product_name_placeholder')}
//               />
//             </div>

//             {/* Categorie */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('product.category')}</label>
//               <select
//                 name="categorie_id"
//                 defaultValue={editingProduct?.categorie_id || ''}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="">{t('common.all')}</option>
//                 {categories.map(cat => (
//                   <option key={cat.id} value={cat.id}>{cat.nom}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Prix */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.price_dh')}</label>
//               <input
//                 name="prix"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 defaultValue={editingProduct?.prix}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="0.00"
//               />
//             </div>

//             {/* Stock */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('product.stock')}</label>
//               <input
//                 name="stock"
//                 type="number"
//                 min="0"
//                 defaultValue={editingProduct?.stock}
//                 required
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//                 placeholder="0"
//               />
//             </div>

//             {/* Statut */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-700">{t('admin.status')}</label>
//               <select
//                 name="statut"
//                 defaultValue={editingProduct?.statut || 'disponible'}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm"
//               >
//                 <option value="disponible">{t('admin.active')}</option>
//                 <option value="rupture_stock">{t('admin.out_of_stock')}</option>
//                 <option value="abandonne">{t('admin.abandoned') || 'Abandonné'}</option>
//               </select>
//             </div>

//             {/* Description */}
//             <div className="space-y-2 md:col-span-2">
//               <label className="text-sm font-bold text-slate-700">{t('product.description')}</label>
//               <textarea
//                 name="description"
//                 defaultValue={editingProduct?.description}
//                 rows={3}
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm resize-none"
//                 placeholder={t('admin.description_placeholder')}
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
//               {editingProduct ? t('common.save') : t('common.add')}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;
