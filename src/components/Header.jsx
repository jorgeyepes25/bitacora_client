import { useEffect, useState } from "react";
import AvatarMenu from "./AvatarMenu";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/HeaderStyle.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => navigate("/home");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSettingsRoute = location.pathname.startsWith("/settings");

  return (
    <>
      <header
        className={`header ${isScrolled ? "scrolled" : ""} ${
          isSettingsRoute ? "header-settings" : ""
        } ${isSettingsRoute && isMobile ? "header-settings-mobile" : ""}`}
      >        
        <div className="header-left" onClick={handleLogoClick}>
          <img src="/icon.png" alt="App icon" className="icon" />
        </div>
        <div className="header-center" onClick={handleLogoClick}>
          <h1 className="header-title">Bitácoras de Nuestro Caqueta</h1>
        </div>
        <div className="header-right">
          <AvatarMenu />
        </div>
      </header>
    </>
  );
};

export default Header;
