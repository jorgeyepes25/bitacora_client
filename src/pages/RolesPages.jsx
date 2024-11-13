import { useState } from 'react';
import { Button } from 'primereact/button';
import RolesDataTable from '../components/Settinns/RolesDataTable';
import CreateRoleModal from '../components/Settinns/CreateRoleModal';

const RolesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const refreshRoles = () => {
        setRefresh(prev => !prev);
    };

    return (
        <div>
            <h1>Roles Page</h1>
            <div className="roles-header">
                <Button label="Crear Rol" icon="pi pi-plus" onClick={handleOpenModal} className="p-button-primary" />
            </div>
            <RolesDataTable key={refresh} />
            <CreateRoleModal visible={isModalOpen} onHide={handleCloseModal} onRoleCreated={refreshRoles} />
        </div>
    );
};

export default RolesPage;
