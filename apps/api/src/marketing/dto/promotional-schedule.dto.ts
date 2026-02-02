import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreatePromotionalScheduleDto {
  @IsString()
  productId!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isSpecial?: boolean;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;
}

export class UpdatePromotionalScheduleDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isSpecial?: boolean;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
