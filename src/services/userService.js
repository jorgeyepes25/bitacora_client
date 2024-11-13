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

export const getUsers = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get("/api/user", config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los usuarios"
    );
  }
};

export const updateUserRoles = async (userId, userData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`/api/user/${userId}`, userData, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el usuario"
    );
  }
};

export const addRolesToUser = async (userId, roleNames, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `/api/user/${userId}/roles`,
      { roleNames },
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al agregar roles al usuario"
    );
  }
};


export const createRole = async (roleData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post("/api/role", roleData, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al crear el rol"
    );
  }
};

export const getRoles = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get("/api/role", config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los roles"
    );
  }
};

export const getRoleById = async (roleId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`/api/role/${roleId}`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener el rol"
    );
  }
};

export const updateRole = async (roleId, roleData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`/api/role/${roleId}`, roleData, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el rol"
    );
  }
};

export const deleteRole = async (roleId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`/api/role/${roleId}`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el rol"
    );
  }
};
