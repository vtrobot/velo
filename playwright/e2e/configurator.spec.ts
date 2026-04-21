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
});
