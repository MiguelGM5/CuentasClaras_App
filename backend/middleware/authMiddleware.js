const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; // { id, email, (opcional) rol }
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido o expirado. Vuelve a iniciar sesión.' });
    }
};

const verificarRol = (...rolesPermitidos) => {
    return async (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        let rolUsuario = req.usuario.rol;

        if (!rolUsuario) {
            try {
                const u = await User.findById(req.usuario.id);
                if (!u) {
                    return res.status(401).json({ message: 'Usuario no encontrado' });
                }
                rolUsuario = u.nombre_rol;
                req.usuario.rol = rolUsuario;
            } catch (err) {
                return res.status(500).json({ message: 'Error al verificar permisos' });
            }
        }

        const rolNormalizado = (rolUsuario || '').toString().trim().toLowerCase();
        const tienePermiso = rolesPermitidos.some(
            r => r.toString().trim().toLowerCase() === rolNormalizado
        );

        if (!tienePermiso) {
            return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
        }

        next();
    };
};

module.exports = { verificarToken, verificarRol };

