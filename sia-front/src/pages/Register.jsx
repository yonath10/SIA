import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api/api";
import "../styles/register.css";
function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/users/register", form);
      setAuthToken(data.token); // Guardar token en localStorage
      navigate("/dashboard"); // Redirigir después del registro exitoso
    } catch (error) {
      setError(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Crear Cuenta</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input type="text" name="ubicacion" placeholder="Municipio" value={form.ubicacion} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />

        <button type="submit">Registrarse</button>
      </form>
      
      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
    </div>
  );
}

export default Register;
