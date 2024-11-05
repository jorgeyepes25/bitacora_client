// authService.js
import axios from "axios";
import { URL_BACK } from '../config/index';


// Función para realizar el login local
export const login = async (username, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error.response ? error.response.data : new Error('Error en la conexión');
  }
};

// Función para registrar un usuario (registro local)
export const register = async (username, password = []) => {
  try {
    const response = await axios.post("/api/user", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error.response ? error.response.data : new Error("Error en la conexión");
  }
};

// Login o creación de cuenta con Google
export const loginOrSignupWithGoogle = () => {
  window.open(`${URL_BACK}api/auth/social/google`, "_blank", "width=500,height=600");
};

// Login o creación de cuenta con Facebook
export const loginOrSignupWithFacebook = () => {
  window.open(`${URL_BACK}api/auth/social/facebook`, "_blank", "width=500,height=600");
};

// Login o creación de cuenta con GitHub
export const loginOrSignupWithGitHub = () => {
  window.open(`${URL_BACK}api/auth/social/github`, "_blank", "width=500,height=600");
};

// Función para manejar el callback después de la autenticación
export const handleSocialCallback = async (provider) => {
  try {
    const response = await axios.get(`${URL_BACK}api/auth/${provider}/callback`);
    return response.data;
  } catch (error) {
    console.error(`Error en el callback de ${provider}:`, error);
    throw error.response ? error.response.data : new Error("Error en la conexión");
  }
};;
