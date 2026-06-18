const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerController = {
	register: async (req, res) => {
		const {nombre, apellidoPaterno, apellidoMaterno, email, password, confirmPassword} = req.body;
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&#.()_ \-])[A-Za-z\d$@!%*?&#.()_ \-]{8,15}$/;

		if(!nombre || !apellidoPaterno || !email || !password || !confirmPassword) return res.status(400).json({
			title: 'Error',
			text: 'Debes llenar todos los campos obligatorios.',
			icon: 'error'
		});

		if(!emailRegex.test(email)) return res.status(400).json({
			title: 'Error',
			text: 'Ingresa un email valido.',
			icon: 'error'
		})

        if(password !== confirmPassword) return res.status(400).json({
			title: 'Error',
			text: 'Las contraseñas no coinciden.',
			icon: 'error'
		});
        
		if(!passwordRegex.test(password)) return res.status(400).json({
			title: 'Error',
			text: 'La contraseña no cumple con el formato.',
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
				icon: 'success',
				confirmButtonText: 'Ir al Login',
				allowOutsideClick: false
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