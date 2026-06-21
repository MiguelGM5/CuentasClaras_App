const bcrypt = require('bcrypt');
const User = require('../models/User');

const getUserId = (req) => {
    return req.user?.id || req.usuario?.id || req.userId;
};

const formatearUsuario = (usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    apellidoPaterno: usuario.apellido_paterno,
    apellidoMaterno: usuario.apellido_materno || '',
    email: usuario.email,
    telefono: usuario.telefono || '',
    fechaNacimiento: usuario.fecha_nacimiento
        ? String(usuario.fecha_nacimiento).substring(0, 10)
        : '',
    inicial: usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U',
    plan: 'free',
    miembroDesde: usuario.createdAt
});

const profileController = {
    getProfile: async (req, res) => {
        try {
            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const usuario = await User.findById(userId);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(formatearUsuario(usuario));
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({ message: 'Error al obtener perfil' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const datos = req.body;

            if (datos.nombre !== undefined && datos.nombre.trim() === '') {
                return res.status(400).json({ message: 'El nombre no puede estar vacío' });
            }

            if (datos.apellidoPaterno !== undefined && datos.apellidoPaterno.trim() === '') {
                return res.status(400).json({ message: 'El apellido paterno no puede estar vacío' });
            }

            await User.updateProfile(userId, datos);

            const usuarioActualizado = await User.findById(userId);

            res.json({
                message: 'Perfil actualizado correctamente',
                user: formatearUsuario(usuarioActualizado)
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({ message: 'Error al actualizar perfil' });
        }
    },

    changePassword: async (req, res) => {
        try {
            const userId = getUserId(req);

            if (!userId) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const { actual, nueva } = req.body;

            if (!actual || !nueva) {
                return res.status(400).json({
                    message: 'Debes ingresar la contraseña actual y la nueva'
                });
            }

            if (nueva.length < 8) {
                return res.status(400).json({
                    message: 'La nueva contraseña debe tener mínimo 8 caracteres'
                });
            }

            const usuario = await User.findPasswordById(userId);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const passwordMatch = await bcrypt.compare(actual, usuario.password);

            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'La contraseña actual es incorrecta'
                });
            }

            const nuevaHash = await bcrypt.hash(nueva, 10);

            await User.updatePassword(userId, nuevaHash);

            res.json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({ message: 'Error al cambiar contraseña' });
        }
    }
};

module.exports = profileController;