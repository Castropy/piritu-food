/* Servicio para manejar las calificaciones y feedback de clientes y negocios.
Permite agregar nuevas calificaciones y obtener las calificaciones 
de un negocio o cliente específico. */
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rating } from '../../../data/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private firestore: Firestore) {}

  async addRating(rating: Rating): Promise<void> {
    const ratingsRef = collection(this.firestore, 'ratings');
    await addDoc(ratingsRef, {
      ...rating,
      created_at: Timestamp.now()
    });
  }

  // Obtener el feedback de un negocio o cliente específico
  getRatingsByTarget(targetId: string): Observable<Rating[]> {
    const ratingsRef = collection(this.firestore, 'ratings');
    const q = query(ratingsRef, where('target_id', '==', targetId));
    return collectionData(q, { idField: 'id' }) as Observable<Rating[]>;
  }
}