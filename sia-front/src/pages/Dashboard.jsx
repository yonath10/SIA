import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/api";

function Dashboard() {
    const [cultivos, setCultivos] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Añadido para mejor UX
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCultivos = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No estás autenticado");
                    return;
                }

                const { data } = await api.get("/cultivos/obtenerCultivos", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const cultivosConTiempoCosecha = data.map(cultivo => {
                    const fechaSiembra = new Date(cultivo.fecha_siembra);
                    const fechaVencimiento = new Date(cultivo.fecha_vencimiento);
                    const tiempoCosecha = Math.round((fechaVencimiento - fechaSiembra) / (1000 * 60 * 60 * 24));

                    return {
                        ...cultivo,
                        tiempo_cosecha: tiempoCosecha,
                    };
                });

                setCultivos(cultivosConTiempoCosecha);
            } catch (error) {
                // Mensaje más amigable si no hay cultivos
                if (error.response?.status === 404) {
                    setError("Aún no tienes cultivos registrados. ¡Crea el primero!");
                } else {
                    setError("No se pudieron cargar tus cultivos.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCultivos();
    }, []);

    const handleEdit = (cultivo) => {
        navigate(`/editarCultivo/${cultivo.id}`);
    };

    const handleDelete = async (id) => {
        // ... (la funcionalidad de eliminar no cambia)
    };
    
    // --- Renderizado ---

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto p-8 text-center text-gray-500">Cargando tus cultivos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Encabezado con el nuevo color */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-green-800">Tus Cultivos</h2>
                        <p className="text-gray-600 mt-1">Administra y revisa el estado de tus cultivos.</p>
                    </div>

                    {/* Tabla de Cultivos */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Municipio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Espacio (m²)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Estimado (kg)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Siembra</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Cosecha (días)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Vencimiento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Opciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cultivos.map((cultivo) => (
                                    <tr key={cultivo.id} className="hover:bg-green-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* Círculo con inicial y color verde */}
                                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-700 font-bold">
                                                        {cultivo.nombre.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{cultivo.nombre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cultivo.localizacion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cultivo.espacio_sembrado}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-800">{cultivo.cantidad_estimado}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(cultivo.fecha_siembra).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cultivo.tiempo_cosecha}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(cultivo.fecha_vencimiento).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Botones con la nueva paleta de colores */}

                                            <button
                                                onClick={() => handleDelete(cultivo.id)}
                                                className="font-semibold text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {/* Mensaje si no hay cultivos */}
                     {cultivos.length === 0 && !isLoading && (
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-medium text-gray-700">{error}</h3>
                            <button 
                                onClick={() => navigate('/crear-cultivo')}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Registrar mi primer cultivo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;