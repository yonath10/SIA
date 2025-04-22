const Cultivo = require("../models/Cultivo");
const { Sequelize } = require("sequelize");

// 📊 Obtener estadísticas de cultivos
const obtenerEstadisticas = async (req, res) => {
  try {
    // Contar cultivos por tipo
    const cultivosPorTipo = await Cultivo.findAll({
      attributes: ["nombre", [Sequelize.fn("COUNT", Sequelize.col("nombre")), "total"]],
      group: ["nombre"],
    });

    // Sumar cantidad total estimada
    const totalProduccion = await Cultivo.sum("cantidad_estimado");

    res.json({
      cultivosPorTipo,
      totalProduccion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
};

module.exports = { obtenerEstadisticas };
