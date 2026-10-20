import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const resources = {
    ar: {
        translation: ar
    },
    en: {
        translation: en
    },
};

const savedLng = typeof window !== 'undefined' ? (localStorage.getItem('app_language') || 'en') : 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLng,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

if (typeof document !== 'undefined') {
    document.documentElement.dir = savedLng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLng;
}

i18n.on('languageChanged', (lng) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('app_language', lng);
    }
    if (typeof document !== 'undefined') {
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    }
});

export default i18n;