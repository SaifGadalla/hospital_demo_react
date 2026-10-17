import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdEvent, MdSchedule, MdAutorenew, MdCheckCircle } from 'react-icons/md';

export default function OperatingRoom() {
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

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Operating Room (OR)"
            description="Manage surgery schedules, OR availability, and operative resources."
            mainButtonTitle="Book Surgery"
            numberCards={[
                <NumberCard key="total" title="Total Bookings" value={0} icon={<MdEvent size={24} />} />,
                <NumberCard key="scheduled" title="Scheduled" value={0} icon={<MdSchedule size={24} />} />,
                <NumberCard key="inProgress" title="In Progress" value={0} icon={<MdAutorenew size={24} />} />,
                <NumberCard key="completed" title="Completed" value={0} icon={<MdCheckCircle size={24} />} />,
            ]}
            hasSearch={false}
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
