import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('public/orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersPublicController {
  constructor(private readonly ordersService: OrdersService) { }

  @Public()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    // req.user might be present if the client sent a token, but Public() skips the strict check
    const userId = req.user?.userId;

    return this.ordersService.create(
      createOrderDto,
      createOrderDto.tenantId,
      createOrderDto.organizationId,
      userId,
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOnePublic(id);
  }
}
