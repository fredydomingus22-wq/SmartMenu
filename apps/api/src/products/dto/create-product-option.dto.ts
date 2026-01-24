import { IsObject } from 'class-validator';

export class CreateProductOptionDto {
  @IsObject()
  name!: Record<string, string>;
  description?: Record<string, string>;
  minChoices?: number;
  maxChoices?: number;
  isRequired?: boolean;
  values?: CreateProductOptionValueDto[];
}

export class CreateProductOptionValueDto {
  @IsObject()
  name!: Record<string, string>;
  price?: number;
  isAvailable?: boolean;
}
