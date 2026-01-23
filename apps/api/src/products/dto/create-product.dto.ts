export class CreateProductDto {
  name!: string;
  description?: string;
  price!: number;
  categoryId!: string;
  imageUrl?: string;
  isAvailable?: boolean;
  images?: string[];
  options?: CreateProductOptionFromProductDto[];
}

export class CreateProductOptionFromProductDto {
  name!: string;
  description?: string;
  minChoices?: number;
  maxChoices?: number;
  isRequired?: boolean;
  values!: {
    name: string;
    price: number;
    isAvailable?: boolean;
  }[];
}
