# SmartMenu KDS - Kitchen Display System

Sistema de exibição para cozinha otimizado para tablets e smartphones.

## Funcionalidades

- **Visualização de Pedidos**: Grid responsivo com 3 colunas para tablets
- **Status em Tempo Real**: Atualizações via WebSocket
- **Controle de Status**: Toque para alterar status dos pedidos
- **Filtros por Status**: Visualizar pedidos por status específico
- **Notificações Sonoras**: Alertas para novos pedidos
- **Modo Paisagem**: Otimizado para orientação landscape
- **Offline Support**: Funciona mesmo sem conexão

## Como Usar

1. **Login**: O app se conecta automaticamente ao iniciar
2. **Visualizar Pedidos**: Pedidos são exibidos em grid de 3 colunas
3. **Atualizar Status**: Toque no botão de status para avançar o pedido
4. **Filtrar**: Use os filtros no topo para visualizar pedidos específicos
5. **Limpar**: Botão "LIMPAR" remove pedidos finalizados

## Status dos Pedidos

- **PENDENTE** (Amarelo): Aguardando confirmação
- **PREPARANDO** (Azul): Sendo preparado
- **PRONTO** (Verde): Pronto para entrega
- **ENTREGUE** (Cinza): Finalizado

## Configurações

O app inclui configurações para:
- Auto-refresh de pedidos
- Sons de notificação
- Vibração
- Número máximo de pedidos exibidos

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar no desenvolvimento
npm start

# Build para produção
npx expo build:android
npx expo build:ios
```

## Arquitetura

- **React Native + Expo**: Framework mobile
- **Redux Toolkit**: Gerenciamento de estado
- **Socket.io**: Comunicação em tempo real
- **TypeScript**: Tipagem forte
- **Responsive Design**: Otimizado para tablets