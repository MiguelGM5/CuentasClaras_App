const db = require('../config/db');

const Finance = {

    // ─────────────────────────────────────────
    // MOVIMIENTOS
    // ─────────────────────────────────────────
    getMovimientos: async (usuarioId) => {
        const [rows] = await db.execute(
            `SELECT id, usuario_id, tipo, categoria, descripcion,
                    monto, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, createdAt
             FROM test.movimientos
             WHERE usuario_id = ?
             ORDER BY fecha DESC, id DESC`,
            [usuarioId]
        );
        return rows;
    },

    createMovimiento: async (usuarioId, { tipo, categoria, descripcion, monto, fecha }) => {
        const [result] = await db.execute(
            `INSERT INTO test.movimientos (usuario_id, tipo, categoria, descripcion, monto, fecha)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuarioId, tipo, categoria, descripcion, monto, fecha]
        );
        return result.insertId;
    },

    // ─────────────────────────────────────────
    // PRÉSTAMOS
    // ─────────────────────────────────────────
    getPrestamos: async (usuarioId) => {
        const [rows] = await db.execute(
            `SELECT id, usuario_id, tipo, deudor, concepto, monto, estado,
                    DATE_FORMAT(fecha_pago, '%Y-%m-%d') AS fechaPago,
                    DATE_FORMAT(createdAt, '%Y-%m-%d') AS fecha
             FROM test.prestamos
             WHERE usuario_id = ?
             ORDER BY createdAt DESC`,
            [usuarioId]
        );
        return rows;
    },

    createPrestamo: async (usuarioId, { tipo, deudor, concepto, monto, fecha_pago }) => {
        const [result] = await db.execute(
            `INSERT INTO test.prestamos (usuario_id, tipo, deudor, concepto, monto, fecha_pago)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuarioId, tipo, deudor, concepto, monto, fecha_pago || null]
        );
        return result.insertId;
    },

    saldarPrestamo: async (id, usuarioId) => {
        await db.execute(
            `UPDATE test.prestamos SET estado = 'Saldado'
             WHERE id = ? AND usuario_id = ?`,
            [id, usuarioId]
        );
    },

    // ─────────────────────────────────────────
    // METAS
    // ─────────────────────────────────────────
    getMetas: async (usuarioId) => {
        const [rows] = await db.execute(
            `SELECT id, usuario_id, titulo,
                monto_objetivo  AS montoObjetivo,
                monto_actual    AS montoActual,
                DATE_FORMAT(fecha_limite, '%Y-%m-%d') AS fechaLimite,
                createdAt
            FROM test.metas
            WHERE usuario_id = ? AND deletedAt IS NULL
            ORDER BY createdAt DESC`,
            [usuarioId]
        );
        return rows;
    },

    createMeta: async (usuarioId, { titulo, monto_objetivo, monto_actual, fecha_limite }) => {
        const [result] = await db.execute(
            `INSERT INTO test.metas (usuario_id, titulo, monto_objetivo, monto_actual, fecha_limite)
                VALUES (?, ?, ?, ?, ?)`,
            [usuarioId, titulo, monto_objetivo, monto_actual || 0, fecha_limite || null]
        );
        return result.insertId;
    },

    updateMeta: async (id, usuarioId, { titulo, monto_objetivo, monto_actual, fecha_limite }) => {
        await db.execute(
            `UPDATE test.metas 
             SET titulo         = COALESCE(?, titulo),
                 monto_objetivo = COALESCE(?, monto_objetivo),
                 monto_actual   = COALESCE(?, monto_actual),
                 fecha_limite   = COALESCE(?, fecha_limite)
             WHERE id = ? AND usuario_id = ?`,
            [
                titulo !== undefined ? titulo : null,
                monto_objetivo !== undefined ? monto_objetivo : null,
                monto_actual !== undefined ? monto_actual : null,
                fecha_limite !== undefined ? fecha_limite : null,
                id, 
                usuarioId
            ]
        );
    },

    
    deleteMeta: async (id, usuarioId) => {
        await db.execute(
            `UPDATE test.metas 
                SET deletedAt = CURRENT_TIMESTAMP
                WHERE id = ? AND usuario_id = ?`,
            [id, usuarioId]
        );
    },

    // ─────────────────────────────────────────
    // PAGARÉS (solo premium)
    // ─────────────────────────────────────────
    getPagares: async (usuarioId) => {
        const [rows] = await db.execute(
            `SELECT id, usuario_id, folio, deudor, monto_solicitado, estado, interes_moratorio, firma,
                    DATE_FORMAT(fecha_vencimiento, '%Y-%m-%d') AS fecha_vencimiento,
                    DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt
            FROM test.pagares
            WHERE usuario_id = ? AND deletedAt IS NULL
            ORDER BY fecha_vencimiento ASC`,
            [usuarioId]
        );
        return rows;
    },

    createPagare: async (usuarioId, { folio, deudor, monto_solicitado, fecha_vencimiento, interes_moratorio, firma }) => {
        const [result] = await db.execute(
            `INSERT INTO test.pagares 
                (usuario_id, folio, deudor, monto_solicitado, fecha_vencimiento, interes_moratorio, firma, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Al corriente')`,
            [
                usuarioId, 
                folio || null, 
                deudor, 
                monto_solicitado, 
                fecha_vencimiento, 
                interes_moratorio || 0.00, 
                firma || null
            ]
        );
        return result.insertId;
    }
};

module.exports = Finance;