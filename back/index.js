const express = require("express");
const moment = require("moment");
require("dotenv").config();
const { Op } = require("sequelize");
const Cultivo = require("./models/Cultivo");
const sequelize = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const cultivoRoutes = require("./routes/CultivoRoutes");
const statsRoutes = require("./routes/StatsRoutes");
const utilsRoutes = require("./routes/utilsRoutes");
const suscripcionRoutes = require("./routes/suscripcionRoutes");
const rendimientoRoutes = require("./routes/rendimientoRoutes");
const cors = require("cors"); // Importar cors

const app = express();
app.use(express.json());

//  Configurar CORS
const corsOptions = {
  origin: "http://localhost:5173", // URL del frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/cultivos", cultivoRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/utils", utilsRoutes);
app.use("/api/suscripciones", suscripcionRoutes);
app.use("/api/rendimientos", rendimientoRoutes);
const PORT = process.env.PORT || 8000;


// Función para eliminar cultivos vencidos
async function eliminarCultivosVencidos() {
  try {
    const hoy = moment().format("YYYY-MM-DD"); 
    console.log(`🔍 Verificando cultivos vencidos para eliminar (${hoy})...`);

    const eliminados = await Cultivo.destroy({
      where: {
        fecha_vencimiento: {
          [Op.lte]: hoy, 
        },
      },
    });

    if (eliminados > 0) {
      console.log(` Se eliminaron ${eliminados} cultivos vencidos.`);
    } else {
      console.log(" No hay cultivos vencidos para eliminar.");
    }
  } catch (error) {
    console.error(" Error eliminando cultivos vencidos:", error);
  }
}

setInterval(eliminarCultivosVencidos, 24 * 60 * 60 * 1000);

// Ejecutar una vez al iniciar el servidor
eliminarCultivosVencidos();
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.listen(PORT, () => {
  console.log(`Servidor  en http://localhost:${PORT}`);
});
