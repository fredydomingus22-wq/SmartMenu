# Estratégia de Qualidade e Testes (QA) – SmartMenu

## 22. Estratégia de QA

Este documento define a estratégia de garantia de qualidade para o SmartMenu, garantindo que o isolamento de tenants, a performance em tempo real e a integridade financeira sejam mantidos.

---

### 22.1 Níveis de Teste

#### Testes Unitários
- **Ferramentas:** Jest (API), Vitest (Web).
- **Foco:** Lógica de cálculo de preços, validação de inputs, mapeamento de status.

#### Testes de Integração
- **Isolamento Hierárquico:** Garantir que dados de uma Org/Tenant não vazem para outro.
- **Supabase Sync:** Verificar se `app_metadata` (orgId, tenantId) está sincronizado.
- **OpenAI/Prisma:** Validar integrações críticas.

#### Testes E2E (Playwright)
1. **Fluxo Público:** Scan QR -> Menu -> Carrinho -> Envio.
2. **Redirecionamento:** Root (`/`) para Dashboard (se logado).
3. **Persistência:** Carrinho em LocalStorage.
4. **Trustless Orders:** Ignorar preço enviado pelo cliente e recalcular no server.
5. **Theming:** Injeção de CSS Vars por tenant.

---

### 22.2 Matriz de Testes Críticos

| Funcionalidade | Tipo | Impacto | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| Multi-tenancy | Security | Crítico | Zero vazamento de dados. |
| Auth Metadata | Security | Crítico | JWT deve conter `organization_id` e `tenant_id`. |
| Loyalty Engine | Logic | Alto | Pontos calculados corretamente após `DELIVERED` e validados no resgate. |
| Customization Logic | Logic | Alto | Preço final (Base + Extras * Qty) calculado no server bate com o esperado. |
| KDS Logic | Operational | Alto | Pedidos aparecem em < 2s na cozinha e filtros de setor funcionam. |
| **KDS Filtering** | Operational | Crítico | Pedidos 'DELIVERED' ou 'CANCELLED' desaparecem imediatamente da tela. |
| **KDS Mobile** | UX | Alto | Layout adapta-se a 1 coluna em mobile (<768px) e botões têm >48px. |
| Tenant Branding | UX | Médio | Injeção de CSS Vars por tenant e fallback para estilos padrão. |
| **Recommendations** | UX | Médio | Itens sugeridos são do mesmo tenant e relevantes à categoria. |
| **Upsell Logic** | Business | Alto | Preço do combo/upsell é adicionado corretamente ao total. |
| **Localization** | UX | Médio | Tradução correta de produtos/categorias ao trocar o idioma. |
| **Responsive Grid** | UX | Médio | Layout sections (featured/standard) se comportam bem em mobile/desktop. |
| **BI Accuracy** | Logic | Alto | Dados de horários de pico e ranking de clientes condizem com o histórico de pedidos no banco. |
| **Mobile Gestures** | UX | Alto | Swipe-to-action e Bottom Sheet funcionam sem lag em dispositivos mobile reais. |
| **Advanced Filtering** | UX/Logic | Alto | Combinação de múltiplos filtros (status + mesa + data) retorna o conjunto correto de dados. |
| **Action Menu** | UI | Médio | Menu de 'três pontinhos' abre opções corretas e executa ações (Imprimir/Detalhes). |

---

### 22.3 Processo de QA

- **Branch Protection:** Build e Testes obrigatórios antes do merge.
- **Review:** Revisão técnica de cada Pull Request.

---

**Documento de referência para estratégia de qualidade do SmartMenu.**
