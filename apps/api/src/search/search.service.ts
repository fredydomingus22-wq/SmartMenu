import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProducts(tenantId: string, query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    // Using raw SQL for fuzzy search with pg_trgm
    // similarity() returns a value between 0 and 1
    // We order by similarity descending
    return this.prisma.$queryRaw`
      SELECT 
        p.*, 
        similarity(p.name, ${query}) as _score
      FROM public.products p
      WHERE p.tenant_id = ${tenantId}
        AND p.is_available = true
        AND (
          p.name % ${query} OR 
          p.description % ${query} OR
          similarity(p.name, ${query}) > 0.2
        )
      ORDER BY _score DESC
      LIMIT 20
    `;
  }
}
