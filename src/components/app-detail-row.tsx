import { useTranslation } from 'react-i18next';

type AppDetailRowProps = {
    label: string;
    value?: string | null;
    labelWidth?: number | string;
};

export default function AppDetailRow({ label, value, labelWidth = 160 }: AppDetailRowProps) {
    const { t } = useTranslation();

    return (
        <div className="py-1 flex items-start">
            <div style={{ width: labelWidth }} className="shrink-0">
                <span className="text-label text-text-primary">{label}</span>
            </div>
            <div className="flex-1">
                <span className="text-bodyMedium text-text-primary">{value || t('common.notAvailable')}</span>
            </div>
        </div>
    );
}
