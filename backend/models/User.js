const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM test.usuarios WHERE email = ?', [email]);
        return rows[0];
    },
    create: async (userData) => {
        const {nombre, apellido_paterno, apellido_materno, email, password} = userData;
        const createQuery = `
            INSERT INTO test.usuarios (nombre, apellido_paterno, apellido_materno, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.execute(createQuery, [nombre, apellido_paterno, apellido_materno, email, password]);
        return result.insertId;
    }
}

module.exports = User;