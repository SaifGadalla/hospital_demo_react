import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import AppPage from "../components/app-page";

export default function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function navToDashboard() {
        navigate("/dashboard");
    }

    return (
        <AppPage
            title={t('home.title')}
            description={t('home.description')}
            mainButtonTitle={t('home.getStarted')}
            mainButtonOnTap={navToDashboard}
        />
    )
}