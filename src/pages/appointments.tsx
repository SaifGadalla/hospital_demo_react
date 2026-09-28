import { useState } from 'react';
import AppPage from '../components/app-page';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';

import { useAppointments } from '../features/appointments/api/useAppointments';
import CreateAppointmentDialog from '../components/dialogs/CreateAppointmentDialog';

export default function Appointments() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const { data, isLoading } = useAppointments();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Filter appointments based on search, type, and date
    const appointments = data?.items || [];
    const filteredAppointments = appointments.filter(appt => {
        const matchesSearch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.appointmentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter ? appt.appointmentType === typeFilter : true;
        const matchesDate = dateFilter ? appt.appointmentDate?.toString().startsWith(dateFilter) : true;
        return matchesSearch && matchesType && matchesDate;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setTypeFilter('');
        setDateFilter('');
    };

    const columns: AppColumn[] = [
        { label: 'Appt Number', width: 130 },
        { label: 'Date & Time', width: 180 },
        { label: 'Patient', flex: 2 },
        { label: 'Type', width: 140 },
        { label: 'Doctor', flex: 1 },
        { label: 'Status', width: 120 },
    ];

    const rows: AppDataRow[] = filteredAppointments.map(appt => ({
        id: appt.id,
        cells: [
            <span className="text-bodyMedium font-mono text-text-primary">{appt.appointmentNumber}</span>,
            <span className="text-bodyMedium text-text-primary">
                {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleString('en-US', {
                    month: '2-digit', day: '2-digit', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true
                }) : 'N/A'}
            </span>,
            <span className="text-bodyMedium font-medium text-text-primary">{appt.patientName}</span>,
            <span className="text-bodyMedium text-text-primary">{appt.appointmentType}</span>,
            <span className="text-bodyMedium text-text-primary">{appt.doctorId}</span>,
            <span className={`text-caption font-bold px-2 py-1 rounded ${appt.status === 'Completed' ? 'bg-success/20 text-success' :
                    appt.status === 'In Progress' ? 'bg-warning/20 text-warning' :
                        appt.status === 'Cancelled' ? 'bg-error/20 text-error' :
                            'bg-primary-light/20 text-primary'
                }`}>
                {appt.status}
            </span>,
        ]
    }));

    return (
        <>
        <AppPage
            title="Appointments"
            description="Manage and schedule patient appointments and procedures."
            mainButtonTitle="Schedule Appointment"
            mainButtonOnTap={() => setIsCreateOpen(true)}
            secondaryButtons={[
                <button
                    key="board"
                    onClick={() => console.log('Board View')}
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    Board View
                </button>,
                <button
                    key="list"
                    onClick={() => console.log('List View')}
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    List View
                </button>
            ]}
            hasSearch={true}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            secondarySearchHeaderWidgets={[
                <select
                    key="type-filter"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
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
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-37.5"
                />,
                <button
                    key="clear-filters"
                    onClick={handleClearFilters}
                    className="text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2.5 rounded-xl text-buttonText transition-colors"
                >
                    Clear Filters
                </button>
            ]}
            table={
                isLoading ? (
                    <div className="p-8 text-center text-text-secondary">Loading appointments...</div>
                ) : (
                    <AppDataTable columns={columns} rows={rows} />
                )
            }
        />
        {isCreateOpen && (
            <CreateAppointmentDialog onClose={() => setIsCreateOpen(false)} />
        )}
        </>
    );
}
