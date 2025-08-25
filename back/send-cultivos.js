// yonath10/sia/back/seed-cultivos.js

const sequelize = require('./config/db'); // Importa tu conexión a la BD
const User = require('./models/User');     // Importa el modelo de Usuario
const Cultivo = require('./models/Cultivo'); // Importa el modelo de Cultivo
const moment = require('moment');

// --- PARÁMETROS DE CONFIGURACIÓN ---
const CULTIVOS_POR_USUARIO = 7; // ¿Cuántos cultivos quieres crear para cada usuario?

// --- DATOS DE EJEMPLO PARA GENERAR CULTIVOS ALEATORIOS ---
const nombresCultivos = ["Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa", "Zanahoria", "Remolacha", "Maíz"];
const localizaciones = ["Cota", "Chia", "Antioquia", "Tenjo", "Cajica"];

// Función para generar un número aleatorio en un rango
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- FUNCIÓN PRINCIPAL DEL SCRIPT ---
async function generarCultivos() {
  console.log('🌱 Iniciando la siembra masiva de cultivos...');

  try {
    // 1. Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // 2. Obtener todos los usuarios existentes
    const usuarios = await User.findAll({ attributes: ['id'] });
    if (usuarios.length === 0) {
      console.error('❌ No se encontraron usuarios en la base de datos. Debes crear usuarios primero.');
      return;
    }
    console.log(`👤 Encontrados ${usuarios.length} usuarios.`);

    // 3. Preparar la lista de cultivos para la creación masiva
    const cultivosParaCrear = [];
    
    for (const usuario of usuarios) {
      for (let i = 0; i < CULTIVOS_POR_USUARIO; i++) {
        const nombreAleatorio = nombresCultivos[randomInt(0, nombresCultivos.length - 1)];
        const fechaSiembra = moment().subtract(randomInt(1, 60), 'days').format('YYYY-MM-DD');

        cultivosParaCrear.push({
          nombre: nombreAleatorio,
          localizacion: localizaciones[randomInt(0, localizaciones.length - 1)],
          espacio_sembrado: randomInt(10, 1000),
          cantidad_estimado: randomInt(50, 2000),
          fecha_siembra: fechaSiembra,
          userId: usuario.id,
        });
      }
    }

    console.log(`📝 Preparando para crear ${cultivosParaCrear.length} cultivos en total...`);

    // 4. Insertar todos los cultivos en la base de datos de una sola vez
    // Usamos bulkCreate para máxima eficiencia
    await Cultivo.bulkCreate(cultivosParaCrear);

    console.log('🎉 ¡Éxito! Se crearon los cultivos masivamente.');

  } catch (error) {
    console.error('❌ Error durante la siembra de cultivos:', error);
  } finally {
    // 5. Cerrar la conexión a la base de datos
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar la función
generarCultivos();