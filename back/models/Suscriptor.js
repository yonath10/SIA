
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Suscriptor = sequelize.define("Suscriptor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Para no tener correos duplicados
    validate: {
      isEmail: true, // Validación básica de email
    },
  },
});

module.exports = Suscriptor;