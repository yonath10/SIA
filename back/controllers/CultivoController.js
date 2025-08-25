const Cultivo = require("../models/Cultivo");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");

// Rendimiento promedio en kilogramos por metro cuadrado (kg/m²)
// Esta es la "fuente de verdad" para los cálculos automáticos.
const RENDIMIENTOS_PROMEDIO = {
    Espinaca: 2.5,
    Cilantro: 1.5,
    Lechuga: 3.0,
    Apio: 4.0,
    Brócoli: 2.0,
    Papa: 5.0,
    Zanahoria: 4.5,
    Remolacha: 3.5,
    Maíz: 1.0,
};

/**
 * Crea un nuevo cultivo.
 * Si no se proporciona 'cantidad_estimado', lo calcula automáticamente
 * basándose en el 'espacio_sembrado' y el rendimiento promedio del cultivo.
 */
const crearCultivo = async (req, res) => {
  try {
    let { nombre, localizacion, espacio_sembrado, cantidad_estimado, fecha_siembra } = req.body;
    const userId = req.user.id;

    // --- LÓGICA DE CÁLCULO AUTOMÁTICO ---
    // Verifica si la cantidad no fue enviada, pero sí el espacio y el cultivo es conocido.
    if (!cantidad_estimado && espacio_sembrado && RENDIMIENTOS_PROMEDIO[nombre]) {
      cantidad_estimado = espacio_sembrado * RENDIMIENTOS_PROMEDIO[nombre];
    }

    // Valida que los campos requeridos existan después del posible cálculo.
    if (!nombre || !localizacion || !espacio_sembrado || !cantidad_estimado || !fecha_siembra) {
        return res.status(400).json({ message: "Faltan campos requeridos para crear el cultivo." });
    }

    const cultivo = await Cultivo.create({
      nombre,
      localizacion,
      espacio_sembrado,
      cantidad_estimado, // Usa el valor original o el calculado
      fecha_siembra,
      userId,
    });

    res.status(201).json({ message: "Cultivo creado exitosamente", cultivo });
  } catch (error) {
    console.error("Error al crear cultivo:", error);
    res.status(500).json({ message: "Error interno al crear el cultivo." });
  }
};

/**
 * Obtiene todos los cultivos (sin filtrar por usuario).
 * Usado para las gráficas y proyecciones globales.
 */
const obtenerTodosLosCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.findAll();
    res.json(cultivos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener todos los cultivos", error });
  }
};


/**
 * Actualiza un cultivo existente por su ID.
 */
const actualizarCultivo = async (req, res) => {
  try {
    const { id } = req.params;
    const cultivo = await Cultivo.findByPk(id);

    if (!cultivo) {
      return res.status(404).json({ message: "Cultivo no encontrado" });
    }

    // Solo permite actualizar al dueño del cultivo
    if (cultivo.userId !== req.user.id) {
        return res.status(403).json({ message: "No tienes permiso para editar este cultivo." });
    }

    await cultivo.update(req.body);

    res.json({ message: "Cultivo actualizado exitosamente", cultivo });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cultivo", error });
  }
};

/**
 * Elimina un cultivo por su ID.
 */
const eliminarCultivo = async (req, res) => {
  try {
    const { id } = req.params;
    const cultivo = await Cultivo.findByPk(id);

    if (!cultivo) {
      return res.status(404).json({ message: "Cultivo no encontrado" });
    }

    // Solo permite eliminar al dueño del cultivo
    if (cultivo.userId !== req.user.id) {
        return res.status(403).json({ message: "No tienes permiso para eliminar este cultivo." });
    }

    await cultivo.destroy();

    res.json({ message: "Cultivo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cultivo", error });
  }
};

/**
 * Proyecta la oferta de un cultivo en un mes futuro,
 * basándose en una fecha de siembra opcional.
 */
const proyeccionCosecha = async (req, res) => {
    const { nombre, semanas_cosecha, fecha_siembra } = req.query;

    if (!nombre || !semanas_cosecha) {
        return res.status(400).json({ message: "Se requiere el nombre del cultivo y las semanas de cosecha." });
    }

    try {
        const fechaBase = fecha_siembra ? moment(fecha_siembra) : moment();
        const fechaCosechaProyectada = fechaBase.add(semanas_cosecha, 'weeks');
        const mes = fechaCosechaProyectada.month() + 1;
        const anio = fechaCosechaProyectada.year();

        const cultivosExistentes = await Cultivo.findAll({
            where: {
                nombre: nombre,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM fecha_vencimiento')), mes),
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM fecha_vencimiento')), anio),
                ]
            }
        });

        const ofertaProyectada = cultivosExistentes.reduce((sum, cultivo) => sum + cultivo.cantidad_estimado, 0);

        res.json({
            cultivo: nombre,
            fechaProyectada: fechaCosechaProyectada.format('YYYY-MM-DD'),
            ofertaProyectadaKg: ofertaProyectada
        });

    } catch (error) {
        console.error("Error en la proyección:", error);
        res.status(500).json({ message: "Error al calcular la proyección." });
    }
};

module.exports = { 
    crearCultivo, 
    obtenerTodosLosCultivos, // Cambiado para reflejar su propósito
    actualizarCultivo, 
    eliminarCultivo,
    proyeccionCosecha
};
