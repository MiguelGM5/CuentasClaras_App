const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        const query = `
            SELECT u.*, r.nombre_rol,
                   DATEDIFF(NOW(), u.createdAt) AS dias_miembro
            FROM test.usuarios u 
            INNER JOIN test.roles r ON u.rol_Id = r.id 
            WHERE u.email = ? AND u.status = 1
        `;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    findById: async (id) => {
        const query = `
            SELECT u.*, r.nombre_rol,
                   DATEDIFF(NOW(), u.createdAt) AS dias_miembro
            FROM test.usuarios u 
            INNER JOIN test.roles r ON u.rol_Id = r.id 
            WHERE u.id = ? AND u.status = 1
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },

    create: async (userData) => {
        const { nombre, apellidoPaterno, apellidoMaterno, email, password } = userData;
        const createQuery = `
            INSERT INTO test.usuarios (nombre, apellido_paterno, apellido_materno, email, password)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(createQuery, [nombre, apellidoPaterno, apellidoMaterno, email, password]);
        return result.insertId;
    },

    // ── 🔥 NUEVO: GUARDAR CAMBIOS DE PERFIL ────────────────────────
    updateProfile: async (id, profileData) => {
        // Mapeamos el camelCase del front al snake_case de la base de datos
        const { nombre, apellidoPaterno, apellidoMaterno, telefono, fechaNacimiento } = profileData;
        const query = `
            UPDATE test.usuarios 
            SET nombre = ?, 
                apellido_paterno = ?, 
                apellido_materno = ?, 
                telefono = ?, 
                fecha_nacimiento = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [
            nombre, 
            apellidoPaterno || null, 
            apellidoMaterno || null, 
            telefono || null, 
            fechaNacimiento || null, 
            id
        ]);
        return result.affectedRows > 0;
    },

    // ── 🔥 NUEVO: ACTUALIZAR CONTRASEÑA ────────────────────────────
    updatePassword: async (id, newHashedPassword) => {
        const query = 'UPDATE test.usuarios SET password = ? WHERE id = ?';
        const [result] = await db.execute(query, [newHashedPassword, id]);
        return result.affectedRows > 0;
    }
};

module.exports = User;