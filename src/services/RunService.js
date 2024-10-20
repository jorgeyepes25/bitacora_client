import axios from "axios";

// Función para consultar el estado del servidor
export const serverRun = async () => {
  try {
    const response = await axios.get("/ping");

    if (response.data.message === "pong") {
      return "pong";
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (error) {
    console.error("Error al contactar el servidor:", error);
    throw error.response ? error.response.data : new Error("El servidor no responde");
  }
};
