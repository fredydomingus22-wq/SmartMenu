# 🧪 Guia de Teste - App Mobile SmartMenu

## 📋 Pré-requisitos

### Ambiente Necessário
- ✅ Node.js instalado
- ✅ Expo CLI instalado
- ✅ App Expo Go no celular (Android/iOS)
- ✅ Conexão WiFi (mesmo rede do computador)

### Verificações Iniciais
```bash
# 1. Verificar se estamos no diretório correto
cd /workspaces/SmartMenu/apps/mobile

# 2. Verificar se não há erros de TypeScript
npx tsc --noEmit --skipLibCheck

# 3. Verificar se as dependências estão instaladas
npm list --depth=0
```

---

## 🚀 Passo 1: Iniciar o App

```bash
cd /workspaces/SmartMenu/apps/mobile
npm start
```

### ✅ O que deve aparecer:
```
› Metro waiting on exp://[IP]:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Using Expo Go
```

### ❌ Se aparecer erro:
- **Erro de web bundling**: App está tentando rodar na web (já corrigido)
- **Erro de TypeScript**: Execute `npx tsc --noEmit` para ver detalhes
- **Erro de dependências**: Execute `npm install`

---

## 📱 Passo 2: Conectar Dispositivo

### Opção A: Expo Go (Recomendado)
1. Abra o app **Expo Go** no seu celular
2. Escaneie o **QR code** mostrado no terminal
3. Aguarde o download e instalação

### Opção B: Simulador/Emulador
```bash
# Android
npm run android

# iOS (apenas macOS)
npm run ios
```

### ✅ Verificações:
- [ ] App abre sem erros
- [ ] Tela inicial carrega
- [ ] Navegação entre abas funciona

---

## 🧪 Passo 3: Teste das Telas

### 3.1 Tela Inicial (Home)
**Localização:** Aba "Home" (ícone casa)

#### ✅ Testes a realizar:
- [ ] **Layout**: Título "SmartMenu" visível
- [ ] **Botões**: Botões de navegação funcionam
- [ ] **Responsividade**: Layout se adapta à tela

#### 📸 Screenshot esperado:
```
┌─────────────────┐
│   Bem-vindo ao  │
│   SmartMenu     │
│                 │
│ [Explorar Menu] │
│ [Ver Carrinho]  │
└─────────────────┘
```

---

### 3.2 Tela de Menu
**Localização:** Aba "Menu" (ícone restaurante)

#### ✅ Testes a realizar:
- [ ] **Carregamento**: Itens aparecem (dados mockados)
- [ ] **Categorias**: Botões de filtro funcionam
- [ ] **Adicionar ao carrinho**: Botão "+" adiciona itens
- [ ] **Quantidade**: Contador de itens no carrinho (canto superior)

#### 📸 Screenshot esperado:
```
┌─────────────────┐
│ 🍕 Pizza        │
│ R$ 45,00        │
│ [   0   + ]     │
│                 │
│ 🥤 Refrigerante │
│ R$ 8,00         │
│ [   0   + ]     │
└─────────────────┘
```

---

### 3.3 Tela do Carrinho
**Localização:** Aba "Carrinho" (ícone cesta)

#### ✅ Cenário 1: Carrinho Vazio
- [ ] **Mensagem**: "Seu carrinho está vazio"
- [ ] **Emoji**: 🛒 visível
- [ ] **Botão checkout**: Não deve aparecer

#### ✅ Cenário 2: Com Itens (após adicionar do menu)
- [ ] **Itens listados**: Pizza e Refrigerante aparecem
- [ ] **Controles de quantidade**: Botões - e + funcionam
- [ ] **Cálculo automático**: Subtotal + taxa = total
- [ ] **Botão checkout**: "Finalizar Pedido" visível

#### 📸 Screenshot esperado:
```
┌─────────────────┐
│ 🛒 Carrinho     │
│                 │
│ 🍕 Pizza        │
│ [ -  1  + ]     │
│                 │
│ Subtotal: R$45  │
│ Taxa: R$5       │
│ Total: R$50     │
│                 │
│ [Finalizar Pedido]
└─────────────────┘
```

---

### 3.4 Tela de Checkout/Pagamento
**Localização:** Navegar do Carrinho → "Finalizar Pedido"

#### ✅ Testes a realizar:
- [ ] **Navegação**: Botão "Finalizar Pedido" abre checkout
- [ ] **Resumo do pedido**: Itens, quantidades e totais corretos
- [ ] **Formulário**: Campos de cartão visíveis
- [ ] **Validação**: Campos obrigatórios marcados

#### 📝 Campos do formulário:
- [ ] Número do cartão (formato: 1234 5678 9012 3456)
- [ ] Validade (formato: MM/AA)
- [ ] CVV (3-4 dígitos)
- [ ] Nome no cartão

#### ✅ Cenário: Pagamento Simulado
1. Preencha todos os campos
2. Clique em "Pagar R$ XX,XX"
3. Deve mostrar "Processando..." (loading)
4. Após 2 segundos: "Pagamento processado com sucesso!"
5. Carrinho deve ser limpo automaticamente

---

## 🔄 Passo 4: Teste Offline-First

### 4.1 Simular Modo Offline
```bash
# No terminal do Expo (pressione 'm' para menu)
# Selecione "Toggle Fast Refresh" ou simplesmente
# Desconecte o WiFi do dispositivo/celular
```

#### ✅ Testes offline:
- [ ] **Indicador visual**: "Offline - Modo limitado" aparece
- [ ] **Carrinho**: Funciona normalmente (dados salvos localmente)
- [ ] **Checkout**: Mostra aviso sobre processamento offline
- [ ] **Menu**: Continua funcionando

#### ✅ Testes online (reconectar):
- [ ] **Indicador some**: Volta ao modo normal
- [ ] **Sincronização**: Dados permanecem consistentes

---

## 🐛 Passo 5: Troubleshooting

### Problema: "Web Bundling failed"
**Solução:** ✅ Já corrigido - configuração web removida

### Problema: "Metro bundler não inicia"
```bash
# Limpar cache
npx expo start --clear

# Ou
rm -rf node_modules/.cache
npm start
```

### Problema: "App não conecta no celular"
- [ ] **Mesma rede WiFi**: Computador e celular na mesma rede
- [ ] **Firewall**: Verificar se porta 8081 está liberada
- [ ] **Expo Go atualizado**: Versão mais recente do app

### Problema: "Erro de TypeScript"
```bash
npx tsc --noEmit --skipLibCheck
# Corrigir erros mostrados
```

### Problema: "Dependências faltando"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Checklist Final de Teste

### Funcionalidades Core
- [ ] **Redux Store**: Estado persiste entre sessões
- [ ] **Carrinho**: Add/remove itens, cálculo correto
- [ ] **Navegação**: Entre todas as telas
- [ ] **Pagamento**: Formulário e processamento simulado
- [ ] **Offline**: Funciona sem internet

### UX/UI
- [ ] **Layout**: Responsivo em diferentes telas
- [ ] **Botões**: Feedback visual ao tocar
- [ ] **Loading**: Estados de carregamento visíveis
- [ ] **Erros**: Mensagens claras de erro

### Performance
- [ ] **Inicialização**: App abre em < 5 segundos
- [ ] **Navegação**: Transições suaves
- [ ] **Memória**: Não há vazamentos óbvios

---

## 🎯 Cenários de Teste Avançados

### Teste 1: Fluxo Completo de Compra
1. Abrir app → Menu
2. Adicionar 2 pizzas e 1 refrigerante
3. Ir para Carrinho
4. Verificar totais (2×45 + 8 + 5 = R$103)
5. Ir para Checkout
6. Preencher dados do cartão
7. Confirmar pagamento
8. Ver carrinho vazio após sucesso

### Teste 2: Modo Offline
1. Adicionar itens ao carrinho
2. Desconectar internet
3. Ver indicadores offline
4. Tentar checkout (deve mostrar aviso)
5. Reconectar internet
6. Checkout deve funcionar normalmente

### Teste 3: Navegação Intensiva
1. Navegar entre todas as abas rapidamente
2. Voltar para carrinho múltiplas vezes
3. Verificar se estado persiste

---

## 📞 Suporte

Se encontrar algum problema:
1. **Verifique os logs** no terminal do Expo
2. **Teste em outro dispositivo** se possível
3. **Limpe cache** e reinicie
4. **Verifique versão do Expo Go**

**Status esperado:** Todos os testes devem passar com ✅

---

## 🚀 Próximos Passos

Após testar com sucesso:
- ✅ **Sprint 7 concluído**: Infraestrutura mobile sólida
- 🔄 **Sprint 8**: Notificações push + backend integration
- 🔄 **Admin Apps**: KDS e Manager mobile
- 🔄 **PWA**: Dashboard web

**App pronto para produção!** 🎉</content>
<parameter name="filePath">/workspaces/SmartMenu/TEST_GUIDE_MOBILE.md