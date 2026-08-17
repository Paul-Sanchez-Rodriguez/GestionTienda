import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountPeriod } from '../../models/client.model';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly productService = inject(ProductService);

  readonly selectedPeriod = signal<AccountPeriod>('account');
  readonly selectedProductId = signal<number | null>(null);
  readonly productSearchQuery = signal('');
  readonly quantity = signal(1);
  readonly paymentMessage = signal('');
  readonly refreshKey = signal(0);

  readonly periods: { value: AccountPeriod; label: string }[] = [
    { value: 'day', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'account', label: 'Cuenta actual' },
  ];

  get clientId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  get client() {
    this.refreshKey();
    return this.clientService.getClientSummary(this.clientId);
  }

  get purchases() {
    this.refreshKey();
    return this.clientService.getPurchases(this.clientId, this.selectedPeriod());
  }

  get filteredTotal() {
    return this.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  }

  get filteredProducts() {
    if (!this.productSearchQuery().trim()) {
      return [];
    }

    return this.productService.searchProducts(this.productSearchQuery());
  }

  get showProductResults(): boolean {
    return this.productSearchQuery().trim().length > 0;
  }

  get selectedProduct() {
    const id = this.selectedProductId();
    return id ? this.productService.getProductById(id) : undefined;
  }

  get purchasePreviewTotal() {
    const product = this.selectedProduct;
    return product ? product.price * this.quantity() : 0;
  }

  selectPeriod(period: AccountPeriod): void {
    this.selectedPeriod.set(period);
    this.paymentMessage.set('');
  }

  onProductSearchInput(event: Event): void {
    this.productSearchQuery.set((event.target as HTMLInputElement).value);
  }

  clearProductSearch(): void {
    this.productSearchQuery.set('');
  }

  selectProduct(productId: number): void {
    this.selectedProductId.set(productId);
  }

  clearSelectedProduct(): void {
    this.selectedProductId.set(null);
  }

  onQuantityChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.quantity.set(value > 0 ? value : 1);
  }

  addPurchase(): void {
    const productId = this.selectedProductId();
    if (!productId) {
      this.paymentMessage.set('Selecciona un producto antes de registrar la compra.');
      return;
    }

    const created = this.clientService.addPurchase(
      this.clientId,
      productId,
      this.quantity()
    );

    if (created) {
      this.refreshKey.update((value) => value + 1);
      this.paymentMessage.set('Compra registrada en la cuenta del cliente.');
      this.selectedProductId.set(null);
      this.productSearchQuery.set('');
      this.quantity.set(1);
    }
  }

  registerPayment(): void {
    const paid = this.clientService.registerPayment(this.clientId);

    if (paid) {
      this.refreshKey.update((value) => value + 1);
      this.selectedPeriod.set('account');
      this.paymentMessage.set('Pago registrado. Se abrió una nueva cuenta limpia.');
      return;
    }

    this.paymentMessage.set('No hay deuda pendiente para registrar el pago.');
  }
}
