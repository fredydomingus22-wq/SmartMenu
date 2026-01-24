export class CreateProductDto {
  name!: Record<string, string>;
  description?: Record<string, string>;
  price!: number;
  categoryId!: string;
  imageUrl?: string;
  isAvailable?: boolean;
  images?: string[];
  options?: CreateProductOptionFromProductDto[];
  upsells?: string[];
  recommendations?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export class CreateProductOptionFromProductDto {
  name!: Record<string, string>;
  description?: Record<string, string>;
  minChoices?: number;
  maxChoices?: number;
  isRequired?: boolean;
  values!: {
    name: string;
    price: number;
    isAvailable?: boolean;
  }[];
}
