// AuthProvider.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useUserStore from "../store/state/useUserStore";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useUserStore();

  useEffect(() => {
    const checkAuth = () => {
      const publicRoutes = ["/", "/register"];
      if (!token && !publicRoutes.includes(location.pathname)) {
        navigate('/');
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, navigate, location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
