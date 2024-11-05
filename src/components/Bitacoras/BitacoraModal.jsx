import { useState } from "react";
import PropTypes from "prop-types";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import LocationPicker from "./LocationPicker";
import useUserStore from "../../store/state/useUserStore";
import { crearBitacora } from "../../services/bitacoraService";
import "./styles/BitacoraModal.css";

const estadoPlantaOptions = [
  { label: "Viva", value: "viva" },
  { label: "Seca", value: "seca" },
  { label: "Preservada", value: "preservada" },
];

const BitacoraModal = ({ visible, onHide }) => {
  const { token, userId } = useUserStore();

  const [formData, setFormData] = useState({
    title: "",
    dateTime: null,
    latitude: null,
    longitude: null,
    weather: "",
    habitatDescription: "",
    sitePhotos: [],
    speciesDetails: "",
    additionalObservations: "",
    species: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        sitePhotos: Array.from(files),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        sitePhotos: [],
      }));
    }
  };

  // Para manejar fotos de cada especie recolectada
  const handleSpeciesPhotoChange = (index, e) => {
    const { files } = e.target;
    const updatedSpecies = formData.species.map((specie, i) =>
      i === index
        ? { ...specie, photos: files.length > 0 ? Array.from(files) : [] }
        : specie
    );
    setFormData((prevData) => ({
      ...prevData,
      species: updatedSpecies,
    }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleAddSpecies = () => {
    console.log("Especies antes de agregar una nueva:", formData.species);

    setFormData((prevData) => ({
      ...prevData,
      species: [
        ...prevData.species,
        {
          scientificName: "",
          commonName: "",
          family: "",
          sampleQuantity: 1, // valor predeterminado como número
          state: "viva", // valor predeterminado de estado
          photos: [],
        },
      ],
    }));
  };

  const handleSpeciesChange = (index, field, value) => {
    const updatedSpecies = formData.species.map((specie, i) =>
      i === index
        ? {
            ...specie,
            [field]: field === "sampleQuantity" ? parseInt(value, 10) || 1 : value,
          }
        : specie
    );
    setFormData((prevData) => ({
      ...prevData,
      species: updatedSpecies,
    }));
  };

  const handleSubmit = async () => {
    try {
      const latitude = parseFloat(formData.latitude);
      const longitude = parseFloat(formData.longitude);

      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        throw new Error("La latitud debe estar entre -90 y 90.");
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        throw new Error("La longitud debe estar entre -180 y 180.");
      }

      formData.species.forEach((specie, index) => {
        if (!specie.scientificName || !specie.commonName || !specie.family) {
          throw new Error(
            `Faltan datos en la especie #${
              index + 1
            }. Todos los campos de nombre científico, común y familia son obligatorios.`
          );
        }

        if (
          typeof specie.sampleQuantity !== "number" ||
          specie.sampleQuantity <= 0
        ) {
          throw new Error(
            `La cantidad de muestras en la especie #${
              index + 1
            } debe ser un número mayor a 0.`
          );
        }
        if (!["viva", "seca", "preservada"].includes(specie.state)) {
          throw new Error(
            `El estado de la planta en la especie #${index + 1} es inválido.`
          );
        }
      });

      const bitacoraData = {
        titulo: formData.title,
        fechaMuestreo: formData.dateTime,
        localizacion: {
          latitud: latitude,
          longitud: longitude,
        },
        condicionesClimaticas: formData.weather,
        descripcionHabitat: formData.habitatDescription,
        observaciones: formData.additionalObservations,
        detallesEspecies: formData.species,
        fotos: formData.sitePhotos,
        creadoPor: userId,
      };

      const response = await crearBitacora(bitacoraData, token);
      console.log("Bitácora creada:", response);

      setFormData({
        title: "",
        dateTime: null,
        latitude: null,
        longitude: null,
        weather: "",
        habitatDescription: "",
        sitePhotos: [],
        speciesDetails: "",
        additionalObservations: "",
        species: [],
      });

      onHide();
    } catch (error) {
      console.error("Error al crear la bitácora:", error.message);
    }
  };

  const footer = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Agregar Bitácora"
      visible={visible}
      style={{ width: "60vw" }}
      onHide={onHide}
      footer={footer}
      draggable={false}
    >
      <form>
        <div className="p-fluid grid">
          <div className="col-12 field">
            <label htmlFor="title">Título de la bitácora</label>
            <InputText
              id="title"
              name="title"
              placeholder="Título de la bitácora"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-6 field">
            <label htmlFor="dateTime">Fecha y hora del muestreo</label>
            <Calendar
              id="dateTime"
              name="dateTime"
              placeholder="Fecha y hora del muestreo"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.value })}
              onSelect={() => document.activeElement.blur()}
              required
              showTime
              showButtonBar
            />
          </div>
          <div className="col-3 field">
            <label htmlFor="latitude">Latitud</label>
            <InputText
              id="latitude"
              name="latitude"
              value={formData.latitude || ""}
              onChange={handleInputChange}
              placeholder="Latitud"
              required
            />
          </div>
          <div className="col-3 field">
            <label htmlFor="longitude">Longitud</label>
            <InputText
              id="longitude"
              name="longitude"
              value={formData.longitude || ""}
              onChange={handleInputChange}
              placeholder="Longitud"
              required
            />
          </div>

          <div
            className="col-12 field"
            style={{ height: "300px", marginBottom: "1rem" }}
          >
            <label>Selecciona la ubicación en el mapa</label>
            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
            />
          </div>

          <div className="col-6 field">
            <label htmlFor="weather">Condiciones climáticas</label>
            <InputText
              id="weather"
              name="weather"
              placeholder="Condiciones climáticas"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-6 field">
            <label htmlFor="habitatDescription">Descripción del hábitat</label>
            <InputTextarea
              id="habitatDescription"
              name="habitatDescription"
              placeholder="Descripción del hábitat"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12 field">
            <label htmlFor="sitePhotos">
              Fotografías del sitio de muestreo
            </label>
            <FileUpload
              name="sitePhotos"
              multiple
              accept="image/*"
              customUpload
              uploadHandler={handleFileChange}
            />
          </div>
          <div className="col-12 field">
            <label htmlFor="speciesDetails">
              Detalles de las especies recolectadas
            </label>
            <InputTextarea
              id="speciesDetails"
              name="speciesDetails"
              placeholder="Detalles de las especies recolectadas"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12 field">
            <label htmlFor="additionalObservations">
              Observaciones adicionales
            </label>
            <InputTextarea
              id="additionalObservations"
              name="additionalObservations"
              placeholder="Observaciones adicionales"
              onChange={handleInputChange}
            />
          </div>

          <Divider />

          <h3>Especies Recolectadas</h3>
          {formData.species.map((specie, index) => (
            <div key={index} className="species-entry p-grid">
              <div className="col-6 field">
                <label>Nombre científico</label>
                <InputText
                  value={specie.scientificName}
                  onChange={(e) =>
                    handleSpeciesChange(index, "scientificName", e.target.value)
                  }
                />
              </div>
              <div className="col-6 field">
                <label>Nombre común</label>
                <InputText
                  value={specie.commonName}
                  onChange={(e) =>
                    handleSpeciesChange(index, "commonName", e.target.value)
                  }
                />
              </div>
              <div className="col-4 field">
                <label>Familia</label>
                <InputText
                  value={specie.family}
                  onChange={(e) =>
                    handleSpeciesChange(index, "family", e.target.value)
                  }
                />
              </div>
              <div className="col-4 field">
                <label>Cantidad de muestras</label>
                <InputText
                  value={specie.sampleQuantity}
                  onChange={(e) =>
                    handleSpeciesChange(index, "sampleQuantity", e.target.value)
                  }
                />
              </div>
              <div className="col-4 field">
                <label>Estado de la planta</label>
                <Dropdown
                  value={specie.state}
                  options={estadoPlantaOptions}
                  onChange={(e) => handleSpeciesChange(index, "state", e.value)}
                  placeholder="Seleccionar estado"
                  className="w-full"
                />
              </div>
              <div className="col-12 field">
                <label>Fotografías de la especie</label>
                <FileUpload
                  name={`photos-${index}`}
                  multiple
                  accept="image/*"
                  customUpload
                  uploadHandler={(e) => handleSpeciesPhotoChange(index, e)}
                />
              </div>
            </div>
          ))}

          <Button
            label="Agregar Especie"
            icon="pi pi-plus"
            onClick={handleAddSpecies}
            type="button"
            className="p-button-secondary mt-3"
          />
        </div>
      </form>
    </Dialog>
  );
};

// Definir los tipos de las propiedades esperadas (prop-types)
BitacoraModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default BitacoraModal;
