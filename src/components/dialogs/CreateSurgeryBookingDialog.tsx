import { useState } from 'react';
import type { SurgeryBooking } from '../../features/surgery/types';
import { useCreateSurgeryBooking } from '../../features/surgery/api/useCreateSurgeryBooking';

export default function CreateSurgeryBookingDialog({ onClose }: { onClose: () => void }) {
    const { mutateAsync: createBooking, isPending } = useCreateSurgeryBooking();
    const [formData, setFormData] = useState<Partial<SurgeryBooking>>({
        patientId: '',
        patientName: '',
        procedureName: '',
        scheduledDate: new Date().toISOString().slice(0, 16),
        estimatedDuration: 60,
        anesthesiaType: 'General',
        operatingRoomNumber: '',
        priority: 'Routine',
        status: 'Scheduled',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBooking(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">Book Surgery</h2>
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
                                <label className="text-bodySmall text-text-secondary">Patient Name</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.patientName} 
                                    onChange={e => setFormData({ ...formData, patientName: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Procedure</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.procedureName} 
                                onChange={e => setFormData({ ...formData, procedureName: e.target.value })} 
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Scheduled Date & Time</label>
                                <input 
                                    required
                                    type="datetime-local"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.scheduledDate as string} 
                                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Estimated Duration (mins)</label>
                                <input 
                                    required
                                    type="number"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.estimatedDuration} 
                                    onChange={e => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })} 
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Priority</label>
                                <select 
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.priority} 
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Routine">Routine</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">Operating Room</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. OR-1"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.operatingRoomNumber} 
                                    onChange={e => setFormData({ ...formData, operatingRoomNumber: e.target.value })} 
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Anesthesia Type</label>
                            <input 
                                required
                                type="text"
                                placeholder="e.g. General, Local, Spinal"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.anesthesiaType} 
                                onChange={e => setFormData({ ...formData, anesthesiaType: e.target.value })} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">Notes</label>
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 rounded-xl text-buttonText bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Book Surgery'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
