const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

const authMiddleware = auth.verificarToken || auth.authMiddleware || auth;

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);
router.put('/password', authMiddleware, profileController.changePassword);

module.exports = router;