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

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  options?: {
    valueId: string;
    price?: number;
  }[];
}

export type OrderType = 'DINE_IN' | 'DINE_IN_GENERAL' | 'TAKEAWAY';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsString()
  @IsOptional()
  tableId?: string;

  @IsEnum(['DINE_IN', 'DINE_IN_GENERAL', 'TAKEAWAY'])
  @IsOptional()
  orderType?: OrderType;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  loyaltyRewardId?: string;
}
