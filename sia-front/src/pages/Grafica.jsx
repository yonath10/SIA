import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Sector } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';

const cultivosEsperados = [ "Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa", "Zanahoria", "Remolacha", "Maíz" ];

// --- Componente para un Tooltip personalizado ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border bg-white p-4 shadow-lg">
                <p className="font-bold text-gray-800">{`Mes: ${label}`}</p>
                {payload.map(pld => (
                    <div key={pld.dataKey} style={{ color: pld.fill }}>
                        {`${pld.dataKey}: ${pld.value.toLocaleString('es-ES')} ${pld.unit || 'kg'}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const Grafica = () => {
    const [datosOriginales, setDatosOriginales] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date("2025-03-15"));
    const [isLoading, setIsLoading] = useState(true);
    const [filtroCultivo, setFiltroCultivo] = useState("Todos");
    const [vistaGrafico, setVistaGrafico] = useState('cantidad'); // 'cantidad' o 'espacio'

    useEffect(() => {
        const obtenerYProcesarCultivos = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/cultivos/todosCultivos");
                setDatosOriginales(response.data);
            } catch (error) {
                console.error("Error obteniendo los datos", error);
            } finally {
                setIsLoading(false);
            }
        };
        obtenerYProcesarCultivos();
    }, []);

    // --- Cálculos y Memos para optimizar el rendimiento ---
    const datosFiltradosDelMes = useMemo(() => {
        const fechaInicio = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1);
        const fechaFin = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth() + 1, 0, 23, 59, 59);
        return datosOriginales.filter(c => {
            const fechaCosecha = new Date(c.fecha_vencimiento);
            return fechaCosecha >= fechaInicio && fechaCosecha <= fechaFin;
        });
    }, [datosOriginales, fechaSeleccionada]);

    const datosParaGraficas = useMemo(() => {
        const cultivosDelFiltro = filtroCultivo === "Todos" ? cultivosEsperados : [filtroCultivo];
        const data = cultivosDelFiltro.map(nombre => {
            const cultivosDeEsteTipo = datosFiltradosDelMes.filter(c => c.nombre === nombre);
            return {
                name: nombre,
                cantidad: cultivosDeEsteTipo.reduce((sum, c) => sum + c.cantidad_estimado, 0),
                espacio: cultivosDeEsteTipo.reduce((sum, c) => sum + c.espacio_sembrado, 0),
            };
        });
        return data.filter(d => d.cantidad > 0 || d.espacio > 0); // Solo mostrar si hay datos
    }, [datosFiltradosDelMes, filtroCultivo]);

    const rendimiento = useMemo(() => {
        const totalCantidad = datosParaGraficas.reduce((sum, d) => sum + d.cantidad, 0);
        const totalEspacio = datosParaGraficas.reduce((sum, d) => sum + d.espacio, 0);
        if (totalEspacio === 0) return 0;
        return (totalCantidad / totalEspacio).toFixed(2); // kg/m²
    }, [datosParaGraficas]);
    
    const colores = useMemo(() => {
        const colorMap = {};
        const palette = ["#22c55e", "#16a34a", "#15803d", "#14532d", "#84cc16", "#f59e0b", "#d97706", "#b45309", "#78350f"];
        cultivosEsperados.forEach((nombre, index) => {
            colorMap[nombre] = palette[index % palette.length];
        });
        return colorMap;
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto my-10 rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-700 text-center">Análisis de Producción Mensual</h2>
                
                {/* --- FILTROS --- */}
                <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6 rounded-md border p-4 items-end">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Selecciona un Mes:</label>
                        <DatePicker selected={fechaSeleccionada} onChange={(date) => setFechaSeleccionada(date)} dateFormat="MMMM yyyy" showMonthYearPicker locale={es} className="w-full rounded-md border border-gray-300 p-2 text-center" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Filtrar por Cultivo:</label>
                        <select value={filtroCultivo} onChange={(e) => setFiltroCultivo(e.target.value)} className="w-full rounded-md border border-gray-300 p-2">
                            <option value="Todos">Todos los Cultivos</option>
                            {cultivosEsperados.map(nombre => <option key={nombre} value={nombre}>{nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-600">Ver por:</label>
                        <div className="flex rounded-md shadow-sm">
                            <button onClick={() => setVistaGrafico('cantidad')} className={`flex-1 p-2 rounded-l-md transition ${vistaGrafico === 'cantidad' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cantidad (kg)</button>
                            <button onClick={() => setVistaGrafico('espacio')} className={`flex-1 p-2 rounded-r-md transition ${vistaGrafico === 'espacio' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Superficie (m²)</button>
                        </div>
                    </div>
                </div>

                {/* --- VISUALIZACIONES --- */}
                {isLoading ? <p>Cargando datos...</p> : datosParaGraficas.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-center">
                        {/* Gráfico de Barras */}
                        <div className="lg:col-span-2 h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosParaGraficas} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" domain={[0, 'dataMax + 100']} />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} />
                                    <Bar dataKey={vistaGrafico} name={vistaGrafico === 'cantidad' ? 'Cantidad' : 'Superficie'} unit={vistaGrafico === 'cantidad' ? ' kg' : ' m²'} fill="#16a34a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Gráfico de Torta y Rendimiento */}
                        <div className="flex flex-col gap-8">
                            <div className="h-64">
                                <h3 className="text-lg font-semibold text-center mb-2">Distribución de Producción (kg)</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={datosParaGraficas} dataKey="cantidad" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {datosParaGraficas.map((entry) => <Cell key={`cell-${entry.name}`} fill={colores[entry.name]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800">Rendimiento Promedio</h3>
                                <p className="text-4xl font-bold text-green-700 mt-2">{rendimiento}</p>
                                <p className="text-sm text-gray-600">kg / m²</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="mt-8 text-center text-xl text-orange-600">No hay datos para mostrar con los filtros seleccionados.</p>
                )}
            </div>
        </div>
    );
};

export default Grafica;