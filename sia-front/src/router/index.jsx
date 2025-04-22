import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CrearCultivo from "../pages/CrearCultivo"; 
import Grafica from "../pages/Grafica"; 
import PrivateRoute from "./PrivateRoute";
import EditarCultivo from "../pages/EditarCultivo";
import Estadisticas from "../pages/Estadisticas";
import Footer from "../components/Footer"; // Importa el componente Footer
const AppRouter = () => {
  return (
    <BrowserRouter>
  
      <Routes>
        
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/editarCultivo/:id" element={<PrivateRoute><EditarCultivo /></PrivateRoute>} />
        <Route path="/grafica" element={<PrivateRoute><Grafica /></PrivateRoute>} />
        <Route path="/crear-cultivo" element={<PrivateRoute><CrearCultivo /></PrivateRoute>} /> {/* ✅ Nueva Ruta */}
        <Route path="/estadisticas" element={<PrivateRoute><Estadisticas /></PrivateRoute>} /> {/* ✅ Nueva Ruta */}
      </Routes>
      <Footer /> 
      
      
      

    </BrowserRouter>
  );
};

export default AppRouter;
