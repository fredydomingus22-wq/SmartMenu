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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('categories')
@UseGuards(SupabaseAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.categoriesService.create(
      createCategoryDto,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.categoriesService.findAll(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.categoriesService.findOne(
      id,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.categoriesService.remove(
      id,
      req.user.tenantId,
      req.user.organizationId,
    );
  }
}
