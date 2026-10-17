import { useNavigate } from "react-router";
import AppPage from "../components/app-page";

export default function Home() {
    const navigate = useNavigate();

    function mainButtonOnTap() {
        navigate("/dashboard");
    }

    return (
        <AppPage
            title="Welcome to CarePulse"
            description="A unified platform for hospital operations, finance, HR, supply chain, and more."
            mainButtonTitle="Get Started"
            mainButtonOnTap={mainButtonOnTap}
        />
    )
}