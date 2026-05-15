export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export interface CustomerData {
  name: string;
  email: string;
}

export interface OrderDetails {
  number: string;
  Status: OrderStatus;
  color: string;
  wheels: string;
  curtomer: CustomerData;
  payment: string;
}

export type WheelType = 'AERO' | 'SPORT';
export type ConfiguratorPrice =
  | 'R$ 40.000,00'
  | 'R$ 42.000,00'
  | 'R$ 45.500,00'
  | 'R$ 50.500,00';

