import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/api";
import "../styles/dashboard.css";

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

                // Calcular tiempo_cosecha en el frontend
                const cultivosConTiempoCosecha = data.map(cultivo => {
                    const fechaSiembra = new Date(cultivo.fecha_siembra);
                    const fechaVencimiento = new Date(cultivo.fecha_vencimiento);
                    const tiempoCosecha = Math.round((fechaVencimiento - fechaSiembra) / (1000 * 60 * 60 * 24)); // Días

                    return {
                        ...cultivo,
                        tiempo_cosecha: tiempoCosecha,
                    };
                });

                setCultivos(cultivosConTiempoCosecha);
            } catch (error) {
                setError("Error al obtener cultivos");
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
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h2> tus Cultivos</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <table className="cultivo-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Municipio</th>
                            <th>Espacio Sembrado</th>
                            <th>Cantidad Estimada</th>
                            <th>Fecha de Siembra</th>
                            <th>Tiempo de Cosecha</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cultivos.map((cultivo) => (
                            <tr key={cultivo.id}>
                                <td>{cultivo.nombre}</td>
                                <td>{cultivo.localizacion}</td>
                                <td>{cultivo.espacio_sembrado} m²</td>
                                <td>{cultivo.cantidad_estimado} kg</td>
                                <td>{new Date(cultivo.fecha_siembra).toLocaleDateString()}</td>
                                <td>{cultivo.tiempo_cosecha} días</td> 
                                <td>{new Date(cultivo.fecha_vencimiento).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(cultivo)}>✏️ Editar</button>
                                    <button onClick={() => handleDelete(cultivo.id)}>️ Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;