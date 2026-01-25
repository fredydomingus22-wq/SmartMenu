# SmartMenu Admin Mobile App

Aplicativo mobile para administradores do SmartMenu, desenvolvido com React Native e Expo.

## 🚀 Funcionalidades

### 📊 **Dashboard de Pedidos**
- Visualização em tempo real de todos os pedidos
- Controle de status (Pendente → Preparando → Pronto → Entregue)
- Filtros e busca por pedidos
- Notificações automáticas

### 🍽️ **Gerenciamento de Menu**
- Controle de disponibilidade de itens
- Busca e filtros por categoria
- Atualização em tempo real
- Alertas de itens com baixo estoque

### 📈 **Analytics e Relatórios**
- Métricas de desempenho (total de pedidos, receita, ticket médio)
- Análise por período (hoje, semana, mês)
- Itens mais vendidos
- Horários de pico
- Receita por período

### ⚙️ **Configurações**
- Configurações de notificações
- Informações do restaurante
- Preferências do admin
- Exportação de dados

### 🔔 **Sistema de Notificações**
- Alertas de novos pedidos
- Notificações de sistema
- Controle de leitura
- Filtros por tipo

### 👤 **Perfil do Administrador**
- Informações pessoais
- Controle de conta
- Logout seguro

## 🛠️ **Tecnologias Utilizadas**

- **React Native** - Framework mobile cross-platform
- **Expo SDK 54** - Plataforma de desenvolvimento
- **Redux Toolkit** - Gerenciamento de estado
- **React Navigation** - Navegação e roteamento
- **TypeScript** - Tipagem estática
- **Expo SecureStore** - Armazenamento seguro

## 📱 **Estrutura do App**

```
apps/admin-mobile/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx          # Navegação principal
│   ├── screens/
│   │   ├── LoginScreen.tsx           # Tela de login
│   │   ├── OrdersScreen.tsx          # Dashboard de pedidos
│   │   ├── MenuScreen.tsx            # Gerenciamento de menu
│   │   ├── AnalyticsScreen.tsx       # Relatórios e métricas
│   │   ├── SettingsScreen.tsx        # Configurações
│   │   ├── NotificationsScreen.tsx   # Notificações
│   │   ├── MoreScreen.tsx            # Menu adicional
│   │   └── ProfileScreen.tsx         # Perfil do usuário
│   ├── services/
│   │   ├── authService.ts            # Autenticação
│   │   ├── ordersService.ts          # API de pedidos
│   │   ├── menuService.ts            # API de menu
│   │   └── analyticsService.ts       # API de analytics
│   ├── store/
│   │   ├── index.ts                  # Configuração Redux
│   │   └── slices/
│   │       ├── authSlice.ts          # Estado de auth
│   │       ├── ordersSlice.ts        # Estado de pedidos
│   │       ├── menuSlice.ts          # Estado de menu
│   │       └── analyticsSlice.ts     # Estado de analytics
│   ├── types/
│   │   ├── index.ts                  # Tipos principais
│   │   └── analytics.ts              # Tipos de analytics
│   ├── hooks/
│   │   └── useConnectivity.ts        # Hook de conectividade
│   └── utils/                        # Utilitários
```

## 🚀 **Como Executar**

1. **Instalar dependências:**
   ```bash
   cd apps/admin-mobile
   npm install
   ```

2. **Executar o app:**
   ```bash
   npm start
   ```

3. **Executar em dispositivo/emulador:**
   ```bash
   npm run android  # Para Android
   npm run ios      # Para iOS
   ```

## 🔐 **Autenticação**

O app utiliza autenticação baseada em JWT com armazenamento seguro via Expo SecureStore. Os administradores têm diferentes níveis de permissão (Manager/Admin).

## 📡 **API Integration**

O app se conecta com a API REST do SmartMenu para:
- Sincronização de pedidos em tempo real
- Gerenciamento de menu
- Dados analíticos
- Notificações push

## 🎨 **Design System**

Interface moderna e intuitiva seguindo as melhores práticas de UX/UI para aplicações mobile administrativas.

## 🔄 **Estado Offline**

O app mantém funcionalidades básicas mesmo sem conexão, sincronizando dados quando a conectividade retorna.

## 📋 **Próximas Funcionalidades**

- [ ] Notificações push nativas
- [ ] Modo offline avançado
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Múltiplos restaurantes por conta
- [ ] Integração com sistemas externos
- [ ] Dashboard personalizado

## 🤝 **Contribuição**

Para contribuir com o desenvolvimento:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT.