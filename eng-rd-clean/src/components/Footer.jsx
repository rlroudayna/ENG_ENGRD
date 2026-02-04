import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Section principale du footer */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Logo centré */}
          <div className="footer-logo-section">
            <img src={logo} alt="ENG RND" className="footer-logo" />
          </div>

          {/* Informations de contact */}
          <div className="footer-contact">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <a href="mailto:contact@eng-rnd.com" className="contact-link">
                contact@eng-rnd.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="footer-divider"></div>

      {/* Navigation et copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <nav className="footer-navigation">
            <Link to="/" className="footer-nav-link">Accueil</Link>
            <Link to="/jobs" className="footer-nav-link">Carrière</Link>
            <Link to="/news" className="footer-nav-link">Actualité</Link>
            <Link to="/contact" className="footer-nav-link">Nous contacter</Link>
          </nav>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2025 ENG RND. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
