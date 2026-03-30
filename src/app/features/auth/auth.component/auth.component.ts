import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Usando el Barrel File (index.ts) para una importación limpia
import { User, Business, Admin } from '../../../data/interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';

// Tipos auxiliares para el estado de la vista
type AuthMode = 'login' | 'register';
type UserType = 'client' | 'business';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para reactividad moderna en Angular
  authMode = signal<AuthMode>('login');
  userType = signal<UserType>('client');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulario reactivo centralizado
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // Campos dinámicos para registro
    firstName: [''],
    lastName: [''],
    dni: [''],
    businessName: [''],
    taxId: [''],
    phone: [''],
    address: ['']
  });

  /**
   * Alterna entre Iniciar Sesión y Crear Cuenta
   */
  toggleMode() {
    this.authMode.update(mode => mode === 'login' ? 'register' : 'login');
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  /**
   * Cambia el rol seleccionado en el registro (Client vs Business)
   */
  setUserType(type: UserType) {
    this.userType.set(type);
    this.errorMessage.set(null);
    // Reiniciamos solo email y pass para mantener consistencia
    this.authForm.patchValue({ email: '', password: '' });
  }

  /**
   * Punto de entrada al presionar el botón principal
   */
  async onSubmit() {
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
      this.errorMessage.set(this.translateError(error.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Lógica de inicio de sesión (Debatiremos el barrido de colecciones en breve)
   */
  private async handleLogin(email: string, password: string) {
    // 1. Autenticación básica en Firebase Auth
    await this.authService.loginWithEmail(email, password);
    
    // TODO: Implementar lógica de detección de rol (users vs businesses vs admins)
    // Por ahora, redirigimos a store por defecto
    this.router.navigate(['/store']);
  }

  /**
   * Lógica de registro diferenciado
   */
  private async handleRegister(email: string, password: string) {
    const role = this.userType();
    
    // Llamada al servicio para crear usuario y documento inicial
    await this.authService.signUpWithEmail(email, password, role);
    
    if (role === 'business') {
      // UX: Los negocios no entran directo, esperan validación del admin
      alert('Registro recibido. PírituFood verificará tu negocio pronto.');
      this.authMode.set('login');
    } else {
      // Los clientes entran directo a comprar
      this.router.navigate(['/store']);
    }
  }

  /**
   * Mapeo de errores técnicos a mensajes amigables
   */
  private translateError(code: string): string {
    switch (code) {
      case 'auth/user-not-found': return 'No encontramos esa cuenta, socio.';
      case 'auth/wrong-password': return 'La clave no coincide.';
      case 'auth/email-already-in-use': return 'Ese correo ya está en uso.';
      case 'auth/invalid-credential': return 'Credenciales inválidas.';
      default: return 'Algo salió mal. Reintenta en un momento.';
    }
  }
}