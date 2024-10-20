import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema/loginSchema";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { login } from "../services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { serverRun } from "../services/RunService";
import { useState, useEffect } from "react";
import "./styles/Login.css";

const LoginPage = () => {
  const [serverStatus, setServerStatus] = useState(false); // Estado para el servidor
  const [loading, setLoading] = useState(true); // Estado para el spinner
  const [error, setError] = useState(null); // Estado para errores de servidor

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  // useEffect para hacer la petición de 'ping'
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await serverRun();
        if (response === "pong") {
          setServerStatus(true);
        }
      } catch (error) {
        console.error("Error al contactar el servidor:", error);
        setError("Error al contactar el servidor");
      } finally {
        setLoading(false); // Desactivar el spinner
      }
    };
    checkServer();
  }, []);

  const onSubmit = async (values) => {
    try {
      const data = await login(values.username, values.password);
      console.log("Login success:", data);
      toast.success("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
    }
  };

  // Mostrar spinner y mensaje mientras carga el estado del servidor
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">El backend se está iniciando, por favor espere...</p>
      </div>
    );
  }

  // Mostrar error si no hay respuesta del servidor
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="login-page">
      <Card title="Iniciar Sesión" className="login-card">
        {serverStatus ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label htmlFor="username">Nombre de Usuario</label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="username"
                    {...field}
                    className={errors.username ? "p-invalid" : ""}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.username && <p className="error-message">{errors.username.message}</p>}
            </div>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Password
                    id="password"
                    {...field}
                    className={errors.password ? "p-invalid" : ""}
                    feedback={false}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              label={isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
              icon="pi pi-user"
              className="p-button-lg"
              disabled={isSubmitting}
            />
          </form>
        ) : (
          <h2>El servidor no está disponible.</h2>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
