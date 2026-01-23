# Proposta Técnica – Sistema de Menu Digital Inteligente (QR Ordering)

## 1. Visão Geral do Sistema

O sistema é uma plataforma SaaS de pedidos digitais para restaurantes e fast food, acessível via QR Code por mesa, permitindo que clientes visualizem o menu, realizem pedidos, acompanhem o estado em tempo real, participem de programas de fidelidade e interajam com o atendimento. Do lado do restaurante, o sistema centraliza pedidos, notifica setores (cozinha, bar, caixa) e fornece dashboards de gestão.

**Objetivo:** Reduzir fricção operacional, aumentar ticket médio, fidelizar clientes (Club de Pontos) e gerar dados acionáveis.

---

## 2. Stakeholders

| Stakeholder | Descrição |
|-------------|-----------|
| Cliente final | Consumidor que acede via QR Code |
| Atendente / Caixa | Operador de pedidos e pagamentos |
| Cozinha / Bar | Equipa de produção |
| Gerente do restaurante | Gestor operacional e estratégico (Escopado por Org e Tenant) |
| Administrador SaaS | Gestor da plataforma (Multi-Level: Org e Tenant) |

---

## 2.1 Hierarquia Multi-tenant

O sistema opera em dois níveis de isolamento:
- **Organização:** Nível de empresa ou grupo (ex: Grupo de Restaurantes).
- **Tenant:** Nível de loja ou filial individual.

Toda a segurança (RLS) e dados transacionais são isolados por este par hierárquico.

---

**Documento de referência para visão de produto e stakeholders do SmartMenu.**
