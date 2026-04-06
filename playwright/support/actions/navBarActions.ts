import { Page } from "@playwright/test";

export function createNavBarActions(page: Page) {

    return {

        async   orderLookupLink(){
            await page.getByRole('link', { name: 'Consultar Pedido' }).click();


        }
    }
}