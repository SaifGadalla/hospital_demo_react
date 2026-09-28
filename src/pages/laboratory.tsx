import { useState } from 'react';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdScience, MdPending, MdAutorenew, MdHourglassTop, MdVisibility, MdCancel } from 'react-icons/md';

import { useLabOrders } from '../features/labs/api/useLabOrders';
import CreateLabOrderDialog from '../components/dialogs/CreateLabOrderDialog';

export default function Laboratory() {
    const { data, isLoading } = useLabOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Dialog States
    const [viewOrder, setViewOrder] = useState<any | null>(null);
    const [cancelOrder, setCancelOrder] = useState<any | null>(null);

    const orders = data?.items || [];

    // Filter logic
    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? o.status?.toLowerCase() === statusFilter.toLowerCase() : true;
        const matchesPriority = priorityFilter ? o.priority?.toLowerCase() === priorityFilter.toLowerCase() : true;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPriorityFilter('');
    };

    // Statistics logic
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const inProgressOrders = orders.filter(o => o.status === 'In Progress').length;
    const statOrders = orders.filter(o => o.priority === 'STAT').length;

    // Actions
    const confirmCancel = () => {
        if (!cancelOrder) return;
        // Mock action
        setCancelOrder(null);
    };

    const columns: AppColumn[] = [
        { label: 'Order #', width: 130 },
        { label: 'Date', width: 140 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Tests', flex: 2 },
        { label: 'Priority', width: 100 },
        { label: 'Status', width: 140 },
        { label: 'Actions', width: 100 },
    ];

    const rows: AppDataRow[] = filteredOrders.map(o => {
        const testsSummary = o.tests && o.tests.length > 0
            ? o.tests.map((t: any) => t.testName).join(', ')
            : 'No tests';

        return {
            id: o.id,
            cells: [
                <span className="text-bodyMedium font-mono text-text-primary">{o.orderNumber}</span>,
                <span className="text-bodyMedium text-text-primary">
                    {o.orderDate ? new Date(o.orderDate).toLocaleString('en-US', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    }) : 'N/A'}
                </span>,
                <span className="text-bodyMedium font-medium text-text-primary">{o.patientId}</span>,
                <span className="text-bodyMedium text-text-primary truncate" title={testsSummary}>{testsSummary}</span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${o.priority === 'STAT' ? 'bg-error/20 text-error' :
                    o.priority === 'Urgent' ? 'bg-warning/20 text-warning' :
                        'bg-primary/10 text-primary'
                    }`}>
                    {o.priority}
                </span>,
                <span className={`text-caption font-bold px-2 py-1 rounded ${o.status === 'Completed' || o.status === 'Approved' ? 'bg-success/20 text-success' :
                    o.status === 'In Progress' || o.status === 'Sample Collected' ? 'bg-primary-light/20 text-primary' :
                        o.status === 'Cancelled' ? 'bg-error/20 text-error' :
                            'bg-warning/20 text-warning' // Pending
                    }`}>
                    {o.status}
                </span>,
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setViewOrder(o)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="View Details"
                    >
                        <MdVisibility size={20} />
                    </button>
                    <button
                        onClick={() => setCancelOrder(o)}
                        disabled={o.status === 'Cancelled'}
                        className={`p-2 rounded-full transition-colors ${o.status === 'Cancelled' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        title="Cancel Order"
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
                title="Laboratory"
                description="Manage lab orders, track sample status, and view test results."
                mainButtonTitle="New Lab Order"
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title="Total Orders" value={totalOrders} icon={<MdScience size={24} />} />,
                    <NumberCard key="pending" title="Pending" value={pendingOrders} icon={<MdPending size={24} />} />,
                    <NumberCard key="inProgress" title="In Progress" value={inProgressOrders} icon={<MdAutorenew size={24} />} />,
                    <NumberCard key="stat" title="STAT Priority" value={statOrders} icon={<MdHourglassTop size={24} />} />,
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
                        <option value="Pending">Pending</option>
                        <option value="Sample Collected">Sample Collected</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>,
                    <select
                        key="priority-filter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                    >
                        <option value="">All Priorities</option>
                        <option value="Routine">Routine</option>
                        <option value="Urgent">Urgent</option>
                        <option value="STAT">STAT</option>
                    </select>,
                    <button
                        key="clear-filters"
                        onClick={handleClearFilters}
                        className="text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl text-buttonText transition-colors"
                    >
                        Clear
                    </button>
                ]}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">Loading lab orders...</div>
                    ) : (
                        <AppDataTable columns={columns} rows={rows} />
                    )
                }
            />

            {isCreateOpen && (
                <CreateLabOrderDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* View Details Dialog */}
            {viewOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">Order Details: {viewOrder.orderNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label="Order Number" value={viewOrder.orderNumber} />
                            <AppDetailRow label="Patient" value={viewOrder.patientId} />
                            <AppDetailRow label="Doctor ID" value={viewOrder.doctorId} />
                            <AppDetailRow label="Priority" value={viewOrder.priority} />
                            <AppDetailRow label="Status" value={viewOrder.status} />
                            <AppDetailRow label="Clinical Indication" value={viewOrder.clinicalIndication} />
                            <AppDetailRow label="Specimen Type" value={viewOrder.specimenType} />
                            <AppDetailRow label="Order Date" value={viewOrder.orderDate ? new Date(viewOrder.orderDate).toLocaleString('en-US', {
                                month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
                            }) : 'N/A'} />

                            {viewOrder.tests && viewOrder.tests.length > 0 && (
                                <>
                                    <hr className="border-divider my-2" />
                                    <h4 className="text-h4 text-text-primary mb-2">Tests</h4>
                                    <div className="flex flex-col gap-2">
                                        {viewOrder.tests.map((t: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-bodyMedium text-text-secondary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-border-theme shrink-0"></span>
                                                <span className="font-medium text-text-primary">{t.testName}</span>
                                                <span className="mx-1">&mdash;</span>
                                                <span>{t.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewOrder(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            {cancelOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Cancel Order</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Are you sure you want to cancel order {cancelOrder.orderNumber}?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelOrder(null)}
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
