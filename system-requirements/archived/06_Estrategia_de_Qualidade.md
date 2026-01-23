# Estratégia de Qualidade e Testes (QA)

## 1. Visão Geral
Este documento define a estratégia de garantia de qualidade para o SmartMenu, garantindo que o isolamento de tenants, a performance em tempo real e a integridade financeira sejam mantidos.

## 2. Níveis de Teste

### 2.1 Testes Unitários (Unit Tests)
- **Ferramentas:** Jest (API), Vitest (Web).
- **Foco:** Lógica de cálculo de preços, validação de inputs de menu, mapeamento de status de pedidos.

### 2.2 Testes de Integração (Integration Tests)
- **Foco:** Chamadas Prisma -> Supabase, Integração com OpenAI (Analytics), Injeção de dependências no NestJS.
- **Integration: Hierarchical Isolation (Org + Tenant):**
  - **Scenario 1: Cross-Organization Isolation:** Garantir que o Usuário A (Org A) não consiga acessar nenhum Tenant B (Org B).
  - **Scenario 2: Same-Org Cross-Tenant Isolation:** Garantir que o Usuário A (Org A, Tenant A) não consiga acessar dados do Tenant B (Org A) a menos que tenha permissão de nível "OWNER/MANAGER" na Organização.
  - **Admin Metadata Sync Audit:** Verificar se `app_metadata` no Supabase contém `organization_id` e `tenant_id` após o primeiro login (`syncUser`).

### 2.3 Testes E2E (End-to-End)
- **Ferramenta:** Playwright.
- **Cenários Críticos:**
  1. **Fluxo do Cliente (Público):** Scan QR -> Acesso à Página `/menu/[id]` -> Visualização de Categorias/Produtos.
  2. **Landing Page & Redirection:** 
     - Acessar `/` deslogado -> Ver Landing Page.
     - Acessar `/` logado -> Ser redirecionado para `/dashboard`.
     - Validar tempo de carregamento da Landing Page.
  3. **Carrinho & Order Engine:**
     - Adicionar itens -> Recarregar página -> Validar se carrinho persiste (LocalStorage).
     - Submeter pedido -> Verificar se o POST é enviado com o `tenantId` e `organizationId` corretos.
     - **Trustless Test:** Tentar injetar um preço inferior no JSON do pedido -> Verificar se o Backend ignora o preço do cliente e recalcula baseado no banco de dados.
  4. **QR Engine:** Gerar QR no Dashboard -> Descarregar/Copiar Link -> Validar se o link aponta para o `tenantId` correto.
  5. **Segurança de API Pública:** GET `/public/menu/[id]` deve retornar dados sem Auth; POST na rota de orders deve ser validado para evitar bots/spam.
  6. **Fluxo do Atendente:** Novo Pedido (Notificação) -> Marcar como "Pronto".
  7. **Fluxo de Pagamento:** Simulação de pagamento Multicaixa Express -> Callback de sucesso -> Pedido "Finalizado".
  8. **Theming Dinâmico:** Verificar se a injeção de variáveis (`--primary`) altera corretamente as cores dos componentes vitais (Botões, Headers).

## 3. Matriz de Testes Críticos

| Funcionalidade | Tipo | Impacto | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| Hierarchical Multi-tenancy | Security/Integration | Crítico | Nenhum vazamento de dados entre empresas (Orgs) ou restaurantes (Tenants). |
| Auth Metadata Sync | Functional/Security | Crítico | JWT deve obrigatoriamente conter `organization_id` e `tenant_id`. |
| QR Code Persistence | Functional | Alto | O link gerado deve persistir e ser válido mesmo após logout. |
| Public API Scoping | Security | Crítico | Apenas produtos com `isAvailable: true` e `isDeleted: false` devem ser expostos. |
| Real-time Updates | Performance | Alto | Notificação no KDS em menos de 500ms após pedido. |
| Upsell AI | Functional | Médio | Sugestões devem ser semanticamente relacionadas ao carrinho. |
| Latência Menu | Performance | Médio | Tempo de carregamento do menu público (First Paint) < 1.5s. |
| Animation Janking | Experience | Médio | Animações de entrada (Framer Motion) devem rodar a 60fps sem layout shift (CLS < 0.1). |

## 4. Performance e UX
- **Lighthouse:** Score > 90 em Mobile.
- **Vitals:** LCP < 2.5s.
- **Offline:** PWA deve mostrar menu em cache se a conexão cair (modo visualização).

## 5. Processo de QA
- **Branch Protection:** Build e Testes devem passar no CI antes do Merge.
- **Review:** Todo PR requer aprovação de um "Lead Agent".

