import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/api";

function Dashboard() {
    const [cultivos, setCultivos] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCultivos = async () => {
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
                setError("No tienes cultivos en Curso");
            }
        };

        fetchCultivos();
    }, []);

    const handleEdit = (cultivo) => {
        navigate(`/editarCultivo/${cultivo.id}`);
    };

    const handleDelete = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar este cultivo?");
        if (!confirmacion) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/cultivos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCultivos(cultivos.filter((cultivo) => cultivo.id !== id));
            alert("Cultivo eliminado correctamente");
        } catch (error) {
            console.error("Error al eliminar el cultivo", error);
            alert("Error al eliminar el cultivo");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Tus Cultivos</h2>
                        <p className="text-gray-600 mt-1">Administra y revisa el estado de tus cultivos</p>
                    </div>

                    {error && (
                        <div className="p-6">
                            <p className="text-red-500 bg-red-50 p-3 rounded-md">{error}</p>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio Sembrado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad Estimada</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Siembra</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de Cosecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Vencimiento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cultivos.map((cultivo) => (
                                    <tr key={cultivo.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium">
                                                        {cultivo.nombre.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{cultivo.nombre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {cultivo.localizacion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                                                {cultivo.espacio_sembrado} m²
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md">
                                                {cultivo.cantidad_estimado} kg
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(cultivo.fecha_siembra).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md">
                                                {cultivo.tiempo_cosecha} días
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(cultivo.fecha_vencimiento).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(cultivo)}
                                                className="mr-3 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1 rounded transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cultivo.id)}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;