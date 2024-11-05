// RegisterPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { toast } from "sonner";
import RegisterForm from "../components/Register/RegisterForm";
import { register, loginOrSignupWithGoogle, loginOrSignupWithFacebook, loginOrSignupWithGitHub } from "../services/authService";
import "./styles/Login.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const onSubmit = async ({ username, password }) => {
    try {
      const data = await register(username, password);
      console.log("Respuesta de la API:", data);
      toast.success("Cuenta creada exitosamente");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  const handleSocialLogin = (provider) => {
    switch (provider.toLowerCase()) {
      case "google":
        loginOrSignupWithGoogle();
        break;
      case "facebook":
        loginOrSignupWithFacebook();
        break;
      case "github":
        loginOrSignupWithGitHub();
        break;
      default:
        toast.error("Proveedor de autenticación no soportado");
    }
  };

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data.message === "login_success") {
        toast.success("Inicio de sesión exitoso");
        navigate("/");
      }
    };
    window.addEventListener("message", handleAuthMessage);
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [navigate]);

  return (
    <div className="login-page">
      <Card title="Crear Cuenta" className="login-card">
        <RegisterForm onSubmit={onSubmit} />

        <Divider align="center">O</Divider>

        <div className="social-login-buttons">
          <Button
            icon="pi pi-facebook"
            className="p-button-rounded p-button-facebook"
            aria-label="Iniciar con Facebook"
            onClick={() => handleSocialLogin("facebook")}
          />
          <Button
            icon="pi pi-google"
            className="p-button-rounded p-button-google"
            aria-label="Iniciar con Google"
            onClick={() => handleSocialLogin("google")}
          />
          <Button
            icon="pi pi-github"
            className="p-button-rounded p-button-github"
            aria-label="Iniciar con GitHub"
            onClick={() => handleSocialLogin("github")}
          />
        </div>

        <Divider />

        <p className="create-account-link">
          ¿Ya tienes una cuenta? <Link to="/">Iniciar sesión</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
