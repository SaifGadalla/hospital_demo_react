import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdLocalHospital, MdToday, MdWarning, MdWarningAmber } from 'react-icons/md';

export default function Emergency() {
    const columns: AppColumn[] = [
        { label: 'ER Number', width: 120 },
        { label: 'Arrival', width: 120 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Chief Complaint', flex: 1.5 },
        { label: 'Triage Lvl', width: 100 },
        { label: 'Status', width: 150 },
        { label: 'Actions', width: 110 },
    ];

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Emergency (ER)"
            description="Monitor active ER arrivals, triages, and registrations in real-time."
            mainButtonTitle="Register Arrival"
            secondaryButtons={[
                <button
                    key="ambulance"
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    Ambulance Call
                </button>
            ]}
            numberCards={[
                <NumberCard key="active" title="Active Calls" value={0} icon={<MdLocalHospital size={24} />} />,
                <NumberCard key="today" title="Today's Total" value={0} icon={<MdToday size={24} />} />,
                <NumberCard key="notTriaged" title="Not Triaged" value={0} icon={<MdWarning size={24} />} />,
                <NumberCard key="resus" title="Level 1 Resus" value={0} icon={<MdWarningAmber size={24} />} />,
            ]}
            hasSearch={false}
            tableHeader="Recent ER Registrations"
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
