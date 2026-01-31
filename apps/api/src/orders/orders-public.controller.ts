import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('public/orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersPublicController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: unknown,
  ) {
    console.log('[OrdersPublicController] Checkout request received:', {
      tenantId: createOrderDto.tenantId,
      organizationId: createOrderDto.organizationId,
      itemCount: createOrderDto.items?.length || 0,
      hasUser: !!(req as { user?: { userId?: string } }).user?.userId,
    });

    // Validate required fields
    if (!createOrderDto.items?.length) {
      throw new BadRequestException('Pedido sem itens');
    }
    if (!createOrderDto.tenantId) {
      throw new BadRequestException('tenantId é obrigatório');
    }

    try {
      const userId = (req as { user?: { userId?: string } }).user?.userId;

      const order = await this.ordersService.create(
        createOrderDto,
        createOrderDto.tenantId,
        createOrderDto.organizationId,
        userId,
      );

      console.log(
        '[OrdersPublicController] Order created successfully:',
        order.id,
      );
      return order;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[OrdersPublicController] CHECKOUT ERROR:', message, error);

      // If it's already a NestJS HTTP exception, re-throw
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Convert domain errors to proper HTTP responses
      if (message.includes('invalid or unavailable')) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException(
        `Erro ao criar pedido: ${message}`,
      );
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOnePublic(id);
  }
}
