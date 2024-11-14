import UsersDataTable from '../components/Settinns/UsersDataTable';
import "./styles/StyleUserPage.css";

const UsersPage = () => {

    return (
    <div className="users-page">
        <h1>Pagina de usuarios</h1>
        <UsersDataTable />
    </div>
    );
};

export default UsersPage;