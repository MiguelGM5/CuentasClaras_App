const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verificarToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Helper para verificar propiedad del recurso o rol de superAdmin
const esMismoUsuarioOSuperAdmin = (req, targetUserId) => {
    const usuarioId = req.usuario?.id;
    const rol = (req.usuario?.rol || '').toString().trim().toLowerCase();
    return String(usuarioId) === String(targetUserId) || rol === 'superadmin';
};

// Todas las rutas de este router requieren autenticación mediante JWT
router.use(verificarToken);

router.post('/crear-checkout', async (req, res) => {
    const { userId } = req.body; // El ID del usuario que quiere ser PRO

    if (!userId) {
        return res.status(400).json({ error: 'Falta el userId' });
    }

    if (!esMismoUsuarioOSuperAdmin(req, userId)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este usuario' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_PRO_ID, 
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            // Metadata es la clave para que el webhook sepa a quién subirle el rol
            metadata: { userId: String(userId) }, 
            success_url: `${process.env.FRONTEND_URL}/user/perfil?pago=exito`,
            cancel_url: `${process.env.FRONTEND_URL}/user/perfil`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
});

router.get('/historial-pagos/:userId', async (req, res) => {
    if (!esMismoUsuarioOSuperAdmin(req, req.params.userId)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este usuario' });
    }

    try {
        const user = await User.findById(req.params.userId);

        if (!user || !user.stripe_customer_id) {
             return res.json([]); 
        }

        const invoices = await stripe.invoices.list({
            customer: user.stripe_customer_id,
            limit: 10,
        });

        const historialFormateado = invoices.data.map(invoice => {
            const fecha = new Date(invoice.created * 1000).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            return {
                id: invoice.id,
                concepto: 'Suscripción Premium',
                fecha: fecha,
                monto: (invoice.amount_paid / 100).toFixed(2),
                estado: invoice.status === 'paid' ? 'Pagado' : 'Pendiente'
            };
        });

        res.json(historialFormateado);

    } catch (error) {
        console.error("Error obteniendo facturas:", error);
        res.status(500).json({ error: 'No se pudo cargar el historial de pagos' });
    }
});

router.get('/perfil-actualizado/:userId', async (req, res) => {
    if (!esMismoUsuarioOSuperAdmin(req, req.params.userId)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este usuario' });
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json({
            rol: user.nombre_rol,
            rol_Id: user.rol_Id
        });
    } catch (error) {
        console.error("Error renovando sesión:", error);
        res.status(500).json({ error: 'Error al consultar rol' });
    }
});

router.post('/cancelar-suscripcion', async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'Falta el userId' });

    if (!esMismoUsuarioOSuperAdmin(req, userId)) {
        return res.status(403).json({ error: 'Acceso no autorizado para este usuario' });
    }

    try {
        const user = await User.findById(userId);
        
        if (!user || !user.stripe_subscription_id) {
            return res.status(400).json({ error: 'El usuario no tiene una suscripción activa' });
        }

        await stripe.subscriptions.cancel(user.stripe_subscription_id);
        await User.cancelarSuscripcionPro(user.stripe_subscription_id);

        const userActualizado = await User.findById(userId);

        res.json({ 
            success: true, 
            rol: userActualizado.nombre_rol, 
            rol_Id: userActualizado.rol_Id 
        });

    } catch (error) {
        console.error("Error al cancelar la suscripción:", error);
        res.status(500).json({ error: 'Error al procesar la cancelación en Stripe' });
    }
});
module.exports = router;