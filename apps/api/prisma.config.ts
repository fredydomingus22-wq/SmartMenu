import { join } from 'path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Robust path resolution
const envPath = join(__dirname, '../../.env');
console.log('TRACE: Loading .env from:', envPath);
const result = config({ path: envPath });

if (result.error) {
  console.error('TRACE: Error loading .env:', result.error);
}

const directUrl = process.env.DIRECT_URL;
const databaseUrl = process.env.DATABASE_URL;

console.log('TRACE: DIRECT_URL length:', directUrl?.length || 0);
console.log('TRACE: DATABASE_URL length:', databaseUrl?.length || 0);

const finalUrl = directUrl || databaseUrl;

if (!finalUrl) {
  throw new Error('Prisma config error: No database URL found in .env at ' + envPath);
}

export default defineConfig({
  schema: '../../prisma/schema.prisma',
  migrations: {
    path: '../../prisma/migrations',
  },
  datasource: {
    url: finalUrl,
  },
});
