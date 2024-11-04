// contexts/AuthProvider.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useUserStore from "../store/state/useUserStore";
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token, setUser, logout } = useUserStore();

  useEffect(() => {
    const checkAuth = () => {
      if (!token) {
        navigate('/');
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
