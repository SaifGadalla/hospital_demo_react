import { useState } from 'react';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdLocalHospital, MdToday, MdWarning, MdWarningAmber, MdVisibility, MdUpdate } from 'react-icons/md';

import { useERRegistrations } from '../features/er/api/useERRegistrations';
import CreateERRegistrationDialog from '../components/dialogs/CreateERRegistrationDialog';

export default function Emergency() {
    const { data, isLoading } = useERRegistrations();
    const [viewCall, setViewCall] = useState<any | null>(null);
    const [updateStatusCall, setUpdateStatusCall] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const registrations = data?.items || [];

    // Statistics logic
    const activeCalls = registrations.filter(r => r.status !== 'Completed').length;

    const today = new Date().toDateString();
    const todayTotal = registrations.filter(c => c.arrivalTime && new Date(c.arrivalTime).toDateString() === today).length;

    const notTriaged = registrations.filter(c => !c.triageLevel).length;

    const level1Resus = registrations.filter(c => c.triageLevel === 1).length;

    const handleUpdateStatus = (status: string) => {
        if (!updateStatusCall) return;
        // Mock update action
        setUpdateStatusCall(null);
        alert(`Status updated to: ${status}`);
    };

    const columns: AppColumn[] = [
        { label: 'ER Number', width: 120 },
        { label: 'Arrival', width: 120 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Chief Complaint', flex: 1.5 },
        { label: 'Triage Lvl', width: 100 },
        { label: 'Status', width: 150 },
        { label: 'Actions', width: 110 },
    ];

    const rows: AppDataRow[] = registrations.map(c => ({
        id: c.id,
        cells: [
            <span className="text-bodyMedium font-mono text-text-primary">{c.erNumber}</span>,
            <span className="text-bodyMedium text-text-primary">
                {c.arrivalTime ? new Date(c.arrivalTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
            </span>,
            <span className="text-bodyMedium font-medium text-text-primary">{c.patientName}</span>,
            <span className="text-bodyMedium text-text-primary truncate">{c.chiefComplaint}</span>,
            <span className="text-bodyMedium text-text-primary">{c.triageLevel || '-'}</span>,
            <span className={`text-caption font-bold px-2 py-1 rounded ${!c.triageLevel ? 'bg-error/20 text-error' :
                    c.status === 'Discharged' || c.status === 'Completed' ? 'bg-success/20 text-success' :
                        'bg-warning/20 text-warning'
                }`}>
                {c.status || 'Waiting'}
            </span>,
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setViewCall(c)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="View Details"
                >
                    <MdVisibility size={20} />
                </button>
                <button
                    onClick={() => setUpdateStatusCall(c)}
                    className="p-2 text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                    title="Update Status"
                >
                    <MdUpdate size={20} />
                </button>
            </div>
        ]
    }));

    return (
        <>
            <AppPage
                title="Emergency (ER)"
                description="Monitor active ER arrivals, triages, and registrations in real-time."
                mainButtonTitle="Register Arrival"
                mainButtonOnTap={() => setIsCreateOpen(true)}
                secondaryButtons={[
                    <button
                        key="ambulance"
                        onClick={() => alert('Ambulance Call Initialized')}
                        className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                    >
                        Ambulance Call
                    </button>
                ]}
                numberCards={[
                    <NumberCard key="active" title="Active Calls" value={activeCalls} icon={<MdLocalHospital size={24} />} />,
                    <NumberCard key="today" title="Today's Total" value={todayTotal} icon={<MdToday size={24} />} />,
                    <NumberCard key="notTriaged" title="Not Triaged" value={notTriaged} icon={<MdWarning size={24} />} />,
                    <NumberCard key="resus" title="Level 1 Resus" value={level1Resus} icon={<MdWarningAmber size={24} />} />,
                ]}
                hasSearch={false}
                tableHeader="Recent ER Registrations"
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">Loading registrations...</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreateERRegistrationDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* Call Details Dialog */}
            {viewCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">Registration {viewCall.erNumber}</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <AppDetailRow label="Patient" value={viewCall.patientName} />
                            <AppDetailRow label="Arrival Time" value={viewCall.arrivalTime ? new Date(viewCall.arrivalTime).toLocaleString('en-US', {
                                hour: 'numeric', minute: '2-digit', month: 'short', day: '2-digit'
                            }) : 'N/A'} />
                            <AppDetailRow label="Complaint" value={viewCall.chiefComplaint} />
                            <AppDetailRow label="Triage Level" value={viewCall.triageLevel?.toString()} />
                            <AppDetailRow label="Status" value={viewCall.status} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewCall(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Dialog */}
            {updateStatusCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary mb-2">Update Status</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Patient: <span className="font-medium text-text-primary">{updateStatusCall.patientName}</span>
                            </p>
                        </div>
                        <div className="flex flex-col py-2">
                            {['Dispatched', 'En Route', 'On Scene', 'Transporting', 'Arrived', 'Completed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdateStatus(status)}
                                    className="px-6 py-3 text-left text-bodyMedium text-text-primary hover:bg-surface-elevated transition-colors"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setUpdateStatusCall(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
