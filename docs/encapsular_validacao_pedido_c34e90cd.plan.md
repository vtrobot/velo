---
name: Encapsular validacao pedido
overview: Extrair asserções repetidas dos testes para métodos do Page Object `OrderLookupPage`, centralizando a validação de detalhes, status e cenários de não encontrado.
todos:
  - id: add-types
    content: Criar types `OrderStatus` e `OrderDetails`
    status: completed
  - id: extend-page-object
    content: Adicionar métodos de busca e asserts no `OrderLookupPage`
    status: completed
    dependencies:
      - add-types
  - id: refactor-specs
    content: Refatorar `pedidos.spec.ts` para usar o Page Object
    status: completed
    dependencies:
      - extend-page-object
  - id: cleanup-alias
    content: Remover alias `serchOrder` após migração
    status: completed
    dependencies:
      - refactor-specs
---

# Encapsular validação de detalhe do pedido - (Playwright)

## Objetivo

- **Centralizar** validações de UI do resultado de pedido em métodos do Page Object `OrderLookupPage`.
- **Reduzir duplicação** e facilitar manutenção dos testes em [`playwright/e2e/pedidos.spec.ts`](C:/automatizaai/velo/playwright/e2e/pedidos.spec.ts).

## Arquivos impactados

- Atualizar: [`playwright/support/pages/OrderLookupPage.ts`](C:/automatizaai/velo/playwright/support/pages/OrderLookupPage.ts)
- Atualizar: [`playwright/e2e/pedidos.spec.ts`](C:/automatizaai/velo/playwright/e2e/pedidos.spec.ts)
- Adicionar (opcional, mas recomendado): [`playwright/support/types.ts`](C:/automatizaai/velo/playwright/support/types.ts)

## Alterações propostas

1. **Tipagem de domínio**

      - Criar `OrderStatus` (union) e `OrderDetails` para padronizar dados usados nos asserts.
```ts
// playwright/support/types.ts
export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export interface CustomerData {
  name: string;
  email: string;
}

export interface OrderDetails {
  number: string;
  Status: OrderStatus; // mantém compatível com dados atuais do teste
  color: string;
  wheels: string;
  curtomer: CustomerData; // mantém nome atual para evitar refactor amplo
  payment: string;
}
```


2. **Estender `OrderLookupPage`**

      - Adicionar métodos para:
          - `searchOrder(number: string)` (corrigir typo `serchOrder` e manter alias para compatibilidade)
          - `assertOrderFound(order: OrderDetails)` (snapshot + asserts de campos principais)
          - `assertStatusUi(status: OrderStatus)` (badge cor, texto e ícone)
          - `assertOrderNotFound()` (título e mensagem)
```ts
// playwright/support/pages/OrderLookupPage.ts (adições principais)
import { Page, expect } from '@playwright/test';
import { OrderDetails, OrderStatus } from '../types';

export class OrderLookupPage {
  constructor(private page: Page) {}

  async searchOrder(numero: string) { /* ... preenche e clica ... */ }
  async serchOrder(numero: string) { return this.searchOrder(numero); } // alias

  async assertOrderFound(order: OrderDetails) { /* ... toMatchAriaSnapshot + campos ... */ }
  async assertStatusUi(status: OrderStatus) { /* ... classes por status e ícone ... */ }
  async assertOrderNotFound() { /* ... heading level 3 e parágrafo ... */ }
}
```

- Regra de mapeamento de UI por status dentro do Page Object:
    - `APROVADO` → classes `bg-green-100`, `text-green-700`, ícone `lucide-circle-check-big`
    - `REPROVADO` → `bg-red-100`, `text-red-700`, ícone `lucide-circle-x`
    - `EM_ANALISE` → `bg-amber-100`, `text-amber-700`, ícone `lucide-clock-icon`

3. **Refatorar os testes**

      - Substituir asserts diretos por chamadas ao Page Object:
```ts
// playwright/e2e/pedidos.spec.ts (exemplo por cenário)
const orderLookupPage = new OrderLookupPage(page);
await orderLookupPage.searchOrder(order.number);
await orderLookupPage.assertOrderFound(order);
await orderLookupPage.assertStatusUi(order.Status);

// "não encontrado"
await orderLookupPage.searchOrder(gerarCodigoPedido());
await orderLookupPage.assertOrderNotFound();
```


4. **Compatibilidade e migração suave**

- Manter `serchOrder` como alias temporário para não quebrar chamadores atuais.
- Opcional: após refactor, remover chamadas antigas e finalmente retirar o alias.

## Benefícios

- Menos duplicação, testes mais curtos e legíveis.
- Mudanças de UI (classes/ícones) ficam centralizadas em um único lugar.

## Riscos/Observações

- Se os `data-testid` ou estrutura ARIA mudarem, só o Page Object precisará de ajuste.
- O snapshot ARIA será mantido dentro do Page Object para cada cenário com interpolação dos dados.

## Snippets essenciais a serem gerados

- Implementação de `assertOrderFound` conterá o snapshot hoje usado nos testes, interpolando `order`:
```ts
await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
 - img
 - paragraph: Pedido
 - paragraph: ${order.number}
 - status:
  - img
  - text: ${order.Status}
 - img "Velô Sprint"
 - paragraph: Modelo
 - paragraph: Velô Sprint
 - paragraph: Cor
 - paragraph: ${order.color}
 - paragraph: Interior
 - paragraph: cream
 - paragraph: Rodas
 - paragraph: ${order.wheels}
 - heading "Dados do Cliente" [level=4]
 - paragraph: Nome
 - paragraph: ${order.curtomer.name}
 - paragraph: Email
 - paragraph: ${order.curtomer.email}
 - paragraph: Loja de Retirada
 - paragraph
 - paragraph: Data do Pedido
 - paragraph: /\\d{2}\\/\\d{2}\\/\\d{4}/
 - heading "Pagamento" [level=4]
 - paragraph: ${order.payment}
 - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
`);
```


## O que não será alterado

- A navegação e checkpoints do `beforeEach` permanecem no spec.

## Resultado esperado

- Specs reduzidas a ~3-4 linhas por cenário após `searchOrder` + `assert*`.