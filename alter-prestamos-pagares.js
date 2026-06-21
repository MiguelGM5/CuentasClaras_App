require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: false
        }
    });

    await connection.execute(`
        ALTER TABLE test.prestamos
        ADD COLUMN numero_tarjeta VARCHAR(30) NULL
    `).catch(() => console.log('numero_tarjeta ya existe o no se pudo agregar'));

    await connection.execute(`
        ALTER TABLE test.pagares
        ADD COLUMN prestamo_id INT NULL
    `).catch(() => console.log('prestamo_id ya existe o no se pudo agregar'));

    await connection.execute(`
        ALTER TABLE test.pagares
        ADD COLUMN folio VARCHAR(50) NULL
    `).catch(() => console.log('folio ya existe o no se pudo agregar'));

    console.log('Cambios aplicados');
    await connection.end();
}

main().catch(console.error);