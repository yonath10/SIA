import React from 'react';
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
    return (
        <div className="home-container">
            <div className="home-buttons">
                <Link to="/login">
                    <button>Iniciar Sesión</button>
                </Link>
                <Link to="/register">
                    <button>Registrarse</button>
                </Link>
            </div>

            <h1> Bienvenido a SIA</h1>
            <p>Gestión inteligente de cultivos</p>

            <section className="home-benefits">
                <h2>Beneficios de SIA</h2>
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <h3>Aumenta la productividad</h3>
                        <p>Maximiza el rendimiento de tus cultivos con información precisa y recomendaciones personalizadas.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Reduce costos y optimiza recursos</h3>
                        <p>Utiliza eficientemente tus recursos y reduce gastos innecesarios con nuestra plataforma.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Toma decisiones basadas en datos precisos</h3>
                        <p>Accede a datos en tiempo real y análisis detallados para tomar decisiones informadas.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Recibe alertas y predicciones personalizadas</h3>
                        <p>Anticipa problemas y optimiza tus cultivos con alertas y predicciones personalizadas.</p>
                    </div>
                    <div className="benefit-item">
                        <h3>Monitorea tus cultivos en tiempo real</h3>
                        <p>Mantente al tanto del estado de tus cultivos en todo momento y desde cualquier lugar.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;