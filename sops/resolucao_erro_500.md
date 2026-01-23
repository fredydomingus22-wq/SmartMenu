# SOP: Resolução de Erros 500 (Internal Server Error) no SmartMenu

Este documento descreve o procedimento padrão para investigar e resolver erros persistentes de "Internal Server Error" (500) que ocorrem durante a comunicação entre o `apiClient` (Frontend) e o NestJS (Backend).

## 1. Localizar a Causa no Backend
Sempre que o `apiClient` reportar um erro 500, a causa real está no servidor API.

1.  **Verificar Logs do Terminal:** Observe o terminal onde o `npm run dev:api` está rodando. Procure por erros de Prisma ou exceções não tratadas.
2.  **Validar Identificadores (UUID):** No SmartMenu, campos `id` e `tenantId` costumam ser UUIDs. Se um identificador malformado for passado ao Prisma em um filtro, ele lançará uma exceção, resultando em 500.

## 2. Refatorar o Controller para Robustez
Não confie que os dados sempre existirão ou estarão no formato correto.

```typescript
@Get(':tenantId/product/:productId')
async getProduct(@Param('tenantId') tenantId: string, @Param('productId') productId: string) {
  try {
    // 1. Validar formato UUID (opcional, mas recomendado)
    // 2. Buscar dados no serviço
    const product = await this.menuService.getPublicProduct(tenantId, productId);
    
    // 3. Tratar 'não encontrado' explicitamente (evita 500 caso o serviço retorne null)
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    return product;
  } catch (error) {
    console.error('[MenuController] Error name:', error.name, error.message);
    // Permite que erros HTTP (como NotFoundException) passem, mas captura erros de DB
    throw error;
  }
}
```

## 3. Alinhar o Frontend com o Padrão Next.js 16
As páginas que "funcionam" no SmartMenu seguem o padrão de **Server Components** com `Promise` params.

1.  **Aguardar params:** No Next.js 16, `params` e `searchParams` são Promises. Use `await params` antes de acessar as propriedades.
2.  **Fetch no Servidor:** Prefira buscar dados vitais para a renderização no lado do servidor usando `apiClient.get('/path', { cache: 'no-store' })`.
3.  **Habilitar Cache-Control:** Use `cache: 'no-store'` para garantir que dados dinâmicos (como cardápio) sejam sempre frescos na primeira renderização.

## 4. Checklist de Resolução
- [ ] O arquivo do Controller importa `NotFoundException` do `@nestjs/common`?
- [ ] O `apiClient.get` no Frontend está recebendo IDs válidos?
- [ ] O layout ou página pai possui o `CartProvider` (ou outros contextos necessários)?
- [ ] O componente da página (se Server Component) está definindo `params` como `Promise`?
