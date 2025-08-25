import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";

// --- Iconos SVG para la barra de progreso ---
const CultivoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const DetalleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const FechaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
// --- NUEVO: Icono de Carga ---
const LoadingIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


const cultivosDisponibles = ["Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa", "Zanahoria", "Remolacha", "Maíz"];

function CrearCultivo() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [rendimientos, setRendimientos] = useState({});

    const [form, setForm] = useState({
        nombre: cultivosDisponibles[0],
        localizacion: "",
        espacio_sembrado: "",
        fecha_siembra: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Cargar los datos de rendimiento desde el backend al iniciar
    useEffect(() => {
        const fetchRendimientos = async () => {
            try {
                const { data } = await api.get('/rendimientos');
                setRendimientos(data);
            } catch (error) {
                console.error("No se pudieron cargar los datos de rendimiento", error);
                setError("No se pudieron cargar los datos de rendimiento. El cálculo automático no funcionará.");
            }
        };
        fetchRendimientos();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const userId = token ? jwtDecode(token).id : null;

            if (!token || !userId) {
                setError("Autenticación inválida. Por favor, inicia sesión de nuevo.");
                setIsLoading(false); // Detener la carga si hay un error de autenticación
                return;
            }

            // El backend calculará la 'cantidad_estimado' si no se envía,
            // y siempre calculará la 'fecha_vencimiento'.
            const cultivoData = { ...form, userId };

            await api.post("/cultivos/crearCultivo", cultivoData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("¡Cultivo creado con éxito! Serás redirigido al dashboard.");
            setTimeout(() => navigate("/dashboard"), 2500);
        } catch (error) {
            console.error("Error al crear el cultivo:", error);
            setError(error.response?.data?.message || "Error al crear el cultivo.");
        } finally {
            setIsLoading(false);
        }
    };

    // Lógica para el asistente de pasos
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const steps = [
        { num: 1, title: "Cultivo y Lugar", icon: <CultivoIcon /> },
        { num: 2, title: "Detalles", icon: <DetalleIcon /> },
        { num: 3, title: "Fecha de Siembra", icon: <FechaIcon /> },
    ];

    // Calcula la producción estimada en tiempo real para mostrarla en la UI
    const cantidadCalculada = rendimientos[form.nombre] && form.espacio_sembrado
        ? (form.espacio_sembrado * rendimientos[form.nombre]).toFixed(2)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Barra de Progreso */}
                    <div className="mb-8 flex justify-between items-center">
                        {steps.map((s, index) => (
                            <React.Fragment key={s.num}>
                                <div className="flex flex-col items-center text-center w-1/3">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.num ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {s.icon}
                                    </div>
                                    <p className={`mt-2 text-xs font-semibold ${step >= s.num ? 'text-green-700' : 'text-gray-500'}`}>{s.title}</p>
                                </div>
                                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step > s.num ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Contenedor del Formulario */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* --- PASO 1 --- */}
                            {step === 1 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Información General del Cultivo</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Producto</label>
                                        <select name="nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500" required>
                                            {cultivosDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Localización</label>
                                        <input type="text" name="localizacion" placeholder="Ej: Finca Las Acacias" value={form.localizacion} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500" required />
                                    </div>
                                </div>
                            )}

                            {/* --- PASO 2 --- */}
                            {step === 2 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Dimensiones y Cantidad</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Espacio sembrado (m²)</label>
                                        <input type="number" name="espacio_sembrado" placeholder="Ej: 2500" value={form.espacio_sembrado} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500" required min="0" />
                                    </div>
                                    <div className="mt-6 bg-green-50 p-4 rounded-lg text-center">
                                        <p className="text-sm font-medium text-green-800">Producción Estimada (Automática)</p>
                                        <p className="text-3xl font-bold text-green-600 mt-1">
                                            {cantidadCalculada} kg
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Basado en un rendimiento promedio de {rendimientos[form.nombre] || 0} kg/m² para {form.nombre}.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* --- PASO 3 --- */}
                            {step === 3 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Fecha de Inicio</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Siembra</label>
                                        <input type="date" name="fecha_siembra" value={form.fecha_siembra} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500" required />
                                    </div>
                                </div>
                            )}

                            {/* --- Botones de Navegación --- */}
                            <div className="pt-6 flex justify-between items-center">
                                <div>
                                    {step > 1 && <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Anterior</button>}
                                </div>
                                <div>
                                    {step < 3 && <button type="button" onClick={nextStep} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">Siguiente</button>}
                                    {step === 3 && (
                                        <button 
                                            type="submit" 
                                            disabled={isLoading} 
                                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <LoadingIcon />
                                                    Creando...
                                                </>
                                            ) : (
                                                'Finalizar y Crear Cultivo'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrearCultivo;
