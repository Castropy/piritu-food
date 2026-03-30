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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile, UserRole } from '../../models/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos el servicio de Auth (Identidad)
  private _auth = inject(Auth);
  // Inyectamos Firestore (Base de datos de perfiles)
  private _firestore = inject(Firestore);

  /**
   * Observable que emite el estado del usuario de Firebase en tiempo real.
   * Beneficio: Cualquier componente suscrito (ej. Navbar) reaccionará al login/logout.
   */
  readonly user$: Observable<User | null> = authState(this._auth);

  // --- Métodos de Autenticación ---

  /**
   * Registra un nuevo usuario en Firebase Auth y crea su perfil en Firestore.
   * @param role El rol del usuario ('client' o 'business').
   */
  async signUpWithEmail(email: string, password: string, role: UserRole) {
    // 1. Crea la cuenta en Firebase Authentication
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    
    // 2. Si se crea con éxito, inicializa el perfil en la base de datos
    if (credential.user) {
      await this.setUserData(credential.user, role);
    }
    
    return credential;
  }

  /**
   * Inicia sesión con correo y contraseña.
   */
  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  /**
   * Inicia sesión con Google (Popup).
   * Nota: Por defecto, los usuarios de Google se podrían mapear como 'client'.
   */
  loginWithGoogle() {
    return signInWithPopup(this._auth, new GoogleAuthProvider());
  }

  /**
   * Cierra la sesión activa en el dispositivo.
   */
  logout() {
    return signOut(this._auth);
  }

  /**
   * Crea o actualiza el documento del usuario en la colección 'users'.
   * Precaución: Se usa el UID de Auth como ID del documento para vinculación directa.
   */
  private async setUserData(user: User, role: UserRole) {
    const userRef = doc(this._firestore, `users/${user.uid}`);
    
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      role: role,
      createdAt: Date.now()
    };

    // merge: true asegura que no borremos datos existentes si el usuario ya tenía perfil.
    return setDoc(userRef, profile, { merge: true });
  }

  /**
   * Getter de utilidad para obtener el UID actual sin suscribirse al observable.
   */
  get currentUserId(): string | null {
    return this._auth.currentUser?.uid || null;
  }
}