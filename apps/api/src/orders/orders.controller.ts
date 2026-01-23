import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    try {
      return await this.ordersService.findAll(
        req.user.tenantId,
        req.user.organizationId,
      );
    } catch (error) {
      console.error('[OrdersController] Error in findAll:', error);
      throw error;
    }
  }

  @Get('kds')
  async findAllForKitchen(@Request() req: AuthenticatedRequest) {
    try {
      return await this.ordersService.findAllForKitchen(
        req.user.tenantId,
        req.user.organizationId,
      );
    } catch (error) {
      console.error('[OrdersController] Error in findAllForKitchen:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    try {
      return await this.ordersService.findOne(
        id,
        req.user.tenantId,
        req.user.organizationId,
      );
    } catch (error) {
      console.error(`[OrdersController] Error in findOne (${id}):`, error);
      throw error;
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.ordersService.updateStatus(
        id,
        updateOrderStatusDto.status,
        req.user.tenantId,
      );
    } catch (error) {
      console.error(`[OrdersController] Error in updateStatus (${id}):`, error);
      throw error;
    }
  }
}
