import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNearbyDto {
  @IsNumber()
  @Type(() => Number)
  lat!: number;

  @IsNumber()
  @Type(() => Number)
  lng!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radius?: number = 5000; // Default 5km
}
