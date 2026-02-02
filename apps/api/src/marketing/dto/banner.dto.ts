import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsObject,
} from 'class-validator';

export class CreateBannerDto {
  @IsString()
  type!: string; // 'hero' | 'footer'

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  subtitle?: Record<string, string>;

  @IsOptional()
  @IsObject()
  buttonText?: Record<string, string>;

  @IsOptional()
  @IsString()
  buttonLink?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsObject()
  subtitle?: Record<string, string>;

  @IsOptional()
  @IsObject()
  buttonText?: Record<string, string>;

  @IsOptional()
  @IsString()
  buttonLink?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}
