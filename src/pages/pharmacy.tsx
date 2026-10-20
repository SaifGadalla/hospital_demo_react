import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdMedication, MdPending, MdCheckCircle, MdList, MdCancel, MdCheckCircleOutline } from 'react-icons/md';

import { usePrescriptions } from '../features/pharmacy/api/usePrescriptions';
import CreatePrescriptionDialog from '../components/dialogs/CreatePrescriptionDialog';

export default function Pharmacy() {
    const { data, isLoading } = usePrescriptions();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { t } = useTranslation();

    // Dialog States
    const [dispenseTarget, setDispenseTarget] = useState<any | null>(null);
    const [cancelTarget, setCancelTarget] = useState<any | null>(null);

    const prescriptions = data?.items || [];

    // Filter logic
    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesSearch = p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.prescriptionNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? p.status?.toLowerCase() === statusFilter.toLowerCase() : true;
        return matchesSearch && matchesStatus;
    });

    // Statistics logic
    const totalRx = prescriptions.length;
    const pendingRx = prescriptions.filter(p => p.status === 'Pending').length;
    const dispensedRx = prescriptions.filter(p => p.status === 'Dispensed').length;
    const totalItems = prescriptions.reduce((sum, p) => sum + (p.items?.length || 0), 0);

    // Actions
    const confirmDispense = () => {
        if (!dispenseTarget) return;
        // Mock action
        setDispenseTarget(null);
    };

    const confirmCancel = () => {
        if (!cancelTarget) return;
        // Mock action
        setCancelTarget(null);
    };

    const columns: AppColumn[] = [
        { label: t('pharmacy.columns.rxNumber'), width: 120 },
        { label: t('pharmacy.columns.date'), width: 120 },
        { label: t('pharmacy.columns.patient'), flex: 1.5 },
        { label: t('pharmacy.columns.diagnosis'), flex: 1.5 },
        { label: t('pharmacy.columns.items'), flex: 2 },
        { label: t('pharmacy.columns.status'), width: 110 },
        { label: t('pharmacy.columns.actions'), width: 110 },
    ];

    const rows: AppDataRow[] = filteredPrescriptions.map(p => {
        const itemsSummary = p.items && p.items.length > 0
            ? p.items.map((item: any) => `${item.medicationName} ${item.dosage}`).join(', ')
            : t('common.noItems');

        return {
            id: p.id,
            cells: [
                <span className="text-bodyMedium font-mono text-text-primary">{p.prescriptionNumber}</span>,
                <span className="text-bodyMedium text-text-primary">{p.prescriptionDate?.toString()}</span>,
                <span className="text-bodyMedium font-medium text-text-primary">{p.patientId}</span>,
                <span className="text-bodyMedium text-text-primary">{p.diagnosis}</span>,
                <span className="text-bodyMedium text-text-primary truncate" title={itemsSummary}>{itemsSummary}</span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${p.status === 'Dispensed' ? 'bg-success/20 text-success' :
                    p.status === 'Pending' ? 'bg-warning/20 text-warning' :
                        'bg-error/20 text-error'
                    }`}>
                    {p.status}
                </span>,
                <div className="flex items-center gap-1">
                    {p.status === 'Pending' && (
                        <button
                            onClick={() => setDispenseTarget(p)}
                            className="p-2 text-success hover:bg-success/10 rounded-full transition-colors"
                            title={t('pharmacy.dispense')}
                        >
                            <MdCheckCircleOutline size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => setCancelTarget(p)}
                        disabled={p.status === 'Cancelled'}
                        className={`p-2 rounded-full transition-colors ${p.status === 'Cancelled' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        title={t('pharmacy.cancelPrescription')}
                    >
                        <MdCancel size={20} />
                    </button>
                </div>
            ]
        };
    });

    return (
        <>
            <AppPage
                title={t('pharmacy.title')}
                description={t('pharmacy.description')}
                mainButtonTitle={t('pharmacy.newPrescription')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title={t('pharmacy.totalRx')} value={totalRx} icon={<MdMedication size={24} />} />,
                    <NumberCard key="pending" title={t('pharmacy.pending')} value={pendingRx} icon={<MdPending size={24} />} />,
                    <NumberCard key="dispensed" title={t('pharmacy.dispensed')} value={dispensedRx} icon={<MdCheckCircle size={24} />} />,
                    <NumberCard key="items" title={t('pharmacy.lineItems')} value={totalItems} icon={<MdList size={24} />} />,
                ]}
                hasSearch={true}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                secondarySearchHeaderWidgets={[
                    <select
                        key="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                    >
                        <option value="">{t('common.allStatuses')}</option>
                        <option value="Cancelled">{t('common.cancel')}</option>
                        <option value="Dispensed">{t('pharmacy.dispensed')}</option>
                        <option value="Pending">{t('pharmacy.pending')}</option>
                    </select>
                ]}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">{t('pharmacy.loadingPrescriptions')}</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreatePrescriptionDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* Dispense Confirmation Dialog */}
            {dispenseTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('pharmacy.dispensePrescription')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('pharmacy.dispenseMessage', { number: dispenseTarget.prescriptionNumber })}
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setDispenseTarget(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={confirmDispense}
                                className="px-5 py-2 rounded-xl text-buttonText text-success hover:bg-success/10 transition-colors"
                            >
                                {t('pharmacy.dispense')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('pharmacy.cancelPrescription')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('pharmacy.cancelMessage', { number: cancelTarget.prescriptionNumber })}
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelTarget(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.no')}
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                {t('common.yesCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
