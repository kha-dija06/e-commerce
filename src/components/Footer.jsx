import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto  px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-2">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-emerald-500 mb-4">MoroccoArt</h3>
            <p className="text-gray-400 max-w-md">
              {t('home.hero_subtitle')}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.about')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-emerald-500 transition">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">{t('footer.privacy')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-gray-400">Email: contact@moroccoart.ma</p>
            <p className="text-gray-400">Tel: +212 5XX XXX XXX</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>{t('footer.copyright').replace('2024', currentYear)}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
