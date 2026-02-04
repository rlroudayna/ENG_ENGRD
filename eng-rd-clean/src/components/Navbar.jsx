import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setOpenDropdown(null); // Ferme les dropdowns quand le menu mobile est ouvert/fermé
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // Ferme les dropdowns et le menu mobile si on clique en dehors de la navbar
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToSection = (id) => {
    // Ferme le menu mobile et les dropdowns
    setMenuOpen(false);
    setOpenDropdown(null);
    
    // Si nous sommes sur une autre page, redirige vers l'accueil avec l'ancre
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      // Sinon, si nous sommes déjà sur l'accueil, effectue un défilement doux
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToTop = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={scrollToTop}>
          <img src={logo} alt="ENG RND" className="logo-img" />
        </Link>

        {/* Bouton hamburger pour le menu mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Menu de navigation principal */}
        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={scrollToTop}>Accueil</Link>
          </li>

          <li className="dropdown">
            <div className="dropdown-header">
              {/* Le clic sur le lien "Qui sommes-nous" déclenche le défilement */}
              <span
                className="dropdown-main-link"
                onClick={() => scrollToSection("about")}
              >
                Qui sommes-nous
              </span>
              {/* Bouton pour ouvrir/fermer le sous-menu déroulant */}
              <button className="dropdown-arrow" onClick={() => toggleDropdown("about")}>▼</button>
            </div>
            <ul className={`dropdown-menu ${openDropdown === "about" ? "show" : ""}`}>
              <li><span onClick={() => scrollToSection("expertise")}>Notre expertise</span></li>
              <li><span onClick={() => scrollToSection("secteurs-activites")}>Secteurs d'activités</span></li>
              <li><span onClick={() => scrollToSection("valeurs")}>Valeurs & engagements</span></li>
            </ul>
          </li>

          <li className="dropdown">
            <div className="dropdown-header">
              {/* Le lien "Carrière" qui mène à /jobs */}
              <Link to="/jobs" className="dropdown-main-link" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>Carrière</Link>
              {/* Bouton pour ouvrir/fermer le sous-menu déroulant */}
              <button className="dropdown-arrow" onClick={() => toggleDropdown("career")}>▼</button>
            </div>
            <ul className={`dropdown-menu ${openDropdown === "career" ? "show" : ""}`}>
              <li><Link to="/jobs" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>Offres ENG</Link></li>
              <li><Link to="/apply" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>Candidature</Link></li>
            </ul>
          </li>

          {/* ⭐ Le lien pour la page Actualité, qui pointe vers /news */}
          <li><Link to="/news" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>Actualité</Link></li>

          <li><Link to="/contact" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>Nous contacter</Link></li>
        </ul>
      </div>
    </nav>
  );
}
