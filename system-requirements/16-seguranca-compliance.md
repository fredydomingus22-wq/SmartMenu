# Segurança e Compliance – SmartMenu

## 16. Segurança e Governança

A segurança do SmartMenu é baseada num modelo "Zero Trust" entre tenants e proteção rigorosa dos dados transacionais.

---

### 16.1 Autenticação e RBAC (Role-Based Access Control)

- **Supabase Auth & JWT:**
  - Todo token JWT contém `tenantId` e `organizationId` nas claims personalizadas.
  - Sessões de curta duração com refresh tokens seguros.

- **Níveis de Acesso (Roles):**
  | Role | Permissões |
  | :--- | :--- |
  | **OWNER** | Acesso total a configurações, faturação e utilizadores do tenant. |
  | **MANAGER** | Gestão de menu, relatórios e controlo de pessoal. |
  | **WAITER** | Gestão de pedidos e mesas em tempo real. |
  | **KITCHEN** | Visualização e atualização de status de produção (KDS). |

---

### 16.2 Isolamento de Dados (RLS)

- **Enforcement:** `ROW LEVEL SECURITY` habilitado obrigatoriamente em todas as tabelas.
- **Policy Padrão:** `USING (tenant_id = auth.jwt() ->> 'tenant_id')`.
- **Zero Trust:** A `service_role` (admin) é restrita ao backend (NestJS/Analytics), nunca exposta ao frontend.

### 16.2.1 Segurança de Mesas & QR
- **Gestão:** Apenas users com role `MANAGER` ou superior podem Criar/Deletar mesas.
- **Acesso QR:** O endpoint público de menu valida o `tenantId` e `tableId` antes de iniciar a sessão.

### 16.2.2 Isolamento de Dados do Cliente (Client-Side RLS)
- **Princípio:** Um cliente nunca deve conseguir listar dados de outro tenant, mesmo que esteja autenticado na plataforma.
- **Implementation:**
  - Todas as queries de `Orders`, `LoyaltyPoints` e `CustomerProfile` devem conter filtro obrigatório `WHERE tenant_id = :currentTenantId`.
  - A API deve rejeitar tokens válidos se o `tenant_id` da requisição não corresponder ao contexto da sessão do cliente.
- **Isolamento de Recomendações:** O motor de recomendações deve filtrar estritamente por `tenant_id` ativo, prevenindo que produtos de outros estabelecimentos sejam sugeridos.


---

### 16.3 Proteção de Dados e Compliance

- **PII (Personally Identifiable Information):**
  - Recolha mínima de dados de clientes (Nome/Telefone).
  - Anonimização automática de logs após 90 dias.
  - Conformidade com RGPD (direito ao esquecimento/exclusão total).

- **Transações Financeiras:**
  - Comunicação via TLS 1.3 obrigatória.
  - Dados sensíveis de pagamento nunca são persistidos em texto claro.

- **Segurança de Aplicação (OWASP):**
  - **Trustless Logic:** O servidor recalcula todos os preços de produtos e extras (`ProductOptionValue`), ignorando valores enviados pelo cliente.
  - **Sanitização de Notas:** Todas as observações e remoções ("Remover Ketchup") devem ser limpas contra XSS/Injection antes de exibição no KDS/Dashboard.
  - **AI Content Protection:** Traduções geradas automaticamente devem passar por um filtro de sanitização para evitar que prompts injetados no nome do produto gerem scripts maliciosos nas traduções resultantes.
  - **Rate Limiting:** Proteção contra spam e abuso em endpoints públicos (`/public/orders`).
  - **Sanitização:** Proteção contra SQL Injection (Prisma) e XSS (Next.js).

### 16.3.1 Prevenção de Fraude em Fidelidade
- **Pontos Imutáveis:** O saldo de pontos só pode ser alterado via triggers de transação no banco ou endpoints assinados.
- **Validação de Resgate:** Toda tentativa de resgate de pontos deve ser validada contra o saldo atualizado no banco de dados (Server-Side) antes da aplicação no pedido.
- **Double-Spending:** Utilização de transações ACID para garantir que pontos não sejam gastos duas vezes simultaneamente.

---

### 16.4 Auditoria

- **Audit Logs:** Registo automático de alterações críticas (preços, deleções, permissões) na tabela `audit_logs`.
- **Monitoramento:** Alertas para acessos suspeitos ou falhas consecutivas de login.

---

**Documento de referência para segurança e compliance do SmartMenu.**
