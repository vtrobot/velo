import { Page, expect } from '@playwright/test';
import { ConfiguratorPrice, WheelType } from '../types';

const wheelButtonByType: Record<WheelType, RegExp> = {
  AERO: /Aero Wheels/i,
  SPORT: /Sport Wheels/i,
};

const priceByWheelType: Record<WheelType, ConfiguratorPrice> = {
  AERO: 'R$ 40.000,00',
  SPORT: 'R$ 42.000,00',
};

const carImageByWheelType: Record<WheelType, string> = {
  AERO: '/src/assets/glacier-blue-aero-wheels.png',
  SPORT: '/src/assets/glacier-blue-sport-wheels.png',
};

type OptionalFeature = 'PRECISION_PARK' | 'FLUX_CAPACITOR';

const optionalCheckboxByType: Record<OptionalFeature, string> = {
  PRECISION_PARK: 'opt-precision-park',
  FLUX_CAPACITOR: 'opt-flux-capacitor',
};

const optionalLabelByType: Record<OptionalFeature, string> = {
  PRECISION_PARK: 'Precision Park',
  FLUX_CAPACITOR: 'Flux Capacitor',
};

export function createConfiguratorActions(page: Page) {
  const priceElement = page.getByTestId('total-price');
  const carImage = page.locator('img[alt^="Velô Sprint"]');
  const checkoutButton = page.getByTestId('checkout-button');
  const checkoutSummaryTotal = page.getByTestId('summary-total-price');

  return {
    elements: {
      priceElement,
      carImage,
    },

    async open() {
      await page.goto('http://localhost:5173/configure');
      await expect(priceElement).toBeVisible();
    },

    async selectWheels(type: WheelType) {
      await page.getByRole('button', { name: wheelButtonByType[type] }).click();
    },

    async assertTotalPrice(value: ConfiguratorPrice) {
      await expect(priceElement).toHaveText(value);
    },

    async assertExpectedPriceForWheels(type: WheelType) {
      await this.assertTotalPrice(priceByWheelType[type]);
    },

    async assertCarImageForWheels(type: WheelType) {
      await expect(carImage).toHaveAttribute('src', carImageByWheelType[type]);
    },

    async selectOptional(type: OptionalFeature) {
      await page.getByTestId(optionalCheckboxByType[type]).click();
    },

    async goToCheckout() {
      await checkoutButton.click();
      await expect(page).toHaveURL(/\/order$/);
    },

    async assertCheckoutSummaryTotal(value: string) {
      await expect(checkoutSummaryTotal).toHaveText(value);
    },

    async assertCheckoutSummaryHasOptional(type: OptionalFeature) {
      await expect(page.getByText(optionalLabelByType[type], { exact: true })).toBeVisible();
    },
  };
}
