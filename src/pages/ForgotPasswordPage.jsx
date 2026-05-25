import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft, CheckCircle, Lock, KeyRound } from 'lucide-react';
import api from '../services/api';

const forgotSchema = z.object({
  email: z.string().email('Email invalide'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'Le code doit contenir 6 chiffres'),
});

const resetSchema = z.object({
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// ── Step 1: Email ─────────────────────────────────────────────
const EmailStep = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/forgot-password', { email: data.email });
      onSuccess(data.email);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="text-emerald-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.forgot_password')}</h1>
        <p className="text-gray-500 text-sm">{t('auth.forgot_desc')}</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.email')}</label>
          <div className="relative">
            <input
              type="email"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                errors.email ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
              }`}
              placeholder="exemple@email.com"
            />
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:bg-emerald-400"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.send_token')}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link to="/login" className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1">
          <ArrowLeft size={16} /> {t('auth.back_to_login')}
        </Link>
      </div>
    </>
  );
};

// ── Step 2: Code 6 chiffres ───────────────────────────────────
const CodeStep = ({ email, onSuccess, onResend }) => {
  const { t } = useTranslation();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [resending, setResending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(codeSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/check-token', { email, token: data.code });
      onSuccess(data.code);
    } catch (err) {
      setError(err.response?.data?.message || 'Code incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/forgot-password', { email });
      setError(null);
    } catch {}
    finally { setResending(false); }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="text-emerald-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérification</h1>
        <p className="text-gray-500 text-sm">
          Code envoyé à <strong>{email}</strong>
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Code à 6 chiffres</label>
          <input
            type="text"
            maxLength={6}
            {...register('code')}
            className={`w-full text-center text-3xl font-bold tracking-widest py-4 border rounded-xl outline-none transition ${
              errors.code ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
            }`}
            placeholder="000000"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1 text-center">{errors.code.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:bg-emerald-400"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Vérifier le code'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-emerald-600 hover:underline font-semibold"
        >
          {resending ? 'Envoi...' : 'Renvoyer le code'}
        </button>
      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1">
          <ArrowLeft size={16} /> {t('auth.back_to_login')}
        </Link>
      </div>
    </>
  );
};

// ── Step 3: New password ──────────────────────────────────────
const ResetStep = ({ email, code, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await api.post('/reset-password', {
        email,
        token:                 code,
        password:              data.password,
        password_confirmation: data.confirmPassword,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-emerald-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.new_password')}</h1>
        <p className="text-gray-500 text-sm">{t('auth.new_password_desc')}</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.new_password')}</label>
          <div className="relative">
            <input
              type="password"
              {...register('password')}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                errors.password ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
              }`}
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('auth.confirm_password')}</label>
          <div className="relative">
            <input
              type="password"
              {...register('confirmPassword')}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'
              }`}
              placeholder="••••••••"
            />
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:bg-emerald-400"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.reset_password')}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link to="/login" className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1">
          <ArrowLeft size={16} /> {t('auth.back_to_login')}
        </Link>
      </div>
    </>
  );
};

// ── Step 4: Success ───────────────────────────────────────────
const SuccessStep = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-emerald-600" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.password_changed')}</h1>
        <p className="text-gray-500 text-sm">{t('auth.password_changed_desc')}</p>
      </div>
      <Link
        to="/login"
        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center"
      >
        {t('auth.login')}
      </Link>
    </>
  );
};

// ── Main ──────────────────────────────────────────────────────
const ForgotPasswordPage = () => {
  const [step, setStep]   = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode]   = useState('');

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['email', 'code', 'reset', 'success'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                s === step ? 'bg-emerald-600 w-6' :
                ['email', 'code', 'reset', 'success'].indexOf(step) > i ? 'bg-emerald-400' : 'bg-gray-200'
              }`} />
            </div>
          ))}
        </div>

        {step === 'email' && (
          <EmailStep onSuccess={(e) => { setEmail(e); setStep('code'); }} />
        )}
        {step === 'code' && (
          <CodeStep
            email={email}
            onSuccess={(c) => { setCode(c); setStep('reset'); }}
          />
        )}
        {step === 'reset' && (
          <ResetStep email={email} code={code} onSuccess={() => setStep('success')} />
        )}
        {step === 'success' && <SuccessStep />}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Mail, Loader2, ArrowLeft, CheckCircle, Copy, Check, Lock } from 'lucide-react';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// // ── Zod schemas ───────────────────────────────────────────────
// const forgotSchema = z.object({
//   email: z.string().email('Email invalide'),
// });

// const resetSchema = z.object({
//   password: z.string().min(6, 'Minimum 6 caractères'),
//   confirmPassword: z.string(),
// }).refine((d) => d.password === d.confirmPassword, {
//   message: 'Les mots de passe ne correspondent pas',
//   path: ['confirmPassword'],
// });

// // ── Step 1: Email form ────────────────────────────────────────
// const EmailStep = ({ onSuccess }) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState(null);

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(forgotSchema),
//   });

//   const onSubmit = async (data) => {
//     setError(null);
//     setLoading(true);
//     try {
//       const response = await api.post('/forgot-password', { email: data.email });
//       if (response.data.success && response.data.data) {
//         onSuccess(response.data.data); // { token, email }
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           {t('auth.forgot_password')}
//         </h1>
//         <p className="text-gray-500">
//           {t('auth.forgot_desc')}
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {t('auth.email')}
//           </label>
//           <div className="relative">
//             <input
//               type="email"
//               {...register('email')}
//               className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                 errors.email
//                   ? 'border-red-500 focus:ring-red-200'
//                   : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//               }`}
//               placeholder="exemple@email.com"
//             />
//             <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//           </div>
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
//         >
//           {loading
//             ? <Loader2 className="animate-spin mr-2" size={20} />
//             : t('auth.send_token')}
//         </button>
//       </form>

//       <div className="text-center mt-6">
//         <Link
//           to="/login"
//           className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1 transition"
//         >
//           <ArrowLeft size={16} />
//           {t('auth.back_to_login')}
//         </Link>
//       </div>
//     </>
//   );
// };

// // ── Step 2: Token display ─────────────────────────────────────
// const TokenStep = ({ tokenData, onContinue }) => {
//   const { t } = useTranslation();
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(tokenData.token);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <>
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <CheckCircle className="text-emerald-600" size={32} />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           {t('auth.token_created')}
//         </h1>
//         <p className="text-gray-500 text-sm">
//           {t('auth.token_desc')}
//         </p>
//       </div>

//       <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
//         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
//           {t('auth.your_token')}
//         </p>
//         <div className="flex items-center gap-2">
//           <code className="flex-1 text-xs text-gray-700 break-all font-mono leading-relaxed">
//             {tokenData.token}
//           </code>
//           <button
//             onClick={handleCopy}
//             className="p-2 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
//           >
//             {copied
//               ? <Check size={16} className="text-emerald-600" />
//               : <Copy size={16} className="text-gray-500" />}
//           </button>
//         </div>
//         <p className="text-xs text-amber-600 mt-3 font-medium">
//           ⚠ {t('auth.token_expires')}
//         </p>
//       </div>

//       <button
//         onClick={onContinue}
//         className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center"
//       >
//         {t('auth.reset_password')} →
//       </button>

//       <div className="text-center mt-6">
//         <Link
//           to="/login"
//           className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1 transition"
//         >
//           <ArrowLeft size={16} />
//           {t('auth.back_to_login')}
//         </Link>
//       </div>
//     </>
//   );
// };

// // ── Step 3: Reset password form ───────────────────────────────
// const ResetStep = ({ tokenData, onSuccess }) => {
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState(null);

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(resetSchema),
//   });

//   const onSubmit = async (data) => {
//     setError(null);
//     setLoading(true);
//     try {
//       await api.post('/reset-password', {
//         email:                 tokenData.email,
//         token:                 tokenData.token,
//         password:              data.password,
//         password_confirmation: data.confirmPassword,
//       });
//       onSuccess();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           {t('auth.new_password')}
//         </h1>
//         <p className="text-gray-500 text-sm">
//           {t('auth.new_password_desc')}
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Email readonly */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {t('auth.email')}
//           </label>
//           <div className="relative">
//             <input
//               type="email"
//               disabled
//               value={tokenData.email}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none bg-gray-50 disabled:opacity-60"
//             />
//             <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
//           </div>
//         </div>

//         {/* New password */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {t('auth.new_password')}
//           </label>
//           <div className="relative">
//             <input
//               type="password"
//               {...register('password')}
//               className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                 errors.password
//                   ? 'border-red-500 focus:ring-red-200'
//                   : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//               }`}
//               placeholder="••••••••"
//             />
//             <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//           </div>
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//           )}
//         </div>

//         {/* Confirm password */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             {t('auth.confirm_password')}
//           </label>
//           <div className="relative">
//             <input
//               type="password"
//               {...register('confirmPassword')}
//               className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition ${
//                 errors.confirmPassword
//                   ? 'border-red-500 focus:ring-red-200'
//                   : 'border-gray-200 focus:ring-emerald-200 focus:border-emerald-500'
//               }`}
//               placeholder="••••••••"
//             />
//             <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
//           </div>
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center disabled:bg-emerald-400"
//         >
//           {loading
//             ? <Loader2 className="animate-spin mr-2" size={20} />
//             : t('auth.reset_password')}
//         </button>
//       </form>

//       <div className="text-center mt-6">
//         <Link
//           to="/login"
//           className="text-sm text-gray-500 hover:text-emerald-600 font-semibold flex items-center justify-center gap-1 transition"
//         >
//           <ArrowLeft size={16} />
//           {t('auth.back_to_login')}
//         </Link>
//       </div>
//     </>
//   );
// };

// // ── Step 4: Success ───────────────────────────────────────────
// const SuccessStep = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <CheckCircle className="text-emerald-600" size={32} />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           {t('auth.password_changed')}
//         </h1>
//         <p className="text-gray-500 text-sm">
//           {t('auth.password_changed_desc')}
//         </p>
//       </div>

//       <Link
//         to="/login"
//         className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center justify-center"
//       >
//         {t('auth.login')}
//       </Link>
//     </>
//   );
// };

// // ── Main component ────────────────────────────────────────────
// const ForgotPasswordPage = () => {
//   // step: 'email' | 'token' | 'reset' | 'success'
//   const [step, setStep]           = useState('email');
//   const [tokenData, setTokenData] = useState(null); // { token, email }

//   return (
//     <div className="max-w-md mx-auto mt-12">
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

//         {step === 'email' && (
//           <EmailStep
//             onSuccess={(data) => {
//               setTokenData(data);
//               setStep('token');
//             }}
//           />
//         )}

//         {step === 'token' && (
//           <TokenStep
//             tokenData={tokenData}
//             onContinue={() => setStep('reset')}
//           />
//         )}

//         {step === 'reset' && (
//           <ResetStep
//             tokenData={tokenData}
//             onSuccess={() => setStep('success')}
//           />
//         )}

//         {step === 'success' && <SuccessStep />}

//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;