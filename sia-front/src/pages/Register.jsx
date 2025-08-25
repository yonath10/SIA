import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, setAuthToken } from "../api/api";

const logoUrl = '/img/sia.png'; 

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/users/register", form);
      setAuthToken(data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Error en el registro. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">SIA</h1>
        <p className="text-xl text-green-600">Sistemas de Información Agrícola</p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear cuenta</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="ubicacion"
              placeholder="Municipio"
              value={form.ubicacion}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-green-800 mb-4">Optimiza tu producción agrícola con inteligencia de datos</p>
        <Link 
          to="/home" 
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition"
        >
          Conoce más
        </Link>
      </div>
    </div>
  );
};

export default Register;