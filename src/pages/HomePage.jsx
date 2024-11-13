// pages/HomePage.jsx
import { useState } from "react";
import { Button } from 'primereact/button';
import Header from "../components/Header";
import Bitacoras from "../components/Bitacoras/DataView";
import BitacoraModal from "../components/Bitacoras/BitacoraModal";
import "./styles/HomePage.css";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="home-page">
      <Header />
      <div className="content">
        <div className="bitacoras-header">
          <Button label="Agregar Bitácora" icon="pi pi-plus" onClick={handleOpenModal} className="p-button-primary" />
        </div>
        <Bitacoras />
      </div>
      <BitacoraModal visible={isModalOpen} onHide={handleCloseModal} />
    </div>
  );
};

export default HomePage;
