import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { Public } from '../common/decorators/public.decorator';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Post('public/:tenantId')
  @Public()
  createPublic(
    @Param('tenantId') tenantId: string,
    @Body() createDto: CreateServiceRequestDto,
  ) {
    return this.serviceRequestsService.create(tenantId, createDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.serviceRequestsService.findAllActive(req.user.tenantId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch(':id/complete')
  markAsCompleted(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.serviceRequestsService.markAsCompleted(id, req.user.tenantId);
  }
}
