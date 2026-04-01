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

// Importación de Mappers para el blindaje de datos
import { UserMapper } from '../../../data/mappers/user/user.mapper';
import { BusinessMapper } from '../../../data/mappers/business/business.mapper';
import { AdminMapper } from '../../../data/mappers/admin/admin.mapper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  // Observable para cambios de estado de sesión (Firebase Auth)
  readonly user$: Observable<FirebaseUser | null> = authState(this._auth);
  
  // Signal para el perfil cargado con acceso global
  currentUserProfile = signal<User | Business | Admin | null>(null);

  /**
   * Registro diferenciado por colección con uso de Mappers
   */
  async signUpWithEmail(email: string, password: string, role: 'client' | 'business', extraData: any) {
    const credential = await createUserWithEmailAndPassword(this._auth, email, password);
    
    if (credential.user) {
      const uid = credential.user.uid;
      const collectionName = role === 'client' ? 'users' : 'businesses';
      const userRef = doc(this._firestore, `${collectionName}/${uid}`);

      let profileData: any;

      if (role === 'client') {
        profileData = UserMapper.toFirestore({
          id: uid,
          email,
          is_blocked: false,
          created_at: new Date(),
          ...extraData 
        } as User);
      } else {
        profileData = BusinessMapper.toFirestore({
          id: uid,
          email,
          is_verified: false,
          is_blocked: false,
          created_at: new Date(),
          ...extraData
        } as Business);
      }

      await setDoc(userRef, profileData);
    }
    return credential;
  }

  /**
   * Login con Identificación Paralela de Rol y normalización de datos
   */
  async loginWithEmail(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this._auth, email, password);
    const uid = credential.user.uid;

    // Lanzamos las 3 peticiones en paralelo para máxima velocidad
    const [userSnap, businessSnap, adminSnap] = await Promise.all([
      getDoc(doc(this._firestore, `users/${uid}`)),
      getDoc(doc(this._firestore, `businesses/${uid}`)),
      getDoc(doc(this._firestore, `admins/${uid}`))
    ]);

    // 1. Identificar si es Cliente
    if (userSnap.exists()) {
      const data = UserMapper.fromFirestore(uid, userSnap.data() as any);
      this.currentUserProfile.set(data);
      return { role: 'client', data };
    } 

    // 2. Identificar si es Negocio
    if (businessSnap.exists()) {
      const data = BusinessMapper.fromFirestore(uid, businessSnap.data() as any);
      
      // Bloqueo de seguridad si el negocio no ha sido aprobado
      if (!data.is_verified) {
        await this.logout();
        throw { code: 'auth/business-not-verified' };
      }
      
      this.currentUserProfile.set(data);
      return { role: 'business', data };
    }

    // 3. Identificar si es Admin
    if (adminSnap.exists()) {
      const data = AdminMapper.fromFirestore(uid, adminSnap.data() as any);
      this.currentUserProfile.set(data);
      return { role: 'admin', data };
    }

    throw { code: 'auth/user-profile-not-found' };
  }

  /**
   * Cierre de sesión y limpieza de estado
   */
  async logout() {
    this.currentUserProfile.set(null);
    return signOut(this._auth);
  }

  /**
   * Helper para obtener el UID actual de forma síncrona
   */
  get currentUserId(): string | null {
    return this._auth.currentUser?.uid || null;
  }
}