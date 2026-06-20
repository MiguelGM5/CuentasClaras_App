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
             WHERE usuario_id = ?
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

    abonarMeta: async (id, usuarioId, abono) => {
        await db.execute(
            `UPDATE test.metas SET monto_actual = monto_actual + ?
             WHERE id = ? AND usuario_id = ?`,
            [abono, id, usuarioId]
        );
    },

    // ─────────────────────────────────────────
    // PAGARÉS (solo premium)
    // ─────────────────────────────────────────
    getPagares: async (usuarioId) => {
        const [rows] = await db.execute(
            `SELECT id, usuario_id, deudor, monto, estado,
                    DATE_FORMAT(vencimiento, '%Y-%m-%d') AS vencimiento,
                    createdAt
             FROM test.pagares
             WHERE usuario_id = ?
             ORDER BY vencimiento ASC`,
            [usuarioId]
        );
        return rows;
    },

    createPagare: async (usuarioId, { deudor, monto, vencimiento }) => {
        const [result] = await db.execute(
            `INSERT INTO test.pagares (usuario_id, deudor, monto, vencimiento)
             VALUES (?, ?, ?, ?)`,
            [usuarioId, deudor, monto, vencimiento]
        );
        return result.insertId;
    }
};

module.exports = Finance;
