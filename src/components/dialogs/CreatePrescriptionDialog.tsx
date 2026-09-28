import { useState } from 'react';
import type { Prescription, PrescriptionItem } from '../../features/pharmacy/types';
import { useCreatePrescription } from '../../features/pharmacy/api/useCreatePrescription';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function CreatePrescriptionDialog({ onClose }: { onClose: () => void }) {
    const { mutateAsync: createPrescription, isPending } = useCreatePrescription();
    const [formData, setFormData] = useState<Partial<Prescription>>({
        patientId: '',
        doctorId: '',
        prescriptionDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        status: 'Pending',
        items: []
    });

    const [currentItem, setCurrentItem] = useState<Partial<PrescriptionItem>>({
        medicationName: '',
        dosage: '',
        frequency: '',
        durationDays: 7
    });

    const handleAddItem = () => {
        if (!currentItem.medicationName || !currentItem.dosage) return;

        setFormData(prev => ({
            ...prev,
            items: [...(prev.items || []), currentItem as PrescriptionItem]
        }));

        setCurrentItem({
            medicationName: '',
            dosage: '',
            frequency: '',
            durationDays: 7
        });
    };

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPrescription(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">New Prescription</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Patient ID</label>
                                <input
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.patientId}
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Doctor ID</label>
                                <input
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.doctorId}
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Date</label>
                                <input
                                    required
                                    type="date"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.prescriptionDate as string}
                                    onChange={e => setFormData({ ...formData, prescriptionDate: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Diagnosis</label>
                                <input
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                    value={formData.diagnosis}
                                    onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="border-t border-divider my-2 pt-4">
                            <h4 className="text-bodyMedium font-medium text-text-primary mb-3">Medications</h4>

                            {formData.items && formData.items.length > 0 && (
                                <div className="flex flex-col gap-2 mb-4">
                                    {formData.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-surface-elevated border border-border-theme p-3 rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="text-bodyMedium font-medium text-text-primary">{item.medicationName} ({item.dosage})</span>
                                                <span className="text-caption text-text-secondary">{item.frequency} for {item.durationDays} days</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col gap-3 bg-surface-elevated p-4 rounded-xl border border-border-theme">
                                <div className="flex gap-3">
                                    <input
                                        placeholder="Medication Name"
                                        className="flex-1 bg-surface border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        value={currentItem.medicationName}
                                        onChange={e => setCurrentItem({ ...currentItem, medicationName: e.target.value })}
                                    />
                                    <input
                                        placeholder="Dosage (e.g. 500mg)"
                                        className="w-1/3 bg-surface border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        value={currentItem.dosage}
                                        onChange={e => setCurrentItem({ ...currentItem, dosage: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        placeholder="Frequency (e.g. BID)"
                                        className="flex-1 bg-surface border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        value={currentItem.frequency}
                                        onChange={e => setCurrentItem({ ...currentItem, frequency: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Days"
                                        className="w-24 bg-surface border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                                        value={currentItem.durationDays}
                                        onChange={e => setCurrentItem({ ...currentItem, durationDays: parseInt(e.target.value) || 0 })}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="flex items-center gap-1 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                                    >
                                        <MdAdd size={18} /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-divider flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !formData.items?.length}
                            className="px-6 py-2 rounded-xl text-buttonText bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Create Prescription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
