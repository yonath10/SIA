import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api/api";

function EditarCultivo() {
  const location = useLocation();
  const navigate = useNavigate();
  const cultivoData = location.state?.cultivo || {};

  const [form, setForm] = useState({
    nombre: cultivoData.nombre || "",
    localizacion: cultivoData.localizacion || "",
    espacio_sembrado: cultivoData.espacio_sembrado || "",
    cantidad_estimado: cultivoData.cantidad_estimado || "",
    fecha_siembra: cultivoData.fecha_siembra || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const fechaSiembra = new Date(form.fecha_siembra);
      const tiempoCosechaDias = obtenerTiempoCosecha(form.nombre); // Obtener tiempo de cosecha en días
      const fechaVencimiento = new Date(fechaSiembra);
      fechaVencimiento.setDate(fechaSiembra.getDate() + tiempoCosechaDias);

      const cultivoDataActualizado = {
        ...form,
        fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
      };

      // Elimina el ID del cultivo del final de la ruta
      await api.put(`/${cultivoData.id}`, cultivoDataActualizado, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Cultivo actualizado correctamente");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al actualizar el cultivo", error);
      alert("Error al actualizar el cultivo");
    }
  };

  const obtenerTiempoCosecha = (nombreCultivo) => {
    const tiemposCosecha = {
      Espinaca: 45, // Días
      Cilantro: 60,
      Lechuga: 50,
      Apio: 90,
      Brócoli: 70,
      Papa: 120,
      Zanahoria: 100,
      Remolacha: 80,
      Maíz: 90,
    };

    return tiemposCosecha[nombreCultivo] || 60; // Tiempo de cosecha predeterminado si no se encuentra el cultivo
  };

  return (
    <div>
      <Navbar />
      <h2>✏️ Editar Cultivo</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del Cultivo:</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Localización:</label>
        <input type="text" name="localizacion" value={form.localizacion} onChange={handleChange} required />

        <label>Espacio sembrado (m²):</label>
        <input type="number" name="espacio_sembrado" value={form.espacio_sembrado} onChange={handleChange} required />

        <label>Cantidad estimada (kg):</label>
        <input type="number" name="cantidad_estimado" value={form.cantidad_estimado} onChange={handleChange} required />

        <label>Fecha de Siembra:</label>
        <input type="date" name="fecha_siembra" value={form.fecha_siembra} onChange={handleChange} required />

        <button type="submit">Actualizar Cultivo</button>
      </form>
    </div>
  );
}

export default EditarCultivo;