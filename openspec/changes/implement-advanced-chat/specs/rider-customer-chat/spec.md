## ADDED Requirements

### Requirement: Rider-initiated communication

O sistema DEVE permitir que um entregador inicie uma conversa com o cliente de um pedido que lhe foi atribuído.

#### Scenario: Iniciar chat pelo app do Rider

- **WHEN** o entregador clica no ícone de mensagem na tela de entrega ativa
- **THEN** o sistema SHALL abrir uma interface de chat vazia ou com o histórico anterior deste pedido

### Requirement: Customer response in tracking view

O sistema DEVE permitir que o cliente responda às mensagens do entregador diretamente da tela de rastreamento do pedido.

#### Scenario: Responder mensagem pelo Consumer App

- **WHEN** o cliente recebe uma mensagem e digita na caixa de texto do rastreamento
- **THEN** o sistema SHALL enviar a mensagem instantaneamente para o app do Rider

### Requirement: Chat expiration

O sistema DEVE desabilitar o envio de mensagens em conversas de pedidos 30 minutos após a confirmação da entrega.

#### Scenario: Tentativa de envio após expiração

- **WHEN** o tempo desde a entrega > 30 minutos
- **THEN** o sistema SHALL ocultar o campo de entrada de texto e exibir "Este chat foi encerrado"
