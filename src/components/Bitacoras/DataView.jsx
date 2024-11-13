import { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { obtenerBitacoras } from "../../services/bitacoraService";
import useUserStore from "../../store/state/useUserStore";
import { useNavigate } from "react-router-dom";
import "./styles/DataView.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/103573/pexels-photo-103573.jpeg?cs=srgb&dl=pexels-suneo1999-24143-103573.jpg&fm=jpg";

export default function Bitacoras() {
  const { token } = useUserStore();
  const [bitacoras, setBitacoras] = useState([]);
  const [layout, setLayout] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const data = await obtenerBitacoras(token);
        setBitacoras(data);
      } catch (error) {
        console.error("Error al obtener las bitácoras:", error.message);
      }
    };

    fetchBitacoras();
  }, [token]);

  const getSeverity = (condition) => {
    switch (condition) {
      case "lluvioso":
        return "info";
      case "seco":
        return "warning";
      case "extremo":
        return "danger";
      default:
        return "success";
    }
  };

  const handleDetailsClick = (id) => {
    navigate(`/bitacora/${id}`);
  };

  const gridItem = (bitacora) => (
    <div className="grid-card" key={bitacora._id}>
      <Card
        title={bitacora.titulo}
        subTitle={new Date(bitacora.fechaMuestreo).toLocaleDateString()}
        className="shadow-2 border-round"
        header={
          <img
            src={bitacora.fotos.length > 0 ? bitacora.fotos[0] : DEFAULT_IMAGE}
            alt="Imagen de la bitácora"
            className="w-full border-round"
            style={{ height: "150px", objectFit: "cover" }}
          />
        }
        footer={
          <div className="flex justify-content-between align-items-center location">
            <span>
              Lat: {bitacora.localizacion.latitud.toFixed(2)}, Lng: {bitacora.localizacion.longitud.toFixed(2)}
            </span>
            <Button
              icon="pi pi-info-circle"
              label="Detalles"
              className="p-button-rounded p-button-info"
              onClick={() => handleDetailsClick(bitacora._id)}
            />
          </div>
        }
      >
        <div className="flex justify-content-between align-items-center mb-2">
          <Tag value={bitacora.creadoPor?.username || "Desconocido"} icon="pi pi-user" />
          <Tag value={bitacora.condicionesClimaticas} severity={getSeverity(bitacora.condicionesClimaticas)} />
        </div>
        <p className="description">{bitacora.descripcionHabitat || "Sin descripción"}</p>
      </Card>
    </div>
  );

  const listItem = (bitacora) => (
    <div className="col-12" key={bitacora._id}>
      <div className="p-4 border-1 surface-border surface-card border-round shadow-2">
        <div className="flex align-items-center">
          <img
            src={bitacora.fotos.length > 0 ? bitacora.fotos[0] : DEFAULT_IMAGE}
            alt="Imagen de la bitácora"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            className="border-round mr-3"
          />
          <div>
            <h5 className="m-0">{bitacora.titulo}</h5>
            <p className="text-secondary">{new Date(bitacora.fechaMuestreo).toLocaleDateString()}</p>
            <Tag value={bitacora.condicionesClimaticas} severity={getSeverity(bitacora.condicionesClimaticas)} />
            <p>{bitacora.descripcionHabitat || "Sin descripción"}</p>
            <Button
              icon="pi pi-info-circle"
              label="Detalles"
              className="p-button-text"
              onClick={() => handleDetailsClick(bitacora._id)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const itemTemplate = (bitacora, layout) => {
    if (!bitacora) return null;
    return layout === "grid" ? gridItem(bitacora) : listItem(bitacora);
  };

  const header = (
    <div className="flex justify-content-between align-items-center mb-3">
      <h4>Bitácoras</h4>
      <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    </div>
  );

  return (
    <div className="full-width-container">
      <DataView
        value={bitacoras}
        itemTemplate={(bitacora) => itemTemplate(bitacora, layout)}
        layout={layout}
        header={header}
        paginator
        rows={9}
      />
    </div>
  );
}
