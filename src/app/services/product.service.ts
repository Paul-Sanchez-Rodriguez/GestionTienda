import { Injectable } from '@angular/core';
import { Product, StoreInfo } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly storeInfo: StoreInfo = {
    name: 'Tienda Nova',
    tagline: 'Productos de calidad para tu día a día',
    description:
      'Somos una tienda local con más de 10 años ofreciendo productos seleccionados en tecnología, hogar y estilo de vida. Envíos a todo el país.',
    address: 'Av. Principal 123, Ciudad Central',
    phone: '+34 900 123 456',
    email: 'contacto@tiendanova.com',
    hours: 'Lun–Vie 9:00–20:00 · Sáb 10:00–18:00',
  };

  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Auriculares Inalámbricos Pro',
      description:
        'Sonido envolvente con cancelación activa de ruido. Hasta 30 horas de batería y carga rápida USB-C.',
      price: 89.99,
      category: 'Tecnología',
      image: 'https://picsum.photos/seed/headphones/600/400',
      stock: 24,
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Reloj Inteligente Sport',
      description:
        'Monitor de actividad, GPS integrado y resistencia al agua IP68. Compatible con iOS y Android.',
      price: 149.99,
      category: 'Tecnología',
      image: 'https://picsum.photos/seed/smartwatch/600/400',
      stock: 15,
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Lámpara de Escritorio LED',
      description:
        'Luz regulable en intensidad y temperatura de color. Diseño minimalista con base antideslizante.',
      price: 34.99,
      category: 'Hogar',
      image: 'https://picsum.photos/seed/lamp/600/400',
      stock: 40,
      rating: 4.5,
    },
    {
      id: 4,
      name: 'Mochila Urbana 25L',
      description:
        'Compartimento acolchado para portátil de 15". Material impermeable y múltiples bolsillos organizadores.',
      price: 59.99,
      category: 'Accesorios',
      image: 'https://picsum.photos/seed/backpack/600/400',
      stock: 18,
      rating: 4.7,
    },
    {
      id: 5,
      name: 'Botella Térmica 750ml',
      description:
        'Mantiene bebidas frías 24 h o calientes 12 h. Acero inoxidable libre de BPA.',
      price: 22.99,
      category: 'Estilo de vida',
      image: 'https://picsum.photos/seed/bottle/600/400',
      stock: 55,
      rating: 4.4,
    },
    {
      id: 6,
      name: 'Teclado Mecánico Compacto',
      description:
        'Switches silenciosos, retroiluminación RGB y conexión Bluetooth o USB. Ideal para trabajo y gaming.',
      price: 79.99,
      category: 'Tecnología',
      image: 'https://picsum.photos/seed/keyboard/600/400',
      stock: 12,
      rating: 4.9,
    },
    {
      id: 7,
      name: 'Set de Tazas Cerámica (x4)',
      description:
        'Cerámica artesanal esmaltada a mano. Aptas para microondas y lavavajillas.',
      price: 28.99,
      category: 'Hogar',
      image: 'https://picsum.photos/seed/mugs/600/400',
      stock: 30,
      rating: 4.3,
    },
    {
      id: 8,
      name: 'Gafas de Sol Polarizadas',
      description:
        'Protección UV400 con montura ligera de acetato. Incluye estuche rígido y paño de microfibra.',
      price: 45.99,
      category: 'Accesorios',
      image: 'https://picsum.photos/seed/sunglasses/600/400',
      stock: 22,
      rating: 4.6,
    },
  ];

  getStoreInfo(): StoreInfo {
    return this.storeInfo;
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map((p) => p.category))];
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter((p) => p.category === category);
  }

  searchProducts(query: string): Product[] {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return this.getProducts();
    }

    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized)
    );
  }
}
