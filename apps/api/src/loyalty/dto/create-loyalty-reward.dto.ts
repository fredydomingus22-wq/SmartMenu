import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateLoyaltyRewardDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsNumber()
  @Min(1)
  pointsRequired!: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
