import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateDeliveryDto } from './create-delivery.dto';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @IsOptional()
  @IsEnum([
    'ASSIGNED',
    'PICKED_UP',
    'IN_TRANSIT',
    'DELIVERED',
    'FAILED',
    'CANCELLED',
  ])
  status?:
    | 'ASSIGNED'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'FAILED'
    | 'CANCELLED';
}
