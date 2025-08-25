// sia-front/src/pages/AsesorDeSiembra.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../api/api';

const AsesorDeSiembra = () => {
    const [tiemposCosecha, setTiemposCosecha] = useState({});
    const [cultivoSeleccionado, setCultivoSeleccionado] = useState('');
    const [proyeccion, setProyeccion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. Cargar los tiempos de cosecha desde el nuevo endpoint del backend
    useEffect(() => {
        const cargarTiempos = async () => {
            try {
                const { data } = await api.get('/utils/tiempos-cosecha');
                setTiemposCosecha(data);
                if (Object.keys(data).length > 0) {
                    setCultivoSeleccionado(Object.keys(data)[0]);
                }
            } catch (err) {
                setError('No se pudieron cargar los datos de los cultivos.');
            }
        };
        cargarTiempos();
    }, []);

    // 2. Ejecutar la proyección cada vez que el usuario cambie el cultivo
    useEffect(() => {
        if (cultivoSeleccionado && tiemposCosecha[cultivoSeleccionado]) {
            const obtenerProyeccion = async () => {
                setIsLoading(true);
                setProyeccion(null);
                setError('');
                try {
                    const semanas = tiemposCosecha[cultivoSeleccionado];
                    const { data } = await api.get(`/cultivos/proyeccion-cosecha?nombre=${cultivoSeleccionado}&semanas_cosecha=${semanas}`);
                    setProyeccion(data);
                } catch (err) {
                    setError("Error al obtener la proyección.");
                } finally {
                    setIsLoading(false);
                }
            };
            obtenerProyeccion();
        }
    }, [cultivoSeleccionado, tiemposCosecha]);

    // 3. Lógica para colorear la tarjeta de resultado según la oferta
    const getCardInfo = (oferta) => {
        if (oferta < 2000) { // Baja oferta = Buena oportunidad
            return {
                styles: 'border-green-500 bg-green-50',
                mensaje: '¡Excelente oportunidad! La oferta proyectada es baja, lo que podría significar mejores precios.'
            };
        }
        if (oferta < 7000) { // Oferta media = Considerar
            return {
                styles: 'border-yellow-500 bg-yellow-50',
                mensaje: 'Mercado competitivo. La oferta es moderada. Analiza tus costos y evalúa la siembra.'
            };
        }
        return { // Alta oferta = Alto riesgo
            styles: 'border-red-500 bg-red-50',
            mensaje: '¡Alto riesgo! El mercado estará saturado. Considera sembrar un cultivo diferente.'
        };
    };

    const cardInfo = proyeccion ? getCardInfo(proyeccion.ofertaProyectadaKg) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto my-10 max-w-3xl px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Asesor de Siembra Predictivo 🔮</h2>
                <p className="mt-2 text-lg text-gray-600">Descubre qué sembrar hoy para obtener el mejor precio en la cosecha.</p>

                <div className="mt-8 rounded-lg bg-white p-6 shadow">
                    <label htmlFor="cultivo-select" className="block text-lg font-medium text-gray-700">
                        Si siembro hoy... ¿cómo estará el mercado de?
                    </label>
                    <select
                        id="cultivo-select"
                        value={cultivoSeleccionado}
                        onChange={(e) => setCultivoSeleccionado(e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 p-3 text-lg shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                        {Object.keys(tiemposCosecha).map(nombre => (
                            <option key={nombre} value={nombre}>{nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mt-8 min-h-[200px]">
                    {isLoading && <p className="pt-10 text-xl text-gray-500">Analizando el futuro...</p>}
                    {error && <p className="pt-10 text-xl text-red-500">{error}</p>}

                    {proyeccion && !isLoading && (
                        <div className={`rounded-lg border-l-8 p-6 text-left shadow-lg transition-all duration-500 ${cardInfo.styles}`}>
                            <h3 className="text-xl font-bold text-gray-900">Proyección para {proyeccion.cultivo}</h3>
                            <p className="mt-2 text-gray-700">
                                Tu cosecha estaría lista cerca del: {' '}
                                <span className="font-semibold">{new Date(proyeccion.fechaProyectada).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </p>
                            <p className="mt-4 text-2xl font-semibold text-gray-800">
                                La oferta ya comprometida para ese mes es de:
                            </p>
                            <p className="mt-1 text-5xl font-extrabold text-gray-900">
                                {proyeccion.ofertaProyectadaKg.toLocaleString('es-ES')} kg
                            </p>
                            <p className="mt-6 border-t pt-4 font-semibold text-gray-800">{cardInfo.mensaje}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsesorDeSiembra;