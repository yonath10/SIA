const express = require("express");
const { crearCultivo, obtenerCultivos, actualizarCultivo, eliminarCultivo } = require("../controllers/CultivoController");
const verificarToken = require("../middlewares/authMiddleware");
const Cultivo = require("../models/Cultivo"); // Asegúrate de importar el modelo

const router = express.Router();

// ✅ Crear cultivo (protegido)
router.post("/crearCultivo", verificarToken, crearCultivo);

// ✅ Actualizar cultivo (protegido)
router.put("/:id", verificarToken, actualizarCultivo);

// ✅ Eliminar cultivo (protegido)
router.delete("/:id", verificarToken, eliminarCultivo);

// ✅ Obtener cultivos de un usuario específico
router.get("/obtenerCultivos", verificarToken, async (req, res) => { 
  try {
   
    const cultivos = await Cultivo.findAll({ where: { userId: req.user.id } });

    if (!cultivos.length) {
      return res.status(404).json({ message: "No tienes cultivos creados." });
    }

    res.json(cultivos);
  } catch (error) {
    console.error("❌ Error al obtener cultivos:", error);
    res.status(500).json({ message: "Error al obtener cultivos." });
  }
});
// ✅ Obtener TODOS los cultivos (para la gráfica)
router.get("/todosCultivos",  async (req, res) => {
  try {
    const cultivos = await Cultivo.findAll(); // No filtramos por usuario
    res.json(cultivos);
  } catch (error) {
    console.error("❌ Error al obtener todos los cultivos:", error);
    res.status(500).json({ message: "Error al obtener los cultivos." });
  }
});

module.exports = router;
