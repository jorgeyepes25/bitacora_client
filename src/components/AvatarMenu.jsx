import { useRef, useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/state/useUserStore";
import { getUserById } from "../services/userService";
import "./styles/AvatarMenu.css";

const AvatarMenu = () => {
  const navigate = useNavigate();
  const menu = useRef(null);

  const { userId, token } = useUserStore();
  const [user, setUser] = useState(null);

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

  // Verificar si el usuario tiene el rol de 'admin'
  const isAdmin = user?.roles?.some((role) => role.name === "admin");

  const menuItems = [
    { label: user?.username || "Perfil", icon: "pi pi-user" },
    ...(isAdmin ? [{ label: "Configuración", icon: "pi pi-cog", command: () => navigate("/settings") }] : []),
    { label: "Cerrar sesión", icon: "pi pi-sign-out", command: () => navigate("/logout") },
  ];

  if (!userId || !user) return null;

  return (
    <div className="avatar-menu">
      <Avatar
        label={user?.username?.charAt(0).toUpperCase()}
        icon={!user?.username ? "pi pi-user" : null}
        size="large"
        shape="circle"
        className="avatar"
        onClick={(e) => menu.current && menu.current.toggle(e)}
      />
      <Menu model={menuItems} popup ref={menu} />
    </div>
  );
};

export default AvatarMenu;
