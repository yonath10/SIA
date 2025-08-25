const Cultivo = require("../models/Cultivo");
const User = require("../models/User");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize"); // Asegúrate de importar Op y Sequelize


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

//  Obtener todos los cultivos
const obtenerCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.findAll();
    res.json(cultivos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cultivos", error });
  }
};

//  Actualizar un cultivo
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

//  Eliminar un cultivo
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
// NUEVA FUNCIÓN PARA EL ASESOR DE SIEMBRA
const proyeccionCosecha = async (req, res) => {
    const { nombre, semanas_cosecha } = req.query;

    if (!nombre || !semanas_cosecha) {
        return res.status(400).json({ message: "Se requiere el nombre del cultivo y las semanas de cosecha." });
    }

    try {
        // Calcula la fecha de cosecha futura sumando las semanas
        const fechaCosechaProyectada = moment().add(semanas_cosecha, 'weeks');
        const mes = fechaCosechaProyectada.month() + 1; // en moment(), los meses son de 0 a 11
        const anio = fechaCosechaProyectada.year();

        // Busca todos los cultivos del mismo tipo que vencerán en el mismo mes y año
        const cultivosExistentes = await Cultivo.findAll({
            where: {
                nombre: nombre,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM fecha_vencimiento')), mes),
                    Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM fecha_vencimiento')), anio),
                ]
            }
        });

        // Suma la cantidad estimada para obtener la oferta proyectada
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
    obtenerCultivos, 
    actualizarCultivo, 
    eliminarCultivo,
    proyeccionCosecha // Exporta la nueva función
};