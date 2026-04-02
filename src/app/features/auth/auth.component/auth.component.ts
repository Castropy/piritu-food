import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core'; // Añadido OnInit
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User, Business } from '../../../data/interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LOBBY_IMAGES } from '../../../shared/assets/lobby-images.assets';

type AuthMode = 'login' | 'register';
type UserType = 'client' | 'business';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy { // Implementamos OnInit
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  public authMode = signal<AuthMode>('login');
  public userType = signal<UserType>('client');
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  
  // 1. Añadimos el índice activo para el carrusel
  public activeImageIndex = signal<number>(0);
  private imageInterval: any;

  images = signal<string[]>(LOBBY_IMAGES);

  public authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: [''],
    lastName: [''],
    dni: [''],
    businessName: [''],
    taxId: [''],
    phone: [''],
    address: ['']
  });

  // 2. Iniciamos el temporizador al cargar el componente
  ngOnInit(): void {
    this.imageInterval = setInterval(() => {
      this.activeImageIndex.update(index => 
        (index + 1) % this.images().length
      );
    }, 5000); // Cambia cada 5 segundos para que no sea estresante
  }

  // 3. Limpiamos el intervalo para evitar que el navegador explote en segundo plano
  ngOnDestroy(): void {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleMode(): void {
    this.authMode.update(mode => mode === 'login' ? 'register' : 'login');
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  public setUserType(type: UserType): void {
    this.userType.set(type);
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  public async onSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.authForm.value;

    try {
      if (this.authMode() === 'login') {
        await this.handleLogin(email, password);
      } else {
        await this.handleRegister(email, password);
      }
    } catch (error: any) {
      this.errorMessage.set(this.translateError(error.code || error.message));
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleLogin(email: string, password: string): Promise<void> {
    const response = await this.authService.loginWithEmail(email, password);
    const routes = { client: '/store', business: '/dashboard', admin: '/admin' };
    this.router.navigate([routes[response.role as keyof typeof routes] || '/store']);
  }

  private async handleRegister(email: string, password: string): Promise<void> {
    const role = this.userType();
    const rawData = this.authForm.value;

    if (role === 'client') {
      const userData: Partial<User> = {
        email,
        first_name: rawData.firstName || '',
        last_name: rawData.lastName || '',
        dni: rawData.dni || '',
        phone: rawData.phone || '',
        address: rawData.address || '',
        image_profile: null,
        is_blocked: false,
        status_multa: 0
      };
      await this.authService.signUpWithEmail(email, password, role, userData);
      this.router.navigate(['/store']);
    } else {
      const businessData: Partial<Business> = {
        name: rawData.businessName || '',
        owner_name: `${rawData.firstName} ${rawData.lastName}`.trim(),
        tax_id: rawData.taxId || '',
        phone: rawData.phone || '',
        address: rawData.address || '',
        email,
        description: 'Nuevo negocio en PírituFood',
        image_url: '', 
        gallery_urls: [],
        opening_time: '08:00',
        closing_time: '22:00',
        is_blocked: false,
        is_verified: false,
        penalty_status: 0
      };
      await this.authService.signUpWithEmail(email, password, role, businessData);
      alert('¡Listo! Tu negocio está en revisión.');
      this.toggleMode();
    }
  }

  private translateError(code: string): string {
    const errors: Record<string, string> = {
      'auth/business-not-verified': 'Tu negocio aún está en proceso de revisión.',
      'auth/user-not-found': 'Cuenta no encontrada.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'Este correo ya está registrado.'
    };
    return errors[code] || 'Ocurrió un error inesperado.';
  }
}