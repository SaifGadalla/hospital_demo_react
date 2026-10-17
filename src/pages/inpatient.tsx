import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdBed, MdHotel, MdLocalHotel, MdPercent } from 'react-icons/md';

export default function Inpatient() {
    const columns: AppColumn[] = [
        { label: 'Admission #', width: 140 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Bed', width: 130 },
        { label: 'Diagnosis', flex: 1.5 },
        { label: 'Date Admitted', width: 120 },
        { label: 'Status', width: 110 },
        { label: 'Actions', width: 100 },
    ];

    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Inpatient Management"
            description="Manage ward bed assignments, admissions, and discharges."
            mainButtonTitle="Admit Patient"
            numberCards={[
                <NumberCard key="active" title="Active Admissions" value={0} icon={<MdBed size={24} />} />,
                <NumberCard key="occupied" title="Beds Occupied" value={0} icon={<MdHotel size={24} />} />,
                <NumberCard key="available" title="Beds Available" value={0} icon={<MdLocalHotel size={24} />} />,
                <NumberCard key="occupancy" title="Occupancy Rate" value={`0%`} icon={<MdPercent size={24} />} />,
            ]}
            tableHeader="Active Admissions"
            customBody={
                <div className="bg-surface border border-border-theme rounded-xl p-4 mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h4 className="text-h4 text-text-primary">Ward / Bed Map</h4>
                            <div className="flex items-center gap-4 text-bodyMedium">
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-success"></span>Available</div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error"></span>Occupied</div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-warning"></span>Cleaning</div>
                                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-divider"></span>Blocked</div>
                            </div>
                        </div>
                        <hr className="border-divider" />
                        <div className="flex items-center gap-3">
                            <button className="bg-primary text-text-inverse px-4 py-2 rounded-xl text-buttonText hover:bg-primary-dark transition-colors">Filter by Ward</button>
                            <button className="bg-primary text-text-inverse px-4 py-2 rounded-xl text-buttonText hover:bg-primary-dark transition-colors">Filter by Date</button>
                        </div>
                    </div>
                </div>
            }
            table={<AppDataTable columns={columns} rows={rows} />}
        />
    );
}
