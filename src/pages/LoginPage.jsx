// LoginPage.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { toast } from "sonner";
import useUserStore from "../store/state/useUserStore";
import LoginForm from "../components/Login/LoginForm";
import { login, loginOrSignupWithGoogle, loginOrSignupWithFacebook, loginOrSignupWithGitHub } from "../services/authService";
import "./styles/Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const loginUser = useUserStore((state) => state.login);

  const onSubmit = async (values) => {
    try {
      const data = await login(values.username, values.password);
      loginUser(data.userId, data.token);
      toast.success("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      toast.error(error.message || "Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  const handleSocialLogin = (provider) => {
    switch (provider.toLowerCase()) {
      case "google":
        toast("Redirigiendo a Google...");
        loginOrSignupWithGoogle();
        break;
      case "facebook":
        toast("Redirigiendo a Facebook...");
        loginOrSignupWithFacebook();
        break;
      case "github":
        toast("Redirigiendo a GitHub...");
        loginOrSignupWithGitHub();
        break;
      default:
        toast.error("Proveedor de autenticación no soportado");
    }
  };

  useEffect(() => {
    // Listener para capturar el mensaje de autenticación desde la ventana emergente
    const handleAuthMessage = (event) => {
      if (event.data.message === "login_success") {
        const { token, userId } = event.data;

        // Almacena los datos de autenticación y redirige al usuario a /home
        loginUser(userId, token);
        toast.success("Inicio de sesión exitoso");
        navigate("/home");
      }
    };

    window.addEventListener("message", handleAuthMessage);

    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [navigate, loginUser]);

  return (
    <div className="login-page">
      <Card title="Iniciar Sesión" className="login-card">
        <LoginForm onSubmit={onSubmit} />
        
        <Divider align="center">O</Divider>

        <div className="social-login-buttons">
          <Button
            icon="pi pi-facebook"
            className="p-button-rounded p-button-facebook social-button"
            aria-label="Iniciar con Facebook"
            onClick={() => handleSocialLogin("facebook")}
          />
          <Button
            icon="pi pi-google"
            className="p-button-rounded p-button-google social-button"
            aria-label="Iniciar con Google"
            onClick={() => handleSocialLogin("google")}
          />
          <Button
            icon="pi pi-github"
            className="p-button-rounded p-button-github social-button"
            aria-label="Iniciar con GitHub"
            onClick={() => handleSocialLogin("github")}
          />
        </div>

        <Divider />

        <p className="create-account-link">
          ¿No tienes una cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
