import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('public/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Get(':tenantId')
  getMenu(@Param('tenantId') tenantId: string) {
    return this.menuService.getPublicMenu(tenantId);
  }

  @Get(':tenantId/config')
  getMenuConfig(@Param('tenantId') tenantId: string) {
    return this.menuService.getMenuConfig(tenantId);
  }

  @Get(':tenantId/product/:productId')
  async getProduct(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
  ) {
    try {
      const product = await this.menuService.getPublicProduct(
        tenantId,
        productId,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      console.error('[MenuController] Error fetching product:', error);
      throw error;
    }
  }
}
