import { useLanguage } from '../hooks/useLanguage';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { currentLang, changeLang } = useLanguage();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-xl border border-gray-200/50 hover:bg-white hover:shadow-sm transition-all group">
      <Globe size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
      <select
        value={currentLang}
        onChange={(e) => changeLang(e.target.value)}
        className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors appearance-none pr-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
