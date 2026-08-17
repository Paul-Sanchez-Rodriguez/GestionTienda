import { Injectable, inject } from '@angular/core';
import {
  AccountPeriod,
  Client,
  ClientAccount,
  ClientSummary,
  CreditPurchase,
} from '../models/client.model';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly productService = inject(ProductService);
  private nextClientId = 4;
  private nextAccountId = 4;
  private nextPurchaseId = 10;

  private readonly clients: Client[] = [
    { id: 1, name: 'Juan', lastname: 'Pérez', phone: '555-0101', activeAccountId: 1 },
    { id: 2, name: 'María', lastname: 'García', phone: '555-0102', activeAccountId: 2 },
    { id: 3, name: 'Carlos', lastname: 'López', phone: '555-0103', activeAccountId: 3 },
  ];

  private readonly accounts: ClientAccount[] = [
    {
      id: 1,
      clientId: 1,
      startedAt: daysAgo(5),
      purchases: [
        purchase(1, 3, 'Lámpara de Escritorio LED', 1, 34.99, daysAgo(4)),
        purchase(2, 5, 'Botella Térmica 750ml', 2, 22.99, daysAgo(2)),
        purchase(3, 1, 'Auriculares Inalámbricos Pro', 1, 89.99, daysAgo(1)),
      ],
    },
    {
      id: 2,
      clientId: 2,
      startedAt: daysAgo(12),
      purchases: [
        purchase(4, 4, 'Mochila Urbana 25L', 1, 59.99, daysAgo(10)),
        purchase(5, 7, 'Set de Tazas Cerámica (x4)', 1, 28.99, daysAgo(3)),
      ],
    },
    {
      id: 3,
      clientId: 3,
      startedAt: daysAgo(1),
      purchases: [
        purchase(6, 6, 'Teclado Mecánico Compacto', 1, 79.99, hoursAgo(6)),
        purchase(7, 8, 'Gafas de Sol Polarizadas', 1, 45.99, hoursAgo(2)),
      ],
    },
  ];

  getClients(): ClientSummary[] {
    return this.clients.map((client) => this.toSummary(client));
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find((client) => client.id === id);
  }

  getClientSummary(id: number): ClientSummary | undefined {
    const client = this.getClientById(id);
    return client ? this.toSummary(client) : undefined;
  }

  getActiveAccount(clientId: number): ClientAccount | undefined {
    const client = this.getClientById(clientId);
    if (!client) {
      return undefined;
    }

    return this.accounts.find(
      (account) => account.id === client.activeAccountId && !account.closedAt
    );
  }

  getPurchases(clientId: number, period: AccountPeriod): CreditPurchase[] {
    const account = this.getActiveAccount(clientId);
    if (!account) {
      return [];
    }

    const now = new Date();
    return account.purchases
      .filter((purchase) => this.matchesPeriod(purchase.purchasedAt, period, account.startedAt, now))
      .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());
  }

  getDebt(clientId: number): number {
    const account = this.getActiveAccount(clientId);
    if (!account) {
      return 0;
    }

    return account.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  }

  addPurchase(clientId: number, productId: number, quantity: number): CreditPurchase | null {
    const account = this.getActiveAccount(clientId);
    const product = this.productService.getProductById(productId);

    if (!account || !product || quantity < 1) {
      return null;
    }

    const purchaseItem: CreditPurchase = {
      id: this.nextPurchaseId++,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      total: round(product.price * quantity),
      purchasedAt: new Date(),
    };

    account.purchases.push(purchaseItem);
    return purchaseItem;
  }

  registerPayment(clientId: number): boolean {
    const client = this.getClientById(clientId);
    const account = this.getActiveAccount(clientId);

    if (!client || !account || account.purchases.length === 0) {
      return false;
    }

    account.closedAt = new Date();

    const newAccount: ClientAccount = {
      id: this.nextAccountId++,
      clientId,
      startedAt: new Date(),
      purchases: [],
    };

    this.accounts.push(newAccount);
    client.activeAccountId = newAccount.id;
    return true;
  }

  createClient(name: string, lastname: string, phone: string): ClientSummary {
    const account: ClientAccount = {
      id: this.nextAccountId++,
      clientId: this.nextClientId,
      startedAt: new Date(),
      purchases: [],
    };

    const client: Client = {
      id: this.nextClientId++,
      name: name.trim(),
      lastname: lastname.trim(),
      phone: phone.trim(),
      activeAccountId: account.id,
    };

    account.clientId = client.id;
    this.clients.push(client);
    this.accounts.push(account);

    return this.toSummary(client);
  }

  searchClients(query: string): ClientSummary[] {
    const normalized = query.trim().toLowerCase();
    const clients = this.getClients();

    if (!normalized) {
      return clients;
    }

    return clients.filter((client) => {
      const fullName = `${client.name} ${client.lastname}`.toLowerCase();
      return fullName.includes(normalized) || client.phone.includes(normalized);
    });
  }

  private toSummary(client: Client): ClientSummary {
    const account = this.getActiveAccount(client.id);

    return {
      ...client,
      debt: this.getDebt(client.id),
      purchaseCount: account?.purchases.length ?? 0,
      accountStartedAt: account?.startedAt ?? new Date(),
    };
  }

  private matchesPeriod(
    date: Date,
    period: AccountPeriod,
    accountStart: Date,
    now: Date
  ): boolean {
    switch (period) {
      case 'account':
        return date >= accountStart;
      case 'day':
        return isSameDay(date, now);
      case 'week':
        return date >= startOfWeek(now);
      case 'month':
        return date >= startOfMonth(now);
    }
  }
}

function purchase(
  id: number,
  productId: number,
  productName: string,
  quantity: number,
  unitPrice: number,
  purchasedAt: Date
): CreditPurchase {
  return {
    id,
    productId,
    productName,
    quantity,
    unitPrice,
    total: round(unitPrice * quantity),
    purchasedAt,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10, 0, 0, 0);
  return date;
}

function hoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
