import AppPage from '../components/app-page';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';

export default function Patients() {
    const columns: AppColumn[] = [
        { label: 'MRN', width: 130 },
        { label: 'Patient', flex: 2 },
        { label: 'DOB / Age', width: 140 },
        { label: 'Gender', width: 90 },
        { label: 'Phone', width: 130 },
        { label: 'Blood', width: 70 },
        { label: 'Status', width: 90 },
        { label: 'Actions', width: 140 },
    ];

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Patients"
            description="Manage patient records, view details, and update statuses."
            mainButtonTitle="Add Patient"
            hasSearch={true}
            secondarySearchHeaderWidgets={[
                <select
                    key="gender-filter"
                    className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            ]}
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
