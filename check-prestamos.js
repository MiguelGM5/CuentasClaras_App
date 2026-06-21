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

  console.log('TABLA PRESTAMOS');
  const [prestamos] = await connection.execute('DESCRIBE test.prestamos');
  console.table(prestamos);

  console.log('TABLA PAGARES');
  const [pagares] = await connection.execute('DESCRIBE test.pagares');
  console.table(pagares);

  await connection.end();
}

main().catch(console.error);