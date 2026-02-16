## ADDED Requirements

### Requirement: Global Support Initiation

O sistema DEVE oferecer um ponto de entrada global (ex: botão flutuante ou menu lateral) para que o cliente inicie contato com o suporte do estabelecimento.

#### Scenario: Abrir suporte global

- **WHEN** o cliente clica no botão de suporte
- **THEN** o sistema SHALL abrir uma janela de chat vinculada ao tenant atual

### Requirement: Admin Dashboard Integration

O sistema DEVE centralizar todas as mensagens de suporte no painel administrativo para que os atendentes possam responder.

#### Scenario: Recebimento no Admin

- **WHEN** um cliente envia uma mensagem de suporte
- **THEN** o sistema SHALL exibir uma notificação visual no dashboard administrativo e listar a conversa na fila de atendimento

### Requirement: Real-time Admin Replies

O sistema DEVE garantir que as respostas do administrador apareçam instantaneamente para o cliente sem necessidade de recarregar a página.

#### Scenario: Resposta do Admin em tempo real

- **WHEN** o administrador envia uma resposta no dashboard
- **THEN** o sistema SHALL usar broadcast para exibir a mensagem na janela de chat do cliente imediatamente
