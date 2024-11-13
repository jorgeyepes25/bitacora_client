import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { getUsers, getRoles, addRolesToUser } from "../../services/userService"; // Importar addRolesToUser
import useUserStore from "../../store/state/useUserStore";
import { toast } from "sonner";

export default function UsersDataTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]); // Estado para los roles obtenidos
  const { token } = useUserStore();
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchUsers = async () => {
      isFetching.current = true;
      try {
        const data = await getUsers(token);
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        toast.error("Error al obtener usuarios. Por favor, intente de nuevo.");
      } finally {
        isFetching.current = false;
      }
    };

    const fetchRoles = async () => {
      try {
        const roles = await getRoles(token);
        // Mapeo de roles para el Dropdown
        setRoleOptions(
          roles.map((role) => ({ label: role.name, value: role.name }))
        );
      } catch (error) {
        console.error("Error al obtener roles:", error);
        toast.error("Error al obtener roles. Por favor, intente de nuevo.");
      }
    };

    if (token && !isFetching.current) {
      fetchUsers();
      fetchRoles();
    }
  }, [token]);

  const getRoleSeverity = (roleName) => {
    switch (roleName) {
      case "admin":
        return "danger";
      case "investigador":
        return "info";
      case "viewer":
        return "success";
      case "colaborador":
        return "warning";
      default:
        return "primary";
    }
  };

  const roleTemplate = (rowData) => (
    <div className="flex align-items-center">
      {rowData.roles && rowData.roles.length > 0 ? (
        rowData.roles.map((role, index) => (
          <Tag
            key={role._id || index}
            value={role.name}
            severity={getRoleSeverity(role.name)}
            className="mr-2"
          />
        ))
      ) : (
        <Tag value="N/A" severity="secondary" />
      )}
      <Dropdown
        options={roleOptions}
        onChange={(e) => handleAssignRole(rowData, e.value)}
        placeholder="Asignar Rol"
        className="p-column-filter"
      />
    </div>
  );
  

  const handleAssignRole = async (user, newRole) => {
    if (user.roles.some((role) => role.name === newRole)) {
      toast.error("Este usuario ya tiene el rol asignado.");
      return;
    }

    try {
      // Llamada a la función addRolesToUser para agregar el nuevo rol
      await addRolesToUser(user._id, [newRole], token);

      // Actualizar el estado local de usuarios para reflejar el nuevo rol asignado
      const updatedRoles = [...user.roles, { name: newRole }];
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, roles: updatedRoles } : u
        )
      );
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.map((u) =>
          u._id === user._id ? { ...u, roles: updatedRoles } : u
        )
      );
      toast.success("Rol asignado con éxito.");
    } catch (error) {
      console.error("Error al asignar rol:", error);
      toast.error("Error al asignar el rol. Por favor, intente de nuevo.");
    }
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const dateRangeFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => handleDateFilter(e.value, options.filterCallback)}
        selectionMode="range"
        placeholder="Selecciona un rango"
        dateFormat="yy-mm-dd"
        className="p-column-filter"
      />
    );
  };

  const handleDateFilter = (dateRange, filterCallback) => {
    if (
      !dateRange ||
      dateRange.length !== 2 ||
      !dateRange[0] ||
      !dateRange[1]
    ) {
      setFilteredUsers(users);
      filterCallback(null);
      return;
    }

    const [startDate, endDate] = dateRange;
    const filtered = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    if (filtered.length === 0) {
      toast.error(
        "No hay usuarios creados en ese rango de fechas. Por favor, selecciona otro rango."
      );
    }

    setFilteredUsers(filtered);
    filterCallback(filtered);
  };

  const textFilterTemplate = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.filterCallback(e.target.value)}
        placeholder="Buscar..."
        className="p-column-filter"
      />
    );
  };

  return (
    <div className="card">
      <DataTable
        value={filteredUsers}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={10}
        sortMode="multiple"
      >
        <Column
          field="username"
          header="Usuario"
          filter
          filterElement={textFilterTemplate}
          sortable
          filterPlaceholder="Buscar por usuario"
        />
        <Column
          field="status"
          header="Estado"
          filter
          filterPlaceholder="Buscar por estado"
          filterElement={textFilterTemplate}
        />
        <Column
          field="createdAt"
          header="Creado El"
          body={dateBodyTemplate}
          filter
          filterElement={dateRangeFilterTemplate}
          sortable
        />
        <Column
          header="Roles"
          body={roleTemplate}
          filter
          filterElement={textFilterTemplate}
        />
      </DataTable>
    </div>
  );
}
