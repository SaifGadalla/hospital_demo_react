import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MedicalRecord } from '../../features/clinical/types';
import { useCreateMedicalRecord } from '../../features/clinical/api/useCreateMedicalRecord';

export default function CreateMedicalRecordDialog({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { mutateAsync: createRecord, isPending } = useCreateMedicalRecord();
    const [formData, setFormData] = useState<Partial<MedicalRecord>>({
        patientId: '',
        doctorId: '',
        visitDate: new Date().toISOString().slice(0, 16),
        diagnosisDescription: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRecord(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">{t('dialogs.createMedicalRecord.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.patientId')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.patientId} 
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.doctorId')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.doctorId} 
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.visitDate')}</label>
                                <input 
                                    required
                                    type="datetime-local"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.visitDate as string} 
                                    onChange={e => setFormData({ ...formData, visitDate: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.diagnosisDescription')}</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.diagnosisDescription} 
                                onChange={e => setFormData({ ...formData, diagnosisDescription: e.target.value })} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.subjective')}</label>
                            <textarea 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary min-h-20" 
                                value={formData.subjective} 
                                onChange={e => setFormData({ ...formData, subjective: e.target.value })} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.objective')}</label>
                            <textarea 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary min-h-20" 
                                value={formData.objective} 
                                onChange={e => setFormData({ ...formData, objective: e.target.value })} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.assessment')}</label>
                            <textarea 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary min-h-20" 
                                value={formData.assessment} 
                                onChange={e => setFormData({ ...formData, assessment: e.target.value })} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createMedicalRecord.plan')}</label>
                            <textarea 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary min-h-20" 
                                value={formData.plan} 
                                onChange={e => setFormData({ ...formData, plan: e.target.value })} 
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
                            {isPending ? t('common.saving') : t('dialogs.createMedicalRecord.saveRecord')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
