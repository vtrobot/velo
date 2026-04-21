import { Page, expect } from '@playwright/test';
import { OrderDetails, OrderStatus } from '../types';

export function createOrderLookupActions(page: Page) {

    const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' });
    const searchButton = page.getByRole('button', { name: 'Buscar Pedido' });

    return {

        elements: {

            orderInput,
            searchButton,

        },

        async open() {

            await page.goto('http://localhost:5173');
            const title = page.getByTestId('hero-section').getByRole('heading')
            await expect(title).toContainText('Velô Sprint');

            await page.getByRole('link', { name: 'Consultar Pedido' }).click();
            await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

        },
        async searchOrder(numero: string) {
            await orderInput.fill(numero);
            await searchButton.click();
        },

        async assertOrderFound(order: OrderDetails) {
            await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
        },

        async assertStatusUi(status: OrderStatus) {
            const statusBadge = page.getByRole('status').filter({ hasText: status });

            if (status === 'APROVADO') {
                await expect(statusBadge).toHaveClass(/bg-green-100/);
                await expect(statusBadge).toHaveClass(/text-green-700/);
                const statusIcon = statusBadge.locator('svg');
                await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);
                return;
            }

            if (status === 'REPROVADO') {
                await expect(statusBadge).toHaveClass(/bg-red-100/);
                await expect(statusBadge).toHaveClass(/text-red-700/);
                const statusIcon = statusBadge.locator('svg');
                await expect(statusIcon).toHaveClass(/lucide-circle-x/);
                return;
            }

            if (status === 'EM_ANALISE') {
                await expect(statusBadge).toHaveClass(/bg-amber-100/);
                await expect(statusBadge).toHaveClass(/text-amber-700/);
                const statusIcon = statusBadge.locator('svg');
                await expect(statusIcon).toHaveClass(/lucide-clock-icon/);
                return;
            }

            throw new Error(`Status inesperado para validação de UI: ${status}`);
        },

        async assertOrderNotFound() {
            await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
        },
    };
}

