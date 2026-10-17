import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdMedication, MdPending, MdCheckCircle, MdList } from 'react-icons/md';

export default function Pharmacy() {
    const columns: AppColumn[] = [
        { label: 'Rx #', width: 120 },
        { label: 'Date', width: 120 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Diagnosis', flex: 1.5 },
        { label: 'Items', flex: 2 },
        { label: 'Status', width: 110 },
        { label: 'Actions', width: 110 },
    ];

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Pharmacy"
            description="Manage prescriptions, dispensations, and inventory."
            mainButtonTitle="New Prescription"
            numberCards={[
                <NumberCard key="total" title="Total Rx" value={0} icon={<MdMedication size={24} />} />,
                <NumberCard key="pending" title="Pending" value={0} icon={<MdPending size={24} />} />,
                <NumberCard key="dispensed" title="Dispensed" value={0} icon={<MdCheckCircle size={24} />} />,
                <NumberCard key="items" title="Line Items" value={0} icon={<MdList size={24} />} />,
            ]}
            hasSearch={true}
            secondarySearchHeaderWidgets={[
                <select
                    key="status-filter"
                    className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                >
                    <option value="">All Statuses</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Dispensed">Dispensed</option>
                    <option value="Pending">Pending</option>
                </select>
            ]}
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
