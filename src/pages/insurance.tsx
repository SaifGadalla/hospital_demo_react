import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import { MdDescription, MdCheckCircle, MdCancel, MdAttachMoney } from 'react-icons/md';

export default function Insurance() {
    const cols: AppColumn[] = [
        { label: 'Claim #', width: 110 },
        { label: 'Service Date', width: 120 },
        { label: 'Patient', flex: 1.5 },
        { label: 'Plan', flex: 1.5 },
        { label: 'Total', width: 100 },
        { label: 'Paid', width: 100 },
        { label: 'Status', width: 110 },
        { label: 'Actions', width: 100 },
    ];
    
    const rows: AppDataRow[] = [];

    return (
        <AppPage
            title="Insurance & Billing"
            description="Manage insurance claims, pre-authorizations, and accepted plans."
            mainButtonTitle="New Claim"
            numberCards={[
                <NumberCard key="total" title="Total Claims" value={0} icon={<MdDescription size={24} />} />,
                <NumberCard key="approved" title="Approved/Paid" value={0} icon={<MdCheckCircle size={24} />} />,
                <NumberCard key="rejected" title="Rejected" value={0} icon={<MdCancel size={24} />} />,
                <NumberCard key="claimed" title="Total Claimed" value={`$0`} icon={<MdAttachMoney size={24} />} />,
            ]}
            hasSearch={false}
            customBody={
                <div className="flex border-b border-divider mb-6 gap-6">
                    <button className="py-3 px-1 border-b-2 transition-colors text-buttonText border-primary text-primary">Claims</button>
                    <button className="py-3 px-1 border-b-2 transition-colors text-buttonText border-transparent text-text-secondary hover:text-text-primary">Pre-Authorizations</button>
                    <button className="py-3 px-1 border-b-2 transition-colors text-buttonText border-transparent text-text-secondary hover:text-text-primary">Insurance Plans</button>
                </div>
            }
            table={<AppDataTable columns={cols} rows={rows} />}
        />
    );
}
