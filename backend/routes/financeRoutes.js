const express  = require('express');
const router   = express.Router();
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');
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
router.put ('/metas/:id',             finance.updateMeta);
router.delete('/metas/:id',           finance.deleteMeta);

// Pagarés (Solo usuarios Premium o superAdmin)
const esPro = verificarRol('Premium', 'superAdmin');
router.get ('/pagares',               esPro, finance.getPagares);
router.post('/pagares',               esPro, finance.createPagare);
router.put('/pagares/:id/estado',     esPro, finance.updateEstadoPagare);

module.exports = router;