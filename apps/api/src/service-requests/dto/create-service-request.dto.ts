import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ServiceRequestType } from '@prisma/client';

export class CreateServiceRequestDto {
  @IsEnum(ServiceRequestType)
  type: ServiceRequestType;

  @IsOptional()
  @IsString()
  @IsUUID()
  tableId?: string;
}
