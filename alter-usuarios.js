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
        ALTER TABLE test.usuarios
        ADD COLUMN telefono VARCHAR(20) NULL
    `);

    await connection.execute(`
        ALTER TABLE test.usuarios
        ADD COLUMN fecha_nacimiento DATE NULL
    `);

    console.log('Columnas agregadas correctamente');

    await connection.end();
}

main().catch(console.error);