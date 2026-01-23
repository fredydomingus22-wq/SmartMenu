import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateLoyaltyConfigDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pointsPerUnit?: number;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  currencyUnit?: number;
}
