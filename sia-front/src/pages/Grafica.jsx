import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/grafica.css";

const cultivosEsperados = [
    "Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa",
    "Zanahoria", "Remolacha", "Maíz"
];

const Grafica = () => {
    const [datosCultivo, setDatosCultivo] = useState([]);
    const [mensajeRecomendacion, setMensajeRecomendacion] = useState("");
    const [fechaInicio, setFechaInicio] = useState(new Date(2025, 2, 1));
    const [fechaFin, setFechaFin] = useState(new Date(2025, 2, 31, 23, 59, 59, 999));

    useEffect(() => {
        const obtenerCultivos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await api.get("/cultivos/obtenerCultivos", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const { data } = response;

                    const cultivosFiltrados = data.filter(cultivo => {
                        const fechaParts = cultivo.fecha_vencimiento.split("-");
                        const year = parseInt(fechaParts[0]);
                        const month = parseInt(fechaParts[1]) - 1;
                        const day = parseInt(fechaParts[2]);
                        const fechaCosecha = new Date(year, month, day);

                        return fechaCosecha >= fechaInicio && fechaCosecha <= fechaFin;
                    });

                    if (cultivosFiltrados.length === 0) {
                        setDatosCultivo([]);
                        setMensajeRecomendacion("No hay cultivos para el período seleccionado.");
                        return;
                    }

                    const cultivosAgrupados = cultivosFiltrados.reduce((acc, cultivo) => {
                        const mesCosecha = new Date(cultivo.fecha_vencimiento).toLocaleString("es-ES", { month: "long" });
                        if (!acc[mesCosecha]) acc[mesCosecha] = {};
                        acc[mesCosecha][cultivo.nombre] = (acc[mesCosecha][cultivo.nombre] || 0) + cultivo.cantidad_estimado;
                        return acc;
                    }, {});

                    const datos = Object.entries(cultivosAgrupados).map(([mes, cultivos]) => {
                        let entry = { mes };
                        let faltantes = [];

                        cultivosEsperados.forEach((cultivo) => {
                            if (!cultivos[cultivo] || cultivos[cultivo] < 5) {
                                faltantes.push(cultivo);
                                entry[`Falta: ${cultivo}`] = 5;
                            } else {
                                entry[cultivo] = cultivos[cultivo];
                            }
                        });

                        return entry;
                    });

                    // Calcular tiempo_cosecha en el frontend
                    const datosConTiempoCosecha = cultivosFiltrados.map(cultivo => {
                        const fechaSiembra = new Date(cultivo.fecha_siembra);
                        const fechaVencimiento = new Date(cultivo.fecha_vencimiento);
                        const tiempoCosecha = Math.round((fechaVencimiento - fechaSiembra) / (1000 * 60 * 60 * 24)); // Días

                        return {
                            ...cultivo,
                            tiempo_cosecha: tiempoCosecha,
                        };
                    });

                    setDatosCultivo(datos);

                    const recomendaciones = analizarTendencias(datos);
                    setMensajeRecomendacion(recomendaciones);
                } else {
                    console.error("Token no encontrado en el almacenamiento local.");
                }
            } catch (error) {
                console.error("Error obteniendo los cultivos", error);
            }
        };

        obtenerCultivos();
    }, [fechaInicio, fechaFin]);

    const analizarTendencias = (datos) => {
        let recomendacion = " Recomendación: ";
        let sugerencias = {};

        datos.forEach(({ mes, ...cultivos }) => {
            Object.entries(cultivos).forEach(([cultivo, cantidad]) => {
                if (cultivo.startsWith("Falta:")) {
                    const nombreCultivo = cultivo.replace("Falta: ", "");
                    sugerencias[mes] = sugerencias[mes] || [];
                    sugerencias[mes].push(nombreCultivo);
                }
            });
        });

        if (Object.keys(sugerencias).length > 0) {
            recomendacion += "\n Proyección: Para equilibrar la oferta, podrías sembrar:";
            Object.entries(sugerencias).forEach(([mes, cultivos]) => {
                recomendacion += `\n En ${mes}: ${cultivos.join(", ")}.`;
            });
        } else {
            recomendacion += "La producción está equilibrada.";
        }

        return recomendacion;
    };

    return (
        <div>
            <Navbar />
        <div className="grafico-container">
            
            <h2>Producción de Cultivos y Sugerencias</h2>
            <div className="calendario-container">
                <div className="calendario-item">
                    <label>Fecha Inicio:</label>
                    <DatePicker
                        selected={fechaInicio}
                        onChange={(date) => setFechaInicio(date)}
                        locale="es"
                    />
                </div>
                <div className="calendario-item">
                    <label>Fecha Fin:</label>
                    <DatePicker
                        selected={fechaFin}
                        onChange={(date) => setFechaFin(date)}
                        locale="es"
                    />
                </div>
            </div>
            {datosCultivo.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={datosCultivo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="mes" />
                        <YAxis label={{ value: 'Cantidad (kg)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        {Object.keys(datosCultivo[0] || {}).filter((key) => key !== "mes").map((cultivo) => (
                            <Bar
                                key={cultivo}
                                dataKey={cultivo}
                                fill={cultivo.startsWith("Falta:") ? "#e74c3c" : `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="mensaje-sin-datos">{mensajeRecomendacion}</p>
            )}
            <p className="recomendacion">{mensajeRecomendacion}</p>
        </div>
        </div>
    );
};

export default Grafica;