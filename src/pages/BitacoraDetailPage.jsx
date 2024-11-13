// pages/BitacoraDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bitacoraByID } from "../services/bitacoraService";
import useUserStore from "../store/state/useUserStore";
import Header from "../components/Header";



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

  if (error) return <p>{error}</p>;
  if (!bitacora) return <p>Cargando...</p>;

  return (
    <div>
      <Header />
      <h1>{bitacora.titulo}</h1>
      <img src={bitacora.fotos[0]} alt="Imagen de la bitácora" />
      <p>{bitacora.descripcionHabitat}</p>
      <p>{bitacora.fechaMuestreo}</p>
      <p>{bitacora.localizacion.latitud}</p>
      <p>{bitacora.localizacion.longitud}</p>
      <p>{bitacora.condicionesClimaticas}</p>
      <p>{bitacora.observaciones}</p>
      <p>{bitacora.creadoPor.username}</p>
      <h2>Detalles de las especies</h2>
      {bitacora.detallesEspecies.map((especie) => (
        <div key={especie._id}>
          <p>{especie.nombreCientifico}</p>
          <p>{especie.nombreComun}</p>
          <p>{especie.familia}</p>
          <p>{especie.cantidadMuestras}</p>
          <p>{especie.estadoPlanta}</p>
          <p>{especie.fotos.length > 0 ? especie.fotos[0] : "Sin foto"}</p>
        </div>
      ))}
    </div>
  );
};

export default BitacoraDetailPage;
