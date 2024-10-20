import axios from "axios";

// Función para realizar el login
export const login = async (username, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      username,
      password, 
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error.response ? error.response.data : new Error('Error en la conexión');
  }
};
