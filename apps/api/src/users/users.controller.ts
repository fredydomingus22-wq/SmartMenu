import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(SupabaseAuthGuard)
  async syncUser(
    @Request() req: AuthenticatedRequest,
    @Body() body: { restaurantName?: string },
  ) {
    const { userId, email } = req.user;

    return this.usersService.syncUser({
      id: userId,
      email,
      restaurantName: body.restaurantName,
    });
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMe(@Request() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.userId);
  }
}
