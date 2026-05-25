

// export default ProfilePage;
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Package, MapPin, LogOut, ChevronRight, Edit2, Shield, Save, X, Heart,ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout, loginSuccess } from '../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
   adresse :user?.adresse || '',
    ville :user?.ville || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Jib user data mn backend fl awwal
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const userData = response.data.data;
        dispatch(loginSuccess({
          user: userData,
          token: localStorage.getItem('token'),
        }));
        setFormData({
          name: userData.nom || userData.name || '',
          email: userData.email || '',
          telephone:userData.telephone ||'',
          adresse:userData.adresse || '',
          ville:userData.ville || ''
                
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError(null);
    try {
      const response = await api.put('/profile', {
        nom: formData.name,
        adresse :formData.adresse,
        ville:formData.ville,
      });
      dispatch(loginSuccess({
        user: response.data.data,
        token: localStorage.getItem('token'),
      }));
      setIsEditing(false);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await api.put('/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      });
      setPasswordSuccess(true);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  };

  const clientMenuItems = [
    { label: t('order.history'), icon: Package, path: '/orders' },
    { label: t('favorites.title'), icon: Heart, path: '/favorites' },
    { label: t('cart.title'), icon: ShoppingCart, path: '/cart' },
  
  ];

  const adminMenuItems = [
    { label: t('admin.dashboard'), icon: Shield, path: '/admin' },
    { label: t('admin.products'), icon: Package, path: '/admin/products' },
  ];

  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 rtl:space-x-reverse">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl font-bold">
            {user?.name?.charAt(0) || user?.nom?.charAt(0)}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-emerald-600 hover:bg-emerald-50 transition"
          >
            {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          </button>
        </div>
        <div className="flex-grow text-center md:text-left rtl:md:text-right">
          <h1 className="text-3xl font-bold text-gray-900">{user?.nom || user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Client'}
            </span>
            <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
              {t('profile.member_since')} {user?.date_creation ? new Date(user.date_creation).getFullYear() : new Date(user?.created_at).getFullYear()}
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 rtl:space-x-reverse text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition"
        >
          <LogOut size={20} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Forms */}
        <div className="space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('profile.personal_info')}</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-emerald-600 text-sm font-bold hover:underline">{t('common.edit')}</button>
              )}
            </div>

            {profileError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {profileError}
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.name')}</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.phone')}</label>
               
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.address')}</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.city')}</label>
                 <select name="ville"   value={formData.ville}  disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60"
                >
                 <option  value="Rabat">Rabat</option>
                 <option  value="Sale">Sale</option>
                 <option  value="Casablanca">Casablanca</option>
                 <option  value="Fes">Fes</option>
                 <option  value="Meknes">Meknes</option>
                 <option  value="Tanger">Tanger</option>
                 <option  value="Marakesh">Marakesh</option>
                </select>
              </div>

              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.email')}</label>
                <input 
                  type="email" 
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all disabled:opacity-60"
                />
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-grow bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    <Save size={18} /> {t('profile.save')}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">
                    {t('profile.cancel')}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('profile.security')}</h2>
              <Shield size={20} className="text-gray-400" />
            </div>

            {passwordError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium">
                Mot de passe modifié avec succès
              </div>
            )}
            
            {!isChangingPassword ? (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-emerald-500 hover:text-emerald-600 transition"
              >
                {t('profile.change_password')}
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.current_password')}</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.new_password')}</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.confirm_password')}</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-grow bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">
                    {t('profile.update')}
                  </button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">
                    {t('profile.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Navigation & Settings */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 px-2">{t('profile.activity')}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {menuItems.map((item, i) => (
                <Link 
                  key={i} 
                  to={item.path}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition border-b last:border-0 border-gray-100 group"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="p-2 bg-gray-50 text-gray-600 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                      <item.icon size={20} />
                    </div>
                    <span className="font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition" />
                </Link>
              ))}
            </div>
          </div>

          {!isAdmin && (
            <div className="bg-emerald-600 p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-emerald-600/20">
              <h3 className="text-xl font-bold">{t('profile.need_help')}</h3>
              <p className="text-emerald-100 text-sm">{t('profile.support_text')}</p>
              <Link to="/support" className="inline-block bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition">
                {t('profile.contact_support')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
