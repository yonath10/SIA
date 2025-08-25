const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const   User = require("../models/User");
const moment = require("moment");

const Cultivo = sequelize.define("Cultivos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  localizacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  espacio_sembrado: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidad_estimado: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha_siembra: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: () => moment().add(1, "months").format("YYYY-MM-DD"),
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Nombre del modelo Usuario
      key: "id",
    },
  },

});

Cultivo.belongsTo(User, { foreignKey: "userId" });

// Hook para actualizar fecha de vencimiento dinámicamente según el tipo de cultivo
Cultivo.beforeCreate((cultivo) => {
  const TIEMPO_COSECHA = {
    Espinaca: 8,
    Cilantro: 9,
    Lechuga: 11,
    Apio: 16,
    Brócoli: 12,
    Papa: 20,
    Zanahoria: 20,
    Remolacha: 13,
    Maíz: 20,
  };

  if (cultivo.nombre in TIEMPO_COSECHA) {
    cultivo.fecha_vencimiento = moment(cultivo.fecha_siembra)
      .add(TIEMPO_COSECHA[cultivo.nombre], "weeks")
      .format("YYYY-MM-DD");
  }

  
  
});



module.exports = Cultivo;






