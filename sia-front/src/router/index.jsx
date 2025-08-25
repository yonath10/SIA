import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../index.css';
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CrearCultivo from "../pages/CrearCultivo";
import Grafica from "../pages/Grafica";
import PrivateRoute from "./PrivateRoute";
import EditarCultivo from "../pages/EditarCultivo";
import Asesor from "../pages/AsesorDeSiembra";
import Footer from "../components/Footer";
import PoliticaPrivacidad from "../pages/PoliticaPrivacidad";
import TerminosCondiciones from "../pages/TerminosCondiciones";
const AppRouter = () => {
  return (


    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacidad" element={<PoliticaPrivacidad />} /> 
        <Route path="/terminos" element={<TerminosCondiciones />} /> 

        {/* Rutas Privadas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/editarCultivo/:id" element={<PrivateRoute><EditarCultivo /></PrivateRoute>} />
        <Route path="/grafica" element={<PrivateRoute><Grafica /></PrivateRoute>} />
        <Route path="/crear-cultivo" element={<PrivateRoute><CrearCultivo /></PrivateRoute>} />
        <Route path="/asesor" element={<PrivateRoute><Asesor /></PrivateRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>





  );
};

export default AppRouter;
