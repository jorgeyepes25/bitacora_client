// componentes/Settinns/SidebarMenu.js
import { Link } from 'react-router-dom';
import './styles/SidebarMenu.css';

export default function SidebarMenu() {
    const menuItems = [
        { label: 'Users', path: '/settings/users' },
        { label: 'Roles', path: '/settings/roles' },
        { label: 'Bitacoras', path: '/settings/bitacoras' },
    ];

    return (
        <div className="sidebar-menu">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className="sidebar-menu-item text-700 hover:text-primary transition-duration-150 transition-colors"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
