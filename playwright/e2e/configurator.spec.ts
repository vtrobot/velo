import { test } from '../support/fixtures';

test.describe('Configurador de Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });

  test('CT02.1 - Verificação do Preço do Modelo Base (Rodas Padrão)', async ({ app }) => {
    await app.configurator.assertExpectedPriceForWheels('AERO');
    await app.configurator.selectWheels('SPORT');
    await app.configurator.assertCarImageForWheels('SPORT');
    await app.configurator.assertExpectedPriceForWheels('SPORT');
  });

  test('CT02.2 - Validação do Recálculo na Troca de Rodas', async ({ app }) => {
    await app.configurator.selectWheels('SPORT');
    await app.configurator.assertExpectedPriceForWheels('SPORT');
    await app.configurator.selectWheels('AERO');
    await app.configurator.assertExpectedPriceForWheels('AERO');
  });

  test('CT03 - Adição Dinâmica de Suprimentos Premium e Submissão ao Checkout', async ({ app }) => {
    await app.configurator.selectOptional('PRECISION_PARK');
    await app.configurator.assertTotalPrice('R$ 45.500,00');

    await app.configurator.selectOptional('FLUX_CAPACITOR');
    await app.configurator.assertTotalPrice('R$ 50.500,00');

    await app.configurator.goToCheckout();
    await app.configurator.assertCheckoutSummaryHasOptional('PRECISION_PARK');
    await app.configurator.assertCheckoutSummaryHasOptional('FLUX_CAPACITOR');
    await app.configurator.assertCheckoutSummaryTotal('R$ 50.500,00');
  });
});
