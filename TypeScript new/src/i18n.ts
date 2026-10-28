import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { storage } from './storage/Storage';

const savedLanguage = storage.get<string>('language') || localStorage.getItem('language') || 'ru';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: 'ru',
    ns: ['common', 'home', 'catalog', 'products', 'test'],
    defaultNS: 'common',
    backend: {
      loadPath: '/api/v1/translations/{{lng}}/{{ns}}',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

i18n.on('languageChanged', (lng) => {
  storage.set('language', lng);
  localStorage.setItem('language', lng);
});

export default i18n;
