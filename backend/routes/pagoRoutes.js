const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

module.exports = router;