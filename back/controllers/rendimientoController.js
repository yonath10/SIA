
// Rendimiento promedio en kilogramos por metro cuadrado (kg/m²)
const RENDIMIENTOS_PROMEDIO = {
    Espinaca: 2.5,    // 2.5 kg/m²
    Cilantro: 1.5,
    Lechuga: 3.0,
    Apio: 4.0,
    Brócoli: 2.0,
    Papa: 5.0,
    Zanahoria: 4.5,
    Remolacha: 3.5,
    Maíz: 1.0,
};

const obtenerRendimientos = (req, res) => {
    res.json(RENDIMIENTOS_PROMEDIO);
};

module.exports = { obtenerRendimientos };