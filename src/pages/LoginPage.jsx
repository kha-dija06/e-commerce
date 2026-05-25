// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '../utils/validators';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import { Mail, Lock, Loader2 } from 'lucide-react';

// const LoginPage = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loading, error } = useAuth();

//   const from = location.state?.from?.pathname || "/";

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data) => {
//     dispatch(loginStart());
//     try {
//       // Mock API call
//       setTimeout(() => {
//         const mockUser = { id: 1, name: 'Khadija', email: data.email, role: 'admin' };
//         dispatch(loginSuccess({ user: mockUser, token: 'mock-jwt-token' }));
//         navigate(from, { replace: true });
//       }, 1000);
//     } catch (err) {
//       dispatch(loginFailure(err.message));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
//           <p className="text-gray-500">{t('auth.no_account')} <Link to="/register" className="text-emerald-600 font-semibold">{t('auth.register')}</Link></p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
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
//             <div className="flex justify-between mb-2">
//               <label className="text-sm font-semibold text-gray-700">{t('auth.password')}</label>
//               <Link to="/forgot-password" size="sm" className="text-xs text-emerald-600 hover:underline">
//                 {t('auth.forgot_password')}
//               </Link>
//             </div>
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

//           <button 
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.login')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '../utils/validators';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import { Mail, Lock, Loader2 } from 'lucide-react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// const LoginPage = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loading, error } = useAuth();

//   const from = location.state?.from?.pathname || '/';

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data) => {
//     dispatch(loginStart());
//     try {
//       const response = await api.post('/login', {
//         email: data.email,
//         mot_de_passe: data.password,
//       });

//       const { user, token } = response.data.data;

//       // ✅ API katraj3 "nom" — khasna normalize l "name" bash navbar tkhdam
//       const normalizedUser = {
//         ...user,
//         name: user.nom,  // nom → name
//       };

//       localStorage.setItem('token', token);
//       dispatch(loginSuccess({ user: normalizedUser, token }));

//       // ✅ Redirect selon role
//       if (normalizedUser.role === 'administrateur') {
//         navigate('/admin', { replace: true });
//       } else {
//         navigate(from, { replace: true });
//       }

//     } catch (err) {
//       const message = err.response?.data?.message || 'Email ou mot de passe incorrect';
//       dispatch(loginFailure(message));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
//           <p className="text-gray-500">
//             {t('auth.no_account')}{' '}
//             <Link to="/register" className="text-emerald-600 font-semibold">
//               {t('auth.register')}
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               {t('auth.email')}
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 {...register('email')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.email
//                     ? 'border-red-500 focus:ring-red-200'
//                     : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="exemple@email.com"
//               />
//               <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <div className="flex justify-between mb-2">
//               <label className="text-sm font-semibold text-gray-700">
//                 {t('auth.password')}
//               </label>
//               <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
//                 {t('auth.forgot_password')}
//               </Link>
//             </div>
//             <div className="relative">
//               <input
//                 type="password"
//                 {...register('password')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.password
//                     ? 'border-red-500 focus:ring-red-200'
//                     : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.login')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '../utils/validators';
// import { Link, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
// import { Mail, Lock, Loader2 } from 'lucide-react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// const LoginPage = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { loading, error } = useAuth();

//   const from = location.state?.from?.pathname || '/';

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data) => {
//     dispatch(loginStart());
//     try {
//       const response = await api.post('/login', {
//         email: data.email,
//         mot_de_passe: data.password,
//       });

//       const { user, token } = response.data.data;

//       const normalizedUser = {
//         ...user,
//         name: user.nom,
//       };

//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(normalizedUser));
//       dispatch(loginSuccess({ user: normalizedUser, token }));

//       // ✅ Hard redirect — kayforce reload complet w Redux state ytkhzen
//       if (normalizedUser.role === 'administrateur') {
//         window.location.href = '/admin';
//       } else {
//         window.location.href = from || '/';
//       }

//     } catch (err) {
//       const message = err.response?.data?.message || 'Email ou mot de passe incorrect';
//       dispatch(loginFailure(message));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
//           <p className="text-gray-500">
//             {t('auth.no_account')}{' '}
//             <Link to="/register" className="text-emerald-600 font-semibold">
//               {t('auth.register')}
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               {t('auth.email')}
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 {...register('email')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.email
//                     ? 'border-red-500 focus:ring-red-200'
//                     : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="exemple@email.com"
//               />
//               <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <div className="flex justify-between mb-2">
//               <label className="text-sm font-semibold text-gray-700">
//                 {t('auth.password')}
//               </label>
//               <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
//                 {t('auth.forgot_password')}
//               </Link>
//             </div>
//             <div className="relative">
//               <input
//                 type="password"
//                 {...register('password')}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                   errors.password
//                     ? 'border-red-500 focus:ring-red-200'
//                     : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//                 }`}
//                 placeholder="••••••••"
//               />
//               <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
//           >
//             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.login')}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validators';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { Mail, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/login', {
        email: data.email,
        mot_de_passe: data.password,
      });

      // ✅ Fix BOM + parse si response est string
      const responseData = typeof response.data === 'string'
        ? JSON.parse(response.data.trim().replace(/^\uFEFF/, ''))
        : response.data;

      const { user, token } = responseData.data; // ✅ responseData machi response.data

      const normalizedUser = {
        ...user,
        name: user.nom,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      dispatch(loginSuccess({ user: normalizedUser, token }));

      setTimeout(() => {
        if (normalizedUser.role === 'administrateur') {
          window.location.href = '/admin';
        } else {
          window.location.href = from || '/';
        }
      }, 100);

    } catch (err) {
      const message = err.response?.data?.message || t('errors.generic');
      dispatch(loginFailure(message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
          <p className="text-gray-500">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-emerald-600 font-semibold">
              {t('auth.register')}
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="exemple@email.com"
              />
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                {t('auth.forgot_password')}
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
                }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;