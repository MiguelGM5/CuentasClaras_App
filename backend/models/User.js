const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT u.*, r.nombre_rol FROM test.usuarios u INNER JOIN test.roles r ON u.rol_Id = r.id WHERE email = ? AND status = 1', [email]);
        return rows[0];
    },
    create: async (userData) => {
        const {nombre, apellidoPaterno, apellidoMaterno, email, password} = userData;
        const createQuery = `
            INSERT INTO test.usuarios (nombre, apellido_paterno, apellido_materno, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(createQuery, [nombre, apellidoPaterno, apellidoMaterno, email, password]);
        return result.insertId;
    }

}

module.exports = User;