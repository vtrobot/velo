import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {
    //arrange
  await page.goto('http://localhost:5173/');

  //checkpoints
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  //checkpoints texto consultar pedido
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //act

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-B7ICS9');

  await page.getByRole('button', { name: 'Buscar Pedido' }).click();


//assert

  //checkpoints resultado do pedido

  // await expect(page.getByTestId('order-result-id')).toBeVisible({timeout:30_000});
  // await expect(page.getByTestId('order-result-id')).toContainText('VLO-B7ICS9');

  // const ordercode = page.locator('//p[text() ="Pedido"]/..//p[text()="VLO-B7ICS9"]')
  // await expect(ordercode).toBeVisible({timeout:10_000});

  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/})
    .locator('..') //sobe para elemento pai

  await expect(containerPedido).toContainText('VLO-B7ICS9',{timeout:10_000})

  
  //checkpoints status do pedido
  // await expect(page.getByTestId('order-result-status')).toBeVisible();
  // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');

  await expect(page.getByText('APROVADO')).toBeVisible();

});
