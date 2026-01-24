# SOP: Sistema de Internacionalização (I18n) no Consumer App

Este documento descreve como funciona o sistema de traduções no aplicativo do cliente (Consumer App) e como evitar erros de contexto.

## Arquitetura do I18n

Diferente do Web App principal, o Consumer App utiliza um sistema de tradução leve baseado em arquivos JSON locais para garantir performance máxima.

### 1. Fonte da Verdade (Contexto e Hook)
Toda a lógica de tradução reside em:
`apps/consumer/hooks/use-translation.tsx`

Este arquivo exporta:
- `I18nProvider`: O componente que envolve a aplicação e fornece as traduções.
- `useTranslation`: O hook para acessar a função `t` e o locale atual.

### 2. Arquivos de Tradução
As traduções estão em:
`apps/consumer/locales/pt.json` (e outros futuros idiomas)

## Como Usar

### Envolvendo a Aplicação
O `I18nProvider` deve estar no Root Layout:

```tsx
// apps/consumer/app/layout.tsx
import { I18nProvider } from "../hooks/use-translation";

export default function RootLayout({ children }) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}
```

### Usando em Componentes
Sempre importe o hook de `@/hooks/use-translation`:

```tsx
import { useTranslation } from "@/hooks/use-translation";

export function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.welcome')}</h1>;
}
```

## Erros Comuns: `useTranslation must be used within an I18nProvider`

Este erro ocorre geralmente por dois motivos:

1. **Importação incorreta:** Importar `I18nProvider` ou `useTranslation` de um arquivo duplicado (ex: `components/i18n-provider.tsx`). Cada arquivo que cria um `createContext` gera um contexto único. Se o provedor usa um arquivo e o hook usa outro, eles não se comunicam.
   - **Solução:** Remova arquivos duplicados e use sempre o `hooks/use-translation.tsx`.

2. **Hierarquia:** Tentar usar o hook em um componente que não é descendente do `I18nProvider`.
   - **Solução:** Garanta que o provedor esteja no layout mais externo possível.

## Checklist para Novos Idiomas
- [ ] Criar o arquivo `.json` em `locales/`.
- [ ] Adicionar o import e registrar no objeto `translations` em `hooks/use-translation.tsx`.
- [ ] Atualizar o enum de idiomas suportados se necessário.
