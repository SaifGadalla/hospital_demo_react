import { useNavigate, useSearchParams } from "react-router"; // Added useSearchParams
import { useTranslation } from "react-i18next";
import AppPage from "../components/app-page";
import NumberCard from "../components/number-card";
import StatisticsCard from "../components/statistics-card";
import AppDataTable, { type AppColumn, type AppDataRow } from "../components/app-data-table";
import { MdPeople, MdCalendarToday, MdBed, MdHealing } from "react-icons/md";

import { useTodayAppointments } from "../features/appointments/api/useTodayAppointments";
import { useActiveER } from "../features/er/api/useActiveER";
import { useWardOccupancy } from "../features/beds/api/useWardOccupancy";
import { useBedsStats } from "../features/beds/api/useBedsStats";
import { useInsuranceClaims } from "../features/insurance/api/useInsuranceClaims";
import { usePatientsStats } from "../features/patients/api/usePatientsStats";

import type { Appointment } from "../features/appointments/types";
import type { ERPatient } from "../features/er/types";
import type { WardOccupancy } from "../features/beds/types/index";
import type { InsuranceClaim } from "../features/insurance/types";

// Helpers for styled badges
const TriageBadge = ({ level }: { level: number }) => {
    const colors = [
        'bg-gray-200 text-gray-800',
        'bg-red-500 text-white',
        'bg-orange-500 text-white',
        'bg-yellow-500 text-white',
        'bg-green-500 text-white',
        'bg-blue-500 text-white',
    ];
    const color = colors[level] || colors[0];
    return <span className={`px-2 py-1 rounded text-caption font-bold ${color}`}>{level}</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-gray-100 text-gray-800';
    const s = status.toLowerCase();
    if (['completed', 'approved'].includes(s)) color = 'bg-success/20 text-success';
    if (['in progress', 'waiting', 'admitted', 'pending review'].includes(s)) color = 'bg-warning/20 text-warning';
    if (['stat', 'rejected'].includes(s)) color = 'bg-error/20 text-error';

    return <span className={`px-2 py-1 rounded text-caption font-bold ${color}`}>{status}</span>;
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paramsStr = searchParams.toString();
    const { t } = useTranslation();

    // Fetch from all features independently
    const { data: appointmentsData, isLoading: isLoadingAppts } = useTodayAppointments(paramsStr);
    const { data: erData, isLoading: isLoadingEr } = useActiveER(paramsStr);
    const { data: wardsData, isLoading: isLoadingWards } = useWardOccupancy(paramsStr);
    const { data: bedsStats, isLoading: isLoadingBedsStats } = useBedsStats(paramsStr);
    const { data: insuranceData, isLoading: isLoadingClaims } = useInsuranceClaims(paramsStr);
    const { data: patientsStats, isLoading: isLoadingPatientsStats } = usePatientsStats(paramsStr);

    const isLoading = isLoadingAppts || isLoadingEr || isLoadingWards || isLoadingBedsStats || isLoadingClaims || isLoadingPatientsStats;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-bodyLarge text-text-secondary">{t('dashboard.loadingDashboard')}</p>
            </div>
        );
    }

    const appointmentsColumns: AppColumn[] = [
        { label: t('dashboard.columns.time'), width: 70 },
        { label: t('dashboard.columns.patient'), flex: 1 },
        { label: t('dashboard.columns.type'), width: 120 },
        { label: t('dashboard.columns.status'), flex: 1 },
    ];

    const appointmentsRows: AppDataRow[] = appointmentsData?.items?.map((a: Appointment) => ({
        id: a.id,
        cells: [
            <span key="time" className="font-mono text-bodySmall">{a.startTime?.toString()}</span>,
            <span key="patient" className="text-bodyMedium font-medium">{a.patientName}</span>,
            <span key="type">{a.appointmentType}</span>,
            <StatusBadge key="status" status={a.status ?? ''} />
        ]
    })) || [];

    const erColumns: AppColumn[] = [
        { label: t('dashboard.columns.call'), width: 130 },
        { label: t('dashboard.columns.patient'), flex: 1 },
        { label: t('dashboard.columns.triage'), width: 90 },
        { label: t('dashboard.columns.status'), flex: 1 },
    ];

    const erRows: AppDataRow[] = erData?.items?.map((e: ERPatient) => ({
        id: e.id,
        cells: [
            <span key="call" className="font-mono text-bodySmall">{e.call}</span>,
            <span key="patient" className="text-bodyMedium font-medium">{e.patientName}</span>,
            <TriageBadge key="triage" level={e.triage} />,
            <StatusBadge key="status" status={e.status} />
        ]
    })) || [];

    return (
        <AppPage
            title={t('dashboard.title')}
            description={t('dashboard.description')}
            mainButtonTitle={t('dashboard.newAppointment')}
            mainButtonOnTap={() => navigate('/appointments')}
            secondaryButtons={[
                <button
                    key="patients"
                    onClick={() => navigate('/patients')}
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                >
                    {t('dashboard.viewPatients')}
                </button>
            ]}
            numberCards={[
                <NumberCard
                    key="1"
                    title={t('dashboard.totalPatients')}
                    icon={<MdPeople />}
                    value={patientsStats?.totalPatients || 0}
                />,
                <NumberCard
                    key="2"
                    title={t('dashboard.todaysAppointments')}
                    icon={<MdCalendarToday />}
                    value={appointmentsData?.items?.length || 0}
                    subtitle={t('dashboard.totalAppointmentsOnFile', { count: appointmentsData?.totalCount || 0 })}
                />,
                <NumberCard
                    key="3"
                    title={t('dashboard.erActive')}
                    icon={<MdBed />}
                    value={erData?.items?.length || 0}
                    subtitle={t('dashboard.totalERToday', { count: erData?.totalCount || 0 })}
                />,
                <NumberCard
                    key="4"
                    title={t('dashboard.bedsFree')}
                    icon={<MdHealing />}
                    value={`${bedsStats?.freeBeds || 0} / ${bedsStats?.totalBeds || 0}`}
                    subtitle={t('common.acrossAllWards')}
                />
            ]}
            customBody={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    {/* Today's Appointments */}
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.todaysAppointmentsCard')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('common.viewAll')}
                                </button>
                            }
                            content={<AppDataTable columns={appointmentsColumns} rows={appointmentsRows} />}
                        />
                    </div>

                    {/* Active ER */}
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.activeER')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.openER')}
                                </button>
                            }
                            content={<AppDataTable columns={erColumns} rows={erRows} />}
                        />
                    </div>

                    {/* Bed Occupancy */}
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.bedOccupancy')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.manageIPD')}
                                </button>
                            }
                            content={
                                <div className="flex flex-col p-4 gap-6">
                                    {wardsData?.map((ward: WardOccupancy) => {
                                        const percentage = Math.min(100, Math.round((ward.occupied / ward.total) * 100));
                                        return (
                                            <div key={ward.id} className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-bodyMedium">
                                                    <span className="font-medium text-text-primary">{ward.name}</span>
                                                    <span className="text-text-secondary">{ward.occupied} / {ward.total}</span>
                                                </div>
                                                <div className="w-full bg-success-bg h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-success h-full rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            }
                        />
                    </div>

                    {/* Insurance Claims */}
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.insuranceClaims')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.manageClaims')}
                                </button>
                            }
                            content={
                                <div className="flex flex-col p-4 gap-6">
                                    {insuranceData?.items.map((claim: InsuranceClaim) => {
                                        const total = (claim.total ?? claim.totalAmount) || 0;
                                        const claimed = (claim.claimed ?? claim.claimedAmount) || 0;
                                        const percentage = total > 0 ? Math.round((claimed / total) * 100) : 0;
                                        return (
                                            <div key={claim.id} className="flex items-center gap-4">
                                                <span className="w-1/3 text-bodyMedium font-medium text-text-primary truncate">
                                                    {claim.status}
                                                </span>
                                                <div className="flex-1 bg-primary-light/20 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="w-12 text-right text-bodyMedium font-bold text-text-secondary">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            }
                        />
                    </div>
                </div>
            }
        />
    );
}