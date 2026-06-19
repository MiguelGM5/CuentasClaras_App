const User = require('../models/User');
const bcrypt = require('bcrypt');
const { text } = require('body-parser');
const jwt = require('jsonwebtoken');

const loginController = {
    login: async (req, res) => {
        try{
            const {email, password} = req.body;

            const usuario = await User.findByEmail(email);
            const passwordMatch = usuario ? await bcrypt.compare(password, usuario.password) : false;
            
            if(!usuario || !passwordMatch) return res.status(401).json({
                title: 'Acceso Denegado',
                text: 'Credenciales incorrectas',
                icon: 'error'
            });

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1h'
                }
            );

            const datosUsuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido_paterno: usuario.apellido_paterno,
                apellido_materno: usuario.apellido_materno,
                email: usuario.email,
                rol: usuario.nombre_rol,
                createdAt: usuario.createdAt
            }

            res.status(200).json({
                token,
                user: datosUsuario
                
            });

        }catch(error){
            console.error("Error en login:", error);
            res.status(500).json({
                title: 'Error interno',
                text: 'Hubo un problema al intentar iniciar sesión.',
                icon: 'error'
            });
        }
    }
}
module.exports = loginController;