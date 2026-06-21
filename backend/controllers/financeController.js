const Finance = require('../models/Finance');

const financeController = {

    // ── MOVIMIENTOS ────────────────────────────
    getMovimientos: async (req, res) => {
        try {
            const data = await Finance.getMovimientos(req.usuario.id);
            res.json(data);
        } catch (err) {
            console.error('getMovimientos:', err);
            res.status(500).json({ message: 'Error al obtener movimientos' });
        }
    },

    createMovimiento: async (req, res) => {
        try {
            const { tipo, categoria, descripcion, monto, fecha } = req.body;
            if (!tipo || !categoria || !descripcion || !monto || !fecha)
                return res.status(400).json({ message: 'Todos los campos son requeridos' });

            const id = await Finance.createMovimiento(req.usuario.id, { tipo, categoria, descripcion, monto, fecha });
            res.status(201).json({ id, tipo, categoria, descripcion, monto: +monto, fecha });
        } catch (err) {
            console.error('createMovimiento:', err);
            res.status(500).json({ message: 'Error al registrar movimiento' });
        }
    },

    // ── PRÉSTAMOS ──────────────────────────────
    getPrestamos: async (req, res) => {
        try {
            const data = await Finance.getPrestamos(req.usuario.id);
            res.json(data);
        } catch (err) {
            console.error('getPrestamos:', err);
            res.status(500).json({ message: 'Error al obtener préstamos' });
        }
    },

    createPrestamo: async (req, res) => {
        try {
            const { tipo, deudor, concepto, monto, fecha_pago } = req.body;
            if (!tipo || !deudor || !concepto || !monto)
                return res.status(400).json({ message: 'Tipo, persona, concepto y monto son requeridos' });

            const id = await Finance.createPrestamo(req.usuario.id, { tipo, deudor, concepto, monto, fecha_pago });
            res.status(201).json({ id, tipo, deudor, concepto, monto: +monto, estado: 'Pendiente', fechaPago: fecha_pago || null });
        } catch (err) {
            console.error('createPrestamo:', err);
            res.status(500).json({ message: 'Error al registrar préstamo' });
        }
    },

    saldarPrestamo: async (req, res) => {
        try {
            await Finance.saldarPrestamo(req.params.id, req.usuario.id);
            res.json({ ok: true });
        } catch (err) {
            console.error('saldarPrestamo:', err);
            res.status(500).json({ message: 'Error al saldar el préstamo' });
        }
    },

    // ── METAS ─────────────────────────────────
    getMetas: async (req, res) => {
        try {
            const data = await Finance.getMetas(req.usuario.id);
            res.json(data);
        } catch (err) {
            console.error('getMetas:', err);
            res.status(500).json({ message: 'Error al obtener metas' });
        }
    },

    createMeta: async (req, res) => {
        try {
            const { titulo, monto_objetivo, monto_actual, fecha_limite } = req.body;
            if (!titulo || !monto_objetivo)
                return res.status(400).json({ message: 'El título y el objetivo son requeridos' });

            const id = await Finance.createMeta(req.usuario.id, { titulo, monto_objetivo, monto_actual, fecha_limite });
            res.status(201).json({
                id, titulo,
                montoObjetivo: +monto_objetivo,
                montoActual:   +(monto_actual || 0),
                fechaLimite:   fecha_limite || null
            });
        } catch (err) {
            console.error('createMeta:', err);
            res.status(500).json({ message: 'Error al crear la meta' });
        }
    },

    updateMeta: async (req, res) => {
        try {
            // Sacamos los datos que el frontend haya decidido mandar
            const { titulo, monto_objetivo, monto_actual, fecha_limite } = req.body;
            
            await Finance.updateMeta(req.params.id, req.usuario.id, {
                titulo, monto_objetivo, monto_actual, fecha_limite
            });
            
            res.json({ ok: true });
        } catch (err) {
            console.error('updateMeta:', err);
            res.status(500).json({ message: 'Error al actualizar la meta' });
        }
    },

    deleteMeta: async (req, res) => {
        try {
            await Finance.deleteMeta(req.params.id, req.usuario.id);
            res.json({ ok: true });
        } catch (err) {
            console.error('deleteMeta:', err);
            res.status(500).json({ message: 'Error al eliminar la meta' });
        }
    },

    // ── PAGARÉS ───────────────────────────────
    getPagares: async (req, res) => {
        try {
            const data = await Finance.getPagares(req.usuario.id);
            res.json(data);
        } catch (err) {
            console.error('getPagares:', err);
            res.status(500).json({ message: 'Error al obtener pagarés' });
        }
    },

    createPagare: async (req, res) => {
        try {
            const { deudor, monto, vencimiento } = req.body;
            if (!deudor || !monto || !vencimiento)
                return res.status(400).json({ message: 'Deudor, monto y vencimiento son requeridos' });

            const id = await Finance.createPagare(req.usuario.id, { deudor, monto, vencimiento });
            res.status(201).json({ id, deudor, monto: +monto, vencimiento, estado: 'Al corriente' });
        } catch (err) {
            console.error('createPagare:', err);
            res.status(500).json({ message: 'Error al emitir el pagaré' });
        }
    }
};

module.exports = financeController;