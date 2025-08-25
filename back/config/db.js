require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,

    pool: {
      max: 15, // Número máximo de conexiones en el pool
      min: 5,  // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo (en ms) para intentar obtener una conexión
      idle: 10000 // Tiempo máximo (en ms) que una conexión puede estar inactiva
    }
   
  }
);


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a postgres 17");
  } catch (error) {
    console.error("Servicio caido", error);
  }
}

testConnection();

module.exports = sequelize;
