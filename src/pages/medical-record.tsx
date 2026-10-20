import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppPage from '../components/app-page';
import { MdDelete } from 'react-icons/md';

import { useMedicalRecords } from '../features/clinical/api/useMedicalRecords';
import CreateMedicalRecordDialog from '../components/dialogs/CreateMedicalRecordDialog';

export default function MedicalRecords() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useMedicalRecords();
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { t } = useTranslation();

    // Filter records
    const records = data?.items || [];
    const filteredRecords = records.filter(record =>
        record.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosisDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = () => {
        console.log('Deleted record:', selectedRecord?.id);
        setIsDeleteDialogOpen(false);
        setSelectedRecord(null);
    };

    return (
        <>
            <AppPage
                title={t('medicalRecords.title')}
                description={t('medicalRecords.description')}
                mainButtonTitle={t('medicalRecords.newRecord')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                customBody={
                    <div className="flex flex-col lg:flex-row gap-5 mt-4 items-start">
                        {/* Records List Panel */}
                        <div className="w-full lg:w-87.5 shrink-0 bg-surface border border-border-theme rounded-xl p-4 flex flex-col max-h-200">
                            <h4 className="text-h4 text-text-primary mb-3">{t('medicalRecords.records')}</h4>
                            <hr className="border-divider mb-4" />

                            <input
                                type="text"
                                placeholder={t('medicalRecords.searchRecords')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors mb-4"
                            />

                            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                                {filteredRecords.map(record => {
                                    const isSelected = selectedRecord?.id === record.id;
                                    return (
                                        <button
                                            key={record.id}
                                            onClick={() => setSelectedRecord(record)}
                                            className={`flex flex-col items-start p-4 rounded-xl border text-left transition-colors ${isSelected
                                                    ? 'bg-primary/5 border-primary'
                                                    : 'bg-transparent border-border-theme hover:bg-surface-elevated'
                                                }`}
                                        >
                                            <span className={`text-bodyMedium text-text-primary ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                                                {t('medicalRecords.recordId')}: {record.id?.substring(0, 13)}...
                                            </span>
                                            <span className="text-caption text-text-secondary mt-1">
                                                {record.visitDate
                                                    ? new Date(record.visitDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                                                    : t('common.noDate')
                                                }
                                            </span>
                                        </button>
                                    );
                                })}
                                {isLoading && (
                                    <p className="text-bodyMedium text-text-secondary text-center py-4">{t('common.loading')}</p>
                                )}
                                {!isLoading && filteredRecords.length === 0 && (
                                    <p className="text-bodyMedium text-text-secondary text-center py-4">{t('common.noRecordsFound')}</p>
                                )}
                            </div>
                        </div>

                        {/* Record Details Panel */}
                        <div className="flex-1 w-full bg-surface-elevated border border-border-theme rounded-xl p-6 min-h-125">
                            {!selectedRecord ? (
                                <div className="h-full flex items-center justify-center">
                                    <span className="text-bodyMedium text-text-secondary">
                                        {t('medicalRecords.selectRecord')}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-h3 text-text-primary">{t('medicalRecords.recordDetails')}</h3>
                                        <button
                                            onClick={() => setIsDeleteDialogOpen(true)}
                                            className="flex items-center gap-2 text-error hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors text-buttonText"
                                        >
                                            <MdDelete size={18} />
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                    <hr className="border-divider mb-6" />

                                    <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">
                                        <DetailBlock label={t('medicalRecords.detail.patientId')} value={selectedRecord.patientId} />
                                        <DetailBlock label={t('medicalRecords.detail.doctorId')} value={selectedRecord.doctorId} />
                                        <DetailBlock label={t('medicalRecords.detail.diagnosisCode')} value={selectedRecord.diagnosisCode} />
                                        <DetailBlock label={t('medicalRecords.detail.diagnosisDescription')} value={selectedRecord.diagnosisDescription} />
                                        <DetailBlock label={t('medicalRecords.detail.subjective')} value={selectedRecord.subjective} />
                                        <DetailBlock label={t('medicalRecords.detail.objective')} value={selectedRecord.objective} />
                                        <DetailBlock label={t('medicalRecords.detail.assessment')} value={selectedRecord.assessment} />
                                        <DetailBlock label={t('medicalRecords.detail.plan')} value={selectedRecord.plan} />
                                        <DetailBlock label={t('medicalRecords.detail.allergies')} value={selectedRecord.allergies} />
                                        <DetailBlock label={t('medicalRecords.detail.currentMedications')} value={selectedRecord.currentMedications} />
                                        <DetailBlock label={t('medicalRecords.detail.clinicalNotes')} value={selectedRecord.clinicalNotes} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            />

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('medicalRecords.deleteRecord')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('medicalRecords.deleteRecordMessage')}
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateOpen && (
                <CreateMedicalRecordDialog onClose={() => setIsCreateOpen(false)} />
            )}
        </>
    );
}

// Helper block for Medical Record fields (stacked layout)
function DetailBlock({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-label text-text-primary">{label}</span>
            <span className="text-bodyMedium text-text-primary opacity-90 leading-relaxed whitespace-pre-wrap">
                {value || 'N/A'}
            </span>
        </div>
    );
}
