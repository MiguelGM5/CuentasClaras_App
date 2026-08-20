const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.manejarWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verificamos la firma con el secreto del 'stripe listen'
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Error de firma: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejamos los eventos
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.metadata?.userId || null;
            const customerId = session.customer || null;
            const subscriptionId = session.subscription || null;

            if (userId) {
                await User.actualizarSuscripcionPro(userId, customerId, subscriptionId);
            }
            break;

        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await User.cancelarSuscripcionPro(subscription.id);
            break;

        default:
            console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
};