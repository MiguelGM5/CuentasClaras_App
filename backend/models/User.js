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

    // ── ACTUALIZAR CONTRASEÑA ────────────────────────────
    updatePassword: async (id, newHashedPassword) => {
        const query = 'UPDATE test.usuarios SET password = ? WHERE id = ?';
        const [result] = await db.execute(query, [newHashedPassword, id]);
        return result.affectedRows > 0;
    },

    // ── NUEVO: INTEGRACIÓN CON STRIPE (WEBHOOKS) ────────────────
    
    actualizarSuscripcionPro: async (userId, customerId, subscriptionId) => {
        const query = `
            UPDATE test.usuarios 
            SET rol_Id = 3, 
                stripe_customer_id = ?, 
                stripe_subscription_id = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [customerId, subscriptionId, userId]);
        return result.affectedRows > 0;
    },

    cancelarSuscripcionPro: async (subscriptionId) => {
        const query = `
            UPDATE test.usuarios 
            SET rol_Id = 2, 
                stripe_subscription_id = NULL 
            WHERE stripe_subscription_id = ?
        `;
        const [result] = await db.execute(query, [subscriptionId]);
        return result.affectedRows > 0;
    }
};

module.exports = User;