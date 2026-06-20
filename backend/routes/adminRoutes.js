const express = require('express');
const router  = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const admin   = require('../controllers/adminController');

// Todas las rutas requieren JWT válido
// (el guard de rol superAdmin está en el router del frontend)
router.use(verificarToken);

// Usuarios CRUD
router.get   ('/usuarios',      admin.getUsuarios);
router.post  ('/usuarios',      admin.createUsuario);
router.put   ('/usuarios/:id',  admin.updateUsuario);
router.delete('/usuarios/:id',  admin.deleteUsuario);

// Vistas globales
router.get('/prestamos', admin.getPrestamos);
router.get('/gastos',    admin.getGastos);

// Stats para gráficas
router.get('/stats',     admin.getStats);

module.exports = router;
