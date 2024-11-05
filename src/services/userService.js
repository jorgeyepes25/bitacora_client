// services/userService.js
import axios from 'axios';

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error en getUserById:", error.response.data.message);
      throw new Error(error.response.data.message || 'Error al obtener el usuario');
    } else {
      console.error("Error en la solicitud:", error.message);
      throw new Error('Error de conexión con el servidor');
    }
  }
};
