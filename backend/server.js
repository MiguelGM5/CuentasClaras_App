require("dotenv").config();

const profileRoutes = require('./routes/profileRoutes');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');

const financeRoutes = require('./routes/financeRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.post('/api/register', registerController.register);
app.post('/api/login', loginController.login);

app.use('/api/finance', financeRoutes);
app.use('/api/perfil', profileRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});