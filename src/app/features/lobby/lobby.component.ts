import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Hook {
  text: string;
  type: 'client' | 'business';
}

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  // --- Signals de Estado ---
  currentHook = signal<string>('¿Qué se te antoja hoy en Píritu?');
  activeImageIndex = signal<number>(0);
  
  // Lista de imágenes reales en public/images/lobby/
  images = signal<string[]>([
    'bat_fresa.webp', 'cachapa.webp', 'empanadas.webp', 'grill.webp', 
    'hamburguesa.webp', 'hand_burguer.webp', 'hot_dogs.webp', 'pabellon.webp', 
    'papitas.webp', 'parrilla.webp', 'pasticho.webp', 'pizza.webp', 'pollo_asado.webp'
  ]);

  // Timers para limpieza
  private hookInterval: any;
  private imageInterval: any;

  // TODO: Inyectar FirestoreService para traer productos y negocios reales
  featuredProducts = signal<any[]>([]); 
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
    // Limpieza total de intervalos
    if (this.hookInterval) clearInterval(this.hookInterval);
    if (this.imageInterval) clearInterval(this.imageInterval);
  }

  /**
   * Inicializa la rotación de ganchos y el carrusel de imágenes
   */
  private initDynamicContent() {
    const hour = new Date().getHours();
    const day = new Date().getDay(); 

    // Lógica inicial de ganchos por contexto
    if (day === 0 && hour < 12) {
      this.currentHook.set('¡Feliz domingo! Pide tus empanadas y quédate en cama.');
    } else if (hour >= 18) {
      this.currentHook.set('¿Cena lista? Revisa las promociones de hoy.');
    }

    // Rotación de Ganchos (Cada 8 segundos)
    this.hookInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.hooks.length);
      this.currentHook.set(this.hooks[randomIndex].text);
    }, 8000);

    // Rotación de Imágenes Crossfade (Cada 5 segundos)
    this.imageInterval = setInterval(() => {
      this.activeImageIndex.update(index => (index + 1) % this.images().length);
    }, 5000);
  }

  /**
   * Carga inicial de datos de muestra
   */
  async loadPreviewData() {
    // TODO: Implementar queries de Firestore
  }

  /**
   * Navegación hacia Auth con el rol pre-seleccionado
   */
  navigateToAuth(role: 'client' | 'business') {
    this.router.navigate(['/auth'], { queryParams: { role } });
  }

  /**
   * Redirección a la búsqueda
   */
  search(term: string) {
    if (!term) return;
    console.log('Buscando:', term);
    // TODO: Implementar navegación a resultados
  }
}