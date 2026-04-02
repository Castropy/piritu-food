import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/products/product.service'; // <--- Servicio especializado
import { Product } from '../../data/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { LOBBY_IMAGES } from '../../shared/assets/lobby-images.assets';

interface Hook {
  text: string;
  type: 'client' | 'business';
}

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
})
export class LobbyComponent implements OnInit, OnDestroy {
  // Inyecciones
  private router = inject(Router);
  private productService = inject(ProductService); // <--- Usamos el servicio que ya tiene el mapper

  // Control de memoria
  private destroy$ = new Subject<void>();

  // Signals de UI
  currentHook = signal<string>('¿Qué se te antoja hoy en Píritu?');
  activeImageIndex = signal<number>(0);
  
 images = signal<string[]>(LOBBY_IMAGES);

  // Signals de Datos Reales
  featuredProducts = signal<Product[]>([]); 

  private hookInterval: any;
  private imageInterval: any;

  private hooks: Hook[] = [
    { text: '¿Hoy es domingo? Pide tu desayuno y sigue descansando.', type: 'client' },
    { text: '¿Llegaste cansado del trabajo? Una hamburguesa te espera.', type: 'client' },
    { text: '¿Antojo de pizza? Los mejores locales de Píritu están aquí.', type: 'client' },
    { text: '¡Demuestra tu potencial en la cocina! Registra tu negocio.', type: 'business' },
    { text: 'Muestra más, vende más, gana más con PírituFood.', type: 'business' },
    { text: '¿Quieres apartar una mesa? Hazlo rápido desde la web.', type: 'client' }
  ];

  ngOnInit() {
    this.initDynamicContent();
    this.loadFeaturedProducts();
  }

  ngOnDestroy() {
    // Limpieza de intervalos
    if (this.hookInterval) clearInterval(this.hookInterval);
    if (this.imageInterval) clearInterval(this.imageInterval);
    
    // Limpieza de suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initDynamicContent() {
    const hour = new Date().getHours();
    const day = new Date().getDay(); 

    // Lógica de bienvenida temporal
    if (day === 0 && hour < 12) {
      this.currentHook.set('¡Feliz domingo! Pide tus empanadas y quédate en cama.');
    } else if (hour >= 18) {
      this.currentHook.set('¿Cena lista? Revisa las promociones de hoy.');
    }

    // Rotación de hooks
    this.hookInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.hooks.length);
      this.currentHook.set(this.hooks[randomIndex].text);
    }, 8000);

    // Carrusel de imágenes
    this.imageInterval = setInterval(() => {
      this.activeImageIndex.update(index => (index + 1) % this.images().length);
    }, 5000);
  }

  /**
   * Carga de productos destacados usando el servicio especializado.
   */
  private loadFeaturedProducts() {
    // En el Lobby no sabemos el business_id, así que podríamos 
    // necesitar un método en el servicio que traiga productos globales 
    // o simplemente los más recientes de cualquier negocio.
    
    // Por ahora, usamos el getWhere del padre a través del ProductService
    // filtrando por los que están habilitados.
    this.productService.getAvailableProductsByBusiness('') // Si pasas vacío o creas un getGlobal
      .pipe(takeUntil(this.destroy$)) 
      .subscribe({
        next: (products) => {
          // Tomamos 4 aleatorios o los primeros 4 para el preview
          this.featuredProducts.set(products.sort(() => 0.5 - Math.random()).slice(0, 4));
        },
        error: (err) => console.error('Error al cargar destacados:', err)
      });
  }

  navigateToAuth(role: 'client' | 'business') {
    this.router.navigate(['/auth'], { queryParams: { role } });
  }

  search(term: string) {
    if (!term) return;
    // Aquí podrías navegar a una página de resultados
    this.router.navigate(['/search'], { queryParams: { q: term } });
  }
}