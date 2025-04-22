import React, { useState } from "react"; // Importa useState desde React
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";
import "../styles/footer.css";

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Información de Contacto</h4>
                    <p>Correo Electrónico: info@sia-app.com</p>
                    <p>Teléfono: +1 123 456 7890</p>
                    <p>Dirección: 123 Calle Principal, Ciudad, País</p>
                </div>
                <div className="footer-section">
                    <h4>Enlaces Útiles</h4>
                    <ul>
                        <li><a href="/terminos">Términos de Servicio</a></li>
                        <li><a href="/privacidad">Política de Privacidad</a></li>
                        <li><a href="/contacto">Contacto</a></li>
                        <li><a href="/ayuda">Ayuda</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Redes Sociales</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/sia-app" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://www.twitter.com/sia-app" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://www.instagram.com/sia-app" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} SIA. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;