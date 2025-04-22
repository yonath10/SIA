require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,  // Asegurar que no sea undefined
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
);


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL con Sequelize");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
  }
}

testConnection();

module.exports = sequelize;
