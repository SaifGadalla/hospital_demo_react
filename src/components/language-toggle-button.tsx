import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

export default function LanguageToggleButton() {
    const { i18n } = useTranslation();
    const isArabic = (i18n.language || "en").startsWith("ar");

    const toggleLanguage = () => {
        const nextLang = isArabic ? "en" : "ar";
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-theme hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium text-text-primary`}
            title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            aria-label="Toggle language"
        >
            <MdLanguage className="text-base text-primary" />
            <span>{isArabic ? "English" : "العربية"}</span>
        </button>
    );
}
