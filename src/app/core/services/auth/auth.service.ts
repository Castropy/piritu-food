import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { User, Business, Admin } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  // Observable para cambios de estado de sesión
  readonly user$: Observable<FirebaseUser | null> = authState(this._auth);
  
  // Signal para el perfil cargado (Acceso rápido en toda la app)
  currentUserProfile = signal<User | Business | Admin | null>(null);

  /**
   * Registro diferenciado por colección
   */
  async signUpWithEmail(email: string, password: string, role: 'client' | 'business', extraData: any) {
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    
    if (credential.user) {
      const uid = credential.user.uid;
      const collectionName = role === 'client' ? 'users' : 'businesses';
      const userRef = doc(this._firestore, `${collectionName}/${uid}`);

      // Mapeo inicial basado en tus interfaces
      const profile = {
        id: uid,
        email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        is_blocked: false,
        ...extraData // Aquí entran el DNI o el TaxID que debatimos
      };

      if (role === 'business') {
        (profile as any).is_verified = false; // Negocio empieza en espera
      }

      await setDoc(userRef, profile);
    }
    return credential;
  }

  /**
   * Login con Identificación Paralela de Rol
   */
  async loginWithEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this._auth, email, password);
    const uid = credential.user.uid;

    // --- ESTRATEGIA PARALELA ---
    // Lanzamos las 3 peticiones al mismo tiempo
    const [userDoc, businessDoc, adminDoc] = await Promise.all([
      getDoc(doc(this._firestore, `users/${uid}`)),
      getDoc(doc(this._firestore, `businesses/${uid}`)),
      getDoc(doc(this._firestore, `admins/${uid}`))
    ]);

    // Identificamos quién es
    if (userDoc.exists()) {
      const data = userDoc.data() as User;
      this.currentUserProfile.set(data);
      return { role: 'client', data };
    } 

    if (businessDoc.exists()) {
      const data = businessDoc.data() as Business;
      // VALIDACIÓN DE VERIFICACIÓN (Acotación importante)
      if (!data.is_verified) {
        throw { code: 'auth/business-not-verified' };
      }
      this.currentUserProfile.set(data);
      return { role: 'business', data };
    }

    if (adminDoc.exists()) {
      const data = adminDoc.data() as Admin;
      this.currentUserProfile.set(data);
      return { role: 'admin', data };
    }

    throw { code: 'auth/user-profile-not-found' };
  }

  logout() {
    this.currentUserProfile.set(null);
    return signOut(this._auth);
  }

  get currentUserId(): string | null {
    return this._auth.currentUser?.uid || null;
  }
}