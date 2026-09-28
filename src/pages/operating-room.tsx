import { useState } from 'react';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdEvent, MdSchedule, MdAutorenew, MdCheckCircle, MdVisibility, MdCancel } from 'react-icons/md';

import { useSurgeryBookings } from '../features/surgery/api/useSurgeryBookings';
import CreateSurgeryBookingDialog from '../components/dialogs/CreateSurgeryBookingDialog';

export default function OperatingRoom() {
    const { data, isLoading } = useSurgeryBookings();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Dialog States
    const [viewBooking, setViewBooking] = useState<any | null>(null);
    const [cancelBooking, setCancelBooking] = useState<any | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const bookings = data?.items || [];

    // Statistics logic
    const totalBookings = bookings.length;
    const scheduledBookings = bookings.filter(b => b.status === 'Scheduled').length;
    const inProgressBookings = bookings.filter(b => b.status === 'In Progress').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;

    // Actions
    const confirmCancel = () => {
        if (!cancelBooking) return;
        // Mock action
        setCancelBooking(null);
        setCancelReason('');
    };

    const columns: AppColumn[] = [
        { label: 'Date', width: 120 },
        { label: 'Time', width: 100 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Procedure', flex: 1.5 },
        { label: 'Room', width: 100 },
        { label: 'Priority', width: 100 },
        { label: 'Status', width: 120 },
        { label: 'Actions', width: 100 },
    ];

    const rows: AppDataRow[] = bookings.map(b => {
        const dateObj = b.scheduledDate ? new Date(b.scheduledDate) : null;
        return {
            id: b.id,
            cells: [
                <span className="text-bodyMedium text-text-primary">
                    {dateObj ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A'}
                </span>,
                <span className="text-bodyMedium text-text-primary">
                    {dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
                </span>,
                <span className="text-bodyMedium font-medium text-text-primary">{b.patientName}</span>,
                <span className="text-bodyMedium text-text-primary">{b.procedureName}</span>,
                <span className="text-bodyMedium font-mono text-text-primary">{b.operatingRoomNumber}</span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${b.priority === 'Urgent' ? 'bg-error/20 text-error' :
                        'bg-primary/10 text-primary'
                    }`}>
                    {b.priority}
                </span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${b.status === 'Completed' ? 'bg-success/20 text-success' :
                        b.status === 'In Progress' ? 'bg-primary-light/20 text-primary' :
                            b.status === 'Cancelled' ? 'bg-error/20 text-error' :
                                'bg-warning/20 text-warning' // Scheduled
                    }`}>
                    {b.status}
                </span>,
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setViewBooking(b)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="View Details"
                    >
                        <MdVisibility size={20} />
                    </button>
                    <button
                        onClick={() => setCancelBooking(b)}
                        disabled={b.status === 'Cancelled' || b.status === 'Completed'}
                        className={`p-2 rounded-full transition-colors ${b.status === 'Cancelled' || b.status === 'Completed' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        title="Cancel Booking"
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
                title="Operating Room (OR)"
                description="Manage surgery schedules, OR availability, and operative resources."
                mainButtonTitle="Book Surgery"
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title="Total Bookings" value={totalBookings} icon={<MdEvent size={24} />} />,
                    <NumberCard key="scheduled" title="Scheduled" value={scheduledBookings} icon={<MdSchedule size={24} />} />,
                    <NumberCard key="inProgress" title="In Progress" value={inProgressBookings} icon={<MdAutorenew size={24} />} />,
                    <NumberCard key="completed" title="Completed" value={completedBookings} icon={<MdCheckCircle size={24} />} />,
                ]}
                hasSearch={false}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">Loading surgery bookings...</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreateSurgeryBookingDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* View Details Dialog */}
            {viewBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">Booking: {viewBooking.procedureName}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label="Patient" value={viewBooking.patientName} />
                            <AppDetailRow label="Procedure" value={viewBooking.procedureName} />
                            <AppDetailRow label="Date" value={viewBooking.scheduledDate ? new Date(viewBooking.scheduledDate).toLocaleDateString('en-US', {
                                month: 'short', day: '2-digit', year: 'numeric'
                            }) : 'N/A'} />
                            <AppDetailRow label="Time" value={viewBooking.scheduledDate ? new Date(viewBooking.scheduledDate).toLocaleTimeString('en-US', {
                                hour: 'numeric', minute: '2-digit', hour12: true
                            }) : 'N/A'} />
                            <AppDetailRow label="Duration" value={`${viewBooking.estimatedDuration} mins`} />
                            <AppDetailRow label="Anesthesia" value={viewBooking.anesthesiaType} />
                            <AppDetailRow label="Room" value={viewBooking.operatingRoomNumber} />
                            <AppDetailRow label="Status" value={viewBooking.status} />
                            <AppDetailRow label="Notes" value={viewBooking.notes} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewBooking(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {cancelBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Cancel Booking</h2>
                            <p className="text-bodyMedium text-text-secondary mb-4">
                                Are you sure you want to cancel the surgery for <span className="font-medium text-text-primary">{cancelBooking.patientName}</span>?
                            </p>
                            <div className="flex flex-col gap-2">
                                <label className="text-label text-text-primary">Reason for cancellation</label>
                                <textarea
                                    rows={2}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="bg-surface-elevated border border-border-theme rounded-xl p-3 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => {
                                    setCancelBooking(null);
                                    setCancelReason('');
                                }}
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
