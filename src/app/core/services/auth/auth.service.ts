import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User, Business, Admin } from '../../../data/interfaces';
// Importamos los mappers para limpiar la data antes de subirla o bajarla
import { UserMapper } from '../../../data/mappers/user/user.mapper';
import { BusinessMapper } from '../../../data/mappers/business/business.mapper';
import { AdminMapper } from '../../../data/mappers/admin/admin.mapper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  // Observable reactivo para el estado de Firebase Auth
  readonly user$: Observable<FirebaseUser | null> = authState(this._auth);
  
  // Signal global con el perfil tipado y mapeado
  currentUserProfile = signal<User | Business | Admin | null>(null);

  /**
   * Registro con creación de perfil blindado por Mappers
   */
  async signUpWithEmail(email: string, password: string, role: 'client' | 'business', extraData: any) {
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    
    if (credential.user) {
      const uid = credential.user.uid;
      const collectionName = role === 'client' ? 'users' : 'businesses';
      const userRef = doc(this._firestore, `${collectionName}/${uid}`);

      // Usamos el Mapper correspondiente para asegurar integridad
      let profile: any;
      
      if (role === 'client') {
        profile = UserMapper.toFirestore({
          id: uid,
          email,
          ...extraData,
          is_blocked: false,
          created_at: new Date()
        } as User);
      } else {
        profile = BusinessMapper.toFirestore({
          id: uid,
          email,
          ...extraData,
          is_verified: false,
          is_blocked: false,
          created_at: new Date()
        } as Business);
      }

      await setDoc(userRef, profile);
    }
    return credential;
  }

  /**
   * Login con Identificación de Rol y Mapeo de Datos
   */
  async loginWithEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this._auth, email, password);
    const uid = credential.user.uid;

    // Estrategia paralela de búsqueda de perfil
    const [userSnap, businessSnap, adminSnap] = await Promise.all([
      getDoc(doc(this._firestore, `users/${uid}`)),
      getDoc(doc(this._firestore, `businesses/${uid}`)),
      getDoc(doc(this._firestore, `admins/${uid}`))
    ]);

    // 1. Caso Cliente
    if (userSnap.exists()) {
      const data = UserMapper.fromFirestore(uid, userSnap.data());
      this.currentUserProfile.set(data);
      return { role: 'client', data };
    } 

    // 2. Caso Negocio
    if (businessSnap.exists()) {
      const data = BusinessMapper.fromFirestore(uid, businessSnap.data());
      
      // Validación de Seguridad: Si no está verificado, no entra a la App de Negocio
      if (!data.is_verified) {
        await this.logout(); // Cerramos sesión de Auth para limpiar estado
        throw { code: 'auth/business-not-verified' };
      }
      
      this.currentUserProfile.set(data);
      return { role: 'business', data };
    }

    // 3. Caso Admin
    if (adminSnap.exists()) {
      const data = AdminMapper.fromFirestore(uid, adminSnap.data());
      this.currentUserProfile.set(data);
      return { role: 'admin', data };
    }

    throw { code: 'auth/user-profile-not-found' };
  }

  /**
   * Limpia el estado local y cierra sesión en Firebase
   */
  async logout() {
    this.currentUserProfile.set(null);
    return signOut(this._auth);
  }

  get currentUserId(): string | null {
    return this._auth.currentUser?.uid || null;
  }
}