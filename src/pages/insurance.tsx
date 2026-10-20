import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
    const totalClaimed = claims.reduce((sum, c) => sum + (c.claimedAmount || 0), 0);

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
                { label: t('insurance.claimsColumns.claimNumber'), width: 110 },
                { label: t('insurance.claimsColumns.serviceDate'), width: 120 },
                { label: t('insurance.claimsColumns.patient'), flex: 1.5 },
                { label: t('insurance.claimsColumns.plan'), flex: 1.5 },
                { label: t('insurance.claimsColumns.total'), width: 100 },
                { label: t('insurance.claimsColumns.paid'), width: 100 },
                { label: t('insurance.claimsColumns.status'), width: 110 },
                { label: t('insurance.claimsColumns.actions'), width: 100 },
            ];
            const rows: AppDataRow[] = claims.map(c => ({
                id: c.id,
                cells: [
                    <span className="text-bodyMedium font-mono text-text-primary">{c.claimNumber}</span>,
                    <span className="text-bodyMedium text-text-primary">{c.serviceDate ? new Date(c.serviceDate).toLocaleDateString() : t('common.notAvailable')}</span>,
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
                        <button onClick={() => setViewClaim(c)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title={t('common.viewDetails')}>
                            <MdVisibility size={20} />
                        </button>
                        <button onClick={() => setResubmitClaim(c)} className="p-2 text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors" title={t('insurance.resubmit')}>
                            <MdRefresh size={20} />
                        </button>
                    </div>
                ]
            }));
            if (isClaimsLoading) {
                return <div className="p-8 text-center text-text-secondary">{t('insurance.loadingClaims')}</div>;
            }
            return <AppDataTable columns={cols} rows={rows} />;
        }

        if (activeTab === 'preAuths') {
            const cols: AppColumn[] = [
                { label: t('insurance.preAuthColumns.authNumber'), width: 110 },
                { label: t('insurance.preAuthColumns.patient'), flex: 1.5 },
                { label: t('insurance.preAuthColumns.service'), flex: 2 },
                { label: t('insurance.preAuthColumns.estCost'), width: 110 },
                { label: t('insurance.preAuthColumns.status'), width: 110 },
                { label: t('insurance.preAuthColumns.validity'), width: 120 },
                { label: t('insurance.preAuthColumns.actions'), width: 100 },
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
                        <button onClick={() => setViewPreAuth(a)} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors" title={t('common.viewDetails')}>
                            <MdVisibility size={20} />
                        </button>
                        <button
                            onClick={() => setCancelPreAuth(a)}
                            disabled={a.approvalStatus === 'Cancelled' || a.approvalStatus === 'Rejected'}
                            className={`p-2 rounded-full transition-colors ${a.approvalStatus === 'Cancelled' || a.approvalStatus === 'Rejected' ? 'text-divider cursor-not-allowed' : 'text-error hover:bg-error/10'}`}
                            title={t('common.cancel')}
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
                { label: t('insurance.plansColumns.code'), width: 100 },
                { label: t('insurance.plansColumns.planName'), flex: 2 },
                { label: t('insurance.plansColumns.coverage'), width: 100 },
                { label: t('insurance.plansColumns.coPay'), width: 100 },
                { label: t('insurance.plansColumns.deductible'), width: 110 },
                { label: t('insurance.plansColumns.annualLimit'), width: 120 },
                { label: t('insurance.plansColumns.preAuth'), width: 100 },
                { label: t('insurance.plansColumns.status'), width: 100 },
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
                    <span className="text-bodyMedium text-text-primary">{p.preAuthRequired ? t('common.required') : t('common.no')}</span>,
                    <span className={`text-caption font-bold px-2 py-1 rounded ${p.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {p.isActive ? t('common.active') : t('common.inactive')}
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
                title={t('insurance.title')}
                description={t('insurance.description')}
                mainButtonTitle={t('insurance.newClaim')}
                mainButtonOnTap={() => setIsCreateOpen(true)}
                numberCards={[
                    <NumberCard key="total" title={t('insurance.totalClaims')} value={totalClaims} icon={<MdDescription size={24} />} />,
                    <NumberCard key="approved" title={t('insurance.approvedPaid')} value={approvedOrPaid} icon={<MdCheckCircle size={24} />} />,
                    <NumberCard key="rejected" title={t('insurance.rejected')} value={rejected} icon={<MdCancel size={24} />} />,
                    <NumberCard key="claimed" title={t('insurance.totalClaimed')} value={`$${Math.floor(totalClaimed)}`} icon={<MdAttachMoney size={24} />} />,
                ]}
                hasSearch={false}
                customBody={
                    <div className="flex border-b border-divider mb-6 gap-6">
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'claims' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {t('insurance.claims')}
                        </button>
                        <button
                            onClick={() => setActiveTab('preAuths')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'preAuths' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {t('insurance.preAuthorizations')}
                        </button>
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`py-3 px-1 border-b-2 transition-colors text-buttonText ${activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {t('insurance.insurancePlans')}
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
                            <h2 className="text-h3 text-text-primary">{t('insurance.claim')}: {viewClaim.claimNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label={t('insurance.detail.patient')} value={viewClaim.patientName} />
                            <AppDetailRow label={t('insurance.detail.plan')} value={viewClaim.insurancePlanName} />
                            <AppDetailRow label={t('insurance.detail.serviceDate')} value={viewClaim.serviceDate ? new Date(viewClaim.serviceDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : t('common.notAvailable')} />
                            <AppDetailRow label={t('insurance.detail.totalAmount')} value={`$${(viewClaim.totalAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label={t('insurance.detail.claimedAmount')} value={`$${(viewClaim.claimedAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label={t('insurance.detail.paidAmount')} value={`$${(viewClaim.paidAmount || 0).toFixed(2)}`} />
                            <AppDetailRow label={t('insurance.detail.status')} value={viewClaim.status} />
                            <AppDetailRow label={t('insurance.detail.diagnosisCodes')} value={viewClaim.diagnosisCodes} />
                            <AppDetailRow label={t('insurance.detail.procedureCodes')} value={viewClaim.procedureCodes} />
                            <AppDetailRow label={t('insurance.detail.notes')} value={viewClaim.notes} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewClaim(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.close')}
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
                            <h2 className="text-h3 text-text-primary">{t('insurance.preAuth')}: {viewPreAuth.authNumber}</h2>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <AppDetailRow label={t('insurance.detail.patient')} value={viewPreAuth.patientName} />
                            <AppDetailRow label={t('insurance.detail.plan')} value={viewPreAuth.insurancePlanName} />
                            <AppDetailRow label={t('insurance.detail.serviceRequested')} value={viewPreAuth.serviceRequested} />
                            <AppDetailRow label={t('insurance.detail.estimatedCost')} value={`$${viewPreAuth.estimatedCost.toFixed(2)}`} />
                            <AppDetailRow label={t('insurance.detail.status')} value={viewPreAuth.approvalStatus} />
                            <AppDetailRow label={t('insurance.detail.validFrom')} value={new Date(viewPreAuth.validFrom).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} />
                            <AppDetailRow label={t('insurance.detail.validTo')} value={new Date(viewPreAuth.validTo).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} />
                        </div>
                        <div className="p-4 border-t border-divider flex justify-end">
                            <button
                                onClick={() => setViewPreAuth(null)}
                                className="px-6 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.close')}
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
                            <h2 className="text-h3 text-text-primary mb-2">{t('insurance.resubmitClaim')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('insurance.resubmitClaimMessage')} <span className="font-medium text-text-primary">{resubmitClaim.claimNumber}</span>?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setResubmitClaim(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={confirmResubmit}
                                className="px-5 py-2 rounded-xl text-buttonText text-primary hover:bg-primary/10 transition-colors"
                            >
                                {t('insurance.resubmit')}
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
                            <h2 className="text-h3 text-text-primary mb-2">{t('insurance.cancelPreAuth')}</h2>
                            <p className="text-bodyMedium text-text-secondary">
                                {t('insurance.cancelPreAuthMessage')} <span className="font-medium text-text-primary">{cancelPreAuth.authNumber}</span>?
                            </p>
                        </div>
                        <div className="p-4 bg-surface flex justify-end gap-3 border-t border-divider">
                            <button
                                onClick={() => setCancelPreAuth(null)}
                                className="px-5 py-2 rounded-xl text-buttonText text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {t('common.no')}
                            </button>
                            <button
                                onClick={confirmCancelPreAuth}
                                className="px-5 py-2 rounded-xl text-buttonText text-error hover:bg-error/10 transition-colors"
                            >
                                {t('common.yesCancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
