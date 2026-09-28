import { useState } from 'react';
import type { ErRegistration } from '../../features/er/types';
import { useRegisterER } from '../../features/er/api/useRegisterER';

export default function CreateERRegistrationDialog({ onClose }: { onClose: () => void }) {
    const { mutateAsync: registerER, isPending } = useRegisterER();
    const [formData, setFormData] = useState<Partial<ErRegistration>>({
        patientName: '',
        arrivalMode: 'Ambulance',
        chiefComplaint: '',
        triageLevel: 3,
        status: 'Waiting'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerER(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">Register ER Arrival</h2>
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
                            <label className="text-bodySmall text-text-secondary">Arrival Mode</label>
                            <select 
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.arrivalMode} 
                                onChange={e => setFormData({ ...formData, arrivalMode: e.target.value })}
                            >
                                <option value="Ambulance">Ambulance</option>
                                <option value="Walk-in">Walk-in</option>
                                <option value="Transfer">Transfer</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Chief Complaint</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.chiefComplaint} 
                                onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })} 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Triage Level (1-5)</label>
                            <input 
                                required
                                type="number"
                                min={1}
                                max={5}
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.triageLevel} 
                                onChange={e => setFormData({ ...formData, triageLevel: parseInt(e.target.value) || undefined })} 
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
                            {isPending ? 'Registering...' : 'Register Arrival'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
