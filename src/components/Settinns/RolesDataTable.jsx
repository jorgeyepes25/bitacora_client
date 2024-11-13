import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { getRoles, deleteRole } from '../../services/userService';
import useUserStore from '../../store/state/useUserStore';
import PropTypes from 'prop-types'; // Importar PropTypes

const RolesDataTable = ({ refresh }) => {
    const [roles, setRoles] = useState([]);
    const { token } = useUserStore();

    useEffect(() => {
        const fetchRoles = async () => {
            const data = await getRoles(token);
            setRoles(data);
        };

        fetchRoles();
    }, [token, refresh]);

    const confirmDeleteRole = (roleId) => {
        toast(
            (t) => (
                <div>
                    <p>¿Estás seguro de que deseas eliminar este rol?</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => toast.dismiss(t)} className="p-button-text" />
                        <Button
                            label="Eliminar"
                            icon="pi pi-check"
                            onClick={() => handleDelete(roleId, t)}
                            className="p-button-danger"
                        />
                    </div>
                </div>
            ),
            { duration: 5000 }
        );
    };

    const handleDelete = async (roleId, toastId) => {
        try {
            await deleteRole(roleId, token);
            toast.dismiss(toastId);
            toast.success('Rol eliminado exitosamente');
            setRoles(roles.filter((role) => role._id !== roleId));
        } catch (error) {
            console.error('Error al eliminar el rol:', error);
            toast.error('Error al eliminar el rol. Por favor, intente de nuevo.');
        }
    };

    const actionTemplate = (rowData) => {
        return (
            <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button-danger p-button-text"
                onClick={() => confirmDeleteRole(rowData._id)}
            />
        );
    };

    return (
        <DataTable value={roles}>
            <Column field="name" header="Nombre del Rol" />
            <Column field="status" header="Estado" />
            <Column header="Acciones" body={actionTemplate} />
        </DataTable>
    );
};

RolesDataTable.propTypes = {
    refresh: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired, 
};

export default RolesDataTable;
