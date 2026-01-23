# SOP: Tratamento de Erros e Logs no SmartMenu

Este documento define o padrão para captura, tratamento e registro de erros em todas as camadas da aplicação (Frontend e API).

## 1. Princípios Gerais (Guideline Architect)
- **Não silenciar erros**: Nunca use `catch {}` vazio. Se o erro for ignorado de propósito, adicione um comentário explicando o porquê.
- **Fail Fast**: Valide dados de entrada o mais cedo possível.
- **Transparência no Desenvolvimento**: Logs devem ser detalhados no console em ambiente de desenvolvimento.
- **Segurança em Produção**: Nunca exponha stack traces ou detalhes sensíveis do banco de dados no corpo da resposta HTTP.

## 2. Padrão no Backend (NestJS)

### Controllers
Todo método de Controller que realize operações complexas ou interaja com o Banco de Dados deve usar `try-catch`.

```typescript
@Post()
async create(@Body() dto: any, @Request() req: any) {
  try {
    return await this.service.create(dto, req.user);
  } catch (error) {
    // 1. Log detalhado para o desenvolvedor
    console.error(`[ControllerName] Error in create:`, error.message, error.stack);
    
    // 2. Lançar exceção apropriada para o NestJS
    if (error.code === 'P2002') { // Exemplo Prisma: Unique Constraint
       throw new ConflictException('Recurso já existe');
    }
    
    // Se for um erro desconhecido (500), deixe o NestJS tratar ou lance BadRequest se for erro de lógica
    throw error; 
  }
}
```

### Services
Evite lógica de "log" excessiva em serviços para não poluir o código. Deixe que o erro borbulhe (bubble up) até o Controller ou use um Exception Filter global.

## 3. Padrão no Frontend (Next.js)

### Server Actions
Sempre envolva chamadas ao `apiClient` em `try-catch`.

```typescript
export async function myAction(data: any) {
  try {
    const result = await apiClient.post('/path', data);
    revalidatePath('/dashboard/...');
    return { success: true, data: result };
  } catch (error) {
    // Log detalhado no servidor
    console.error('[Action: myAction] Failed:', error.message);
    
    // Retornar erro amigável para o cliente (não 'throw' se quiser tratar na UI)
    return { 
      success: false, 
      error: error instanceof ApiError ? error.message : 'Erro inesperado' 
    };
  }
}
```

### Componentes de Cliente (Forms)
Use o retorno das Actions para mostrar Toasts ou mensagens de erro.

```typescript
async function onSubmit(data) {
  const result = await myAction(data);
  if (result.success) {
    toast.success('Sucesso!');
  } else {
    toast.error(result.error);
  }
}
```

## 4. Diagnóstico de Erros persistence
Se um erro 500 persistir sem mensagem clara:
1. Verifique se o `apiClient.ts` está logando a stack trace em `debug`.
2. Certifique-se de que o backend não está sofrendo de `uncaughtException` que derruba o processo.
3. Utilize `console.log` temporários no `main.ts` do API para interceptar o fluxo.
