// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/state/useUserStore';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated); // Accede como valor, no como función

  return isAuthenticated ? children : <Navigate to="/" />; // Si está autenticado, permite el acceso; si no, redirige al login
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
