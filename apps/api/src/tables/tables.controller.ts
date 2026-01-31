import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('tables')
@UseGuards(SupabaseAuthGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() body: { number: number }, @Req() req: AuthenticatedRequest) {
    console.log('Creating table with:', { body, user: req.user });
    const { organizationId, tenantId } = req.user;
    return this.tablesService.create({
      number: Number(body.number),
      organizationId,
      tenantId,
    });
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { tenantId } = req.user;
    return this.tablesService.findAll(tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { tenantId } = req.user;
    return this.tablesService.remove(id, tenantId);
  }
}
