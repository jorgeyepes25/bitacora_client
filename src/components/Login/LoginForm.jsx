// pages/LoginPage.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../pages/schema/loginSchema";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { login } from "../../services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/state/useUserStore";

const LoginPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const loginUser = useUserStore((state) => state.login);

  const onSubmit = async (values) => {
    try {
      const data = await login(values.username, values.password);
      loginUser(data.userId, data.token);
      toast.success("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="username">Usuarios</label>
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
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
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
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          label={isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
          icon="pi pi-user"
          className="p-button-lg"
          disabled={isSubmitting}
        />
      </form>
  );
};

export default LoginPage;
