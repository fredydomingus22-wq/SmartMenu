import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';
import { UpdateMenuConfigDto } from './dto/update-menu-config.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('tenants')
@UseGuards(SupabaseAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) { }

  @Get('me')
  getTenant(@Request() req: AuthenticatedRequest) {
    return this.tenantsService.findTenant(
      req.user.tenantId,
      req.user.organizationId,
    );
  }

  @Public()
  @Get('nearby')
  findNearby(@Query() query: FindNearbyDto) {
    return this.tenantsService.findNearby(
      Number(query.lat),
      Number(query.lng),
      Number(query.radius || 5000),
    );
  }

  @Patch('me')
  updateTenant(
    @Request() req: AuthenticatedRequest,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.updateTenant(
      req.user.tenantId,
      req.user.organizationId,
      updateTenantDto,
    );
  }

  @Get('organization')
  getOrganization(@Request() req: AuthenticatedRequest) {
    return this.tenantsService.findOrganization(req.user.organizationId);
  }

  @Patch('organization')
  updateOrganization(
    @Request() req: AuthenticatedRequest,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.tenantsService.updateOrganization(
      req.user.organizationId,
      updateOrganizationDto,
    );
  }

  @Public()
  @Get(':id/branding')
  getBranding(@Param('id') id: string) {
    return this.tenantsService.findBranding(id);
  }

  @Patch('me/branding')
  updateBranding(
    @Request() req: AuthenticatedRequest,
    @Body() updateBrandingDto: UpdateBrandingDto,
  ) {
    return this.tenantsService.updateBranding(
      req.user.tenantId,
      updateBrandingDto,
    );
  }

  @Patch('me/menu-config')
  updateMenuConfig(
    @Request() req: AuthenticatedRequest,
    @Body() updateMenuConfigDto: UpdateMenuConfigDto,
  ) {
    return this.tenantsService.updateMenuConfig(
      req.user.tenantId,
      updateMenuConfigDto.sections,
    );
  }
}
