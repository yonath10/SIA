import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- Configuración ---
const cultivosEsperados = [
    "Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa",
    "Zanahoria", "Remolacha", "Maíz"
];
const UMBRAL_PRODUCCION_BAJA = 20; // en kg

const Grafica = () => {
    const [datosGrafica, setDatosGrafica] = useState([]);
    const [mensajeRecomendacion, setMensajeRecomendacion] = useState("");
    const [fechaInicio, setFechaInicio] = useState(new Date("2025-03-01T00:00:00"));
    const [fechaFin, setFechaFin] = useState(new Date("2025-03-31T23:59:59"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerYProcesarCultivos = async () => {
            setIsLoading(true);
            try {
                // CORRECCIÓN: Usar el endpoint público que trae TODOS los cultivos
                const response = await api.get("/cultivos/todosCultivos");
                const todosLosCultivos = response.data;

                const cultivosFiltrados = todosLosCultivos.filter(cultivo => {
                    const fechaCosecha = new Date(cultivo.fecha_vencimiento);
                    return fechaCosecha >= fechaInicio && fechaCosecha <= fechaFin;
                });

                if (cultivosFiltrados.length === 0) {
                    setDatosGrafica([]);
                    setMensajeRecomendacion("No hay datos de cosechas para el período seleccionado.");
                    return;
                }

                const produccionPorMes = cultivosFiltrados.reduce((acc, cultivo) => {
                    const mes = new Date(cultivo.fecha_vencimiento).toLocaleString("es-ES", { month: "long" });
                    if (!acc[mes]) acc[mes] = {};
                    acc[mes][cultivo.nombre] = (acc[mes][cultivo.nombre] || 0) + cultivo.cantidad_estimado;
                    return acc;
                }, {});

                const datosParaChart = Object.keys(produccionPorMes).map(mes => {
                    const datosMes = { mes };
                    cultivosEsperados.forEach(nombreCultivo => {
                        datosMes[nombreCultivo] = produccionPorMes[mes][nombreCultivo] || 0;
                    });
                    return datosMes;
                });
                
                setDatosGrafica(datosParaChart);
                analizarTendencias(cultivosFiltrados);

            } catch (error) {
                console.error("Error obteniendo los datos para la gráfica", error);
                setMensajeRecomendacion("Error al cargar los datos. Intenta de nuevo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        obtenerYProcesarCultivos();
    }, [fechaInicio, fechaFin]);

    const analizarTendencias = (cultivos) => {
        const produccionTotal = cultivosEsperados.reduce((acc, nombreCultivo) => ({...acc, [nombreCultivo]: 0}), {});
        cultivos.forEach(c => {
            if (produccionTotal[c.nombre] !== undefined) {
                produccionTotal[c.nombre] += c.cantidad_estimado;
            }
        });
        
        const cultivosRecomendados = cultivosEsperados.filter(
            nombreCultivo => produccionTotal[nombreCultivo] < UMBRAL_PRODUCCION_BAJA
        );

        if (cultivosRecomendados.length > 0) {
            setMensajeRecomendacion(`Recomendación: La producción de ${cultivosRecomendados.join(", ")} es baja. ¡Considera sembrarlos!`);
        } else {
            setMensajeRecomendacion("¡Buen trabajo! La producción de todos los cultivos está equilibrada.");
        }
    };
    
    const coloresCultivos = cultivosEsperados.reduce((acc, nombre, index) => {
        const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
        acc[nombre] = colores[index % colores.length];
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Contenedor principal con clases de Tailwind */}
            <div className="container mx-auto my-10 rounded-lg bg-white p-8 text-center shadow-lg">
                <h2 className="mb-6 text-2xl font-bold uppercase tracking-wider text-gray-700">
                    Producción de Cultivos por Mes
                </h2>
                
                {/* Contenedor de calendarios */}
                <div className="my-6 flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <div className="flex flex-col items-center">
                        <label className="mb-2 block font-semibold text-gray-600">Fecha Inicio:</label>
                        <DatePicker 
                            selected={fechaInicio} 
                            onChange={date => setFechaInicio(date)} 
                            locale="es" 
                            selectsStart 
                            startDate={fechaInicio} 
                            endDate={fechaFin}
                            className="w-full rounded-md border border-gray-300 p-2 text-center"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="mb-2 block font-semibold text-gray-600">Fecha Fin:</label>
                        <DatePicker 
                            selected={fechaFin} 
                            onChange={date => setFechaFin(date)} 
                            locale="es" 
                            selectsEnd 
                            startDate={fechaInicio} 
                            endDate={fechaFin} 
                            minDate={fechaInicio}
                            className="w-full rounded-md border border-gray-300 p-2 text-center"
                        />
                    </div>
                </div>

                {/* Contenedor de la gráfica */}
                <div className="mt-8 h-96 w-full">
                    {isLoading ? (
                        <p>Cargando datos de la gráfica...</p>
                    ) : datosGrafica.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosGrafica} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis label={{ value: 'Producción (kg)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                {cultivosEsperados.map((nombreCultivo) => (
                                    <Bar key={nombreCultivo} dataKey={nombreCultivo} fill={coloresCultivos[nombreCultivo]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="mt-8 text-xl text-orange-600">No hay datos para mostrar en el período seleccionado.</p>
                        </div>
                    )}
                </div>
                
                {/* Mensaje de recomendación */}
                {!isLoading && (
                     <p className="mt-8 inline-block whitespace-pre-line rounded-md bg-orange-100 p-4 font-semibold text-orange-700">
                        {mensajeRecomendacion}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Grafica;