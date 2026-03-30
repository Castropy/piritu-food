import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore/firestore.service'; // Ajusta la ruta si es necesario
import { Product } from '../../data/interfaces'; // Importamos tu interfaz blindada

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
  private router = inject(Router);
  private firestoreService = inject(FirestoreService); // <--- Inyectamos el motor

  currentHook = signal<string>('¿Qué se te antoja hoy en Píritu?');
  activeImageIndex = signal<number>(0);
  
  images = signal<string[]>([
    'bat_fresa.webp', 'cachapa.webp', 'empanadas.webp', 'grill.webp', 
    'hamburguesa.webp', 'hand_burguer.webp', 'hot_dogs.webp', 'pabellon.webp', 
    'papitas.webp', 'parrilla.webp', 'pasticho.webp', 'pizza.webp', 'pollo_asado.webp'
  ]);

  private hookInterval: any;
  private imageInterval: any;

  // Tipamos el Signal con tu interfaz Product para tener autocompletado y seguridad
  featuredProducts = signal<Product[]>([]); 
  activeBusinesses = signal<any[]>([]);

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
    this.loadPreviewData();
  }

  ngOnDestroy() {
    if (this.hookInterval) clearInterval(this.hookInterval);
    if (this.imageInterval) clearInterval(this.imageInterval);
  }

  private initDynamicContent() {
    const hour = new Date().getHours();
    const day = new Date().getDay(); 

    if (day === 0 && hour < 12) {
      this.currentHook.set('¡Feliz domingo! Pide tus empanadas y quédate en cama.');
    } else if (hour >= 18) {
      this.currentHook.set('¿Cena lista? Revisa las promociones de hoy.');
    }

    this.hookInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.hooks.length);
      this.currentHook.set(this.hooks[randomIndex].text);
    }, 8000);

    this.imageInterval = setInterval(() => {
      this.activeImageIndex.update(index => (index + 1) % this.images().length);
    }, 5000);
  }

  /**
   * Carga de datos reales desde Firestore
   */
  loadPreviewData() {
    // Escuchamos solo los productos habilitados (is_enabled: true)
    this.firestoreService.getFiltered<Product>('products', 'is_enabled', true)
      .subscribe({
        next: (data) => {
          // Tomamos los primeros 4 para mantener la estética del Lobby
          this.featuredProducts.set(data.slice(0, 4));
          console.log('Data real cargada en Lobby:', data);
        },
        error: (err) => console.error('Error cargando productos:', err)
      });
  }

  navigateToAuth(role: 'client' | 'business') {
    this.router.navigate(['/auth'], { queryParams: { role } });
  }

  search(term: string) {
    if (!term) return;
    console.log('Buscando:', term);
  }
}