import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import axios from 'axios';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      // Guardar el usuario y el token en el estado
      setUser({ token: response.data.token, ...response.data.user });
      // Redirigir al usuario a la página principal
      navigate('/');
    } catch (error) {
      setError('Nombre de usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="field">
          <label htmlFor="username">Nombre de Usuario</label>
          <InputText
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            feedback={false}
          />
        </div>
        <Button label="Iniciar Sesión" icon="pi pi-user" />
      </form>
    </div>
  );
};

export default LoginForm;
