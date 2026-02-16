## Context

O SmartMenu opera em um ambiente monorepo com múltiplas aplicações (Consumer Web, Rider Mobile, Admin Mobile/Web). Atualmente, não existe um sistema de mensageria bidirecional. O objetivo é criar uma infraestrutura que suporte conversas em tempo real, persistentes e seguras, integradas ao fluxo de pedidos.

## Goals / Non-Goals

**Goals:**

- Prover mensagens em tempo real com latência mínima (< 500ms).
- Persistir todas as mensagens no PostgreSQL via Prisma para histórico e auditoria.
- Garantir isolamento de conversas (ex: Rider só fala com o cliente do pedido atribuído).
- Suportar múltiplos tipos de participantes (Clientes, Riders, Admins).

**Non-Goals:**

- Chamadas de voz ou vídeo.
- Arquivos de mídia grandes (inicialmente limitado a texto e possivelmente links de imagens).
- Integração com WhatsApp/Telegram direto no backend (nesta fase).

## Decisions

### 1. Motor de Tempo Real: Supabase Realtime

- **Decisão**: Utilizar os canais de `Broadcast` e `Presence` do Supabase.
- **Razão**: Já estamos integrados ao Supabase para autenticação e broadcast de marketing. O custo de implementação é menor que manter um servidor Socket.io customizado.

### 2. Estrutura de Dados (Prisma)

- **Conversa (`Conversation`)**: Agrupador central. Para chat de pedidos, terá `orderId`. Para suporte, terá `tenantId` e `customerId`.
- **Mensagem (`Message`)**: Armazena o conteúdo, remetente (`senderType`, `senderId`) e timestamp.
- **Participante (`ConversationParticipant`)**: Mapeia quem está na conversa e o status de leitura.

### 3. Fluxo de Envio: API-First

- **Decisão**: O cliente envia a mensagem para a API via POST -> API valida/persiste -> API dispara Broadcast via Supabase.
- **Razão**: Garante que nenhuma mensagem seja perdida se o receptor estiver offline e permite aplicar filtros de segurança e moderação no backend.

## Risks / Trade-offs

- [Risco] Sobrecarga de conexões no Supabase (tier gratuito) → [Mitigação] Monitoramento e eventual upgrade ou debounce de mensagens de sistema.
- [Risco] Privacidade de dados → [Mitigação] Implementar RLS (Row Level Security) no Supabase e validação rigorosa via Guards no NestJS.
- [Trade-off] Persistência síncrona → Adiciona latência ao envio, mas garante a integridade do histórico.
