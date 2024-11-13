import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import PropTypes from 'prop-types';
import useUserStore from '../../store/state/useUserStore';
import { createRole } from '../../services/userService';
import { toast } from 'sonner';

const CreateRoleModal = ({ visible, onHide, onRoleCreated }) => {
    const [roleName, setRoleName] = useState('');
    const { token } = useUserStore();

    const handleSave = async () => {
        try {
            if (roleName.trim() === '') {
                toast.error('El nombre del rol no puede estar vacío');
                return;
            }

            // Llamada a la API para crear el rol
            await createRole({ name: roleName }, token);
            toast.success("Nuevo rol creado con éxito");

            // Limpiar el estado y cerrar el modal después de guardar
            setRoleName('');
            onHide();

            // Llamar a la función onRoleCreated para refrescar el DataTable
            onRoleCreated();
        } catch (error) {
            console.error("Error al crear el rol:", error);
            toast.error('Error al crear el rol. Por favor, intente de nuevo.');
        }
    };

    return (
        <Dialog header="Crear Nuevo Rol" visible={visible} onHide={onHide} footer={
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Guardar" icon="pi pi-check" onClick={handleSave} autoFocus />
            </div>
        }>
            <div className="field">
                <label htmlFor="roleName">Nombre del Rol</label>
                <InputText id="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
            </div>
        </Dialog>
    );
};

// Definir los tipos de las props con PropTypes
CreateRoleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onRoleCreated: PropTypes.func.isRequired,
};

export default CreateRoleModal;
