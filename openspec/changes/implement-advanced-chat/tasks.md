## 1. Schema e Infraestrutura Backend

- [x] 1.1 Adicionar modelos `Conversation` e `Message` ao `prisma/schema.prisma`
- [x] 1.2 Executar migração do banco de dados e gerar cliente Prisma
- [x] 1.3 Criar módulo `Chat` no NestJS (Service, Controller, Module)
- [ ] 1.4 Implementar endpoints de criação de conversa e envio de mensagens
- [ ] 1.5 Configurar políticas RLS no Supabase para as novas tabelas

## 2. Mensageria em Tempo Real

- [x] 2.1 Integrar broadcast do Supabase no serviço de mensagens do backend
- [x] 2.2 Criar hook `useChat` no frontend para assinar canais de mensagens
- [ ] 2.3 Implementar lógica de recebimento e atualização de estado local (optimistic updates)

## 3. Interface do Consumidor (Consumer App)

- [x] 3.1 Desenvolver componente de janela de chat flutuante
- [x] 3.2 Integrar botão de chat na tela de rastreamento de pedidos
- [ ] 3.3 Adicionar ponto de entrada global para suporte técnico
- [ ] 3.4 Implementar sistema de badges para mensagens não lidas

## 4. Mobile e Admin (Rider & Centro de Mensagens)

- [x] 4.1 Adicionar navegação para Chat na tela de entrega ativa do Rider App
- [x] 4.2 Desenvolver tela de mensagens no Rider App (React Native)
- [x] 4.3 Criar visualização de mensagens pendentes no Dashboard Administrativo
- [x] 4.4 Implementar interface de resposta rápida para administradores

## 5. Polimento e Notificações (UX & Feedback)

- [x] 5.1 Adicionar alertas sonoros e toasts de notificação
- [x] 5.2 Implementar visualização de "lida" (read receipts)
- [ ] 5.3 Suporte a mídias ricas (imagens/comprovantes) no chat
- [ ] 5.4 Verificar segurança dos endpoints (verificar se o `senderId` coincide com o usuário autenticado)
