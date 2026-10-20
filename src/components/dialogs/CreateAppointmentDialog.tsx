import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Appointment } from '../../features/appointments/types';
import { useCreateAppointment } from '../../features/appointments/api/useCreateAppointment';

export default function CreateAppointmentDialog({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { mutateAsync: createAppointment, isPending } = useCreateAppointment();
    const [formData, setFormData] = useState<Partial<Appointment>>({
        patientName: '',
        doctorId: '',
        appointmentType: 'Consultation',
        appointmentDate: '',
        status: 'Scheduled'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAppointment(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-divider">
                    <h2 className="text-h3 text-text-primary">{t('dialogs.createAppointment.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col max-h-full">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createAppointment.patientName')}</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.patientName} 
                                onChange={e => setFormData({ ...formData, patientName: e.target.value })} 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createAppointment.doctor')}</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.doctorId} 
                                onChange={e => setFormData({ ...formData, doctorId: e.target.value })} 
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createAppointment.dateTime')}</label>
                                <input 
                                    required
                                    type="datetime-local"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.appointmentDate as string} 
                                    onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createAppointment.type')}</label>
                                <select 
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.appointmentType} 
                                    onChange={e => setFormData({ ...formData, appointmentType: e.target.value })}
                                >
                                    <option value="Consultation">{t('dialogs.createAppointment.consultation')}</option>
                                    <option value="Follow-up">{t('dialogs.createAppointment.followUp')}</option>
                                    <option value="Procedure">{t('dialogs.createAppointment.procedure')}</option>
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
                            {isPending ? t('dialogs.createAppointment.scheduling') : t('dialogs.createAppointment.schedule')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
