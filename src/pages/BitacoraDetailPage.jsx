import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bitacoraByID } from "../services/bitacoraService";
import useUserStore from "../store/state/useUserStore";
import Header from "../components/Header";
import "./styles/StylesDetailPage.css";

const BitacoraDetailPage = () => {
  const { token } = useUserStore();
  const { id } = useParams();
  const [bitacora, setBitacora] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const data = await bitacoraByID(id, token);
        setBitacora(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBitacora();
  }, [token, id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!bitacora) return <p className="loading-message">Cargando...</p>;

  return (
    <div className="bitacora-detail-page">
      <Header />
      <div className="bitacora-card">
        <h1 className="bitacora-title">{bitacora.titulo}</h1>
        <img className="bitacora-image" src={bitacora.fotos[0]} alt="Imagen de la bitácora" />
        <div className="bitacora-info">
          <p><strong>Descripción del hábitat:</strong> {bitacora.descripcionHabitat}</p>
          <p><strong>Fecha de muestreo:</strong> {new Date(bitacora.fechaMuestreo).toLocaleDateString()}</p>
          <p><strong>Ubicación:</strong> Lat: {bitacora.localizacion.latitud}, Long: {bitacora.localizacion.longitud}</p>
          <p><strong>Condiciones climáticas:</strong> {bitacora.condicionesClimaticas}</p>
          <p><strong>Observaciones:</strong> {bitacora.observaciones}</p>
          <p><strong>Creado por:</strong> {bitacora.creadoPor.username}</p>
        </div>
        <h2 className="especies-title">Detalles de las especies</h2>
        <div className="especies-list">
          {bitacora.detallesEspecies.map((especie) => (
            <div key={especie._id} className="especie-item">
              <h3>{especie.nombreCientifico}</h3>
              <p><strong>Nombre común:</strong> {especie.nombreComun}</p>
              <p><strong>Familia:</strong> {especie.familia}</p>
              <p><strong>Cantidad de muestras:</strong> {especie.cantidadMuestras}</p>
              <p><strong>Estado de la planta:</strong> {especie.estadoPlanta}</p>
              {especie.fotos.length > 0 && <img src={especie.fotos[0]} alt={especie.nombreComun} className="especie-image" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BitacoraDetailPage;