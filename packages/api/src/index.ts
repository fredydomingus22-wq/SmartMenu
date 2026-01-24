
import { createCoreApiClient } from './client';

export * from './client';

// Default instance using environment variables or fallback
export const apiClient = createCoreApiClient(
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3001/api'
);
