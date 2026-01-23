import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    createMulticaixaPayment(amount: number, reference: string): Promise<{
        status: string;
        amount: number;
        reference: string;
        message: string;
    }>;
}
