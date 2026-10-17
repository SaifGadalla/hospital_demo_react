import ThemeToggleButton from './theme-toggle-button.tsx';
import LanguageToggleButton from './language-toggle-button.tsx';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t } = useTranslation();

    return (
        <header className="h-20 px-6 flex items-center justify-between bg-surface border-b border-divider">
            <div className="w-full max-w-md">
                <input
                    type="text"
                    placeholder={t('searchPlaceholder', 'Search global...')}
                    className="w-full bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
            </div>
            <div className="flex items-center gap-4">
                <LanguageToggleButton />
                <ThemeToggleButton color={undefined} size={undefined} />
            </div>
        </header>
    );
}