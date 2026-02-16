import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'prod-uuid-123', description: 'The UUID of the product' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, description: 'Quantity of the item' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 'No onions', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        valueId: { type: 'string' },
        price: { type: 'number' },
      },
    },
    required: false,
  })
  @IsArray()
  @IsOptional()
  options?: {
    valueId: string;
    price?: number;
  }[];
}

export type OrderType = 'DINE_IN' | 'DINE_IN_GENERAL' | 'TAKEAWAY';

export class CreateOrderDto {
  @ApiProperty({ example: 'tenant-uuid-123' })
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @ApiProperty({ example: 'org-uuid-123' })
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ example: 'table-uuid-123', required: false })
  @IsString()
  @IsOptional()
  tableId?: string;

  @ApiProperty({ enum: ['DINE_IN', 'DINE_IN_GENERAL', 'TAKEAWAY'], required: false })
  @IsEnum(['DINE_IN', 'DINE_IN_GENERAL', 'TAKEAWAY'])
  @IsOptional()
  orderType?: OrderType;

  @ApiProperty({ example: 'Rua Direita, Luanda', required: false })
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiProperty({ example: 'reward-uuid-123', required: false })
  @IsString()
  @IsOptional()
  loyaltyRewardId?: string;
}
