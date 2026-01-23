import { AppService } from './app.service';
import type { AuthenticatedRequest } from './common/interfaces/request.interface';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getProfile(req: AuthenticatedRequest): import("./common/interfaces/request.interface").AuthenticatedUser;
}
