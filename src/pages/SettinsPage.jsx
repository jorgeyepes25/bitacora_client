import Header from "../components/Header";
import SiteBar from "../components/Settinns/SiteBar";
import { useLocation } from "react-router-dom";

export default function SettinsPage() {
    const location = useLocation();
    const isSettingsRoute = location.pathname.startsWith("/settings");

    return (
        <div className="settings-page">
            <Header className={`header ${isSettingsRoute ? "header-settings" : ""}`} />
            {isSettingsRoute && <SiteBar />}
            <div className="main-content">
                <h1>Settings Page</h1>
                Settings Page
            </div>
        </div>
    );
}
