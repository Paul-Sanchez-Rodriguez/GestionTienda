import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly store = this.productService.getStoreInfo();
  readonly categories = this.productService.getCategories();
  readonly selectedCategory = signal<string>('Todos');
  readonly searchQuery = signal('');

  get filteredProducts() {
    const query = this.searchQuery().trim().toLowerCase();
    const products =
      this.selectedCategory() === 'Todos'
        ? this.productService.getProducts()
        : this.productService.getProductsByCategory(this.selectedCategory());

    if (!query) {
      return products;
    }

    return products.filter((product) => product.name.toLowerCase().includes(query));
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
