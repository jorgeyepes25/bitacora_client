import { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Avatar } from 'primereact/avatar';
import { useLocation } from 'react-router-dom';
import './styles/Sidebar.css';

export default function SiteBar() {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const location = useLocation();

    useEffect(() => {
        // Mostrar el sidebar solo cuando la ruta comience con '/settings'
        setVisible(location.pathname.startsWith('/settings'));

        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [location.pathname]);

    return (
        <Sidebar
            visible={visible}
            onHide={() => setVisible(false)}
            position='left'
            className={!isMobile ? 'permanent-sidebar' : ''}
            modal={isMobile}
            showCloseIcon={isMobile}
            dismissable={!location.pathname.startsWith('/settings')}
        >
            <div className="min-h-screen flex relative surface-ground">
                <div className="surface-section h-screen flex-shrink-0 border-right-1 surface-border select-none" style={{ width: '280px' }}>
                    <div className="flex flex-column h-full">
                        <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                            <span className="inline-flex align-items-center gap-2">
                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Contenido SVG */}
                                </svg>
                                <span className="font-semibold text-2xl text-primary">Your Logo</span>
                            </span>
                        </div>
                        <div className="overflow-y-auto">
                            {/* Contenido del Sidebar */}
                        </div>
                        <div className="mt-auto">
                            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                            <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                                <span className="font-bold">Amy Elsner</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
