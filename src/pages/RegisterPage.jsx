// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { registerSchema } from '../utils/validators';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import { Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// const RegisterPage = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useAuth();

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

 
//   const onSubmit = async (data) => {
//     dispatch(loginStart());
 
//     // ← Debug: shuf chi kaytsift l backend
//     console.log('Data kaytsift:', {
//       nom: data.name,
//       email: data.email,
//       mot_de_passe: data.password,
//       telephone: data.phone || null,
//       adresse: data.address || null,
//     });
 
//     try {
//       const response = await api.post('/register', {
//         nom: data.name,
//         email: data.email,
//         mot_de_passe: data.password,
//         telephone: data.phone || null,
//         adresse: data.address || null,
//       });
 
//       const { user, token } = response.data.data;
//       localStorage.setItem('token', token);
//       dispatch(loginSuccess({ user, token }));
//       navigate('/');
//     } catch (err) {
//       // ← Debug: shuf exact l-error mn backend
//       console.log('Status:', err.response?.status);
//       console.log('Response:', err.response?.data);
//       console.log('Validation errors:', err.response?.data?.errors);
 
//       const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
//       dispatch(loginFailure(message));
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-8">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register')}</h1>
//           <p className="text-gray-500">{t('auth.has_account')} <Link to="/login" className="text-emerald-600 font-semibold">{t('auth.login')}</Link></p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.name')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('name')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="Votre nom complet"
//               />
//               <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.email')}</label>
//             <div className="relative">
//               <input 
//                 type="email"
//                 {...register('email')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="exemple@email.com"
//               />
//               <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.password')}</label>
//             <div className="relative">
//               <input 
//                 type="password"
//                 {...register('password')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.confirm_password')}</label>
//             <div className="relative">
//               <input 
//                 type="password"
//                 {...register('confirmPassword')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.phone')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('phone')}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
//                 placeholder="+212 6XX XXX XXX"
//               />
//               <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.address')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('address')}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
//                 placeholder="Votre adresse au Maroc"
//               />
//               <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//           </div>

//           <button 
//             type="submit"
//             disabled={loading}
//             className="md:col-span-2 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400 mt-4"
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.register')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validators';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { Mail, Lock, User, Phone, MapPin, Building2, Loader2 } from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/register', {
        nom:          data.name,
        email:        data.email,
        mot_de_passe: data.password,
        telephone:    data.phone  || null,
        adresse:      data.address || null,
        ville:        data.ville  || null,
      });

      const rawData = typeof response.data === 'string'
        ? JSON.parse(response.data.trim().replace(/^\uFEFF/, ''))
        : response.data;

      const { user, token } = rawData.data;

      const normalizedUser = { ...user, name: user.nom };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      dispatch(loginSuccess({ user: normalizedUser, token }));
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      dispatch(loginFailure(message));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register')}</h1>
          <p className="text-gray-500">
            {t('auth.has_account')}{' '}
            <Link to="/login" className="text-emerald-600 font-semibold">{t('auth.login')}</Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nom */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.name')}</label>
            <div className="relative">
              <input
                type="text"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="Votre nom complet"
              />
              <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.email')}</label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="exemple@email.com"
              />
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.password')}</label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.confirm_password')}</label>
            <div className="relative">
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.phone')}</label>
            <div className="relative">
              <input
                type="text"
                {...register('phone')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
                placeholder="+212 6XX XXX XXX"
              />
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.city') || 'Ville'}</label>
            <div className="relative">
              <input
                type="text"
                {...register('ville')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.ville ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="Casablanca, Rabat, Marrakech..."
              />
              <Building2 className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville.message}</p>}
          </div>

          {/* Adresse */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.address')}</label>
            <div className="relative">
              <input
                type="text"
                {...register('address')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
                placeholder="Votre adresse au Maroc"
              />
              <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400 mt-4"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { registerSchema } from '../utils/validators';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import { Mail, Lock, User, Phone, MapPin, Loader2 } from 'lucide-react';

// const RegisterPage = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useAuth();

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data) => {
//     dispatch(loginStart());
//     try {
//       // Mock API call
//       setTimeout(() => {
//         const mockUser = { id: 1, name: data.name, email: data.email, role: 'user' };
//         dispatch(loginSuccess({ user: mockUser, token: 'mock-jwt-token' }));
//         navigate('/');
//       }, 1000);
//     } catch (err) {
//       dispatch(loginFailure(err.message));
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-8">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register')}</h1>
//           <p className="text-gray-500">{t('auth.has_account')} <Link to="/login" className="text-emerald-600 font-semibold">{t('auth.login')}</Link></p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.name')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('name')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="Votre nom complet"
//               />
//               <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.email')}</label>
//             <div className="relative">
//               <input 
//                 type="email"
//                 {...register('email')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="exemple@email.com"
//               />
//               <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.password')}</label>
//             <div className="relative">
//               <input 
//                 type="password"
//                 {...register('password')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.confirm_password')}</label>
//             <div className="relative">
//               <input 
//                 type="password"
//                 {...register('confirmPassword')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.phone')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('phone')}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
//                 placeholder="+212 6XX XXX XXX"
//               />
//               <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.address')}</label>
//             <div className="relative">
//               <input 
//                 type="text"
//                 {...register('address')}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-emerald-200 focus:border-emerald-500 transition"
//                 placeholder="Votre adresse au Maroc"
//               />
//               <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//           </div>

//           <button 
//             type="submit"
//             disabled={loading}
//             className="md:col-span-2 w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400 mt-4"
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.register')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
