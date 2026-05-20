const mysql = require('mysql2/promise');
require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//console.log('Conexión con TiDB preparada');

module.exports = pool;
