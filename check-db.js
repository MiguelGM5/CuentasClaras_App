// check-db.js
require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/config/db');

async function main() {
  const [rows] = await db.execute('DESCRIBE test.usuarios');
  console.table(rows);
  process.exit();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});