require('dotenv').config({path: './packages/services/.env'});
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
    await client.connect();
    const res = await client.query("SELECT id, tenant_id, integration_id FROM corsair_accounts");
    console.log(res.rows);
    await client.end();
}
run();
