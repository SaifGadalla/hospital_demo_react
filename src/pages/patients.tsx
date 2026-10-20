import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppPage from '../components/app-page';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';

import { usePatients } from '../features/patients/api/usePatients';
import CreatePatientDialog from '../components/dialogs/CreatePatientDialog';

export default function Patients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const { t } = useTranslation();

    const { data, isLoading } = usePatients();

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewPatient, setViewPatient] = useState<any | null>(null);
    const [deletePatient, setDeletePatient] = useState<any | null>(null);

    // Filter patients based on search and dropdown
    const patients = data?.items || [];
    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.mrn?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = genderFilter ? p.gender?.toLowerCase() === genderFilter : true;
        return matchesSearch && matchesGender;
    });

    const columns: AppColumn[] = [
        { label: t('patients.columns.mrn'), width: 130 },
        { label: t('patients.columns.patient'), flex: 2 },
        { label: t('patients.columns.dobAge'), width: 140 },
        { label: t('patients.columns.gender'), width: 90 },
        { label: t('patients.columns.phone'), width: 130 },
        { label: t('patients.columns.blood'), width: 70 },
        { label: t('patients.columns.status'), width: 90 },
        { label: t('patients.columns.actions'), width: 140 },
    ];

    const rows: AppDataRow[] = filteredPatients.map(patient => ({
        id: patient.id,
        cells: [
            <span className="text-bodyMedium text-text-primary">{patient.mrn}</span>,
            <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center shrink-0">
                    <span className="text-caption font-bold text-text-inverse uppercase">
                        {patient.fullName?.[0] || '?'}
                    </span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-bodyMedium font-bold text-text-primary">{patient.fullName}</span>
                        {patient.isVIP && (
                            <span className="bg-warning/20 text-warning text-caption font-bold px-1.5 py-0.5 rounded">VIP</span>
                        )}
                    </div>
                    <span className="text-caption text-text-secondary">{patient.email}</span>
                </div>
            </div>,
            <span className="text-bodyMedium text-text-primary">
                {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : t('common.notAvailable')}
                <span className="text-text-secondary mx-1">/</span>
                {patient.age}
            </span>,
            <span className="text-bodyMedium text-text-primary capitalize">{patient.gender}</span>,
            <span className="text-bodyMedium text-text-primary">{patient.mobile || patient.phone}</span>,
            <span className="text-bodyMedium text-text-primary">{patient.bloodType || t('common.notAvailable')}</span>,
            <span className={`text-caption font-bold px-2 py-1 rounded ${patient.isActive !== false ? 'bg-success/20 text-success' : 'bg-gray-200 text-gray-600'}`}>
                {patient.isActive !== false ? t('common.active') : t('common.inactive')}
            </span>,
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setViewPatient(patient)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={t('common.viewDetails')}
                >
                    <MdVisibility size={18} />
                </button>
                <button
                    onClick={() => console.log('Edit', patient.id)}
                    className="p-2 text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                    title={t('common.editPatient')}
                >
                    <MdEdit size={18} />
                </button>
                <button
                    onClick={() => setDeletePatient(patient)}
                    className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                    title={t('common.deletePatient')}
                >
                    <MdDelete size={18} />
                </button>
            </div>
        ]
    }));

    return (
        <>
            <AppPage
                title={t('patients.title')}
                description={t('patients.description')}
                mainButtonTitle={t('patients.addPatient')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                hasSearch={true}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                secondarySearchHeaderWidgets={[
                    <select
                        key="gender-filter"
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                    >
                        <option value="">{t('common.allGenders')}</option>
                        <option value="male">{t('common.male')}</option>
                        <option value="female">{t('common.female')}</option>
                    </select>
                ]}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">{t('patients.loadingPatients')}</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {/* Create Dialog */}
            {isCreateOpen && (
                <CreatePatientDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* View Details Dialog Overlay */}
            {viewPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">{viewPatient.fullName}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label={t('patients.detail.mrn')} value={viewPatient.mrn} />
                            <AppDetailRow label={t('patients.detail.fullName')} value={viewPatient.fullName} />
                            <AppDetailRow label={t('patients.detail.dob')} value={viewPatient.dateOfBirth} />
                            <AppDetailRow label={t('patients.detail.age')} value={viewPatient.age.toString()} />
                            <AppDetailRow label={t('patients.detail.gender')} value={viewPatient.gender} />
                            <AppDetailRow label={t('patients.detail.bloodType')} value={viewPatient.bloodType} />
                            <AppDetailRow label={t('patients.detail.nationalId')} value={viewPatient.nationalId} />
                            <AppDetailRow label={t('patients.detail.email')} value={viewPatient.email} />
                            <AppDetailRow label={t('patients.detail.mobile')} value={viewPatient.mobile} />
                            <AppDetailRow label={t('patients.detail.address')} value={viewPatient.address} />
                            <hr className="border-divider my-2" />
                            <AppDetailRow label={t('patients.detail.emergencyContact')} value={viewPatient.emergencyContactName} />
                            <AppDetailRow label={t('patients.detail.emergencyPhone')} value={viewPatient.emergencyContactPhone} />
                            <AppDetailRow label={t('patients.detail.relationship')} value={viewPatient.emergencyContactRelationship} />
                            <hr className="border-divider my-2" />
                            <AppDetailRow label={t('patients.detail.status')} value={viewPatient.isActive ? t('common.active') : t('common.inactive')} />
                            <AppDetailRow label={t('patients.detail.vip')} value={viewPatient.isVIP ? t('common.yes') : t('common.no')} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewPatient(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deletePatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">{t('patients.confirmDelete')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('patients.confirmDeleteMessage', { name: deletePatient.fullName })}
                            </p>
                        </div>
                        <div className="p-4 bg-surface-elevated flex justify-end gap-3">
                            <button
                                onClick={() => setDeletePatient(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Deleted', deletePatient.id);
                                    setDeletePatient(null);
                                }}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

