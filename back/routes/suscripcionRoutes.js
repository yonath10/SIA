// back/routes/suscripcionRoutes.js
const express = require("express");
const { registrarSuscripcion } = require("../controllers/suscripcionController");
const router = express.Router();

router.post("/", registrarSuscripcion);

module.exports = router;