import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductOptionValueDto {
  @IsDefined()
  name!: any;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class CreateProductOptionDto {
  @IsDefined()
  name!: any;

  @IsOptional()
  description?: any;

  @IsNumber()
  @IsOptional()
  minChoices?: number;

  @IsNumber()
  @IsOptional()
  maxChoices?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionValueDto)
  values?: CreateProductOptionValueDto[];
}
