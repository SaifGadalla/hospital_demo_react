import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LabOrder, LabOrderTest } from '../../features/labs/types';
import { useCreateLabOrder } from '../../features/labs/api/useCreateLabOrder';
import { MdAdd, MdDelete } from 'react-icons/md';

export default function CreateLabOrderDialog({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();
    const { mutateAsync: createLabOrder, isPending } = useCreateLabOrder();
    const [formData, setFormData] = useState<Partial<LabOrder>>({
        patientId: '',
        doctorId: '',
        orderDate: new Date().toISOString().split('T')[0],
        priority: 'Routine',
        status: 'Pending',
        clinicalIndication: '',
        specimenType: 'Blood',
        tests: []
    });

    const [currentTest, setCurrentTest] = useState<Partial<LabOrderTest>>({
        testName: '',
        status: 'Pending'
    });

    const handleAddTest = () => {
        if (!currentTest.testName) return;
        
        setFormData(prev => ({
            ...prev,
            tests: [...(prev.tests || []), currentTest as LabOrderTest]
        }));
        
        setCurrentTest({
            testName: '',
            status: 'Pending'
        });
    };

    const handleRemoveTest = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tests: prev.tests?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createLabOrder(formData);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-divider shrink-0">
                    <h2 className="text-h3 text-text-primary">{t('dialogs.createLabOrder.title')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createLabOrder.patientId')}</label>
                                <input 
                                    required
                                    type="text"
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.patientId} 
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })} 
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createLabOrder.doctorId')}</label>
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
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createLabOrder.priority')}</label>
                                <select 
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.priority} 
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Routine">{t('dialogs.createLabOrder.routine')}</option>
                                    <option value="Urgent">{t('dialogs.createLabOrder.urgent')}</option>
                                    <option value="STAT">{t('dialogs.createLabOrder.stat')}</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-bodySmall text-text-secondary">{t('dialogs.createLabOrder.specimenType')}</label>
                                <input 
                                    required
                                    type="text"
                                    placeholder={t('dialogs.createLabOrder.specimenPlaceholder')}
                                    className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={formData.specimenType} 
                                    onChange={e => setFormData({ ...formData, specimenType: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-bodySmall text-text-secondary">{t('dialogs.createLabOrder.clinicalIndication')}</label>
                            <input 
                                required
                                type="text"
                                className="bg-surface-elevated border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                value={formData.clinicalIndication} 
                                onChange={e => setFormData({ ...formData, clinicalIndication: e.target.value })} 
                            />
                        </div>

                        <div className="border-t border-divider my-2 pt-4">
                            <h4 className="text-bodyMedium font-medium text-text-primary mb-3">{t('dialogs.createLabOrder.tests')}</h4>
                            
                            {formData.tests && formData.tests.length > 0 && (
                                <div className="flex flex-col gap-2 mb-4">
                                    {formData.tests.map((test, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-surface-elevated border border-border-theme p-3 rounded-lg">
                                            <span className="text-bodyMedium font-medium text-text-primary">{test.testName}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveTest(idx)}
                                                className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3 bg-surface-elevated p-4 rounded-xl border border-border-theme">
                                <input 
                                    placeholder={t('dialogs.createLabOrder.testNamePlaceholder')}
                                    className="flex-1 bg-surface border border-border-theme rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary" 
                                    value={currentTest.testName} 
                                    onChange={e => setCurrentTest({ ...currentTest, testName: e.target.value })} 
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTest();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTest}
                                    className="flex items-center gap-1 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                                >
                                    <MdAdd size={18} /> {t('common.add')}
                                </button>
                            </div>
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
                            disabled={isPending || !formData.tests?.length}
                            className="px-6 py-2 rounded-xl text-buttonText bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                            {isPending ? t('common.saving') : t('dialogs.createLabOrder.createLabOrder')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
