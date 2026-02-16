import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../common/supabase.service';
import { SenderType, ConversationType } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async createOrderConversation(
    tenantId: string,
    orderId: string,
    customerId: string,
    riderId?: string,
  ) {
    this.logger.log(`Creating order conversation for order ${orderId}`);

    // Check if conversation already exists for this order
    const existing = await this.prisma.conversation.findUnique({
      where: { orderId },
    });

    if (existing) {
      return existing;
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        tenantId,
        orderId,
        type: ConversationType.ORDER,
        participants: {
          create: [
            { userId: customerId },
            ...(riderId ? [{ userId: riderId }] : []),
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    return conversation;
  }

  async createSupportConversation(tenantId: string, customerId: string) {
    this.logger.log(
      `Creating support conversation for tenant ${tenantId}, customer ${customerId}`,
    );

    // Support conversations could be multiple, but let's assume one active for now or just generic
    const conversation = await this.prisma.conversation.create({
      data: {
        tenantId,
        type: ConversationType.SUPPORT,
        participants: {
          create: [
            { userId: customerId },
            // Admins are joined dynamically or handled via roles
          ],
        },
      },
    });

    return conversation;
  }

  async sendMessage(
    conversationId: string,
    payload: {
      senderId: string;
      senderType: SenderType;
      content: string;
      metadata?: any;
    },
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { tenant: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // 1. Persist message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: payload.senderId,
        senderType: payload.senderType,
        content: payload.content,
        metadata: payload.metadata || {},
      },
    });

    // 2. Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // 3. Broadcast real-time
    await this.supabase.broadcast(`chat:${conversationId}`, 'NEW_MESSAGE', {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderType: message.senderType,
      metadata: message.metadata,
      createdAt: message.createdAt,
    });

    return message;
  }

  async getConversationMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        order: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getTenantConversations(tenantId: string) {
    return this.prisma.conversation.findMany({
      where: { tenantId },
      include: {
        order: true,
        participants: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async markAsRead(conversationId: string, userId: string) {
    // Mark all unread messages in this conversation as read (for the current user)
    const now = new Date();

    // Update participant's lastReadAt
    await this.prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: now,
      },
    });

    // Mark messages not sent by this user as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: now,
      },
    });

    // Broadcast read receipt
    await this.supabase.broadcast(`chat:${conversationId}`, 'MESSAGES_READ', {
      conversationId,
      userId,
      readAt: now,
    });

    return { success: true, readAt: now };
  }

  async getUnreadCount(conversationId: string, userId: string) {
    const count = await this.prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
    });
    return { unreadCount: count };
  }
}
