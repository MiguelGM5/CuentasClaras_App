const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/User');

router.post('/crear-checkout', async (req, res) => {
    const { userId } = req.body; // El ID del usuario que quiere ser PRO

    if (!userId) {
        return res.status(400).json({ error: 'Falta el userId' });
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
    try {
        // 1. Buscás al usuario en la DB para sacar su stripe_customer_id
        const user = await User.findById(req.params.userId); // Ajustá según tu modelo

        if (!user || !user.stripe_customer_id) {
             // Si no es cliente de Stripe, devolvemos un array vacío
             return res.json([]); 
        }

        // 2. Le pedís a Stripe todas las facturas (invoices) de este cliente
        const invoices = await stripe.invoices.list({
            customer: user.stripe_customer_id,
            limit: 10, // Traemos las últimas 10
        });

        // 3. Mapeás los datos para que el frontend los reciba como los necesita
        const historialFormateado = invoices.data.map(invoice => {
            const fecha = new Date(invoice.created * 1000).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            return {
                id: invoice.id,
                concepto: 'Suscripción Premium', // O invoice.lines.data[0].description si querés lo de Stripe
                fecha: fecha,
                monto: (invoice.amount_paid / 100).toFixed(2), // Stripe manda centavos, dividimos por 100
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
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Devolvemos estrictamente lo que el localStorage necesita actualizar
        res.json({
            rol: user.nombre_rol, // "Premium" / "premium"
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

    try {
        const user = await User.findById(userId);
        
        if (!user || !user.stripe_subscription_id) {
            return res.status(400).json({ error: 'El usuario no tiene una suscripción activa' });
        }

        // 1. Le decimos a Stripe: "Dá de baja esta suscripción AHORA MISMO"
        await stripe.subscriptions.cancel(user.stripe_subscription_id);

        // 2. Le decimos a MySQL: "Bajale el rol a este pibe"
        await User.cancelarSuscripcionPro(user.stripe_subscription_id);

        // 3. Buscamos los datos nuevos para devolverlos al frontend
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