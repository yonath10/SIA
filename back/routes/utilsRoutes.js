// back/routes/utilsRoutes.js
const express = require("express");
const { obtenerTiemposCosecha } = require("../controllers/utilsController");
const router = express.Router();

// Este endpoint devolverá el objeto con los tiempos de cosecha
router.get("/tiempos-cosecha", obtenerTiemposCosecha);

module.exports = router;