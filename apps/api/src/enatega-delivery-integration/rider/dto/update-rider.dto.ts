import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateRiderDto } from './create-rider.dto';

export class UpdateRiderDto extends PartialType(CreateRiderDto) {
  @IsOptional()
  @IsEnum(['AVAILABLE', 'OFFLINE', 'BUSY'])
  status?: 'AVAILABLE' | 'OFFLINE' | 'BUSY';

  @IsOptional()
  @IsNumber()
  currentLat?: number;

  @IsOptional()
  @IsNumber()
  currentLng?: number;

  @IsOptional()
  @IsString()
  lastLocationAt?: string;
}
