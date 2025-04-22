import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api/api";
import "../styles/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Agregamos el estado para el error
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/users/login", { email, password });

            if (data.token) {
                setAuthToken(data.token);
                navigate("/dashboard");
            } else {
                setError("Error al recibir el token");
            }
        } catch (error) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Ingresar</button>
                
                {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}
            </form>

            
        </div>

    );
};

export default Login;