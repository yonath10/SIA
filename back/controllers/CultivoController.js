const Cultivo = require("../models/Cultivo");
const User = require("../models/User");
const moment = require("moment");


//  Crear un nuevo cultivo
const crearCultivo = async (req, res) => {
  try {
    const { nombre, localizacion, espacio_sembrado, cantidad_estimado, fecha_siembra, tiempo_cosecha } = req.body;

    // Obtén el userId del usuario autenticado
    const userId = req.user.id;

    const fecha_vencimiento = moment(fecha_siembra).add(tiempo_cosecha, "weeks").format("YYYY-MM-DD");

    const cultivo = await Cultivo.create({
      nombre,
      localizacion,
      espacio_sembrado,
      cantidad_estimado,
      fecha_siembra,
      tiempo_cosecha,
      fecha_vencimiento,
      userId, // Usa el userId del usuario autenticado
    });

    res.status(201).json({ message: "Cultivo creado exitosamente", cultivo });
  } catch (error) {
    res.status(500).json({ message: "Error al crear cultivo", error });
  }
};

// 📌 Obtener todos los cultivos
const obtenerCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.findAll();
    res.json(cultivos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cultivos", error });
  }
};

// 📌 Actualizar un cultivo
const actualizarCultivo = async (req, res) => {
  try {
    const { id } = req.params;
    const cultivo = await Cultivo.findByPk(id);

    if (!cultivo) {
      return res.status(404).json({ message: "Cultivo no encontrado" });
    }

    await cultivo.update(req.body);

    res.json({ message: "Cultivo actualizado exitosamente", cultivo });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cultivo", error });
  }
};

// 📌 Eliminar un cultivo
const eliminarCultivo = async (req, res) => {
  try {
    const { id } = req.params;
    const cultivo = await Cultivo.findByPk(id);

    if (!cultivo) {
      return res.status(404).json({ message: "Cultivo no encontrado" });
    }

    await cultivo.destroy();

    res.json({ message: "Cultivo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cultivo", error });
  }
};

module.exports = { crearCultivo, obtenerCultivos, actualizarCultivo, eliminarCultivo };
