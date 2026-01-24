import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('public/menu')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':tenantId/search')
  async search(@Param('tenantId') tenantId: string, @Query('q') query: string) {
    return this.searchService.searchProducts(tenantId, query);
  }
}
