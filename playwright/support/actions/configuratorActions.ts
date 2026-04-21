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

export function createConfiguratorActions(page: Page) {
  const priceElement = page.getByTestId('total-price');
  const carImage = page.locator('img[alt^="Velô Sprint"]');

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
  };
}
