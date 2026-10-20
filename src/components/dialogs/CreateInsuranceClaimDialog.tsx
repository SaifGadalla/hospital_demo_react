import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InsuranceClaim } from '../../features/insurance/types';
import { useCreateInsuranceClaim } from '../../features/insurance/api/useCreateInsuranceClaim';

export default function CreateInsuranceClaimDialog({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { mutateAsync: createClaim, isPending } = useCreateInsuranceClaim();
    const [formData, setFormData] = useState<Partial<InsuranceClaim>>({
        patientId: '',
        patientName: '',
        insurancePlanId: '',
        insurancePlanName: '',
        serviceDate: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        claimedAmount: 0,
        status: 'Pending',
        diagnosisCodes: '',
        procedureCodes: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createClaim(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">{t('dialogs.createInsuranceClaim.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.patientId')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.patientId} 
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.patientName')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.patientName} 
                                    onChange={e => setFormData({ ...formData, patientName: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.insurancePlanId')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.insurancePlanId} 
                                    onChange={e => setFormData({ ...formData, insurancePlanId: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.insurancePlanName')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.insurancePlanName} 
                                    onChange={e => setFormData({ ...formData, insurancePlanName: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.serviceDate')}</label>
                            <input 
                                required
                                type="date"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.serviceDate as string} 
                                onChange={e => setFormData({ ...formData, serviceDate: e.target.value })} 
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.totalAmount')}</label>
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.totalAmount} 
                                    onChange={e => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.claimedAmount')}</label>
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.claimedAmount} 
                                    onChange={e => setFormData({ ...formData, claimedAmount: parseFloat(e.target.value) || 0 })} 
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.diagnosisCodes')}</label>
                                <input 
                                    type="text"
                                    placeholder={t('dialogs.createInsuranceClaim.diagnosisCodesPlaceholder')}
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.diagnosisCodes} 
                                    onChange={e => setFormData({ ...formData, diagnosisCodes: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.procedureCodes')}</label>
                                <input 
                                    type="text"
                                    placeholder={t('dialogs.createInsuranceClaim.procedureCodesPlaceholder')}
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.procedureCodes} 
                                    onChange={e => setFormData({ ...formData, procedureCodes: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createInsuranceClaim.notes')}</label>
                            <textarea 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary min-h-20" 
                                value={formData.notes} 
                                onChange={e => setFormData({ ...formData, notes: e.target.value })} 
                            />
                        </div>

                    </div>
                    <div className="p-4 border-t border-divider flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 rounded-xl text-buttonText bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isPending ? t('common.saving') : t('dialogs.createInsuranceClaim.submitClaim')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
