import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources: Resource = {
  pt: { translation: pt },
  'pt-BR': { translation: pt },
  es: { translation: es },
  'es-ES': { translation: es },
  'es-419': { translation: es }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageTag ?? 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: { escapeValue: false },
    returnNull: false
  });

export default i18n;
