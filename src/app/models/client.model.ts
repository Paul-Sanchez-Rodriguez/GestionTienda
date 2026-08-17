export type AccountPeriod = 'day' | 'week' | 'month' | 'account';

export interface CreditPurchase {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  purchasedAt: Date;
}

export interface ClientAccount {
  id: number;
  clientId: number;
  startedAt: Date;
  closedAt?: Date;
  purchases: CreditPurchase[];
}

export interface Client {
  id: number;
  name: string;
  lastname: string;
  phone: string;
  activeAccountId: number;
}

export interface ClientSummary extends Client {
  debt: number;
  purchaseCount: number;
  accountStartedAt: Date;
}
