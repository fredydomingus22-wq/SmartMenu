# SOP: Erro de Fronteira Client/Server no Next.js

Este documento descreve como resolver erros de fronteira entre Client Components e Server Components no Next.js 16+.

## Sintomas Comuns

### Erro 1: Chamando função de cliente a partir do servidor
```
Attempted to call createClient() from the server but createClient is on the client.
It's not possible to invoke a client function from the server...
```

### Erro 2: Usando `next/headers` em Client Component
```
You're importing a component that needs "next/headers". 
That only works in a Server Component...
```

## Causa Raiz

O Next.js tem uma fronteira rígida entre Server Components e Client Components:

| Tipo | Pode usar `next/headers`? | Pode usar hooks (`useState`, etc)? |
|------|---------------------------|-----------------------------------|
| Server Component | ✅ Sim | ❌ Não |
| Client Component (`"use client"`) | ❌ Não | ✅ Sim |

## Arquitetura Correta para Supabase

O SmartMenu usa **dois arquivos separados** para o cliente Supabase:

### `utils/supabase/server.ts` (Server-only)
- **NÃO** tem `"use client"`
- Usa `next/headers` para acessar cookies
- Usado por Server Components, Server Actions, e `auth-server.ts`

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, { cookies: {...} });
}
```

### `utils/supabase/client.ts` (Client-only)
- Pode ter `"use client"` (opcional, já que usa `createBrowserClient`)
- **NÃO** usa `next/headers`
- Usado por Client Components

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => createBrowserClient(url, key);
```

## Checklist de Resolução

1. **Identificar qual arquivo está incorreto:**
   - Se o erro menciona `next/headers` em client → O arquivo server está sendo importado por um Client Component
   - Se o erro menciona "client function from server" → O arquivo server foi marcado com `"use client"`

2. **Verificar imports:**
   - Client Components devem importar de `./supabase/client`
   - Server Components devem importar de `./supabase/server`

3. **Refatorar páginas se necessário:**
   - Se uma página precisa de dados do servidor E interatividade:
     1. Mantenha a página como Server Component (sem `"use client"`)
     2. Faça o fetch de dados no server
     3. Passe os dados para um Client Component filho (ex: `PageClient.tsx`)

## Exemplo de Refatoração

### ❌ Antes (Errado)
```tsx
// page.tsx
"use client"; // ← Problema: página é client, mas usa apiClient que importa server.ts

import { apiClient } from "@/utils/api-client";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    apiClient.get('/product/123').then(setProduct);
  }, []);
  // ...
}
```

### ✅ Depois (Correto)
```tsx
// page.tsx (Server Component)
import { apiClient } from "@/utils/api-client";
import { ProductPageClient } from "./_components/product-page-client";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await apiClient.get(`/product/${id}`, { cache: 'no-store' });
  return <ProductPageClient product={product} />;
}

// _components/product-page-client.tsx
"use client";

export function ProductPageClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  // Toda a lógica interativa aqui
}
```

## Arquivos Afetados no SmartMenu

| Arquivo | Tipo | Importa de |
|---------|------|------------|
| `auth-server.ts` | Server utility | `./supabase/server` |
| `api-client.ts` | Universal (dynamic import) | `./supabase/server` (apenas no server) |
| `app/menu/[id]/page.tsx` | Server Component | `api-client.ts` ✅ |
| `ProductPageClient.tsx` | Client Component | Nenhum Supabase direto |
