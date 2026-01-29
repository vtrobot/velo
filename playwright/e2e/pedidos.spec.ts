import { test, expect } from '@playwright/test';

import { gerarCodigoPedido } from '../support/Helpers'; 

test('Deve consultar um pedido aprovado', async ({ page }) => {

  //Test Data

    const order ='VLO-B7ICS9'


    //arrange
  await page.goto('http://localhost:5173/');

  //checkpoints
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  //checkpoints texto consultar pedido
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //act

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);

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

  await expect(containerPedido).toContainText(order,{timeout:10_000})

  
  //checkpoints status do pedido
  // await expect(page.getByTestId('order-result-status')).toBeVisible();
  // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');

  await expect(page.getByText('APROVADO')).toBeVisible();

});

test ('Deve validar quando não encontrar o pedido', async({page}) => {

    const order = gerarCodigoPedido()

        //arrange
  await page.goto('http://localhost:5173/');

  //checkpoints
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');


  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  //checkpoints texto consultar pedido
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();


  // const title = page.getByRole('heading',{name:'Pedido não encontrado', level:3}  )
  // await expect(title).toBeVisible()

  // const mesage = page.locator('p',{hasText:'Verifique o número do pedido e tente novamente'})
  // await expect(mesage).toBeVisible()


  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);








})
