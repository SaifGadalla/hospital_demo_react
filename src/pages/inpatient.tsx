import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdBed, MdHotel, MdLocalHotel, MdPercent, MdTransferWithinAStation, MdLocalHospital } from 'react-icons/md';

import { useAdmissions } from '../features/clinical/api/useAdmissions';
import CreateAdmissionDialog from '../components/dialogs/CreateAdmissionDialog';

export default function Inpatient() {
    const { t } = useTranslation();
    const { data, isLoading } = useAdmissions();
    const [transferTarget, setTransferTarget] = useState<any | null>(null);
    const [transferReason, setTransferReason] = useState('');
    const [dischargeTarget, setDischargeTarget] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const admissions = data?.items || [];

    // Statistics logic
    const totalBeds = 30;
    const activeAdmissions = admissions.filter(a => a.status === 'Admitted').length;
    const bedsAvailable = totalBeds - activeAdmissions;
    const occupancyRate = Math.round((activeAdmissions / totalBeds) * 100);

    // Actions
    const handleTransfer = () => {
        if (!transferTarget) return;
        // Mock UI action
        setTransferTarget(null);
        setTransferReason('');
    };

    const handleDischarge = () => {
        if (!dischargeTarget) return;
        // Mock UI action
        setDischargeTarget(null);
    };

    const columns: AppColumn[] = [
        { label: t('inpatient.columns.admissionNumber'), width: 140 },
        { label: t('inpatient.columns.patient'), flex: 1.5 },
        { label: t('inpatient.columns.bed'), width: 130 },
        { label: t('inpatient.columns.diagnosis'), flex: 1.5 },
        { label: t('inpatient.columns.dateAdmitted'), width: 120 },
        { label: t('inpatient.columns.status'), width: 110 },
        { label: t('inpatient.columns.actions'), width: 100 },
    ];

    const rows: AppDataRow[] = admissions.map(a => ({
        id: a.id,
        cells: [
            <span className="text-bodyMedium font-mono text-text-primary">{a.admissionNumber}</span>,
            <span className="text-bodyMedium font-medium text-text-primary">{a.patientName}</span>,
            <span className="text-bodyMedium text-text-primary">{a.bedNumber}</span>,
            <span className="text-bodyMedium text-text-primary">{a.admissionDiagnosis}</span>,
            <span className="text-bodyMedium text-text-primary">{a.admissionDate?.toString()}</span>,
            <span className={`text-caption font-bold px-2 py-1 rounded ${a.status === 'Admitted' ? 'bg-success/20 text-success' :
                    a.status === 'Discharged' ? 'bg-primary/10 text-primary' :
                        'bg-warning/20 text-warning'
                }`}>
                {a.status}
            </span>,
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setTransferTarget(a)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={t('inpatient.transfer')}
                >
                    <MdTransferWithinAStation size={20} />
                </button>
                <button
                    onClick={() => setDischargeTarget(a)}
                    className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                    title={t('inpatient.discharge')}
                >
                    <MdLocalHospital size={20} />
                </button>
            </div>
        ]
    }));

    return (
        <>
            <AppPage
                title={t('inpatient.title')}
                description={t('inpatient.description')}
                mainButtonTitle={t('inpatient.admitPatient')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="active" title={t('inpatient.activeAdmissions')} value={activeAdmissions} icon={<MdBed size={24} />} />,
                    <NumberCard key="occupied" title={t('inpatient.bedsOccupied')} value={activeAdmissions} icon={<MdHotel size={24} />} />,
                    <NumberCard key="available" title={t('inpatient.bedsAvailable')} value={bedsAvailable} icon={<MdLocalHotel size={24} />} />,
                    <NumberCard key="occupancy" title={t('inpatient.occupancyRate')} value={`${occupancyRate}%`} icon={<MdPercent size={24} />} />,
                ]}
                tableHeader={t('inpatient.activeAdmissions')}
                customBody={
                    <div className="bg-surface border border-border-theme rounded-xl p-4 mb-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <h4 className="text-h4 text-text-primary">{t('inpatient.wardBedMap')}</h4>
                                <div className="flex items-center gap-4 text-bodyMedium">
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success"></span>{t('inpatient.available')}</div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error"></span>{t('inpatient.occupied')}</div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning"></span>{t('inpatient.cleaning')}</div>
                                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-divider"></span>{t('inpatient.blocked')}</div>
                                </div>
                            </div>
                            <hr className="border-divider" />
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => alert('Filter by ward toast')}
                                    className="bg-primary text-text-inverse px-4 py-2 rounded-xl text-buttonText hover:bg-primary-dark transition-colors"
                                >
                                    {t('inpatient.filterByWard')}
                                </button>
                                <button
                                    onClick={() => alert('Filter by date toast')}
                                    className="bg-primary text-text-inverse px-4 py-2 rounded-xl text-buttonText hover:bg-primary-dark transition-colors"
                                >
                                    {t('inpatient.filterByDate')}
                                </button>
                            </div>
                        </div>
                    </div>
                }
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">{t('inpatient.loadingAdmissions')}</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreateAdmissionDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* Discharge Confirmation Dialog */}
            {dischargeTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('inpatient.confirmDischarge')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('inpatient.dischargeMessage', { name: dischargeTarget.patientName })}
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setDischargeTarget(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDischarge}
                                className="px-5 py-2 rounded-xl text-buttonText text-primary hover:bg-primary/10 transition-colors"
                            >
                                {t('inpatient.discharge')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Dialog */}
            {transferTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('inpatient.transferPatient')}</h2>
                            <p className="text-bodyMedium text-text-secondary mb-4">
                                {t('inpatient.transferMessage', { name: transferTarget.patientName })}
                            </p>
                            <div className="flex flex-col gap-2">
                                <label className="text-label text-text-primary">{t('inpatient.reasonForTransfer')}</label>
                                <textarea
                                    rows={2}
                                    value={transferReason}
                                    onChange={(e) => setTransferReason(e.target.value)}
                                    className="bg-surface-elevated border border-border-theme rounded-xl p-3 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => {
                                    setTransferTarget(null);
                                    setTransferReason('');
                                }}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleTransfer}
                                className="px-5 py-2 rounded-xl text-buttonText text-primary hover:bg-primary/10 transition-colors"
                            >
                                {t('inpatient.transfer')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
