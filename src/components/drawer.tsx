import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
    MdHome,
    MdDashboard,
    MdPeople,
    MdCalendarToday,
    MdFolderShared,
    MdLocalPharmacy,
    MdScience,
    MdHotel,
    MdEmergency,
    MdMeetingRoom,
    MdHealthAndSafety,
    MdLocalHospital,
} from 'react-icons/md';

export default function Drawer() {
    const location = useLocation();
    const currentPath = location.pathname;
    const { t } = useTranslation();

    return (
        <div className="w-75 h-full bg-primary-dark text-text-inverse flex flex-col border-r border-text-inverse/10">
            {/* Header / Brand Identity */}
            <div className="px-6 py-8 flex items-center gap-4">
                <div className="p-2.5 bg-linear-to-br from-secondary-light to-primary-light rounded-2xl shadow-[0_4px_12px_rgba(147,197,253,0.25)]">
                    <MdLocalHospital className="text-text-inverse text-2xl" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-text-inverse text-h3 tracking-wide">
                        {t('drawer.hospitalApp')}
                    </h3>
                    <span className="text-text-inverse/60 text-caption">
                        {t('drawer.healthcareManagement')}
                    </span>
                </div>
            </div>

            <div className="px-5">
                <hr className="border-text-inverse/10" />
            </div>

            {/* Navigation Links list */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-text-inverse/10">
                <DrawerButton
                    label={t('drawer.overview')}
                    link="/home"
                    icon={<MdHome />}
                    isSelected={currentPath === '/home'}
                />
                <DrawerButton
                    label={t('drawer.dashboard')}
                    link="/dashboard"
                    icon={<MdDashboard />}
                    isSelected={currentPath === '/dashboard'}
                />
                <DrawerButton
                    label={t('drawer.patients')}
                    link="/patients"
                    icon={<MdPeople />}
                    isSelected={currentPath === '/patients'}
                />
                <DrawerButton
                    label={t('drawer.appointments')}
                    link="/appointments"
                    icon={<MdCalendarToday />}
                    isSelected={currentPath === '/appointments'}
                />
                <DrawerButton
                    label={t('drawer.medicalRecords')}
                    link="/medical-records"
                    icon={<MdFolderShared />}
                    isSelected={currentPath === '/medical-records'}
                />
                <DrawerButton
                    label={t('drawer.pharmacy')}
                    link="/pharmacy"
                    icon={<MdLocalPharmacy />}
                    isSelected={currentPath === '/pharmacy'}
                />
                <DrawerButton
                    label={t('drawer.laboratory')}
                    link="/laboratory"
                    icon={<MdScience />}
                    isSelected={currentPath === '/laboratory'}
                />
                <DrawerButton
                    label={t('drawer.inpatientIPD')}
                    link="/inpatient"
                    icon={<MdHotel />}
                    isSelected={currentPath === '/inpatient'}
                />
                <DrawerButton
                    label={t('drawer.emergencyER')}
                    link="/emergency"
                    icon={<MdEmergency />}
                    isSelected={currentPath === '/emergency'}
                />
                <DrawerButton
                    label={t('drawer.operatingRoom')}
                    link="/operating-room"
                    icon={<MdMeetingRoom />}
                    isSelected={currentPath === '/operating-room'}
                />
                <DrawerButton
                    label={t('drawer.insuranceClaims')}
                    link="/insurance"
                    icon={<MdHealthAndSafety />}
                    isSelected={currentPath === '/insurance-claims'}
                />
            </div>

            {/* User / Profile Info Footer */}
            <hr className="border-text-inverse/10" />
            <div className="p-5 bg-black/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-light to-secondary shadow-[0_2px_8px_rgba(153,246,228,0.2)] flex items-center justify-center">
                    <span className="text-text-inverse font-bold text-bodyMedium">JD</span>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <span className="text-text-inverse text-bodyMedium font-bold truncate">
                        {t('drawer.drName')}
                    </span>
                    <span className="text-text-inverse/60 text-caption truncate">
                        {t('drawer.drTitle')}
                    </span>
                </div>
            </div>
        </div>
    );
}

type DrawerButtonProps = {
    label: string;
    link: string;
    icon: React.ReactNode;
    isSelected: boolean;
};

function DrawerButton({ label, link, icon, isSelected }: DrawerButtonProps) {
    return (
        <Link
            to={link}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors duration-200 ${isSelected
                ? 'bg-secondary-light/10 text-text-inverse'
                : 'text-text-inverse/70 hover:bg-white/5 hover:text-text-inverse'
                }`}
        >
            <div className={`text-xl ${isSelected ? 'text-secondary-light' : 'text-text-inverse/55'}`}>
                {icon}
            </div>
            <span className={`text-bodyMedium ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                {label}
            </span>
        </Link>
    );
}