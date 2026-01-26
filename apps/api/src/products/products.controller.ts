import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';

// Helper type for error casting
type ErrorWithMessage = {
  message: string;
  code?: string;
  stack?: string;
};

@Controller('products')
@UseGuards(SupabaseAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.productsService.create(
        createProductDto,
        req.user.tenantId,
        req.user.organizationId,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        const error = err as ErrorWithMessage;
        console.error(
          '[ProductsController] Error in create:',
          error.message,
          error.stack,
        );
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Categoria ou dado relacionado não encontrado',
          );
        }
      }
      throw err;
    }
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('categoryId') categoryId?: string,
  ) {
    console.log(
      `[ProductsController] findAll for user: ${req.user.email}, tenantId: ${req.user.tenantId}, orgId: ${req.user.organizationId}`,
    );
    try {
      const products = await this.productsService.findAll(
        req.user.tenantId,
        req.user.organizationId,
        categoryId,
      );
      console.log(`[ProductsController] Found ${products.length} products`);
      return products;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[ProductsController] Error in findAll:', err.message);
      }
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    try {
      const product = await this.productsService.findOne(
        id,
        req.user.tenantId,
        req.user.organizationId,
      );
      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }
      return product;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          `[ProductsController] Error in findOne (${id}):`,
          err.message,
        );
      }
      throw err;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.productsService.update(
        id,
        updateProductDto,
        req.user.tenantId,
        req.user.organizationId,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          `[ProductsController] Error in update (${id}):`,
          err.message,
          err.stack,
        );
      }
      throw err;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.productsService.remove(
      id,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Post(':id/duplicate')
  async duplicate(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.duplicate(
      id,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Patch('bulk/availability')
  async updateAvailabilityBulk(
    @Body() data: { ids: string[]; isAvailable: boolean },
    @Request() req: AuthenticatedRequest,
  ) {
    if (!data.ids || !Array.isArray(data.ids)) {
      throw new BadRequestException('IDs deve ser um array');
    }
    return this.productsService.updateBulkAvailability(
      data.ids,
      data.isAvailable,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Post('bulk/delete')
  async removeBulk(
    @Body() data: { ids: string[] },
    @Request() req: AuthenticatedRequest,
  ) {
    if (!data.ids || !Array.isArray(data.ids)) {
      throw new BadRequestException('IDs deve ser um array');
    }
    return this.productsService.removeBulk(
      data.ids,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  // ============ Product Options ============

  @Post(':id/options')
  createOption(
    @Param('id') productId: string,
    @Body()
    createOptionDto: {
      name: string;
      description?: string;
      minChoices?: number;
      maxChoices?: number;
      isRequired?: boolean;
      values?: { name: string; price?: number; isAvailable?: boolean }[];
    },
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.createOption(
      productId,
      createOptionDto,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get(':id/options')
  findOptions(
    @Param('id') productId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.findOptions(
      productId,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Delete('options/:optionId')
  removeOption(
    @Param('optionId') optionId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.productsService.removeOption(
      optionId,
      req.user.tenantId,
      req.user.organizationId,
    );
  }
}
