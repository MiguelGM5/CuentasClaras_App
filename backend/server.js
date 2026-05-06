require("dotenv").config();

const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('funcionando ');
});

//Prueba que manda un json desde el endpoint al front 
app.get("/deudas", (req, res) => {
  res.json([
    { nombre: "Juan", monto: 500, estado: "pendiente" }
  ]);
});

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});