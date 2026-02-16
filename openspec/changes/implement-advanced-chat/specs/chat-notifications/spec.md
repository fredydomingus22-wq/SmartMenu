## ADDED Requirements

### Requirement: Unread Message Badge

O sistema DEVE exibir um indicador visual (badge) com o número de mensagens não lidas nos ícones de chat.

#### Scenario: Exibição de badge

- **WHEN** uma nova mensagem é recebida e a janela de chat está fechada
- **THEN** o sistema SHALL incrementar o contador no badge do ícone de mensagens

### Requirement: Foreground Audio Alert

O sistema DEVE emitir um alerta sonoro discreto ao receber uma nova mensagem, caso a aba do navegador ou aplicativo esteja em primeiro plano.

#### Scenario: Alerta sonoro

- **WHEN** uma mensagem chega e a sessão está ativa
- **THEN** o sistema SHALL reproduzir o som de notificação padrão do chat

### Requirement: In-app Notification Toast

O sistema DEVE exibir um toast de notificação persistente por 5 segundos com o nome do remetente e o início da mensagem recebida.

#### Scenario: Toast de nova mensagem

- **WHEN** uma mensagem chega e o usuário não está na tela de chat
- **THEN** o sistema SHALL exibir um toast contendo "[Nome]: [Início da mensagem]"
