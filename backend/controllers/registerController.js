const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerController = {
	register: async (req, res) => {
		const {nombre, apellidoPaterno, apellidoMaterno, email, password, confirmPassword} = req.body;

		if(!nombre || !apellidoPaterno || !email || !password || !confirmPassword) return res.status(400).json({
			title: 'Error',
			text: 'Debes llenar todos los campos obligatorios',
			icon: 'error'
		});

        if(password !== confirmPassword) return res.status(400).json({
			title: 'Error',
			text: 'Las contraseñas no coinciden',
			icon: 'error'
		});
        
		if(password.length < 10) return res.status(400).json({
			title: 'Error',
			text: 'La contraseña debe tener al menos 10 caracteres',
			icon: 'error'
		});		

		try {
			const usuarioExistente = await User.findByEmail(email);

			if (usuarioExistente) return res.status(400).json({
				title: 'Error',
				text: 'Ya existe un usuario con ese correo.',
				icon: 'error'
			});

			const saltRound = 10;
			const encryptedPass = await bcrypt.hash(password, saltRound);

			await User.create({
				nombre,
				apellidoPaterno,
				apellidoMaterno,
				email,
				password: encryptedPass
			});

			return res.status(201).json({
				title: 'Usuario Creado',
				text: 'Usuario Creado correctamente',
				icon: 'success'
			});

		} catch (error) {
			console.error(error);
			
			return res.status(500).json({
				title: 'Error',
				text: 'Ha ocurrido un error inesperado',
				icon: 'error'
			});
		}
	}	
};
module.exports = registerController;