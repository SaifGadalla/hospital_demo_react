import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdScience, MdPending, MdAutorenew, MdHourglassTop, MdVisibility, MdCancel } from 'react-icons/md';

import { useLabOrders } from '../features/labs/api/useLabOrders';
import CreateLabOrderDialog from '../components/dialogs/CreateLabOrderDialog';

export default function Laboratory() {
    const { t } = useTranslation();
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
        { label: t('laboratory.columns.orderNumber'), width: 130 },
        { label: t('laboratory.columns.date'), width: 140 },
        { label: t('laboratory.columns.patient'), flex: 1.5 },
        { label: t('laboratory.columns.tests'), flex: 2 },
        { label: t('laboratory.columns.priority'), width: 100 },
        { label: t('laboratory.columns.status'), width: 140 },
        { label: t('laboratory.columns.actions'), width: 100 },
    ];

    const rows: AppDataRow[] = filteredOrders.map(o => {
        const testsSummary = o.tests && o.tests.length > 0
            ? o.tests.map((tItem: any) => tItem.testName).join(', ')
            : t('common.noTests');

        return {
            id: o.id,
            cells: [
                <span className="text-bodyMedium font-mono text-text-primary">{o.orderNumber}</span>,
                <span className="text-bodyMedium text-text-primary">
                    {o.orderDate ? new Date(o.orderDate).toLocaleString('en-US', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', hour12: false
                    }) : t('common.notAvailable')}
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
                        title={t('common.viewDetails')}
                    >
                        <MdVisibility size={20} />
                    </button>
                    <button
                        onClick={() => setCancelOrder(o)}
                        disabled={o.status === 'Cancelled'}
                        className={`p-2 rounded-full transition-colors ${o.status === 'Cancelled' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                        title={t('laboratory.cancelOrder')}
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
                title={t('laboratory.title')}
                description={t('laboratory.description')}
                mainButtonTitle={t('laboratory.newLabOrder')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title={t('laboratory.totalOrders')} value={totalOrders} icon={<MdScience size={24} />} />,
                    <NumberCard key="pending" title={t('laboratory.pending')} value={pendingOrders} icon={<MdPending size={24} />} />,
                    <NumberCard key="inProgress" title={t('laboratory.inProgress')} value={inProgressOrders} icon={<MdAutorenew size={24} />} />,
                    <NumberCard key="stat" title={t('laboratory.statPriority')} value={statOrders} icon={<MdHourglassTop size={24} />} />,
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
                        <option value="">{t('common.allStatuses')}</option>
                        <option value="Pending">{t('laboratory.pending')}</option>
                        <option value="Sample Collected">{t('laboratory.filters.sampleCollected')}</option>
                        <option value="In Progress">{t('laboratory.inProgress')}</option>
                        <option value="Completed">{t('laboratory.filters.completed')}</option>
                        <option value="Approved">{t('laboratory.filters.approved')}</option>
                        <option value="Cancelled">{t('laboratory.filters.cancelled')}</option>
                    </select>,
                    <select
                        key="priority-filter"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                    >
                        <option value="">{t('common.allPriorities')}</option>
                        <option value="Routine">{t('laboratory.filters.routine')}</option>
                        <option value="Urgent">{t('laboratory.filters.urgent')}</option>
                        <option value="STAT">{t('laboratory.filters.stat')}</option>
                    </select>,
                    <button
                        key="clear-filters"
                        onClick={handleClearFilters}
                        className="text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl text-buttonText transition-colors"
                    >
                        {t('common.clear')}
                    </button>
                ]}
                table={
                    isLoading ? (
                        <div className="p-8 text-center text-text-secondary">{t('laboratory.loadingLabOrders')}</div>
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
                            <h2 className="text-h3 text-text-primary">{t('laboratory.orderDetails')}: {viewOrder.orderNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label={t('laboratory.detail.orderNumber')} value={viewOrder.orderNumber} />
                            <AppDetailRow label={t('laboratory.detail.patient')} value={viewOrder.patientId} />
                            <AppDetailRow label={t('laboratory.detail.doctorId')} value={viewOrder.doctorId} />
                            <AppDetailRow label={t('laboratory.detail.priority')} value={viewOrder.priority} />
                            <AppDetailRow label={t('laboratory.detail.status')} value={viewOrder.status} />
                            <AppDetailRow label={t('laboratory.detail.clinicalIndication')} value={viewOrder.clinicalIndication} />
                            <AppDetailRow label={t('laboratory.detail.specimenType')} value={viewOrder.specimenType} />
                            <AppDetailRow label={t('laboratory.detail.orderDate')} value={viewOrder.orderDate ? new Date(viewOrder.orderDate).toLocaleString('en-US', {
                                month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
                            }) : t('common.notAvailable')} />

                            {viewOrder.tests && viewOrder.tests.length > 0 && (
                                <>
                                    <hr className="border-divider my-2" />
                                    <h4 className="text-h4 text-text-primary mb-2">{t('laboratory.tests')}</h4>
                                    <div className="flex flex-col gap-2">
                                        {viewOrder.tests.map((tItem: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-bodyMedium text-text-secondary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-border-theme shrink-0"></span>
                                                <span className="font-medium text-text-primary">{tItem.testName}</span>
                                                <span className="mx-1">&mdash;</span>
                                                <span>{tItem.status}</span>
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
                                {t('common.close')}
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
                            <h2 className="text-h3 text-text-primary mb-2">{t('laboratory.cancelOrder')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('laboratory.cancelOrderMessage', { number: cancelOrder.orderNumber })}
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelOrder(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.no')}
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                {t('common.yesCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
