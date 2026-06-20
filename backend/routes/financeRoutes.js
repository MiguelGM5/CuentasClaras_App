const express  = require('express');
const router   = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const finance  = require('../controllers/financeController');

// Todas las rutas requieren JWT válido
router.use(verificarToken);

// Movimientos
router.get ('/movimientos',           finance.getMovimientos);
router.post('/movimientos',           finance.createMovimiento);

// Préstamos
router.get ('/prestamos',             finance.getPrestamos);
router.post('/prestamos',             finance.createPrestamo);
router.put ('/prestamos/:id/saldar',  finance.saldarPrestamo);

// Metas
router.get ('/metas',                 finance.getMetas);
router.post('/metas',                 finance.createMeta);
router.put ('/metas/:id/abonar',      finance.abonarMeta);

// Pagarés (el frontend solo los llama si el usuario es premium)
router.get ('/pagares',               finance.getPagares);
router.post('/pagares',               finance.createPagare);

module.exports = router;
