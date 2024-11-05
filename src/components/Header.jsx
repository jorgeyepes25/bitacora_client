// components/Header.jsx
import { useEffect, useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { useNavigate } from "react-router-dom";
import "../pages/styles/HomePage.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => navigate("/");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-left" onClick={handleLogoClick}>
        <img src="/icon.png" alt="App icon" className="icon" />
      </div>
      <div className="header-center">
        <h1 className="header-title">Bitacoras</h1>
      </div>
      <div className="header-right">
        <AvatarMenu />
      </div>
    </header>
  );
};

export default Header;
