require("dotenv").config();

const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');

app.use(cors());
app.use(express.json());

app.post('/api/register', registerController.register);
app.post('/api/login', loginController.login);

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});