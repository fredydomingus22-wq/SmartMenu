# Arquitetura Técnica e Dados

## 5. Arquitetura Técnica

### 5.1 Arquitetura Geral
- Frontend: Web Apps (Cliente, Atendente, Cozinha, Gerente)
- Backend: API central + serviços em tempo real
- Banco de Dados: Relacional + Cache
- Comunicação em tempo real: WebSockets

### 5.2 Stack Implementada

**Frontend (`apps/web`)**
- Next.js 15+ (App Router)
- Tailwind CSS + Shadcn/UI
- Framer Motion (Animations)
- Storybook (Component Documentation)
- Supabase SSR (`@supabase/ssr`)
- `qrcode.react` (QR Code Generation)
- PWA (offline básico)

**Backend (`apps/api`)**
- NestJS 11 (TypeScript, Strict Mode)
- Prisma 7 (ORM) using `@prisma/adapter-pg` for robust Supabase connectivity.
- WebSockets (Socket.io / Supabase Realtime - Phase 2.2)
- REST + Events
- OpenAI SDK (AI integrations)
- Public Menu API: Trustless logic (re-calculates prices on server).
- Middleware: Intelligent redirection from root (`/`) to `/dashboard` for auth users.

**Analytics (`apps/analytics`)**
- Python 3.13 + FastAPI
- OpenAI + LangChain
- Pandas (Data Processing)

**Database**
- Supabase (PostgreSQL managed)
- RLS habilitado em todas as tabelas

**Infraestrutura**
- Supabase CLI (local dev)
- Vercel / Railway (deploy)

---

## 6. Modelo de Dados (Alto Nível)
- Organization (Nível 1)
- Tenant (Nível 2 - Restaurant)
- Table
- QRSession
- User (Linked to Org and Tenant)
- MenuCategory
- MenuItem
- Order
- OrderItem
- Payment
- Notification

---

## 11. CRUD DE MENU ITEM (GESTÃO COMPLETA)

### 11.1 Princípios de Hierarchical Isolation
- **Multi-Level Isolation**: Dados isolados por Organização e Tenant.
- **Global IDs**: Todo dado transacional possui `organizationId` e `tenantId`.
- **JWT context**: O token JWT carrega ambos os IDs no `app_metadata`.
- **RBAC**: Permissões validadas contra o par (Org, Tenant).

### 11.2 Entidades Relacionadas
- Tenant
- MenuCategory
- MenuItem
- MenuItemOption
- MenuItemVariant
- MenuItemAvailability

### 11.3 Create – Criar Item de Menu
**Fluxo UX (Gerente):**
1. Menu > Categorias > Criar Item
2. Campos:
   - Nome
   - Descrição
   - Categoria
   - Preço base
   - Imagem
   - Tipo (comida, bebida, combo)
   - Setor (cozinha, bar)
3. Configurações avançadas:
   - Variantes (tamanho, sabor)
   - Extras (checkbox)
   - Disponibilidade (horário / dias)
   - Estoque inicial
4. Salvar

**Backend:**
- POST /tenants/{id}/menu-items
- Validação tenant_id
- Persistência relacional

### 11.4 Read – Visualização
**Gerente:**
- Lista filtrável (categoria, status)
- Preview do item

**Cliente:**
- Apenas itens ativos
- Cache por tenant

**Backend:**
- GET /tenants/{id}/menu-items

### 11.5 Update – Atualização
**Casos:**
- Alterar preço
- Atualizar imagem
- Ativar/desativar
- Ajustar estoque

**Regras:**
- Não afeta pedidos em andamento
- Versionamento opcional

**Backend:**
- PUT /menu-items/{id}

### 11.6 Delete – Exclusão Lógica
- Soft delete (is_deleted = true)
- Histórico preservado

### 11.7 Gestão Avançada
- Agendamento de disponibilidade
- Preço promocional
- Item esgotado automático
- Clonagem de item

---

## 12. Segurança e Governança
- JWT com tenant_id
- Middleware de isolamento
- Logs por tenant

---

## 13. Próximos Passos Técnicos
1. Definir schema SQL
2. Criar policies de isolamento
3. Implementar CRUD base
4. Testes multi-tenant
