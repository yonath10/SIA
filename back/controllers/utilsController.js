// back/controllers/utilsController.js

// Extraemos la misma lógica que ya tienes en tu modelo Cultivo.js
const TIEMPOS_COSECHA_SEMANAS = {
    Espinaca: 8, Cilantro: 9, Lechuga: 11, Apio: 16, Brócoli: 12,
    Papa: 20, Zanahoria: 20, Remolacha: 13, Maíz: 20,
};

const obtenerTiemposCosecha = (req, res) => {
    res.json(TIEMPOS_COSECHA_SEMANAS);
};

module.exports = { obtenerTiemposCosecha };