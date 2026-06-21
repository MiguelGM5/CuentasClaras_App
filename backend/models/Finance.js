const db = require('../config/db');

const Finance = {
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
    
    getUsuarioById: async (usuarioId) => {
    const [rows] = await db.execute(
        `SELECT id, nombre, apellido_paterno, apellido_materno
         FROM test.usuarios
         WHERE id = ?`,
        [usuarioId]
    );

    return rows[0];
},

actualizarTarjetaPrestamo: async (id, usuarioId, numeroTarjeta) => {
    const [result] = await db.execute(
        `UPDATE test.prestamos
         SET numero_tarjeta = ?
         WHERE id = ? AND usuario_id = ?`,
        [numeroTarjeta, id, usuarioId]
    );

    return result;
},

subirEvidenciaPrestamo: async (id, usuarioId, evidenciaPago) => {
    const [result] = await db.execute(
        `UPDATE test.prestamos
         SET evidencia_pago = ?, fecha_evidencia = CURRENT_TIMESTAMP
         WHERE id = ? AND usuario_id = ?`,
        [evidenciaPago, id, usuarioId]
    );

    return result;
},

    createMovimiento: async (usuarioId, { tipo, categoria, descripcion, monto, fecha }) => {
        const [result] = await db.execute(
            `INSERT INTO test.movimientos (usuario_id, tipo, categoria, descripcion, monto, fecha)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuarioId, tipo, categoria, descripcion, monto, fecha]
        );
        return result.insertId;
    },

   getPrestamos: async (usuarioId) => {
    const [rows] = await db.execute(
        `SELECT 
            pr.id,
            pr.usuario_id,
            pr.tipo,
            pr.deudor,
            pr.concepto,
            pr.monto,
            pr.estado,
            pr.numero_tarjeta AS numeroTarjeta,
            DATE_FORMAT(pr.fecha_pago, '%Y-%m-%d') AS fechaPago,
            DATE_FORMAT(pr.createdAt, '%Y-%m-%d') AS fecha,
            pr.evidencia_pago AS evidenciaPago,
            DATE_FORMAT(pr.fecha_evidencia, '%Y-%m-%d %H:%i:%s') AS fechaEvidencia,

            CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', IFNULL(u.apellido_materno, '')) AS nombreUsuario,

            pg.id AS pagareId,
            pg.folio AS folioPagare,
            pg.monto_solicitado AS montoPagare,
            DATE_FORMAT(pg.fecha_vencimiento, '%Y-%m-%d') AS vencimientoPagare,
            pr.estado AS estadoPagare,
            pg.firma AS firmaPagare

         FROM test.prestamos pr
         INNER JOIN test.usuarios u ON pr.usuario_id = u.id
         LEFT JOIN test.pagares pg ON pg.prestamo_id = pr.id
         WHERE pr.usuario_id = ?
         ORDER BY pr.createdAt DESC`,
        [usuarioId]
    );

    return rows;
},

    createPrestamo: async (usuarioId, { tipo, deudor, concepto, monto, fecha_pago, numeroTarjeta }) => {
        const [result] = await db.execute(
            `INSERT INTO test.prestamos 
             (usuario_id, tipo, deudor, concepto, monto, fecha_pago, numero_tarjeta)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [usuarioId, tipo, deudor, concepto, monto, fecha_pago || null, numeroTarjeta || null]
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
// PAGARÉS
// ─────────────────────────────────────────
getPagares: async (usuarioId) => {
    const [rows] = await db.execute(
        `SELECT 
            id,
            usuario_id,
            prestamo_id,
            folio,
            deudor,
            monto_solicitado AS monto,
            estado,
            firma,
            DATE_FORMAT(fecha_vencimiento, '%Y-%m-%d') AS vencimiento,
            interes_moratorio,
            createdAt
         FROM test.pagares
         WHERE usuario_id = ?
         ORDER BY fecha_vencimiento ASC`,
        [usuarioId]
    );
    return rows;
},

createPagare: async (usuarioId, { prestamoId, folio, deudor, monto, vencimiento }) => {
    const [result] = await db.execute(
        `INSERT INTO test.pagares 
         (usuario_id, prestamo_id, folio, deudor, monto_solicitado, fecha_vencimiento)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuarioId, prestamoId, folio, deudor, monto, vencimiento]
    );
    return result.insertId;
},

firmarPagare: async (pagareId, usuarioId, firma) => {
    const [result] = await db.execute(
        `UPDATE test.pagares
         SET firma = ?
         WHERE id = ? AND usuario_id = ?`,
        [firma, pagareId, usuarioId]
    );

    return result;
}
};

module.exports = Finance;