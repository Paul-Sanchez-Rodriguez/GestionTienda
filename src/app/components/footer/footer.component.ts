import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly productService = inject(ProductService);
  readonly store = this.productService.getStoreInfo();
  readonly year = new Date().getFullYear();
}
