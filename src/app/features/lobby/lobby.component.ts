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

  // Signal para el mensaje persuasivo dinámico
  currentHook = signal<string>('¿Qué se te antoja hoy en Píritu?');
  
  // Timer para rotar los ganchos automáticamente
  private hookInterval: any;

  // TODO: Inyectar FirestoreService para traer productos y negocios reales
  featuredProducts = signal<any[]>([]); 
  activeBusinesses = signal<any[]>([]);

  // Repositorio de ganchos persuasivos (Copywriting)
  private hooks: Hook[] = [
    { text: '¿Hoy es domingo? Pide tu desayuno y sigue descansando.', type: 'client' },
    { text: '¿Llegaste cansado del trabajo? Una hamburguesa te espera.', type: 'client' },
    { text: '¿Antojo de pizza? Los mejores locales de Píritu están aquí.', type: 'client' },
    { text: 'Impulsa las ventas de tu negocio. ¡Regístrate ahora!', type: 'business' },
    { text: 'Muestra más, vende más, gana más con PírituFood.', type: 'business' },
    { text: '¿Quieres apartar una mesa? Hazlo rápido desde la web.', type: 'client' }
  ];

  ngOnInit() {
    this.initDynamicHooks();
    this.loadPreviewData();
  }

  ngOnDestroy() {
    // Limpiamos el timer para evitar fugas de memoria
    if (this.hookInterval) clearInterval(this.hookInterval);
  }

  /**
   * Inicializa la rotación de ganchos según el contexto
   */
  private initDynamicHooks() {
    const hour = new Date().getHours();
    const day = new Date().getDay(); // 0 es Domingo

    // Prioridad por contexto (Mañana o Domingo)
    if (day === 0 && hour < 12) {
      this.currentHook.set('¡Feliz domingo! Pide tus empanadas y quédate en cama.');
    } else if (hour >= 18) {
      this.currentHook.set('¿Cena lista? Revisa las promociones de hoy.');
    } else {
      this.rotateHooks();
    }

    // Rotación automática cada 8 segundos para mantener el Lobby "vivo"
    this.hookInterval = setInterval(() => this.rotateHooks(), 8000);
  }

  private rotateHooks() {
    const randomIndex = Math.floor(Math.random() * this.hooks.length);
    this.currentHook.set(this.hooks[randomIndex].text);
  }

  /**
   * Carga inicial de datos de muestra
   */
  async loadPreviewData() {
    // TODO: Implementar query: collection('products').limit(8)
    // TODO: Implementar query: collection('businesses').where('is_verified', '==', true).limit(4)
  }

  /**
   * Navegación hacia Auth con el rol pre-seleccionado
   */
  navigateToAuth(role: 'client' | 'business') {
    this.router.navigate(['/auth'], { queryParams: { role } });
  }

  /**
   * Redirección a la búsqueda o categorías
   */
  search(term: string) {
    if (!term) return;
    // TODO: Navegar a /search?q=term
    console.log('Buscando:', term);
  }
}