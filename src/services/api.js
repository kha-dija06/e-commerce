// import axios from 'axios';
// import i18n from '../utils/i18n';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//       'Accept': 'application/json', 
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   const currentLanguage = i18n.language || 'fr';
//   config.headers['Accept-Language'] = currentLanguage;
//   return config;
// });
// api.interceptors.response.use((response) => {
//   if (typeof response.data === 'string') {
//     try {
//       response.data = JSON.parse(response.data.trim().replace(/^\uFEFF/, ''));
//     } catch (e) {}
//   }
//   // ✅ Zid hada — fix ila Axios parse JSON wlakin BOM bqat
//   if (response.data && typeof response.data === 'object') {
//     const str = JSON.stringify(response.data);
//     if (str.charCodeAt(0) === 0xFEFF || str.startsWith('\uFEFF')) {
//       try {
//         response.data = JSON.parse(str.replace(/^\uFEFF/, ''));
//       } catch (e) {}
//     }
//   }
//   return response;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default api;
import axios from 'axios';
import i18n from '../utils/i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // ✅ Fix BOM qbel ma Axios yparse JSON
  transformResponse: [
    (data) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data.trim().replace(/^\uFEFF/, ''));
        } catch (e) {
          return data;
        }
      }
      return data;
    }
  ],
});

// Request interceptor — token + language
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Accept-Language'] = i18n.language || 'fr';
  return config;
});

export default api;


