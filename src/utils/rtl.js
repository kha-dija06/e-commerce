export const setLanguageDirection = (language) => {
  if (language === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
    document.body.classList.remove('rtl');
  }
};

export const getInitialLanguage = () => {
  const saved = localStorage.getItem('i18nextLng');
  if (saved && ['fr', 'ar', 'en'].includes(saved)) return saved;
  return 'fr';
};
