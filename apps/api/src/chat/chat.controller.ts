import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../common/guards/supabase-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces/request.interface';
import { ChatService } from './chat.service';
import { SenderType } from '@prisma/client';

@Controller('chat')
@UseGuards(SupabaseAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations/order')
  async createOrderConversation(
    @Body()
    body: {
      tenantId: string;
      orderId: string;
      customerId: string;
      riderId?: string;
    },
  ) {
    return this.chatService.createOrderConversation(
      body.tenantId,
      body.orderId,
      body.customerId,
      body.riderId,
    );
  }

  @Post('conversations/support')
  async createSupportConversation(
    @Body() body: { tenantId: string; customerId: string },
  ) {
    return this.chatService.createSupportConversation(
      body.tenantId,
      body.customerId,
    );
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body()
    body: {
      senderId: string;
      senderType: SenderType;
      content: string;
      metadata?: any;
    },
    @Request() req: AuthenticatedRequest,
  ) {
    // Security: Validate sender matches authenticated user
    if (body.senderId !== req.user.userId && body.senderType !== 'ADMIN') {
      throw new ForbiddenException(
        'Sender ID does not match authenticated user',
      );
    }
    return this.chatService.sendMessage(conversationId, body);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') conversationId: string) {
    return this.chatService.getConversationMessages(conversationId);
  }

  @Get('user/:userId/conversations')
  async getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Get('tenant/:tenantId/conversations')
  async getTenantConversations(@Param('tenantId') tenantId: string) {
    return this.chatService.getTenantConversations(tenantId);
  }

  @Post('conversations/:id/read')
  async markAsRead(
    @Param('id') conversationId: string,
    @Body() body: { userId: string },
    @Request() req: AuthenticatedRequest,
  ) {
    if (body.userId !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('User ID does not match authenticated user');
    }
    return this.chatService.markAsRead(conversationId, body.userId);
  }

  @Get('conversations/:id/unread/:userId')
  async getUnreadCount(
    @Param('id') conversationId: string,
    @Param('userId') userId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    if (userId !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenException('User ID does not match authenticated user');
    }
    return this.chatService.getUnreadCount(conversationId, userId);
  }
}
