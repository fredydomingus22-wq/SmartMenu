const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function listTables() {
    const connectionString = process.env.DIRECT_URL;
    const pool = new Pool({ connectionString });

    try {
        const client = await pool.connect();
        console.log('Listing tables...');
        const res = await client.query(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name;
        `);
        console.log('Tables found:');
        console.table(res.rows);
        client.release();
    } catch (err) {
        console.error('Error listing tables:', err);
    } finally {
        await pool.end();
    }
}

listTables();
