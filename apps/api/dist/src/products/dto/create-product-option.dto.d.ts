export declare class CreateProductOptionDto {
    name: string;
    description?: string;
    minChoices?: number;
    maxChoices?: number;
    isRequired?: boolean;
    values?: CreateProductOptionValueDto[];
}
export declare class CreateProductOptionValueDto {
    name: string;
    price?: number;
    isAvailable?: boolean;
}
