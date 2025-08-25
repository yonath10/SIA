const express = require("express");
const { obtenerEstadisticas } = require("../controllers/StatsController");
const verificarToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/obtenerestadisticas",verificarToken, obtenerEstadisticas);

module.exports = router;
