import { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { useLocation } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import useUserStore from "../../store/state/useUserStore";
import { getUserById } from "../../services/userService";
import "./styles/Sidebar.css";

export default function SiteBar() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { userId, token } = useUserStore();

  useEffect(() => {
    setVisible(location.pathname.startsWith("/settings"));

    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && token) {
        try {
          const userData = await getUserById(userId, token);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [userId, token]);

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      position="left"
      className={!isMobile ? "permanent-sidebar" : ""}
      modal={isMobile}
      showCloseIcon={isMobile}
      dismissable={!location.pathname.startsWith("/settings")}
    >
      <div className="min-h-screen flex relative surface-ground">
        <div
          className="surface-section h-screen flex-shrink-0 border-right-1 surface-border select-none"
          style={{ width: "280px" }}
        >
          <div className="flex flex-column h-full">
            <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
              <span className="inline-flex align-items-center gap-2">
                Rol:{" "}
                {user && user.roles
                  ? user.roles.map((role) => role.name).join(", ")
                  : "Cargando..."}
              </span>
            </div>
            <div className="overflow-y-auto">
              <SidebarMenu />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
