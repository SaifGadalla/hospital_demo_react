import { useState } from 'react';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdMedication, MdPending, MdCheckCircle, MdList, MdCancel, MdCheckCircleOutline } from 'react-icons/md';

import { usePrescriptions } from '../features/pharmacy/api/usePrescriptions';
import CreatePrescriptionDialog from '../components/dialogs/CreatePrescriptionDialog';

export default function Pharmacy() {
    const { data, isLoading } = usePrescriptions();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Dialog States
    const [dispenseTarget, setDispenseTarget] = useState<any | null>(null);
    const [cancelTarget, setCancelTarget] = useState<any | null>(null);

    const prescriptions = data?.items || [];

    // Filter logic
    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesSearch = p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.prescriptionNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? p.status?.toLowerCase() === statusFilter.toLowerCase() : true;
        return matchesSearch && matchesStatus;
    });

    // Statistics logic
    const totalRx = prescriptions.length;
    const pendingRx = prescriptions.filter(p => p.status === 'Pending').length;
    const dispensedRx = prescriptions.filter(p => p.status === 'Dispensed').length;
    const totalItems = prescriptions.reduce((sum, p) => sum + (p.items?.length || 0), 0);

    // Actions
    const confirmDispense = () => {
        if (!dispenseTarget) return;
        // Mock action
        setDispenseTarget(null);
    };

    const confirmCancel = () => {
        if (!cancelTarget) return;
        // Mock action
        setCancelTarget(null);
    };

    const columns: AppColumn[] = [
        { label: 'Rx #', width: 120 },
        { label: 'Date', width: 120 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Diagnosis', flex: 1.5 },
        { label: 'Items', flex: 2 },
        { label: 'Status', width: 110 },
        { label: 'Actions', width: 110 },
    ];

    const rows: AppDataRow[] = filteredPrescriptions.map(p => {
        const itemsSummary = p.items && p.items.length > 0
            ? p.items.map((item: any) => `${item.medicationName} ${item.dosage}`).join(', ')
            : 'No Items';

        return {
            id: p.id,
            cells: [
                <span className="text-bodyMedium font-mono text-text-primary">{p.prescriptionNumber}</span>,
                <span className="text-bodyMedium text-text-primary">{p.prescriptionDate?.toString()}</span>,
                <span className="text-bodyMedium font-medium text-text-primary">{p.patientId}</span>,
                <span className="text-bodyMedium text-text-primary">{p.diagnosis}</span>,
                <span className="text-bodyMedium text-text-primary truncate" title={itemsSummary}>{itemsSummary}</span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${p.status === 'Dispensed' ? 'bg-success/20 text-success' :
                    p.status === 'Pending' ? 'bg-warning/20 text-warning' :
                        'bg-error/20 text-error'
                    }`}>
                    {p.status}
                </span>,
                <div className="flex items-center gap-1">
                    {p.status === 'Pending' && (
                        <button
                            onClick={() => setDispenseTarget(p)}
                            className="p-2 text-success hover:bg-success/10 rounded-full transition-colors"
                            title="Dispense"
                        >
                            <MdCheckCircleOutline size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => setCancelTarget(p)}
                        disabled={p.status === 'Cancelled'}
                        className={`p-2 rounded-full transition-colors ${p.status === 'Cancelled' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        title="Cancel Prescription"
                    >
                        <MdCancel size={20} />
                    </button>
                </div>
            ]
        };
    });

    return (
        <>
            <AppPage
                title="Pharmacy"
                description="Manage prescriptions, dispensations, and inventory."
                mainButtonTitle="New Prescription"
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title="Total Rx" value={totalRx} icon={<MdMedication size={24} />} />,
                    <NumberCard key="pending" title="Pending" value={pendingRx} icon={<MdPending size={24} />} />,
                    <NumberCard key="dispensed" title="Dispensed" value={dispensedRx} icon={<MdCheckCircle size={24} />} />,
                    <NumberCard key="items" title="Line Items" value={totalItems} icon={<MdList size={24} />} />,
                ]}
                hasSearch={true}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                secondarySearchHeaderWidgets={[
                    <select
                        key="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                    >
                        <option value="">All Statuses</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Dispensed">Dispensed</option>
                        <option value="Pending">Pending</option>
                    </select>
                ]}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">Loading prescriptions...</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreatePrescriptionDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* Dispense Confirmation Dialog */}
            {dispenseTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Dispense Prescription</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Are you sure you want to dispense prescription {dispenseTarget.prescriptionNumber}?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setDispenseTarget(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDispense}
                                className="px-5 py-2 rounded-xl text-buttonText text-success hover:bg-success/10 transition-colors"
                            >
                                Dispense
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Cancel Prescription</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Are you sure you want to cancel prescription {cancelTarget.prescriptionNumber}?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelTarget(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
