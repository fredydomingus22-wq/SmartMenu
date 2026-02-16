import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';
import type { AuthenticatedRequest } from './common/interfaces/request.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('diag/test-info')
  async getTestInfo() {
    const prisma = this.prismaService;
    const tenant = await prisma.tenant.findFirst();
    const org = await prisma.organization.findFirst();
    const product = await prisma.product.findFirst();
    const rider = await prisma.rider.findFirst({ include: { user: true } });

    return {
      tenantId: tenant?.id,
      organizationId: org?.id,
      productId: product?.id,
      riderId: rider?.id,
      riderEmail: rider?.user?.email,
    };
  }
}
