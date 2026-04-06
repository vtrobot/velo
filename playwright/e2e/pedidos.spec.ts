import { test, expect } from '../support/fixtures';

import { gerarCodigoPedido } from '../support/Helpers'; 

import { OrderDetails } from '../support/types';

test.describe ('Consulta pedidos', ()=>{

  test.beforeEach(async({app})=>{

    await app.orderLookup.open();


  })

  test('Deve consultar um pedido aprovado', async ({ app, page }) => {

    //Test Data
  
      // const order ='VLO-B7ICS9'

    const order: OrderDetails = {

      number:'VLO-B7ICS9',
      Status:'APROVADO',
      color:'Glacier Blue',
      wheels:'sport Wheels',
      curtomer:{
        name:'valmor teste',
        email:'valmor@este.dev' 
      },
      payment:'À Vista'
    }
    //act
    await app.orderLookup.searchOrder(order.number);
    await app.orderLookup.assertOrderFound(order);
    await app.orderLookup.assertStatusUi(order.Status);
  
  });
  
  test ('Deve consultar pedido reprovado', async({ app, page }) => { 

    //Test Data 
  
    const order: OrderDetails = {

      number:'VLO-XLADSJ',
      Status:'REPROVADO',
      color:'Midnight Black',
      wheels:'sport Wheels',
      curtomer:{
        name:'Victor tambosi',
        email:'victor@tambo.com'
      },
      payment:'À Vista'
    }
    //act
  
    await app.orderLookup.searchOrder(order.number);
    await app.orderLookup.assertOrderFound(order);
    await app.orderLookup.assertStatusUi(order.Status);
  
      
  }) 

  test ('Deve consultar pedido em Analise', async({ app, page }) => { 

    //Test Data
  
    const order: OrderDetails = {

      number:'VLO-MHV67X',
      Status:'EM_ANALISE',
      color:'Midnight Black',
      wheels:'sport Wheels',
      curtomer:{
        name:'vivi teste',
        email:'vivi@tamb.com'
      },
      payment:'À Vista'
    }
    //act
  
    await app.orderLookup.searchOrder(order.number);
    await app.orderLookup.assertOrderFound(order);
    await app.orderLookup.assertStatusUi(order.Status);





  }) 
  test ('Deve validar quando não encontrar o pedido', async({ app, page }) => {

    const order = gerarCodigoPedido()


    await app.orderLookup.searchOrder(order);



  await app.orderLookup.assertOrderNotFound();



})

  test('Deve mater o botão de busca desabilitado', async({ app, page }) => {


     const button =app.orderLookup.elements.searchButton;
     await expect(button).toBeDisabled();

     await app.orderLookup.elements.orderInput.fill('    ');
     await expect(button).toBeDisabled();

  })

})
