export declare class MenuSectionDto {
    id?: string;
    type: string;
    name?: string;
    isActive?: boolean;
    config?: Record<string, any>;
}
export declare class UpdateMenuConfigDto {
    sections: MenuSectionDto[];
}
