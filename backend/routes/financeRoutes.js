const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const financeController = require('../controllers/financeController');
const auth = require('../middleware/authMiddleware');

const authMiddleware = auth.verificarToken || auth.authMiddleware || auth;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploads/evidencias');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `evidencia-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

// MOVIMIENTOS
router.get('/movimientos', authMiddleware, financeController.getMovimientos);
router.post('/movimientos', authMiddleware, financeController.createMovimiento);

// PRÉSTAMOS
router.get('/prestamos', authMiddleware, financeController.getPrestamos);
router.post('/prestamos', authMiddleware, financeController.createPrestamo);
router.put('/prestamos/:id/saldar', authMiddleware, financeController.saldarPrestamo);
router.put('/prestamos/:id/tarjeta', authMiddleware, financeController.actualizarTarjetaPrestamo);
router.post('/prestamos/:id/evidencia', authMiddleware, upload.single('evidencia'), financeController.subirEvidenciaPrestamo);

// METAS
router.get('/metas', authMiddleware, financeController.getMetas);
router.post('/metas', authMiddleware, financeController.createMeta);
router.put('/metas/:id', authMiddleware, financeController.updateMeta);
router.delete('/metas/:id', authMiddleware, financeController.deleteMeta);

// PAGARÉS
router.get('/pagares', authMiddleware, financeController.getPagares);
router.post('/pagares', authMiddleware, financeController.createPagare);
router.put('/pagares/:id/firma', authMiddleware, financeController.firmarPagare);

module.exports = router;