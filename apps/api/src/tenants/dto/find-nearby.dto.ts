import { IsNumber, IsOptional } from 'class-validator';

export class FindNearbyDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;

    @IsNumber()
    @IsOptional()
    radius?: number = 5000; // Default 5km
}
