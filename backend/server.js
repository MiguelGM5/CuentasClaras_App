require("dotenv").config();

const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

const webhookController = require('./controllers/webhookController');
const pagoRoutes = require('./routes/pagoRoutes');
const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');
const financeRoutes = require('./routes/financeRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const { securityHeaders, rateLimiter, errorHandler } = require('./middleware/securityMiddleware');

app.use(securityHeaders);

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/api/pagos/webhook', express.raw({ type: 'application/json' }), webhookController.manejarWebhook);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const { verificarToken } = require('./middleware/authMiddleware');

const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

app.post('/api/register', authLimiter, registerController.register);
app.post('/api/login', authLimiter, loginController.login);
app.get('/api/auth/refresh', verificarToken, loginController.renovarToken);

app.use('/api/pagos', pagoRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});