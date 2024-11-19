import { useState } from "react";
import { Button } from 'primereact/button';
import Header from "../components/Header";
import Bitacoras from "../components/Bitacoras/DataView";
import BitacoraModal from "../components/Bitacoras/BitacoraModal";
import "./styles/HomePage.css";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bitacoras, setBitacoras] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleBitacoraCreated = (newBitacora) => {
    setBitacoras((prevBitacoras) => [newBitacora, ...prevBitacoras]);
    window.location.reload();
    handleCloseModal();
  };

  return (
    <div className="home-page">
      <Header />
      <div className="content">
        <div className="bitacoras-header">
          <Button
            label="Agregar Bitácora"
            icon="pi pi-plus"
            onClick={handleOpenModal}
            className="p-button-primary"
          />
        </div>
        <Bitacoras bitacoras={bitacoras} setBitacoras={setBitacoras} />
      </div>
      <BitacoraModal
        visible={isModalOpen}
        onHide={handleCloseModal}
        onBitacoraCreated={handleBitacoraCreated}
      />
    </div>
  );
};

export default HomePage;
