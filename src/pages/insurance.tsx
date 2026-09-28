import { useState } from 'react';
import AppPage from '../components/app-page';
import NumberCard from '../components/number-card';
import AppDataTable, { type AppColumn, type AppDataRow } from '../components/app-data-table';
import AppDetailRow from '../components/app-detail-row';
import { MdDescription, MdCheckCircle, MdCancel, MdAttachMoney, MdVisibility, MdRefresh } from 'react-icons/md';

import { useInsuranceClaims } from '../features/insurance/api/useInsuranceClaims';
import CreateInsuranceClaimDialog from '../components/dialogs/CreateInsuranceClaimDialog';
import type { InsurancePlan, InsurancePreauthorization } from '../features/insurance/types';

const initialPreAuths: InsurancePreauthorization[] = [
    {
        id: '1', authNumber: 'AUTH-991', patientName: 'John Doe', insurancePlanName: 'Cigna Plus',
        serviceRequested: 'MRI Knee', estimatedCost: 2500, approvalStatus: 'Approved',
        validFrom: '2023-10-01T00:00:00Z', validTo: '2023-11-01T00:00:00Z'
    },
    {
        id: '2', authNumber: 'AUTH-992', patientName: 'Jane Smith', insurancePlanName: 'BlueCross Gold',
        serviceRequested: 'Physical Therapy (12 sessions)', estimatedCost: 1800, approvalStatus: 'Pending',
        validFrom: '2023-10-20T00:00:00Z', validTo: '2024-04-20T00:00:00Z'
    },
];

const initialPlans: InsurancePlan[] = [
    {
        id: '1', planCode: 'BC-GLD', planName: 'BlueCross Gold', coveragePercentage: 80,
        coPayAmount: 20, deductibleAmount: 1000, annualLimit: 1000000, preAuthRequired: true, isActive: true
    },
    {
        id: '2', planCode: 'MED-B', planName: 'Medicare Part B', coveragePercentage: 80,
        coPayAmount: 0, deductibleAmount: 226, annualLimit: 0, preAuthRequired: false, isActive: true
    },
];

type Tab = 'claims' | 'preAuths' | 'plans';

export default function Insurance() {
    const [activeTab, setActiveTab] = useState<Tab>('claims');

    const { data: claimsData, isLoading: isClaimsLoading } = useInsuranceClaims();
    const claims = claimsData?.items || [];

    const [preAuths, setPreAuths] = useState<any[]>(initialPreAuths);
    const [plans] = useState<any[]>(initialPlans);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Dialog states
    const [viewClaim, setViewClaim] = useState<any | null>(null);
    const [resubmitClaim, setResubmitClaim] = useState<any | null>(null);
    const [viewPreAuth, setViewPreAuth] = useState<any | null>(null);
    const [cancelPreAuth, setCancelPreAuth] = useState<any | null>(null);

    // Statistics
    const totalClaims = claims.length;
    const approvedOrPaid = claims.filter(c => c.status === 'Approved' || c.status === 'Paid').length;
    const rejected = claims.filter(c => c.status === 'Rejected').length;
    const totalClaimed = claims.reduce((sum, c) => sum + c.claimedAmount, 0);

    // Actions
    const confirmResubmit = () => {
        if (!resubmitClaim) return;
        // Mock action
        setResubmitClaim(null);
    };

    const confirmCancelPreAuth = () => {
        if (!cancelPreAuth) return;
        setPreAuths(prev => prev.map(a => a.id === cancelPreAuth.id ? { ...a, approvalStatus: 'Cancelled' } : a));
        setCancelPreAuth(null);
    };

    // Table renderers
    const renderTable = () => {
        if (activeTab === 'claims') {
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
            const rows: AppDataRow[] = claims.map(c => ({
                id: c.id,
                cells: [
                    <span className="text-bodyMedium font-mono text-text-primary">{c.claimNumber}</span>,
                    <span className="text-bodyMedium text-text-primary">{new Date(c.serviceDate).toLocaleDateString()}</span>,
                    <span className="text-bodyMedium font-medium text-text-primary">{c.patientName}</span>,
                    <span className="text-bodyMedium text-text-primary">{c.insurancePlanName}</span>,
                    <span className="text-bodyMedium text-text-primary">${(c.totalAmount || 0).toFixed(2)}</span>,
                    <span className="text-bodyMedium text-text-primary">${(c.paidAmount || 0).toFixed(2)}</span>,
                    <span className={`text-caption font-bold px-2 py-1 rounded ${c.status === 'Paid' || c.status === 'Approved' ? 'bg-success/20 text-success' :
                        c.status === 'Rejected' ? 'bg-error/20 text-error' :
                            'bg-warning/20 text-warning'
                        }`}>
                        {c.status}
                    </span>,
                    <div className="flex items-center gap-1">
                        <button onClick={() => setViewClaim(c)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="View">
                            <MdVisibility size={20} />
                        </button>
                        <button onClick={() => setResubmitClaim(c)} className="p-2 text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors" title="Resubmit">
                            <MdRefresh size={20} />
                        </button>
                    </div>
                ]
            }));
            if (isClaimsLoading) {
                return <div className="p-8 text-center text-text-secondary">Loading claims...</div>;
            }
            return <AppDataTable columns={cols} rows={rows} />;
        }

        if (activeTab === 'preAuths') {
            const cols: AppColumn[] = [
                { label: 'Auth #', width: 110 },
                { label: 'Patient', flex: 1.5 },
                { label: 'Service', flex: 2 },
                { label: 'Est. Cost', width: 110 },
                { label: 'Status', width: 110 },
                { label: 'Validity', width: 120 },
                { label: 'Actions', width: 100 },
            ];
            const rows: AppDataRow[] = preAuths.map(a => ({
                id: a.id,
                cells: [
                    <span className="text-bodyMedium font-mono text-text-primary">{a.authNumber}</span>,
                    <span className="text-bodyMedium font-medium text-text-primary">{a.patientName}</span>,
                    <span className="text-bodyMedium text-text-primary truncate">{a.serviceRequested}</span>,
                    <span className="text-bodyMedium text-text-primary">${a.estimatedCost.toFixed(2)}</span>,
                    <span className={`text-caption font-bold px-2 py-1 rounded ${a.approvalStatus === 'Approved' ? 'bg-success/20 text-success' :
                        a.approvalStatus === 'Rejected' || a.approvalStatus === 'Cancelled' ? 'bg-error/20 text-error' :
                            'bg-warning/20 text-warning'
                        }`}>
                        {a.approvalStatus}
                    </span>,
                    <span className="text-bodyMedium text-text-primary">{new Date(a.validTo).toLocaleDateString()}</span>,
                    <div className="flex items-center gap-1">
                        <button onClick={() => setViewPreAuth(a)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title="View">
                            <MdVisibility size={20} />
                        </button>
                        <button
                            onClick={() => setCancelPreAuth(a)}
                            disabled={a.approvalStatus === 'Cancelled' || a.approvalStatus === 'Rejected'}
                            className={`p-2 rounded-full transition-colors ${a.approvalStatus === 'Cancelled' || a.approvalStatus === 'Rejected' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                            title="Cancel"
                        >
                            <MdCancel size={20} />
                        </button>
                    </div>
                ]
            }));
            return <AppDataTable columns={cols} rows={rows} />;
        }

        if (activeTab === 'plans') {
            const cols: AppColumn[] = [
                { label: 'Code', width: 100 },
                { label: 'Plan Name', flex: 2 },
                { label: 'Coverage', width: 100 },
                { label: 'Co-Pay', width: 100 },
                { label: 'Deductible', width: 110 },
                { label: 'Annual Limit', width: 120 },
                { label: 'Pre-Auth', width: 100 },
                { label: 'Status', width: 100 },
            ];
            const rows: AppDataRow[] = plans.map(p => ({
                id: p.id,
                cells: [
                    <span className="text-bodyMedium font-mono text-text-primary">{p.planCode}</span>,
                    <span className="text-bodyMedium font-medium text-text-primary">{p.planName}</span>,
                    <span className="text-bodyMedium text-text-primary">{p.coveragePercentage}%</span>,
                    <span className="text-bodyMedium text-text-primary">${p.coPayAmount.toFixed(2)}</span>,
                    <span className="text-bodyMedium text-text-primary">${p.deductibleAmount.toFixed(2)}</span>,
                    <span className="text-bodyMedium text-text-primary">${p.annualLimit.toFixed(2)}</span>,
                    <span className="text-bodyMedium text-text-primary">{p.preAuthRequired ? 'Required' : 'No'}</span>,
                    <span className={`text-caption font-bold px-2 py-1 rounded ${p.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                ]
            }));
            return <AppDataTable columns={cols} rows={rows} />;
        }

        return null;
    };

    return (
        <>
            <AppPage
                title="Insurance & Billing"
                description="Manage insurance claims, pre-authorizations, and accepted plans."
                mainButtonTitle="New Claim"
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title="Total Claims" value={totalClaims} icon={<MdDescription size={24} />} />,
                    <NumberCard key="approved" title="Approved/Paid" value={approvedOrPaid} icon={<MdCheckCircle size={24} />} />,
                    <NumberCard key="rejected" title="Rejected" value={rejected} icon={<MdCancel size={24} />} />,
                    <NumberCard key="claimed" title="Total Claimed" value={`$${Math.floor(totalClaimed)}`} icon={<MdAttachMoney size={24} />} />,
                ]}
                hasSearch={false}
                customBody={
                    <div className="flex border-b border-divider mb-6 gap-6">
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'claims' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Claims
                        </button>
                        <button
                            onClick={() => setActiveTab('preAuths')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'preAuths' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Pre-Authorizations
                        </button>
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Insurance Plans
                        </button>
                    </div>
                }
                table={renderTable()}
            />

            {isCreateOpen && (
                <CreateInsuranceClaimDialog onClose={() => setIsCreateOpen(false)} />
            )}

            {/* View Claim Dialog */}
            {viewClaim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">Claim: {viewClaim.claimNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label="Patient" value={viewClaim.patientName} />
                            <AppDetailRow label="Plan" value={viewClaim.insurancePlanName} />
                            <AppDetailRow label="Service Date" value={viewClaim.serviceDate ? new Date(viewClaim.serviceDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'} />
                            <AppDetailRow label="Total Amount" value={`$${(viewClaim.totalAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label="Claimed Amount" value={`$${(viewClaim.claimedAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label="Paid Amount" value={`$${(viewClaim.paidAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label="Status" value={viewClaim.status} />
                            <AppDetailRow label="Diagnosis Codes" value={viewClaim.diagnosisCodes} />
                            <AppDetailRow label="Procedure Codes" value={viewClaim.procedureCodes} />
                            <AppDetailRow label="Notes" value={viewClaim.notes} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewClaim(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Pre-Auth Dialog */}
            {viewPreAuth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                        <div className="p-6 border-b border-divider">
                            <h2 className="text-h3 text-text-primary">Pre-Auth: {viewPreAuth.authNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label="Patient" value={viewPreAuth.patientName} />
                            <AppDetailRow label="Plan" value={viewPreAuth.insurancePlanName} />
                            <AppDetailRow label="Service Requested" value={viewPreAuth.serviceRequested} />
                            <AppDetailRow label="Estimated Cost" value={`$${viewPreAuth.estimatedCost.toFixed(2)}`} />
                            <AppDetailRow label="Status" value={viewPreAuth.approvalStatus} />
                            <AppDetailRow label="Valid From" value={new Date(viewPreAuth.validFrom).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} />
                            <AppDetailRow label="Valid To" value={new Date(viewPreAuth.validTo).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewPreAuth(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resubmit Claim Confirmation */}
            {resubmitClaim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Resubmit Claim</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Are you sure you want to resubmit claim <span className="font-medium text-text-primary">{resubmitClaim.claimNumber}</span>?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setResubmitClaim(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmResubmit}
                                className="px-5 py-2 rounded-xl text-buttonText text-primary hover:bg-primary/10 transition-colors"
                            >
                                Resubmit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Pre-Auth Confirmation */}
            {cancelPreAuth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-surface rounded-2xl border border-border-theme shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-6">
                            <h2 className="text-h3 text-text-primary mb-2">Cancel Pre-Auth</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                Are you sure you want to cancel pre-authorization <span className="font-medium text-text-primary">{cancelPreAuth.authNumber}</span>?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelPreAuth(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmCancelPreAuth}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
