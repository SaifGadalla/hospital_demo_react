import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitchButton() {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = i18n.language;

    const toggleDropdown = () => setIsOpen(!isOpen);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary"
                title={t('drawer.language')}
            >
                <MdLanguage className="text-xl" />
                <span className="text-bodySmall font-medium uppercase">
                    {currentLang === 'ar' ? t('langSwitch.ar') : t('langSwitch.en')}
                </span>
            </button>

            {isOpen && (
                <div className="absolute end-0 top-full mt-1 w-36 bg-surface border border-border-theme rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full text-start px-4 py-2.5 text-bodyMedium transition-colors ${
                            currentLang === 'en'
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-text-primary hover:bg-surface-elevated'
                        }`}
                    >
                        🇺🇸 English
                    </button>
                    <button
                        onClick={() => changeLanguage('ar')}
                        className={`w-full text-start px-4 py-2.5 text-bodyMedium transition-colors ${
                            currentLang === 'ar'
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-text-primary hover:bg-surface-elevated'
                        }`}
                    >
                        🇸🇦 العربية
                    </button>
                </div>
            )}
        </div>
    );
}
