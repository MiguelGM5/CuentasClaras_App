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

    actualizarTarjetaPrestamo: async (req, res) => {
    try {
        const { id } = req.params;
        const { numeroTarjeta } = req.body;

        if (!numeroTarjeta) {
            return res.status(400).json({ message: 'El número de cuenta o tarjeta es requerido' });
        }

        await Finance.actualizarTarjetaPrestamo(id, req.usuario.id, numeroTarjeta);

        res.json({
            message: 'Cuenta o tarjeta actualizada correctamente',
            numeroTarjeta
        });
    } catch (err) {
        console.error('actualizarTarjetaPrestamo:', err);
        res.status(500).json({ message: 'Error al actualizar cuenta o tarjeta' });
    }
},

subirEvidenciaPrestamo: async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Debes subir una evidencia de pago' });
        }

        const evidenciaPago = `/uploads/evidencias/${req.file.filename}`;

        await Finance.subirEvidenciaPrestamo(id, req.usuario.id, evidenciaPago);

        res.json({
            message: 'Evidencia subida correctamente',
            evidenciaPago
        });
    } catch (err) {
        console.error('subirEvidenciaPrestamo:', err);
        res.status(500).json({ message: 'Error al subir evidencia' });
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
        const {
            tipo,
            deudor,
            concepto,
            monto,
            fecha_pago,
            numeroTarjeta
        } = req.body;

        if (!tipo || !deudor || !concepto || !monto || !fecha_pago) {
            return res.status(400).json({
                message: 'Tipo, persona, concepto, monto y fecha de pago son requeridos'
            });
        }

        const prestamoId = await Finance.createPrestamo(req.usuario.id, {
            tipo,
            deudor,
            concepto,
            monto,
            fecha_pago,
            numeroTarjeta
        });

        const usuario = await Finance.getUsuarioById(req.usuario.id);

        const nombreUsuario = usuario
        ? `${usuario.nombre} ${usuario.apellido_paterno || ''} ${usuario.apellido_materno || ''}`.trim()
        : 'Usuario';

        const deudorPagare = tipo === 'prestado'
            ? deudor
            : nombreUsuario;

        const acreedorPagare = tipo === 'prestado'
            ? nombreUsuario
            : deudor;

        const folio = `PAG-${prestamoId}-${Date.now()}`;

        const pagareId = await Finance.createPagare(req.usuario.id, {
            prestamoId,
            folio,
            deudor: deudorPagare,
            acreedor: acreedorPagare,
            monto,
            vencimiento: fecha_pago
        });

        res.status(201).json({
            id: prestamoId,
            tipo,
            deudor,
            concepto,
            monto: +monto,
            numeroTarjeta: numeroTarjeta || null,
            estado: 'Pendiente',
            fechaPago: fecha_pago,
            nombreUsuario,
            pagareId,
            folioPagare: folio,
            deudorPagare,
            acreedorPagare,
            montoPagare: +monto,
            vencimientoPagare: fecha_pago,
            estadoPagare: 'Pendiente',
            firmaPagare: null
        });
    } catch (err) {
        console.error('createPrestamo:', err);
        res.status(500).json({ message: 'Error al registrar préstamo' });
    }
},

firmarPagare: async (req, res) => {
    try {
        const { id } = req.params;
        const { firma } = req.body;

        if (!firma) {
            return res.status(400).json({ message: 'La firma es requerida' });
        }

        await Finance.firmarPagare(id, req.usuario.id, firma);

        res.json({ message: 'Pagaré firmado correctamente' });
    } catch (err) {
        console.error('firmarPagare:', err);
        res.status(500).json({ message: 'Error al firmar pagaré' });
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
            res.status(201).json({ id, deudor, monto: +monto, vencimiento, estado: 'Pendiente' });
        } catch (err) {
            console.error('createPagare:', err);
            res.status(500).json({ message: 'Error al emitir el pagaré' });
        }
    }
};

module.exports = financeController;