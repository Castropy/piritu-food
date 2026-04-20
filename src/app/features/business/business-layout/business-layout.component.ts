import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './business-layout.component.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class BusinessLayoutComponent {
  // Lista de navegación para el Sidebar de PírituFood
  public menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: 'dashboard' },
    { label: 'Pedidos', icon: 'pi pi-shopping-cart', route: 'orders' },
    { label: 'Productos', icon: 'pi pi-box', route: 'product-management' },
  ];
}