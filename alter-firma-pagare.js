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
        ALTER TABLE test.pagares
        ADD COLUMN firma LONGTEXT NULL
    `).catch(() => console.log('firma ya existe'));

    console.log('Columna firma lista');
    await connection.end();
}

main().catch(console.error);