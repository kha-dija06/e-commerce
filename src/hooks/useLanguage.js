import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../store/slices/languageSlice';
import api from '../services/api';
import { useEffect } from 'react';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language.current);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const changeLang = async (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    localStorage.setItem('i18nextLng', lang);

    if (isAuthenticated) {
      try {
        await api.put('/language', { language: lang });
      } catch (error) {
        console.error('Failed to sync language with API', error);
      }
    }
  };

  return {
    currentLang,
    changeLang,
    isRTL: currentLang === 'ar',
  };
};
