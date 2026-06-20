const Admin  = require('../models/Admin');
const bcrypt = require('bcrypt');

const adminController = {

    // ── USUARIOS ──────────────────────────────
    getUsuarios: async (req, res) => {
        try {
            const usuarios = await Admin.getAllUsuarios();
            res.json(usuarios);
        } catch (err) {
            console.error('getUsuarios:', err);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    },

    createUsuario: async (req, res) => {
        try {
            const { nombre, apellidoPaterno, apellidoMaterno, email, password, rol_id } = req.body;
            if (!nombre || !email || !password)
                return res.status(400).json({ message: 'Nombre, correo y contraseña son requeridos' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const id = await Admin.createUsuario({
                nombre, apellidoPaterno, apellidoMaterno, email,
                password: hashedPassword, rol_id: rol_id || 3
            });
            res.status(201).json({ id, nombre, email, status: 1 });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY')
                return res.status(400).json({ message: 'Ya existe un usuario con ese correo' });
            console.error('createUsuario:', err);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            await Admin.updateUsuario(req.params.id, req.body);
            res.json({ ok: true });
        } catch (err) {
            console.error('updateUsuario:', err);
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    },

    deleteUsuario: async (req, res) => {
        try {
            await Admin.deleteUsuario(req.params.id);
            res.json({ ok: true });
        } catch (err) {
            console.error('deleteUsuario:', err);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    },

    // ── PRÉSTAMOS (todos) ─────────────────────
    getPrestamos: async (req, res) => {
        try {
            const data = await Admin.getAllPrestamos();
            res.json(data);
        } catch (err) {
            console.error('admin.getPrestamos:', err);
            res.status(500).json({ message: 'Error al obtener préstamos' });
        }
    },

    // ── GASTOS (todos) ────────────────────────
    getGastos: async (req, res) => {
        try {
            const data = await Admin.getAllGastos();
            res.json(data);
        } catch (err) {
            console.error('admin.getGastos:', err);
            res.status(500).json({ message: 'Error al obtener gastos' });
        }
    },

    // ── STATS para gráficas ───────────────────
    getStats: async (req, res) => {
        try {
            const stats = await Admin.getStats();
            res.json(stats);
        } catch (err) {
            console.error('getStats:', err);
            res.status(500).json({ message: 'Error al obtener estadísticas' });
        }
    }
};

module.exports = adminController;
