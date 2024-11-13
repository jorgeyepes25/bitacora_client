import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getUsers } from "../../services/userService";
import useUserStore from "../../store/state/useUserStore";

export default function UsersDataTable() {
  const [users, setUsers] = useState([]);
  const { token } = useUserStore();
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchUsers = async () => {
      isFetching.current = true;
      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        isFetching.current = false;
      }
    };

    if (token && !isFetching.current) {
      fetchUsers();
    }
  }, [token]);

  const roleTemplate = (rowData) => {
    return rowData.roles && rowData.roles.length > 0
      ? rowData.roles.map((role) => role.name).join(", ")
      : "N/A";
  };

  return (
    <div className="card">
      <DataTable value={users} tableStyle={{ minWidth: "50rem" }}>
        <Column field="username" header="Usuario" />
        <Column field="status" header="Estado" />
        <Column field="createdAt" header="Creado El" />
        <Column header="Roles" body={roleTemplate} />
      </DataTable>
    </div>
  );
}
