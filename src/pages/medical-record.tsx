import AppPage from '../components/app-page';

export default function MedicalRecords() {
    return (
        <AppPage
            title="Medical Records"
            description="View and manage patient clinical histories, diagnoses, and treatment plans."
            mainButtonTitle="New Record"
            customBody={
                <div className="flex flex-col lg:flex-row gap-5 mt-4 items-start">
                    <div className="w-full lg:w-87.5 shrink-0 bg-surface border border-border-theme rounded-xl p-4 flex flex-col max-h-200">
                        <h4 className="text-h4 text-text-primary mb-3">Records</h4>
                        <hr className="border-divider mb-4" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="w-full bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-bodyMedium text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors mb-4"
                        />
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                            <p className="text-bodyMedium text-text-secondary text-center py-4">No records found.</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full bg-surface-elevated border border-border-theme rounded-xl p-6 min-h-125">
                        <div className="h-full flex items-center justify-center">
                            <span className="text-bodyMedium text-text-secondary">
                                Select a record to view details
                            </span>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
