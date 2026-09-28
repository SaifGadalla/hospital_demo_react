import { useState } from 'react';
import type { Admission } from '../../features/patients/types/index';
import { useAdmitPatient } from '../../features/clinical/api/useAdmitPatient';

export default function CreateAdmissionDialog({ onClose }: { onClose: () => void }) {
    const { mutateAsync: admitPatient, isPending } = useAdmitPatient();
    const [formData, setFormData] = useState<Partial<Admission>>({
        patientName: '',
        bedNumber: '',
        admissionDiagnosis: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'Admitted'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await admitPatient(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">Admit Patient</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Patient Name</label>
                            <input
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.patientName}
                                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Bed Number (e.g. Ward A - 101)</label>
                            <input
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.bedNumber}
                                onChange={e => setFormData({ ...formData, bedNumber: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Diagnosis</label>
                            <input
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.admissionDiagnosis}
                                onChange={e => setFormData({ ...formData, admissionDiagnosis: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Date</label>
                            <input
                                required
                                type="date"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                value={formData.admissionDate as string}
                                onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="p-4 border-t border-divider flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 rounded-xl text-buttonText bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Admitting...' : 'Admit Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
