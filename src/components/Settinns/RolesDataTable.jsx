import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getRoles } from '../../services/userService';
import useUserStore from '../../store/state/useUserStore';

const RolesDataTable = () => {
    const [roles, setRoles] = useState([]);
    const { token } = useUserStore();
    const isFetching = useRef(false);

    useEffect(() => {
        const fetchRoles = async () => {
            isFetching.current = true;
            try {
                const data = await getRoles(token);
                setRoles(data);
            } catch (error) {
                console.error('Error al obtener roles:', error);
            } finally {
                isFetching.current = false;
            }
        };

        if (token && !isFetching.current) {
            fetchRoles();
        }
    }, [token]);
    return (
        <div>
            <DataTable value={roles} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Nombre" />
                <Column field="description" header="Descripción" />
            </DataTable>
        </div>
    );
};

export default RolesDataTable;