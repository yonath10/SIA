// src/pages/Estadisticas.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/estadisticas.css";

function Estadisticas() {
    const [estadisticas, setEstadisticas] = useState(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const response = await api.get("/obtenerEstadisticas", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEstadisticas(response.data); // Actualiza el estado con los datos
                }
            } catch (error) {
                console.error("Error al obtener estadísticas", error);
            }
        };

        obtenerDatos();
    }, []); // Agrega un array de dependencias vacío aquí

    if (!estadisticas) {
        return (
            <div>
                <Navbar />
                <p>Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <h2>Estadísticas de Cultivos</h2>
            <div>
                <h3>Cultivos por Tipo:</h3>
                <ul>
                    {estadisticas.cultivosPorTipo.map((cultivo) => (
                        <li key={cultivo.nombre}>
                            {cultivo.nombre}: {cultivo.total}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Producción Total Estimada:</h3>
                <p>{estadisticas.totalProduccion} kg</p>
            </div>
        </div>
    );
}

export default Estadisticas;