import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User, Business, Admin } from '../../../data/interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';

type AuthMode = 'login' | 'register';
type UserType = 'client' | 'business';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  //styleUrl: './auth.component.css'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  authMode = signal<AuthMode>('login');
  userType = signal<UserType>('client');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // Campos dinámicos (se capturan según el userType en el HTML)
    firstName: [''],
    lastName: [''],
    dni: [''],
    businessName: [''],
    taxId: [''],
    phone: [''],
    address: ['']
  });

  toggleMode() {
    this.authMode.update(mode => mode === 'login' ? 'register' : 'login');
    this.errorMessage.set(null);
    this.authForm.reset();
  }

  setUserType(type: UserType) {
    this.userType.set(type);
    this.errorMessage.set(null);
    this.authForm.patchValue({ email: '', password: '' });
  }

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
      // Aquí capturamos los errores del servicio (Firebase + Nuestros errores custom)
      this.errorMessage.set(this.translateError(error.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Maneja el login usando la nueva estrategia paralela del servicio
   */
  private async handleLogin(email: string, password: string) {
    // El servicio ahora nos devuelve el rol y la data
    const response = await this.authService.loginWithEmail(email, password);
    
    // Redirección inteligente basada en el rol detectado
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
   * Maneja el registro enviando la data estructurada
   */
  private async handleRegister(email: string, password: string) {
    const role = this.userType();
    const rawData = this.authForm.value;

    // Estructuramos la data según el rol para cumplir con tus interfaces
    const extraData = role === 'client' 
      ? {
          first_name: rawData.firstName,
          last_name: rawData.lastName,
          dni: rawData.dni,
          phone: rawData.phone,
          address: rawData.address,
          status_multa: 0
        }
      : {
          name: rawData.businessName,
          owner_name: rawData.firstName + ' ' + rawData.lastName,
          tax_id: rawData.taxId,
          phone: rawData.phone,
          address: rawData.address,
          penalty_status: 0,
          is_verified: false
        };

    await this.authService.signUpWithEmail(email, password, role, extraData);
    
    if (role === 'business') {
      alert('¡Listo! PírituFood revisará tu negocio. Te avisaremos pronto.');
      this.authMode.set('login');
    } else {
      this.router.navigate(['/store']);
    }
  }

  private translateError(code: string): string {
    switch (code) {
      // Errores Propios (Definidos en el AuthService)
      case 'auth/business-not-verified': 
        return 'Tu negocio aún está en proceso de verificación por el admin. ¡Paciencia, socio!';
      case 'auth/user-profile-not-found': 
        return 'Autenticado, pero no hallamos tu perfil. Contacta a soporte.';
      
      // Errores de Firebase
      case 'auth/user-not-found': return 'Esa cuenta no existe en PírituFood.';
      case 'auth/wrong-password': return 'La clave es incorrecta.';
      case 'auth/email-already-in-use': return 'Este correo ya tiene dueño aquí.';
      case 'auth/invalid-credential': return 'Los datos no son válidos.';
      default: return 'Ups, algo falló. Reintenta en un momento.';
    }
  }
}