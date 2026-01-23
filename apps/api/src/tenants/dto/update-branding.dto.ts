import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class UpdateBrandingDto {
  @IsString()
  @IsOptional()
  tenantName?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @IsHexColor()
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  borderRadius?: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;
}
