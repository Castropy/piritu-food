import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos el servicio de Auth que proveímos en el app.config
  private _auth = inject(Auth);

  /**
   * Observable que emite el estado del usuario en tiempo real.
   * - Si hay sesión: Emite el objeto User de Firebase.
   * - Si no hay sesión: Emite null.
   * Beneficio: Cualquier componente suscrito reaccionará automáticamente al login/logout.
   */
  readonly user$: Observable<User | null> = authState(this._auth);

  // --- Métodos de Autenticación ---

  // Registro con Email
  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this._auth, email, password);
  }

  // Login con Email
  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  // Login con Google
  loginWithGoogle() {
    return signInWithPopup(this._auth, new GoogleAuthProvider());
  }

  // Cerrar Sesión
  logout() {
    return signOut(this._auth);
  }
}