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
            res.status(500).json({ 
                title: 'Error interno',
                text: 'Error al obtener los pagarés',
                icon: 'error'
            });
        }
    },

    createPagare: async (req, res) => {
        try {
            const { folio, deudor, monto_solicitado, fecha_vencimiento, interes_moratorio, firma } = req.body;

            // Validación con SweetAlert payload
            if (!deudor || !monto_solicitado || !fecha_vencimiento || !firma) {
                return res.status(400).json({ 
                    title: 'Datos Incompletos',
                    text: 'El deudor, monto, fecha de vencimiento y firma son obligatorios.',
                    icon: 'warning'
                });
            }

            const id = await Finance.createPagare(req.usuario.id, { 
                folio, deudor, monto_solicitado, fecha_vencimiento, interes_moratorio, firma 
            });

            // ÉXITO CON SWEETALERT PAYLOAD INCLUIDO
            res.status(201).json({
                title: '¡Pagaré Generado!',
                text: 'El documento fue generado con éxito.',
                icon: 'success',
                data: { 
                    id, 
                    folio: folio || `PAG-${id}`, 
                    deudor, 
                    monto_solicitado: +monto_solicitado, 
                    fecha_vencimiento, 
                    interes_moratorio: interes_moratorio || 0,
                    firma,
                    estado: 'Al corriente' 
                }
            });

        } catch (err) {
            console.error('createPagare:', err);
            res.status(500).json({ 
                title: 'Error del Servidor',
                text: 'Hubo un problema al emitir el pagaré legal.',
                icon: 'error' 
            });
        }
    }, 
    updateEstadoPagare: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body; 
            await Finance.updateEstadoPagare(id, req.usuario.id, estado);

            res.status(200).json({ title: 'Actualizado', text: 'Estado modificado.', icon: 'success' });
        } catch (err) {
            console.error('Error al cambiar estado:', err);
            res.status(500).json({ title: 'Error', text: 'Falló la base de datos.', icon: 'error' });
        }
    }
};

module.exports = financeController;