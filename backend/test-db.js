const pool = require('./db');

async function testConnection(){
    try{
        console.log('intentando conectar a la base');
        const [rows] = await pool.query('SELECT * FROM pruebas;');
        console.log('esto tiene la base:', rows);
        console.log('estas son las filas:', rows.length);
        process.exit(0);
    }catch(e){
        console.error('hubo un error', e);
    }
}

testConnection();