import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const savedLang = localStorage.getItem("i18n_lang") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar }
        },
        lng: savedLang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

// Handle RTL/LTR direction and document language persistence
const applyDirection = (lang: string) => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("i18n_lang", lang);
};

applyDirection(savedLang);

i18n.on("languageChanged", (lang) => {
    applyDirection(lang);
});

export default i18n;