import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/Navbar";
import "../styles/crearCultivo.css";

const cultivosDisponibles = ["Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa", "Zanahoria", "Remolacha", "Maíz"];

const token = localStorage.getItem("token");
const userId = token ? jwtDecode(token).id : null;

function CrearCultivo() {
    const [form, setForm] = useState({
        nombre: cultivosDisponibles[0],
        localizacion: "",
        espacio_sembrado: "",
        cantidad_estimado: "",
        fecha_siembra: "",
        userId: userId || "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (!token) {
                setError("No estás autenticado");
                return;
            }
            if (!userId) {
                setError("No se encontró el usuario");
                return;
            }

            const fechaSiembra = new Date(form.fecha_siembra);
            const tiempoCosecha = obtenerTiempoCosecha(form.nombre); // Obtener tiempo de cosecha por defecto
            const fechaVencimiento = new Date(fechaSiembra);
            fechaVencimiento.setDate(fechaSiembra.getDate() + tiempoCosecha);

            const cultivoData = {
                ...form,
                userId,
                fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
            };

            const { data } = await api.post("/cultivos/crearCultivo", cultivoData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Cultivo creado exitosamente");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            console.error("Error al crear el cultivo:", error);
            setError("Error al crear el cultivo");
        }
    };

    // Función para obtener el tiempo de cosecha por defecto para cada cultivo
    const obtenerTiempoCosecha = (nombreCultivo) => {
        switch (nombreCultivo) {
            case "Espinaca": return 60; // Días
            case "Cilantro": return 45; // Días
            case "Lechuga": return 50; // Días
            case "Apio": return 90; // Días
            case "Brócoli": return 75; // Días
            case "Papa": return 120; // Días
            case "Zanahoria": return 100; // Días
            case "Remolacha": return 60; // Días
            case "Maíz": return 90; // Días
            default: return 60; // Tiempo por defecto si no se encuentra el cultivo
        }
    };

    return (
        <div>
            <Navbar />
            <div className="crear-cultivo-container">
                <h2>Crear Nuevo Cultivo</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <label>Nombre de Producto:</label>
                    <select name="nombre" value={form.nombre} onChange={handleChange} required>
                        {cultivosDisponibles.map((cultivo, index) => (
                            <option key={index} value={cultivo}>
                                {cultivo}
                            </option>
                        ))}
                    </select>

                    <input type="text" name="localizacion" placeholder="Localización" value={form.localizacion} onChange={handleChange} required />
                    <input type="number" name="espacio_sembrado" placeholder="Espacio sembrado (m²)" value={form.espacio_sembrado} onChange={handleChange} required />
                    <input type="number" name="cantidad_estimado" placeholder="Cantidad estimada (kg)" value={form.cantidad_estimado} onChange={handleChange} required />
                    <label>Fecha de Siembra:</label>
                    <input type="date" name="fecha_siembra" value={form.fecha_siembra} onChange={handleChange} required />

                    <button type="submit">Crear Cultivo</button>
                </form>
            </div>
        </div>
    );
}

export default CrearCultivo;