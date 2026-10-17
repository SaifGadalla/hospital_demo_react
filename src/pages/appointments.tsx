import AppPage from '../components/app-page';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';

export default function Appointments() {
    const columns: AppColumn[] = [
        { label: 'Appt Number', width: 130 },
        { label: 'Date & Time', width: 180 },
        { label: 'Patient', flex: 2 },
        { label: 'Type', width: 140 },
        { label: 'Doctor', flex: 1 },
        { label: 'Status', width: 120 },
    ];

    const rows: AppDataRow[] = [
        {
            id: '1',
            cells: [
                'APPT-001',
                '2025-01-15 10:00 AM',
                'John Doe',
                'Consultation',
                'Dr. Smith',
                'Scheduled',
            ],
        },
    ];

    return (
        <AppPage
            title="Appointments"
            description="Manage and schedule patient appointments and procedures."
            mainButtonTitle="Schedule Appointment"
            secondaryButtons={[
                <button
                    key="board"
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    Board View
                </button>,
                <button
                    key="list"
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    List View
                </button>
            ]}
            hasSearch={true}
            secondarySearchHeaderWidgets={[
                <select
                    key="type-filter"
                    className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                >
                    <option value="">All Types</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Procedure">Procedure</option>
                </select>,
                <input
                    key="date-filter"
                    type="date"
                    className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                />,
                <button
                    key="clear-filters"
                    className="text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl text-buttonText transition-colors"
                >
                    Clear Filters
                </button>
            ]}
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
