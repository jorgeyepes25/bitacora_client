import { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { obtenerBitacoras, deleteBitacora } from "../../services/bitacoraService";
import useUserStore from "../../store/state/useUserStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./styles/DataView.css";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/103573/pexels-photo-103573.jpeg?cs=srgb&dl=pexels-suneo1999-24143-103573.jpg&fm=jpg";

export default function Bitacoras() {
  const { token } = useUserStore();
  const [bitacoras, setBitacoras] = useState([]);
  const [filteredBitacoras, setFilteredBitacoras] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [usernameFilter, setUsernameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bitacoras.length === 0) {
      const fetchBitacoras = async () => {
        try {
          const data = await obtenerBitacoras(token);
          setBitacoras(data);
          setFilteredBitacoras(data);
        } catch (error) {
          console.error("Error al obtener las bitácoras:", error.message);
        }
      };
      fetchBitacoras();
    } else {
      setFilteredBitacoras(bitacoras);
    }
  }, [bitacoras, token, setBitacoras]);

  const handleDelete = async (id) => {
    toast("¿Estás seguro de que deseas eliminar esta bitácora?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await deleteBitacora(id, token); 
            const updatedBitacoras = bitacoras.filter((bitacora) => bitacora._id !== id);
            setBitacoras(updatedBitacoras); 
            setFilteredBitacoras(updatedBitacoras);
            toast.success("Bitácora eliminada con éxito.");
          } catch (error) {
            console.error("Error al eliminar la bitácora:", error.message);
            toast.error("Error al eliminar la bitácora.");
          }
        },
      },
    });
  };
  
  const applyFilters = () => {
    let filtered = bitacoras;

    if (usernameFilter) {
      filtered = filtered.filter((bitacora) =>
        bitacora.creadoPor?.username
          .toLowerCase()
          .includes(usernameFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((bitacora) => {
        const bitacoraDate = new Date(bitacora.fechaMuestreo).setHours(
          0,
          0,
          0,
          0
        );
        const selectedDate = new Date(dateFilter).setHours(0, 0, 0, 0);
        return bitacoraDate === selectedDate;
      });
    }

    setFilteredBitacoras(filtered);
  };

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
          <div className="flex justify-content-between align-items-center">
            <Button
              icon="pi pi-info-circle"
              label="Detalles"
              className="p-button-rounded p-button-info"
              onClick={() => handleDetailsClick(bitacora._id)}
            />
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              className="p-button-rounded p-button-danger"
              onClick={() => handleDelete(bitacora._id)}
            />
          </div>
        }
      >
        <Tag value={bitacora.condicionesClimaticas} severity={getSeverity(bitacora.condicionesClimaticas)} />
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
          <div className="flex-grow-1">
            <h5 className="m-0">{bitacora.titulo}</h5>
            <p className="text-secondary">{new Date(bitacora.fechaMuestreo).toLocaleDateString()}</p>
            <Tag value={bitacora.condicionesClimaticas} severity={getSeverity(bitacora.condicionesClimaticas)} />
            <p>{bitacora.descripcionHabitat || "Sin descripción"}</p>
          </div>
          <div className="flex align-items-center gap-2">
            <Button
              icon="pi pi-info-circle"
              label="Detalles"
              className="p-button-text"
              onClick={() => handleDetailsClick(bitacora._id)}
            />
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              className="p-button-danger p-button-text"
              onClick={() => handleDelete(bitacora._id)}
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
    <div className="flex flex-column align-items-start mb-3">
      <h4>Bitácoras</h4>
      <div className="flex align-items-center mb-2">
        <span className="p-float-label mr-2">
          <InputText
            id="usernameFilter"
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            placeholder="Filtrar por usuario"
          />
        </span>
        <span className="p-float-label mr-2">
          <Calendar
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.value)}
            dateFormat="yy-mm-dd"
            placeholder="Filtrar por fecha"
          />
        </span>
        <Button
          label="Aplicar filtros"
          icon="pi pi-filter"
          onClick={applyFilters}
        />
      </div>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value)}
      />
    </div>
  );

  return (
    <div className="full-width-container">
      <DataView
        value={filteredBitacoras}
        itemTemplate={(bitacora) => itemTemplate(bitacora, layout)}
        layout={layout}
        header={header}
        paginator
        rows={9}
      />
    </div>
  );
}
