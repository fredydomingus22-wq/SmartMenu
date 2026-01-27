import { Controller, Get, Query, Param } from '@nestjs/common';
import { UpsellService, UpsellSuggestion } from './services/upsell.service';

@Controller('public/suggestions')
export class SuggestionsController {
  constructor(private readonly upsellService: UpsellService) {}

  /**
   * GET /public/suggestions/:tenantId/upsell?products=id1,id2,id3
   * Returns upsell suggestions based on cart contents.
   */
  @Get(':tenantId/upsell')
  async getUpsellSuggestions(
    @Param('tenantId') tenantId: string,
    @Query('products') productsQuery: string,
  ): Promise<UpsellSuggestion[]> {
    const productIds = productsQuery
      ? productsQuery.split(',').filter(Boolean)
      : [];
    return this.upsellService.getSuggestions(tenantId, productIds);
  }
}
