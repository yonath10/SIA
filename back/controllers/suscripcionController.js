
const Suscriptor = require("../models/suscriptor"); 

const registrarSuscripcion = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo electrónico es requerido.' });
  }

  try {
    const [suscriptor, created] = await Suscriptor.findOrCreate({
      where: { email: email },
    });

    if (!created) {
      return res.status(200).json({ message: 'Este correo ya estaba suscrito. ¡Gracias!' });
    }

    return res.status(201).json({ message: '¡Gracias por suscribirte a nuestro boletín!' });

  } catch (error) {
    // Manejar errores de validación (ej. email no válido)
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Por favor, introduce un correo electrónico válido.' });
    }
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
  }
};

module.exports = { registrarSuscripcion };