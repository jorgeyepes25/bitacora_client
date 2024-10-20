import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProtectedRoute = ({ children }) => {
  const { user } = useStore();

  // Si no hay usuario autenticado, redirige al login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, renderiza el contenido protegido
  return children;
};

export default ProtectedRoute;
