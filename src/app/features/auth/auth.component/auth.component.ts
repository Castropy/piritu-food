import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User, Business } from '../../../data/interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';

type AuthMode = 'login' | 'register';
type UserType = 'client' | 'business';

/**
 * AuthComponent: Gestiona el inicio de sesión y registro de usuarios y negocios.
 * 
 * Implementa formularios reactivos y redirección basada en roles, 
 * delegando la lógica de autenticación y validación al AuthService.
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  // Inyecciones
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Control de memoria
  private destroy$ = new Subject<void>();

  // Estado UI Reactivo
  public authMode = signal<AuthMode>('login');
  public userType = signal<UserType>('client');
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  /**
   * Formulario unificado. En la vista HTML se mostrarán u ocultarán 
   * campos dependiendo del 'authMode' y 'userType'.
   */
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Alterna entre la vista de Login y Registro, limpiando el estado.
   */
  public toggleMode(): void {
    this.authMode.update(mode => mode === 'login' ? 'register' : 'login');
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  /**
   * Cambia el rol seleccionado en el formulario (Cliente o Negocio).
   */
  public setUserType(type: UserType): void {
    this.userType.set(type);
    this.errorMessage.set(null);
    this.authForm.reset(); // Limpieza profunda al cambiar de rol
  }

  /**
   * Orquesta el envío del formulario.
   */
  public async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.errorMessage.set('Por favor, completa los campos requeridos correctamente.');
      return;
    }

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
      console.error('Error en Auth:', error);
      this.errorMessage.set(this.translateError(error.code || error.message));
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Ejecuta el login y enruta según el rol devuelto por el servicio.
   */
  private async handleLogin(email: string, password: string): Promise<void> {
    const response = await this.authService.loginWithEmail(email, password);
    
    switch (response.role) {
      case 'client':
        this.router.navigate(['/store']);
        break;
      case 'business':
        this.router.navigate(['/dashboard']);
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/store']);
    }
  }

  /**
   * Formatea los datos del formulario y ejecuta el registro.
   */
  private async handleRegister(email: string, password: string): Promise<void> {
    const role = this.userType();
    const rawData = this.authForm.value;

    if (role === 'client') {
      // Casteo parcial de User. El AuthService generará el ID y los timestamps.
      const userData: Partial<User> = {
        email: email,
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
      // Casteo parcial de Business. El AuthService completará el resto.
      const businessData: Partial<Business> = {
        name: rawData.businessName || '',
        owner_name: `${rawData.firstName} ${rawData.lastName}`.trim(),
        tax_id: rawData.taxId || '',
        phone: rawData.phone || '',
        address: rawData.address || '',
        email: email,
        category: 'general', // Categoría por defecto al registrar
        delivery_cost: 0,
        estimated_time: '30-45 min',
        is_enabled: true,
        is_verified: false, // Esperando aprobación del admin
        logo_url: null,
        min_order: 0,
        penalty_status: 0,
        rating: 0,
        reviews_count: 0
      };
      await this.authService.signUpWithEmail(email, password, role, businessData);
      
      alert('¡Listo! PírituFood revisará tu negocio. Te avisaremos pronto.');
      this.toggleMode(); // Devolvemos al login
    }
  }

  /**
   * Centraliza los mensajes de error para la UI.
   */
  private translateError(code: string): string {
    switch (code) {
      case 'auth/business-not-verified': 
        return 'Tu negocio aún está en proceso de verificación por el admin. ¡Paciencia!';
      case 'auth/user-profile-not-found': 
        return 'Autenticado, pero no hallamos tu perfil. Contacta a soporte.';
      case 'auth/user-not-found': 
      case 'auth/invalid-credential':
        return 'Las credenciales ingresadas son incorrectas.';
      case 'auth/wrong-password': 
        return 'La contraseña es incorrecta.';
      case 'auth/email-already-in-use': 
        return 'Este correo ya está registrado en PírituFood.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default: 
        return 'Ocurrió un error inesperado. Por favor, reintenta.';
    }
  }
}