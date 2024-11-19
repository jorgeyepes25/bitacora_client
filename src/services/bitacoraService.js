import axios from "axios";

export const crearBitacora = async (bitacoraData, token) => {
  try {
    const formData = new FormData();

    formData.append("titulo", bitacoraData.titulo);
    formData.append("fechaMuestreo", bitacoraData.fechaMuestreo);
    formData.append("localizacion[latitud]", bitacoraData.localizacion.latitud);
    formData.append("localizacion[longitud]", bitacoraData.localizacion.longitud);
    formData.append("condicionesClimaticas", bitacoraData.condicionesClimaticas);
    formData.append("descripcionHabitat", bitacoraData.descripcionHabitat);
    formData.append("observaciones", bitacoraData.observaciones);
    formData.append("creadoPor", bitacoraData.creadoPor);

    bitacoraData.detallesEspecies.forEach((especie, index) => {
      formData.append(`detallesEspecies[${index}][nombreCientifico]`, especie.nombreCientifico);
      formData.append(`detallesEspecies[${index}][nombreComun]`, especie.nombreComun);
      formData.append(`detallesEspecies[${index}][familia]`, especie.familia);
      formData.append(`detallesEspecies[${index}][cantidadMuestras]`, especie.cantidadMuestras);
      formData.append(`detallesEspecies[${index}][estadoPlanta]`, especie.estadoPlanta);

      if (especie.fotos) {
        especie.fotos.forEach((foto, fotoIndex) => {
          formData.append(`detallesEspecies[${index}][fotos][${fotoIndex}]`, foto);
        });
      }
    });

    if (bitacoraData.fotos) {
      bitacoraData.fotos.forEach((foto, index) => {
        formData.append(`fotos[${index}]`, foto);
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post("/api/bitacora", formData, config);
    return response.data;
  } catch (error) {
    console.error("Error en crearBitacora:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error al crear la bitácora");
  }
};


export const obtenerBitacoras = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get("/api/bitacora", config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener las bitácoras"
    );
  }
};

export const bitacoraByID = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`/api/bitacora/${id}`, config);   
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener la bitácora"
    );
  }
};
