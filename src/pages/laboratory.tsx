import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdScience, MdPending, MdAutorenew, MdHourglassTop } from 'react-icons/md';

export default function Laboratory() {
    const columns: AppColumn[] = [
        { label: 'Order #', width: 130 },
        { label: 'Date', width: 140 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Tests', flex: 2 },
        { label: 'Priority', width: 100 },
        { label: 'Status', width: 140 },
        { label: 'Actions', width: 100 },
    ];

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Laboratory"
            description="Manage lab orders, track sample status, and view test results."
            mainButtonTitle="New Lab Order"
            numberCards={[
                <NumberCard key="total" title="Total Orders" value={0} icon={<MdScience size={24} />} />,
                <NumberCard key="pending" title="Pending" value={0} icon={<MdPending size={24} />} />,
                <NumberCard key="inProgress" title="In Progress" value={0} icon={<MdAutorenew size={24} />} />,
                <NumberCard key="stat" title="STAT Priority" value={0} icon={<MdHourglassTop size={24} />} />,
            ]}
            hasSearch={true}
            secondarySearchHeaderWidgets={[
                <select key="status-filter" className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Sample Collected">Sample Collected</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                </select>,
                <select key="priority-filter" className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5">
                    <option value="">All Priorities</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT">STAT</option>
                </select>,
                <button key="clear-filters" className="text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl text-buttonText transition-colors">Clear</button>
            ]}
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
