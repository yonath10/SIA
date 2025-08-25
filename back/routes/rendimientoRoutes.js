
const express = require("express");
const { obtenerRendimientos } = require("../controllers/rendimientoController");
const router = express.Router();

router.get("/", obtenerRendimientos);

module.exports = router;