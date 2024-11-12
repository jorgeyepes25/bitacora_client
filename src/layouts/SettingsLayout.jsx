// SettingsLayout.jsx
import Header from "../components/Header";
import SiteBar from "../components/Settinns/SiteBar";
import { Outlet, useLocation } from "react-router-dom";
import "./styles/SettingsLayout.css";

export default function SettingsLayout() {
    const location = useLocation();
    const isSettingsRoute = location.pathname.startsWith("/settings");

    return (
        <div className="settings-layout">
            <Header className={`header ${isSettingsRoute ? "header-settings" : ""}`} />
            <div className="content-layout">
                {isSettingsRoute && <SiteBar className="sidebar" />}
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
