import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from './common/interfaces/request.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
