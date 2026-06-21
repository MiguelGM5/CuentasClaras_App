const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.execute(
            `SELECT u.*, r.nombre_rol 
             FROM test.usuarios u 
             INNER JOIN test.roles r ON u.rol_Id = r.id 
             WHERE email = ? AND status = 1`,
            [email]
        );
        return rows[0];
    },

    create: async (userData) => {
        const { nombre, apellidoPaterno, apellidoMaterno, email, password } = userData;

        const [result] = await db.execute(
            `INSERT INTO test.usuarios 
             (nombre, apellido_paterno, apellido_materno, email, password)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre, apellidoPaterno, apellidoMaterno, email, password]
        );

        return result.insertId;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            `SELECT 
                id,
                nombre,
                apellido_paterno,
                apellido_materno,
                email,
                telefono,
                fecha_nacimiento,
                createdAt
             FROM test.usuarios
             WHERE id = ? AND status = 1`,
            [id]
        );

        return rows[0];
    },

    updateProfile: async (id, datos) => {
        const campos = [];
        const valores = [];

        if (datos.nombre !== undefined) {
            campos.push('nombre = ?');
            valores.push(datos.nombre);
        }

        if (datos.apellidoPaterno !== undefined) {
            campos.push('apellido_paterno = ?');
            valores.push(datos.apellidoPaterno);
        }

        if (datos.apellidoMaterno !== undefined) {
            campos.push('apellido_materno = ?');
            valores.push(datos.apellidoMaterno || null);
        }

        if (datos.telefono !== undefined) {
            campos.push('telefono = ?');
            valores.push(datos.telefono || null);
        }

        if (datos.fechaNacimiento !== undefined) {
            campos.push('fecha_nacimiento = ?');
            valores.push(datos.fechaNacimiento || null);
        }

        if (campos.length === 0) {
            return null;
        }

        valores.push(id);

        const [result] = await db.execute(
            `UPDATE test.usuarios
             SET ${campos.join(', ')}
             WHERE id = ? AND status = 1`,
            valores
        );

        return result;
    },

    findPasswordById: async (id) => {
        const [rows] = await db.execute(
            `SELECT id, password 
             FROM test.usuarios 
             WHERE id = ? AND status = 1`,
            [id]
        );

        return rows[0];
    },

    updatePassword: async (id, passwordHash) => {
        const [result] = await db.execute(
            `UPDATE test.usuarios
             SET password = ?
             WHERE id = ? AND status = 1`,
            [passwordHash, id]
        );

        return result;
    }
};

module.exports = User;