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
  constructor(private readonly productsService: ProductsService) { }

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
      const error = err as any;
      console.error(
        '[ProductsController] Error in create:',
        error.message,
        error.stack,
      );
      if (error.code === 'P2003') {
        // Prisma dependency error
        throw new BadRequestException(
          'Categoria ou dado relacionado não encontrado',
        );
      }
      throw error;
    }
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('categoryId') categoryId?: string,
  ) {
    try {
      return await this.productsService.findAll(
        req.user.tenantId,
        req.user.organizationId,
        categoryId,
      );
    } catch (err: unknown) {
      const error = err as any;
      console.error('[ProductsController] Error in findAll:', error.message);
      throw error;
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
      const error = err as any;
      console.error(
        `[ProductsController] Error in findOne (${id}):`,
        error.message,
      );
      throw error;
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
      const error = err as any;
      console.error(
        `[ProductsController] Error in update (${id}):`,
        error.message,
        error.stack,
      );
      throw error;
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

  // ============ Product Options ============

  @Post(':id/options')
  createOption(
    @Param('id') productId: string,
    @Body() createOptionDto: any,
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
