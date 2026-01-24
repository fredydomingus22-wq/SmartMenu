# Arquitetura Técnica – SmartMenu

## 5. Arquitetura Técnica

### 5.1 Arquitetura Geral

- **Frontend:** Web Apps (Cliente, Atendente, Cozinha, Gerente)
- **Backend:** API central + serviços em tempo real
- **Banco de Dados:** Relacional (PostgreSQL) + RLS (Row Level Security)
- **Comunicação em tempo real:** WebSockets (Supabase Realtime)
- **Internationalization (i18n):** Estratégia de campos JSON para conteúdos traduzíveis no banco de dados.

### 5.2 Stack Implementada

#### Frontend (`apps/web`)
- **Next.js 16+** (App Router)
- **React 19**
- **Tailwind CSS + shadcn/ui** (Acessibilidade via Radix UI Primitives e **Lucide-react**)
- **Framer Motion** (Animações de transição de página e micro-interações: zoom 1.05x em cards)
- **Pattern:** CRUDs complexos (ex: Produtos) migram de Modals para **Dedicated Pages** para melhor UX.
- **Storybook** (Documentação de componentes)
- **Supabase SSR** (`@supabase/ssr`)
- **PWA** (Offline básico e instalação)

#### Backend (`apps/api`)
- **NestJS 10** (TypeScript, Strict Mode)
- **Prisma 6** (ORM com adapter-pg para Supabase)
- **WebSockets** (Socket.io + Supabase Realtime)
- **OpenAI SDK** (Integrações de IA)

#### Analytics (`apps/analytics`)
- **Python 3.13** + FastAPI
- **OpenAI + LangChain**
- **Pandas** (Processamento de dados)

#### Database & Infra
- **Supabase** (PostgreSQL gerido)
- **RLS (Row Level Security)** em todas as tabelas
- **Vercel / Railway** (Deploy sugerido)

---

## 6. Modelo de Dados (Hierárquico)

| Entidade | Descrição |
|----------|-----------|
| Organization | Nível 1 - Grupo de Restaurantes |
| Tenant | Nível 2 - Restaurante individual |
| Table | Mesa física |
| QRSession | Sessão de cliente via QR |
| UserProfile | Usuários com roles (link 1:1 com auth.users) |
| MenuCategory | Categoria do menu |
| MenuItem | Item do menu |
| Order | Pedido |
| OrderItem | Item do pedido |
| Payment | Pagamento |
| Notification | Notificação |
| LoyaltyConfig | Configurações do programa de fidelidade (Pontos por Real, Status) |
| LoyaltyPoint | Saldo de pontos do cliente por Tenant |
| LoyaltyReward | Definição de recompensas (Item X custa Y pontos) |
| PointsTransaction | Histórico de transações de pontos (Ganho/Resgate) |
| **CustomerProfile** | Perfil do cliente específico para um Tenant (Saldo, Histórico). Link 1:N com `auth.users`. |
| **TenantBranding** | Configuração de UI do Tenant (Logo, Colors, Fonts, CSS Vars). |
| ProductImage | Galeria de imagens do produto (1:N com Product) |
| **ProductOption** | Agrupador de customizações (ex: "Escolha seu molho", "Extras"). |
| **ProductOptionValue** | Item individual de uma opção (ex: "Ketchup", "Maionese Caseira"). Possui preço adicional. |
| **OrderItemOption** | Registro da escolha do cliente no momento do pedido (ligação entre OrderItem e ProductOptionValue). |
| **ProductRecommendation** | Relacionamento N:N entre produtos para sugestões ("Relacionados"). **Configurável por Tenant.** |
| **ProductUpsell** | Sugestões de upgrade ou itens complementares de alto valor (Upsell). **Configurável por Tenant.** |
| **MenuSection** | Divisor lógico na home (ex: "Destaques") que agrupa categorias ou produtos específicos. **Dinâmico por Tenant.** |
| **FooterConfig** | Configurações globais de rodapé (Links, Contatos, Sociais). **Personalizado por Restaurante.** |
| **TenantSettings** | Flags de funcionalidade (ex: `enable_recommendations`, `enable_upsells`, `home_layout_type`). |

### 6.1 Estratégia de Internacionalização (i18n)

Para suportar múltiplos idiomas de forma escalável e sem a complexidade de tabelas de tradução N:N para cada entidade, utilizaremos **campos JSONB** para strings transatáveis:

- **MenuItem (Product):**
  - `name`: `Json` (ex: `{ "pt": "Picanha", "en": "Sirloin", "es": "Picaña" }`)
  - `description`: `Json`
- **MenuCategory:**
  - `name`: `Json`
- **ProductOption / ProductOptionValue:**
  - `name`: `Json`

**Implementação:** O backend deve expor um header `Accept-Language` ou query param que determina qual chave do JSON será retornada no "computed field" da API, mantendo o frontend simples.

### 6.2 Marketing & Conversão

- **Upsell:** Implementado via tabela `ProductUpsell` (N:N). Permite sugerir upgrades de tamanho ou acompanhamentos premium no checkout.
- **Recommendations:** Implementado via tabela `ProductRecommendation` (N:N). Permite cross-sell estratégico.

#### Storage Buckets (Supabase)
- **`product-gallery`**: Bucket público para armazenamento de imagens de produtos.
  - Path: `/{tenantId}/{productId}/{filename}`
  - Policies: Public Read, Authenticated Insert/Update/Delete (Tenant Scoped).

---

## 13. Próximos Passos Técnicos

1. Definir schema SQL
2. Criar policies de isolamento
3. Implementar CRUD base
4. Testes multi-tenant

---


## 14. API Modules Map

| Module | Prefix | Scope | Guards |
|--------|--------|-------|--------|
| Auth | `/auth` | Public | None |
| Users | `/users` | Private | SupabaseAuthGuard |
| Tenants | `/tenants` | Private | SupabaseAuthGuard |
| Menu | `/menu` | Public/Private | Mixed |
| Orders | `/orders` | Private | SupabaseAuthGuard |
| Tables | `/tables` | Private | SupabaseAuthGuard (Tenant Scoped) |
| Loyalty | `/loyalty` | Public/Private | SupabaseAuthGuard |
| Config | `/public/menu/:tenantId/config` | Public | None |

#### 14.1 Menu Configuration Schema
O endpoint `/config` retorna um objeto JSON que governa a visibilidade e ordenação dos componentes na interface do cliente:
```json
{
  "branding": { "primaryColor": "#...", "logo": "..." },
  "features": {
    "enable_upsell": true,
    "enable_recommendations": true
  },
  "sections": [
    { "type": "hero", "active": true, "content": { "title": "Benvindo!", "imageUrl": "..." } },
    { "type": "featured", "active": true, "title": "Os Queridinhos" },
    { "type": "category_grid", "active": true }
  ],
  "footer": {
    "socials": { "instagram": "...", "whatsapp": "..." },
    "links": [{ "label": "Sobre Nós", "url": "/about" }]
  }
}
```
