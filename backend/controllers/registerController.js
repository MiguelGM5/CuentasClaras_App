const User = require('../models/User');

const registerController = {
	register: async (req, res) => {
		const {nombre, apellido_paterno, apellido_materno, email, password, confirmPass} = req.body;

		if(!nombre.value || !apellido_paterno.value || !email.value || !password.value || !confirmPass.value) return res.status(400).json({
			title: 'Error',
			text: 'Debes llenar todos los campos obligatorios',
			icon: 'error'
		});

        if(password.value !== confirmPass.value) return res.status(400).json({
			title: 'Error',
			text: 'Las contraseñas no coinciden',
			icon: 'error'
		});
        

		if(!nombre || !apellido_paterno || !email || !password)return res.status(400).json({
			title: 'Error',
			text: 'Los campos obligatorios no pueden ir vacios!',
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

			await User.create(req.body);

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