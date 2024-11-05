// components/Register/RegisterForm.jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { registerSchema } from "../../pages/schema/registerSchema";
import PropTypes from "prop-types";

const RegisterForm = ({ onSubmit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  return (
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
        label={isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        icon="pi pi-user-plus"
        className="p-button-lg"
        disabled={isSubmitting}
      />
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterForm;
