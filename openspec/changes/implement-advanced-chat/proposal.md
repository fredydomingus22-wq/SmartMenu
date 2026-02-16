## Why

Atualmente, o SmartMenu oferece uma experiência de comunicação limitada. O marketing e o CRM funcionam de forma unidirecional (notificações), e as solicitações de serviço (chamar garçom) são apenas gatilhos de status. Não existe uma forma fluida de:

1.  **Riders e Clientes** combinarem pontos exatos de retirada ou informarem sobre imprevistos.
2.  **Clientes** tirarem dúvidas rápidas com o restaurante sobre o tempo de preparo ou detalhes do pedido.
3.  **Administradores** oferecerem suporte proativo através de um canal de ajuda centralizado.

A implementação de recursos avançados de chat elevará o nível de serviço do ecossistema SmartMenu, aumentando a confiança do usuário e a eficiência operacional.

## What Changes

Esta mudança irá introduzir uma infraestrutura de mensageria em tempo real em todo o monorepo:

- **Backend**: Novos modelos de dados para `Conversation` e `Message` no Prisma, além de serviços e controllers para gerenciar o ciclo de vida dos chats.
- **Real-time**: Utilização do Supabase Realtime para entrega instantânea de mensagens sem a necessidade de polling.
- **Consumidor**: Uma interface de chat acessível a partir do histórico de pedidos e de um botão de ajuda flutuante.
- **Rider**: Uma aba de mensagens dentro da tela de entrega ativa.
- **Admin/Restaurante**: Um centro de mensagens para gerenciar todos os chats ativos com clientes.

## Capabilities

### New Capabilities

- `rider-customer-chat`: Canal de comunicação direta entre o entregador e o cliente durante uma entrega ativa.
- `consumer-support-chat`: Canal de suporte direto entre o cliente e o administrador do restaurante/tenant.
- `chat-notifications`: Sistema de sinalização visual e notificações push para novas mensagens recebidas.

### Modified Capabilities

- `order-tracking`: Integração do ponto de entrada do chat na tela de rastreamento de pedidos existente.
- `marketing-crm`: Evolução do sistema de notificações para permitir respostas ou início de conversas a partir de uma campanha.

## Impact

- **API**: `src/chat` (novo módulo), `prisma/schema.prisma` (novos modelos).
- **Consumer App**: `app/menu/[id]/chat`, `hooks/use-chat.ts`.
- **Rider App**: `src/screens/ChatScreen.tsx`.
- **Database**: Migração para incluir tabelas de conversas e mensagens.
- **Infra**: Configuração de políticas de segurança (RLS) no Supabase para garantir privacidade das mensagens.
