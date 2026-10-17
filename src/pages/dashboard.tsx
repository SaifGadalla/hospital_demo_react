import AppPage from "../components/app-page";
import NumberCard from "../components/number-card";
import StatisticsCard from "../components/statistics-card";
import AppDataTable, { type AppColumn, type AppDataRow } from "../components/app-data-table";
import { MdPeople, MdCalendarToday, MdBed, MdHealing } from "react-icons/md";
import { useNavigate } from "react-router";
import { usePatients } from "../hooks/usePatients";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: patientsData } = usePatients();

    const appointmentsColumns: AppColumn[] = [
        { label: t('common.time'), width: 70 },
        { label: t('common.patient'), flex: 1 },
        { label: t('common.type'), width: 120 },
        { label: t('common.status'), flex: 1 },
    ];
    const appointmentsRows: AppDataRow[] = [];

    const erColumns: AppColumn[] = [
        { label: t('dashboard.columns.call'), width: 130 },
        { label: t('common.patient'), flex: 1 },
        { label: t('dashboard.columns.triage'), width: 90 },
        { label: t('common.status'), flex: 1 },
    ];
    const erRows: AppDataRow[] = [];

    function secondaryButtonOnClick() {
        navigate("/patients");
    }

    function mainButtonOnClick() {
        navigate("/appointments");
    }

    return (
        <AppPage
            title={t('dashboard.title')}
            description={t('dashboard.description')}
            mainButtonTitle={t('dashboard.newAppointment')}
            mainButtonOnTap={mainButtonOnClick}
            secondaryButtons={[
                <button
                    key="patients"
                    className="text-primary hover:bg-primary/10 px-4 py-2 rounded-xl text-buttonText transition-colors"
                    onClick={secondaryButtonOnClick}
                >
                    {t('dashboard.viewPatients')}
                </button>
            ]}
            numberCards={[
                <NumberCard
                    key="1"
                    title={t('dashboard.totalPatients')}
                    icon={<MdPeople />}
                    value={patientsData?.totalCount ?? 0}
                />,
                <NumberCard
                    key="2"
                    title={t('dashboard.todaysAppointments')}
                    icon={<MdCalendarToday />}
                    value={0}
                    subtitle={t('dashboard.totalAppointmentsSubtitle', { count: 0 })}
                />,
                <NumberCard
                    key="3"
                    title={t('dashboard.erActive')}
                    icon={<MdBed />}
                    value={0}
                    subtitle={t('dashboard.totalErSubtitle', { count: 0 })}
                />,
                <NumberCard
                    key="4"
                    title={t('dashboard.bedsFree')}
                    icon={<MdHealing />}
                    value="0 / 0"
                    subtitle={t('dashboard.acrossAllWards')}
                />
            ]}
            customBody={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.todaysAppointments')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('common.viewAll')}
                                </button>
                            }
                            content={<AppDataTable columns={appointmentsColumns} rows={appointmentsRows} />}
                        />
                    </div>
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.activeEr')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.openEr')}
                                </button>
                            }
                            content={<AppDataTable columns={erColumns} rows={erRows} />}
                        />
                    </div>
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.bedOccupancy')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.manageIpd')}
                                </button>
                            }
                            content={<div className="flex flex-col p-4 gap-6"></div>}
                        />
                    </div>
                    <div className="h-100">
                        <StatisticsCard
                            title={<h3 className="text-h4 text-text-primary">{t('dashboard.insuranceClaims')}</h3>}
                            action={
                                <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-buttonText transition-colors">
                                    {t('dashboard.manageClaims')}
                                </button>
                            }
                            content={<div className="flex flex-col p-4 gap-6"></div>}
                        />
                    </div>
                </div>
            }
        />
    );
}