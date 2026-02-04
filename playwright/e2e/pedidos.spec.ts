import { test, expect } from '@playwright/test';

import { gerarCodigoPedido } from '../support/Helpers'; 

test.describe ('Consulta pedidos', ()=>{

  test.beforeEach(async({page})=>{

    await page.goto('http://localhost:5173/');
  
    //checkpoints
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    //checkpoints texto consultar pedido
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');


  })

  test('Deve consultar um pedido aprovado', async ({ page }) => {

    //Test Data
  
      // const order ='VLO-B7ICS9'

    const order = {

      number:'VLO-B7ICS9',
      Status:'APROVADO',
      color:' Glacier Blue',
      wheels:'sport Wheels',
      curtomer:{
        name:'valmor teste',
        email:' valmor@este.dev'
      },
      payment:'À Vista'
    }
    //act
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
  
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
  
    await expect(containerPedido).toContainText(order.number,{timeout:10_000})
  
    
    //checkpoints status do pedido
    // await expect(page.getByTestId('order-result-status')).toBeVisible();
    // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
  
    await expect(page.getByText('APROVADO')).toBeVisible();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.Status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph:  ${order.color}
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
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
  
  
  });
  
  test ('Deve consultar pedido reprovado', async({page}) => { 

    //Test Data
  
    const order = {

      number:'VLO-XLADSJ',
      Status:'REPROVADO',
      color:' Midnight Black',
      wheels:'sport Wheels',
      curtomer:{
        name:'Victor tambosi',
        email:' victor@tambo.com'
      },
      payment:'À Vista'
    }
    //act
  
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
  
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.Status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph:  ${order.color}
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
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

  }) 


  test ('Deve validar quando não encontrar o pedido', async({page}) => {

    const order = gerarCodigoPedido()


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



})
