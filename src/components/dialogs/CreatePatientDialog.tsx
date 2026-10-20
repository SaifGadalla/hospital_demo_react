import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Patient } from '../../features/patients/types/index';
import { useCreatePatient } from '../../features/patients/api/useCreatePatient';

export default function CreatePatientDialog({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { mutateAsync: createPatient, isPending } = useCreatePatient();
    const [formData, setFormData] = useState<Partial<Patient>>({
        fullName: '',
        email: '',
        mobile: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodType: 'O+',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPatient(formData);
            onClose();
        } catch (error) {
            console.error(error);
            // Handle error (e.g. show toast)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-divider">
                    <h2 className="text-h3 text-text-primary">{t('dialogs.createPatient.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col max-h-full">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.fullName')}</label>
                            <input
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.email')}</label>
                            <input
                                type="email"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.mobilePhone')}</label>
                            <input
                                required
                                type="tel"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.mobile}
                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.dateOfBirth')}</label>
                                <input
                                    required
                                    type="date"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.dateOfBirth as string}
                                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.gender')}</label>
                                <select
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="Male">{t('common.male')}</option>
                                    <option value="Female">{t('common.female')}</option>
                                    <option value="Other">{t('common.other')}</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createPatient.bloodType')}</label>
                                <select
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.bloodType}
                                    onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-divider flex justify-end gap-3">
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
                            {isPending ? t('common.saving') : t('dialogs.createPatient.savePatient')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
