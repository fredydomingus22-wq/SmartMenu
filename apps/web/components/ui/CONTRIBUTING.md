# Guia de Contribuição - SmartMenu Design System

## 🌟 Princípios Fundamentais

Este diretório contém os componentes de UI "Dumb" (puros) do SmartMenu.
Eles são a base visual de toda a aplicação e seguem regras estritas para garantir consistência e escalabilidade.

### 1. Separação Estrita (Layout vs UI)

> [!IMPORTANT]
> **Componentes de UI NUNCA devem ter margens externas.**

*   **Errado:** `<Button className="mt-4" />` (O componente define seu próprio espaço)
*   **Correto:** Envolva o componente em um primitivo de layout.
    ```tsx
    <Stack gap="4">
      <Button />
    </Stack>
    ```
    Ou passe a classe no momento do uso (se permitido pela prop `className`), mas nunca hardcoded dentro do componente.

### 2. Tokens vs Magic Numbers

*   ❌ `w-[350px]`, `p-[13px]`, `bg-[#f0f0f0]`
*   ✅ `w-full max-w-sm`, `p-4`, `bg-muted`

Use sempre as variáveis semânticas do Tailwind (`primary`, `secondary`, `muted`, `accent`, `destructive`).

### 3. Anatomia de um Componente

Todo componente deve expor:
*   `className`: Para overrides de última milha.
*   `ref`: ForwardRef para acessibilidade e composição.
*   `...props`: Repasse de props nativas do HTML.

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
)
Card.displayName = "Card"
```

### 4. fluxo de Trabalho (Governance)

1.  **Use o Existente:** Antes de criar, verifique se o shadcn/ui já oferece o que você precisa.
2.  **Crie Localmente:** Se for específico de uma feature, crie em `app/feature/_components`.
3.  **Promova:** Se for reutilizável > 3 vezes, abra uma RFC para mover para cá (`components/ui`).

---
**Responsáveis:** Core Team
**Dúvidas:** Consulte `system-requirements/07-design-system.md`
