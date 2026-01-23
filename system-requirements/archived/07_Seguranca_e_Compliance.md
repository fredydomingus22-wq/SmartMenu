# Segurança e Compliance

## 1. Visão Geral
A segurança do SmartMenu é baseada em "Zero Trust" entre tenants e proteção rigorosa dos dados transacionais dos restaurantes e clientes.

## 2. Autenticação e Autorização

### 2.1 Supabase Auth & JWT
- **JWT Claims:** Todo token emitido conterá o `tenantId` nas claims personalizadas (via triggers no Supabase).
- **Session:** Tokens de curta duração para Web App; Refresh tokens seguros.

### 2.2 RBAC (Role-Based Access Control)
- **OWNER:** Acesso total a configurações, faturamento e usuários do seu tenant.
- **MANAGER:** Gestão de menu, relatórios e controle de pessoal.
- **WAITER:** Gestão de pedidos e mesas.
- **KITCHEN:** Apenas visualização e atualização de status de produção.

### 2.3 Tenant Isolation (RLS)
- **Enforcement:** Todas as tabelas têm `ROW LEVEL SECURITY` habilitado.
- **Policy:** `USING (tenantId = auth.jwt() ->> 'tenantId')`.
- **Direct Access:** A `service_role` é usada apenas no backend da API e Analytics, nunca exposta ao frontend.

## 3. Proteção de Dados e Compliance

### 3.1 PII (Personally Identifiable Information)
- **Clientes:** Dados mínimos (Nome/Telefone). Anonimização de logs após 90 dias.
- **RGPD/LGPD:** O sistema suporta a exclusão total de dados de um cliente se solicitado.

### 3.2 Transações Financeiras
- **Comunicação:** TLS 1.3 obrigatório em todas as comunicações com o gateway Multicaixa.
- **Logs:** Dados sensíveis (cartões, tokens de pagamento) nunca são persistidos em texto claro.

### 3.4 Segurança de Aplicação
- **OWASP Top 10:** Proteção contra SQL Injection via Prisma, Sanitização de XSS no Next.js.
- **Trustless Logic (Phase 2):** O servidor deve recalcular todos os preços e totais dos pedidos, ignorando os valores enviados pelo cliente para evitar manipulação de preços.
- **Rate Limiting:** Aplicado via Supabase Edge Functions e API Gateway (NestJS Throttler) para evitar abuso nos endpoints públicos (`/public/orders`) e evitar spam na Landing Page.

## 5. Auditoria
- **Audit Logs:** Log automático de alterações de preços, deleções de pedidos e alterações de permissões (tabela `audit_logs`).
- **Monitoramento:** Alertas automáticos para múltiplos acessos falhados no mesmo IP.
