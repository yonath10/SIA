const express = require("express");
const { obtenerEstadisticas } = require("../controllers/StatsController");

const router = express.Router();

router.get("/obtenerestadisticas",verificarToken, obtenerEstadisticas);

module.exports = router;
