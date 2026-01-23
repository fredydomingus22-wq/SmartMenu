const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function check() {
    const connectionString = process.env.DIRECT_URL;
    console.log('Testing connection to:', connectionString ? connectionString.split('@')[1] : 'UNDEFINED');

    const pool = new Pool({ connectionString });

    try {
        const client = await pool.connect();
        console.log('SUCCESS: Connected to database');
        const res = await client.query('SELECT current_database(), current_user, version()');
        console.log('DB Info:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('FAILURE: Could not connect to database');
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
