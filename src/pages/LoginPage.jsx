// pages/LoginPage.jsx
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
import useUserStore from "../store/state/useUserStore";
import "./styles/Login.css";

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const loginUser = useUserStore((state) => state.login); // Obtén `login` del store

  const onSubmit = async (values) => {
    try {
      const data = await login(values.username, values.password);
      console.log("Login success:", data);
      
      // Llama a `loginUser` con `newUser` como null y el token de la respuesta
      loginUser(null, data.token); // Guarda el token en el store de Zustand
      toast.success("Inicio de sesión exitoso");
      navigate("/home"); // Redirige a /home después de un inicio de sesión exitoso
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-page">
      <Card title="Iniciar Sesión" className="login-card">
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
      </Card>
    </div>
  );
};

export default LoginPage;
